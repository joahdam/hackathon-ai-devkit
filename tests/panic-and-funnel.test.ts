import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { StateStore } from '@hadk/state-store';
import { Orchestrator } from '@hadk/orchestrator';
import { cmdIngest, cmdJudge, cmdSubmit, cmdPanic } from '@hadk/cli';

let dir: string;
let store: StateStore;
let orch: Orchestrator;

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'hadk-panic-'));
  store = new StateStore(dir);
  store.init();
  orch = new Orchestrator(store);
  process.exitCode = 0;
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
  process.exitCode = 0;
});

describe('criteria parsing', () => {
  it('does not leak the "Criteria:" keyword prefix into criterion names', async () => {
    const brief = join(dir, 'brief.md');
    writeFileSync(
      brief,
      `# Test Hackathon 2026\n\n## Tracks\n- Track: AI Agents — build agents\n\n## Judging\n- Judging Criteria: Innovation and originality\n- Judging Criteria: Technical execution\n- Rubric: Presentation quality\n`,
      'utf-8',
    );
    await cmdIngest(store, brief, {});
    const loaded = store.load();
    expect(loaded.ok).toBe(true);
    if (!loaded.ok) return;
    const names = loaded.value.competition.judging_criteria.map((c) => c.name);
    expect(names.length).toBeGreaterThan(0);
    for (const name of names) {
      expect(name).not.toMatch(/^(criteri|judg|rubric)/i);
    }
    expect(names).toContain('Innovation and originality');
  });
});

describe('video skip unblocks the funnel', () => {
  it('judge accepts a skipped video gate and submit completes', async () => {
    store.update((s) => {
      s.competition.name = 'Test Hackathon';
      s.strategy.selected_idea = 'Test Idea';
      s.gates.video_gate = 'skipped';
      s.delivery.phase = 'judge';
    });

    await cmdJudge(store);
    expect(store.listArtifacts('pitch')).toContain('judge-prep.yaml');
    let loaded = store.load();
    expect(loaded.ok && loaded.value.delivery.phase).toBe('submission');

    await cmdSubmit(store, orch, { repository: 'https://github.com/test/repo' });
    loaded = store.load();
    expect(loaded.ok).toBe(true);
    if (!loaded.ok) return;
    expect(loaded.value.gates.submission_gate).toBe('passed');
    expect(loaded.value.delivery.phase).toBe('complete');
  });

  it('judge still refuses a pending video gate', async () => {
    store.update((s) => {
      s.gates.video_gate = 'pending';
      s.delivery.phase = 'judge';
    });
    await cmdJudge(store);
    expect(store.listArtifacts('pitch')).not.toContain('judge-prep.yaml');
    expect(process.exitCode).toBe(1);
  });
});

describe('submission_only recommends a runnable command', () => {
  it('recommends hadk judge when judge prep is missing, then hadk submit', () => {
    store.update((s) => {
      s.competition.remaining_hours = 0.5;
      s.delivery.phase = 'build';
    });
    let loaded = store.load();
    if (!loaded.ok) throw new Error('state load failed');
    expect(orch.getNextAction(loaded.value).command).toBe('hadk judge');

    store.writeArtifact('pitch', 'judge-prep.yaml', { prepared_at: 'now' });
    loaded = store.load();
    if (!loaded.ok) throw new Error('state load failed');
    expect(orch.getNextAction(loaded.value).command).toBe('hadk submit');
  });

  it('submit is allowed early in deadline emergency mode', async () => {
    store.update((s) => {
      s.competition.name = 'Test Hackathon';
      s.competition.remaining_hours = 0.5;
      s.strategy.selected_idea = 'Test Idea';
      s.delivery.phase = 'build';
    });
    store.writeArtifact('pitch', 'judge-prep.yaml', { prepared_at: 'now' });
    await cmdSubmit(store, orch, { repository: 'https://github.com/test/repo' });
    const loaded = store.load();
    expect(loaded.ok).toBe(true);
    if (!loaded.ok) return;
    expect(loaded.value.gates.submission_gate).toBe('passed');
  });
});

describe('hadk panic', () => {
  function lockScopeWithCuttableFeature() {
    store.update((s) => {
      s.scope.status = 'locked';
      s.scope.mvp_features = [
        {
          id: 'core',
          name: 'Core demo feature',
          purpose: 'demo',
          required_for_demo: true,
          required_for_rubric: false,
          estimated_hours: 6,
          dependencies: [],
          fallback: null,
        },
        {
          id: 'extra',
          name: 'Nice-to-have dashboard',
          purpose: 'polish',
          required_for_demo: false,
          required_for_rubric: false,
          estimated_hours: 4,
          dependencies: [],
          fallback: null,
        },
      ];
    });
  }

  it('cuts features not on the demo path from freeze_scope onward and checkpoints first', async () => {
    lockScopeWithCuttableFeature();
    store.update((s) => {
      s.competition.remaining_hours = 4; // freeze_scope
    });
    await cmdPanic(store, orch, {});
    const loaded = store.load();
    expect(loaded.ok).toBe(true);
    if (!loaded.ok) return;
    expect(loaded.value.scope.mvp_features.map((f) => f.id)).toEqual(['core']);
    expect(loaded.value.scope.deferred_features.map((f) => f.id)).toContain('extra');
    expect(loaded.value.delivery.checkpoints.some((c) => c.label === 'pre-panic')).toBe(true);
  });

  it('--dry-run reports what would be cut without changing state', async () => {
    lockScopeWithCuttableFeature();
    store.update((s) => {
      s.competition.remaining_hours = 4;
    });
    await cmdPanic(store, orch, { dryRun: true });
    const loaded = store.load();
    expect(loaded.ok).toBe(true);
    if (!loaded.ok) return;
    expect(loaded.value.scope.mvp_features.length).toBe(2);
    expect(loaded.value.scope.deferred_features.length).toBe(0);
  });

  it('does not cut anything with comfortable time remaining', async () => {
    lockScopeWithCuttableFeature();
    store.update((s) => {
      s.competition.remaining_hours = 40; // full
    });
    await cmdPanic(store, orch, {});
    const loaded = store.load();
    expect(loaded.ok).toBe(true);
    if (!loaded.ok) return;
    expect(loaded.value.scope.mvp_features.length).toBe(2);
  });
});
