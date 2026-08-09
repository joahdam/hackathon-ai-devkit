# Hackathon AI DevKit — Root Orchestrator Skill

## Goal

Provide a complete skill suite for building hackathon projects from idea to submission.

This root skill exposes the full Hackathon AI DevKit to hierarchical skill loaders, enabling autonomous end-to-end pipeline execution from a single hackathon event URL through final submission.

---

## Entry Point

Use this devkit when a hackathon event URL, track description, or team brief is provided.

The pipeline begins with `hackathon-event-parser` (when a URL is available) or `hackathon-track-analyzer` (when raw track text is available).

---

## Available Skills

### Strategy — Event & Track Analysis

- **hackathon-event-parser** — Parse a hackathon event URL to extract tracks, judging criteria, timeline, and sponsor tools
- **hackathon-track-analyzer** — Parse track descriptions and sponsor briefs to extract constraints, evaluation criteria, and strategic opportunities
- **hackathon-problem-space** — Map problem domains, target users, pain points, and solution gaps
- **hackathon-idea-strategy** — Lock a strategy mode (conservative / realistic / futuristic) and its idea-scoring profile
- **hackathon-taste-profiler** — Build a taste profile (market, product layer, technology, traits) that biases ideation toward the team and rubric
- **hackathon-idea-generator** — Generate a diverse set of candidate project ideas aligned to problem space and track constraints
- **hackathon-idea-scoring** — Score and rank candidate ideas against judging criteria and team capabilities

### Planning — Scope & Risk

- **hackathon-scope-cutter** — Reduce a feature set to a shippable MVP within the time limit while preserving demo impact
- **hackathon-risk-analyzer** — Detect technical and demo risks before implementation begins; generate severity-ranked mitigations *(new)*
- **hackathon-doc-writer** — Generate structured technical documentation artifacts (ADR, PRD, feature specs)
- **hackathon-task-planner** — Decompose MVP scope into a time-boxed task list with roles, dependencies, and critical path

### Build — Implementation & Monitoring

- **hackathon-repo-bootstrap** — Generate a ready-to-run project scaffold with environment config and deployment setup *(new)*
- **hackathon-code-implementer** — Provide structured implementation guidance, code scaffolds, and done criteria per task
- **hackathon-test-generator** — Generate demo-path test cases and manual verification checklist to prevent demo failures
- **hackathon-milestone-monitor** — Track project progress at each milestone and recommend corrective actions *(new)*

### Presentation — Demo & Pitch

- **hackathon-demo-script** — Generate a rehearsable 60–90 second live demo narrative with spoken lines and wow-moment staging *(new)*
- **hackathon-pitchdeck** — Construct a complete pitch deck narrative with slide content, speaker notes, and judging alignment
- **hackathon-demo-video** — Produce a structured script and time-coded shot list for a demo video
- **hackathon-wow-detector** — Identify and amplify the single strongest wow-factor moment for maximum judge impact
- **hackathon-judge-simulator** — Simulate a panel of judges to generate adversarial questions, objections, and predicted scores

### Delivery — Deployment & Submission

- **hackathon-deployment-prep** — Generate deployment checklist, demo environment plan, and tiered fallback strategy *(new)*
- **hackathon-submission-prep** — Compile and validate all submission artifacts into a complete, polished package

### Startup — Problem-First Discovery *(beta)*

- **startup-pain-point-research** — Map market pain points with source provenance before any solution ideation
- **startup-opportunity-scorecard** — Rank pain points with transparent 1–5 evidence-aware scores
- **startup-pain-point-deep-dive** — Investigate one pain point while actively seeking disconfirming evidence
- **startup-validation-plan** — Turn assumptions into a falsifiable validation plan with success and kill thresholds
- **startup-hackathon-adapter** — Classify hackathon skills as reuse / adapt / avoid for a problem-first workflow

### Startup — Venture Validation *(beta)*

- **startup-customer-evidence** — Structure interviews, demand signals, and willingness-to-pay evidence
- **startup-market-sizing** — Defensible bottom-up TAM/SAM/SOM with labeled assumptions
- **startup-competitor-mapper** — Competitive map, whitespace, and moat hypothesis
- **startup-business-model** — Value proposition, revenue, costs, and unit economics
- **startup-pricing-hypothesis** — A concrete, testable price point
- **startup-gtm-planner** — Beachhead, channel, and first-100-customers plan
- **startup-pilot-designer** — Pilot / lighthouse-customer design with success criteria
- **startup-judge-simulator** — Investor-style Q&A with evidence-backed answers

---

## Autonomous Mode

Use this pipeline when the full devkit should run end-to-end with minimal human intervention.

### Input

Hackathon event URL (e.g. Devpost, DoraHacks, MLH, Hackathon.com)

### Process

1. Run `hackathon-event-parser` — extract tracks, judging criteria, timeline, sponsor tools
2. Run `hackathon-track-analyzer` — analyze best-fit track, extract evaluation axes and constraints
3. Run `hackathon-problem-space` — map user segments, pain points, and solution gaps
4. Run `hackathon-idea-strategy` — lock the strategy mode and scoring profile
5. Run `hackathon-taste-profiler` — build the taste profile that biases ideation
6. Run `hackathon-idea-generator` — generate diverse candidate ideas
7. Run `hackathon-idea-scoring` — score and rank ideas; select top recommendation
8. Run `hackathon-wow-detector` — identify primary wow moment and amplification tactics
9. Run `hackathon-scope-cutter` — reduce to shippable MVP; define demo flow and time budget
10. Run `hackathon-risk-analyzer` — identify and mitigate technical and demo risks before build
11. Run `hackathon-task-planner` — decompose MVP into tasks with roles and critical path
12. Run `hackathon-doc-writer` — generate PRD and any required ADRs
13. Run `hackathon-repo-bootstrap` — scaffold project structure, env config, and deployment setup
14. Run `hackathon-code-implementer` — iterate through each task; generate scaffolds and done criteria
15. Run `hackathon-milestone-monitor` — check progress at each milestone; recommend corrective actions
16. Run `hackathon-test-generator` — generate demo-path tests and manual verification checklist
17. Run `hackathon-demo-script` — generate live demo narrative with spoken lines and wow-moment staging
18. Run `hackathon-pitchdeck` — construct full pitch deck with judging alignment
19. Run `hackathon-demo-video` — produce demo video script and shot list (skip if the event has no video requirement)
20. Run `hackathon-judge-simulator` — stress-test pitch; surface adversarial questions
21. Run `hackathon-deployment-prep` — validate deployment, load demo data, confirm go/no-go criteria
22. Run `hackathon-submission-prep` — compile and validate all submission artifacts

For startup contests, prepend the problem-first discovery flow (`startup-pain-point-research` → `startup-opportunity-scorecard` → `startup-pain-point-deep-dive` → `startup-validation-plan`) before step 6, and see `playbooks/startup-contest-playbook.md`.

---

## Workflow Reference

See `playbooks/hackathon-workflow.md` for the canonical pipeline reference.

Time-specific playbooks:

- `playbooks/24h-hackathon-playbook.md`
- `playbooks/36h-hackathon-playbook.md`
- `playbooks/48h-hackathon-playbook.md`

---

## Context Files

### Knowledge Base

- `knowledge/hackathon-common-failures.md`
- `knowledge/hackathon-demo-patterns.md`
- `knowledge/hackathon-demo-psychology.md`
- `knowledge/hackathon-judging-criteria.md`
- `knowledge/hackathon-mvp-strategy.md`
- `knowledge/hackathon-pitch-strategy.md`
- `knowledge/hackathon-reference-architecture.md`
- `knowledge/hackathon-submission-guidelines.md`
- `knowledge/hackathon-tools.md`
- `knowledge/hackathon-winning-patterns.md`

### Templates

- `templates/ADR-template.md`
- `templates/PRD-template.md`
- `templates/demo-script-template.md`
- `templates/feature-spec-template.md`
- `templates/pitchdeck-outline.md`

### Playbooks

- `playbooks/hackathon-workflow.md`
- `playbooks/24h-hackathon-playbook.md`
- `playbooks/36h-hackathon-playbook.md`
- `playbooks/48h-hackathon-playbook.md`
- `playbooks/startup-weekend-54h-playbook.md`
- `playbooks/startup-contest-playbook.md`
