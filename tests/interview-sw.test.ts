import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { StateStore } from '@hadk/state-store';
import { cmdSetup, cmdInterviewLog, cmdInterviewStats } from '@hadk/cli';

let dir: string;
let store: StateStore;

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'hadk-sw-'));
  store = new StateStore(dir);
  process.exitCode = 0;
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
  process.exitCode = 0;
});

describe('setup --format startup-weekend', () => {
  it('preloads the Techstars judging frame and skips brief ingestion', async () => {
    await cmdSetup(store, { format: 'startup-weekend', teamSize: '5' });
    const loaded = store.load();
    expect(loaded.ok).toBe(true);
    if (!loaded.ok) return;
    const s = loaded.value;
    expect(s.competition.type).toBe('startup-contest');
    expect(s.competition.remaining_hours).toBe(54);
    expect(s.competition.judging_criteria.map((c) => c.name)).toEqual([
      'Customer Validation',
      'Business Model',
      'Execution & Design',
    ]);
    expect(s.gates.competition_gate).toBe('passed');
    expect(s.delivery.phase).toBe('strategy');
  });

  it('rejects an unknown format', async () => {
    await cmdSetup(store, { format: 'bake-off' });
    expect(process.exitCode).toBe(1);
  });
});

describe('hadk interview', () => {
  beforeEach(() => {
    store.init();
  });

  it('logs interviews and aggregates the traction tally', async () => {
    await cmdInterviewLog(store, { who: 'café owner', verdict: 'would_pay', price: '15' });
    await cmdInterviewLog(store, { who: 'bakery manager', verdict: 'would_pay', price: '20', presale: true });
    await cmdInterviewLog(store, { who: 'student', verdict: 'not_interested' });

    const log = store.readArtifact<{ interviews: unknown[] }>('startup-discovery', 'interviews.yaml');
    expect(log.ok && log.value.interviews.length).toBe(3);

    const summary = store.readArtifact<{
      total_interviews: number;
      presales: number;
      median_stated_price: number | null;
      by_verdict: Record<string, number>;
    }>('startup-discovery', 'traction-summary.yaml');
    expect(summary.ok).toBe(true);
    if (!summary.ok) return;
    expect(summary.value.total_interviews).toBe(3);
    expect(summary.value.by_verdict.would_pay).toBe(2);
    expect(summary.value.presales).toBe(1);
    expect(summary.value.median_stated_price).toBe(15);
  });

  it('rejects an invalid verdict and requires --who', async () => {
    await cmdInterviewLog(store, { who: 'someone', verdict: 'maybe' });
    expect(process.exitCode).toBe(1);
    process.exitCode = 0;
    await cmdInterviewLog(store, { verdict: 'interested' });
    expect(process.exitCode).toBe(1);
    const log = store.readArtifact<{ interviews: unknown[] }>('startup-discovery', 'interviews.yaml');
    expect(log.ok).toBe(false);
  });

  it('stats works with zero interviews without failing', async () => {
    await cmdInterviewStats(store, {});
    expect(process.exitCode).toBe(0);
  });
});
