# Changelog

All notable changes to the HADK (Hackathon AI DevKit) project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **`hadk panic`** — emergency triage command: reads the clock, shows a named panic meter (Level 0 "Suspicious calm" → DEFCON 1 "SUBMIT. NOW."), checkpoints state, cuts MVP features not required for the demo or rubric from `freeze_scope` mode onward, and prints a survival plan of runnable commands. `--dry-run` previews the cuts.
- **`hadk video skip`** — explicitly waives the video gate (with a logged reason) for competitions that judge via live pitch instead of a submitted video. `hadk judge`, `hadk submit`, and the validators honor the skipped gate; the orchestrator treats `skipped` gates as satisfied.
- Contextual deadline one-liners in `hadk status`, keyed to the current deadline mode.
- Generated scaffold (`web-ai-fullstack`): multi-provider AI client (Anthropic Claude → Mistral → OpenAI-compatible, plain `fetch`, no SDK dependency) with an input-dependent deterministic offline fallback, and feature services/routes wired to it so the generated app produces a visible result out of the box.

### Fixed
- Brief parsing no longer leaks the matched keyword into judging criterion names ("Judging Criteria: Innovation" previously produced a criterion literally named "Criteria: Innovation").
- `hadk scaffold --output <dir>` is now honored by the scaffold and build validators (the output directory is recorded in state instead of `prototype/` being hardcoded).
- Under 1 hour remaining, `hadk next` no longer recommends `hadk submit` when judge prep is missing (which the handler would refuse); it recommends the runnable `hadk judge` first, and `hadk submit` is allowed to run early in deadline emergency modes.
- `manifest.yaml`: `hackathon-scope-cutter` requires `hackathon-idea-scoring` again (the beta `startup-validation-plan` is optional, not required).
- `hadk setup` no longer reports agent instruction files as written when they were preserved as user-owned.
- Removed a dead ternary that pinned idea confidence regardless of intent.
- `.agents/` root skill and autonomous workflow now list all 35 skills (strategy, taste, and the 13 startup skills were missing) with a consistent step order.

## [2.0.7] - 2026-08-02

### Added
- Problem-first startup discovery with opportunity scorecards, source provenance, Claude Code/Codex research handoffs, startup status/next commands, and a Shoo venture fixture.
- Deterministic URL/local-source handling with retrieval status, content hashes, warnings, and anti-fabrication safeguards.

### Changed
- Startup customer evidence now depends on the startup validation plan rather than the hackathon selected idea.

## [2.0.5] - 2026-07-28

### Fixed
- **Installer**: enforces `pnpm` for the pnpm-workspace monorepo. Auto-bootstraps pnpm via Corepack when missing and fails with clear instructions if Corepack is unavailable. Removes misleading npm fallback.
- **Strategy/taste**: `hadk strategy --taste user` now accepts real input via `--market`, `--layer`, `--technology`, `--business-shape`, `--traits`, and `--taste-file` flags. Falls back to auto inference with a warning when no taste data is supplied.
- **State consistency**: `hadk scaffold` now sets `gates.architecture_gate = 'passed'` when advancing phase to `build`.
- **Scope invalidation**: `hadk scope --unlock` and `hadk replan` now create a checkpoint, reset downstream gates (`architecture_gate` → `submission_gate`), reset `scope_gate`, invalidate architecture, and roll phase back to `scope`.
- **Checkpoint safety**: `scope --unlock` now checks the checkpoint result and aborts if the checkpoint cannot be created.
- **Generated tests**: replaced fake-pass `expect(true).toBe(true)` tests with honest `it.todo('implements the feature contract')` and contract-oriented todos.
- **API routes**: generated Next.js routes now include design-contract comments and proper 400 error handling for invalid JSON bodies.
- **Video render**: `hadk video render` now detects the HyperFrames CLI (`hyperframes` or `hf`), attempts a real render, verifies the produced MP4, and reports honest status when the CLI is unavailable.
- **Version**: synchronized version to `2.0.5` across README, root `package.json`, all workspace packages, `HADK_VERSION`, and the implementation report.
- **Pipeline lifecycle**: scope budget, gate validation, phase advancement, and render lifecycle now use consistent runtime state and permit an end-to-end completion path.
- **Input and recovery safety**: invalid configuration values and failed URL fetches are rejected; corrupt state can recover from `state.yaml.bak`; unmanaged local installer targets are protected.

### Added
- **Idea import contract**: external agent results now have a documented schema, validated candidate fields, recalculated scores, and selected-candidate consistency checks.
- **Render failure reporting**: failed or blocked video renders persist `video_status`, `video_gate`, and a render report for `hadk status` and `hadk next`.
- Provenance metadata in generated idea artifacts: `generation_mode` (`heuristic_fallback` | `declared_intent` | `agent_imported`) and `confidence` (`low` | `medium` | `high`).
- CLI flags `--agent` and `--provider` on `hadk idea` to declare intended agent/provider execution.

### Known limitations
- Idea agent/provider execution is not yet implemented; heuristic generation runs with clear provenance labeling.
- Scaffold generation is still a scope-shaped structural skeleton, not yet a fully semantic prototype derived from feature design contracts.
- Scaffold dependency installation, typecheck, build, and health verification are not yet automated.
- Competition intelligence (past winners, idea saturation, track comparison, evidence-backed reasoning) remains deferred.

## [2.0.0] - 2026-07-23

### Added
- Initial release of HADK as an AI-native Competition Engineering Harness.
- Eight TypeScript packages: `@hadk/core`, `@hadk/state-store`, `@hadk/orchestrator`, `@hadk/scaffold-engine`, `@hadk/validators`, `@hadk/hyperframes-adapter`, `@hadk/agent-adapters`, `@hadk/cli`.
- `hadk` CLI with 19 commands driving a gated, deadline-aware pipeline.
- Persistent atomic `.hackathon/` state, schema migration, checkpoints, and rollback.
- Three strategy modes (`conservative`, `realistic`, `futuristic`) and auto-inferred taste profiles.
- Scope-driven scaffold engine with dry-run, content-hash conflict detection, and three working profiles.
- HyperFrames demo-video project generator.
- Multi-agent adapters (Claude Code, Codex, OpenCode) from one canonical protocol.
- Idempotent `curl | bash` installer and standalone skill flow via `npx skills add`.
- 63-test suite covering state, scaffold, orchestrator, validators, hyperframes, and a full fixture competition end-to-end through the real CLI.
