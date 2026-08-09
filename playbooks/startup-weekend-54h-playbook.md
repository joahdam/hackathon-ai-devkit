# Startup Weekend 54h Playbook (Techstars format)

Friday ~18:30 → Sunday ~20:00. The judging frame is known before you arrive:
**Customer Validation > Business Model > Execution & Design**. A mediocre
mockup with 40 interviews and 5 pre-sales beats a brilliant MVP with zero
field evidence. This playbook inverts the hackathon playbooks accordingly:
**validation is the main thread; code is a supporting act.**

Setup before Friday (allowed — HADK is public tooling, not project work):

```bash
mkdir my-sw && cd my-sw
hadk setup --format startup-weekend --team-size 5
```

This preloads the Techstars judging frame, sets a 54h clock, and skips brief
ingestion — at a Startup Weekend the "brief" is the idea voted on Friday night.

Rules reminder (Techstars): the *idea* may predate the event, the *work* may
not. Everything you show Sunday must be produced during the weekend. No NDA —
everything pitched is public.

---

## Friday — pick the right idea (18:30–23:00)

| Time | Action | HADK |
|---|---|---|
| 18:30 | Arrive, eat, talk to people. Scout who you would want on a team. | — |
| 19:30 | 60-second idea pitches. Note every idea that gets energy from the room. | — |
| 20:30 | Voting. Before joining a team, sanity-check the top ideas: is the pain real, reachable, and testable *this weekend*? | `hadk startup research` |
| 21:00 | Teams form. Join for the problem and the people, not the demo potential. | `hadk startup scorecard` |
| 21:30 | First team session: write the pain hypothesis and WHO has it, in one sentence each. | `hadk startup deep-dive <id>` |
| 22:30 | Draft tomorrow's validation plan: falsifiable hypotheses, target interview count, success AND kill thresholds ("if <6/10 say they'd pay 15€/month → pivot"). | `hadk startup validate` |

✅ **Milestone: by midnight you have a falsifiable validation plan, not a feature list.**

## Saturday — the street is the product (09:00–23:00)

| Time | Action | HADK |
|---|---|---|
| 09:00 | Split: 2/3 of the team goes OUTSIDE (street, phone, DMs). 1/3 stays on landing page / mockup. | — |
| 09:00–12:30 | Interview sprint #1. Log every conversation the moment it ends — 15 seconds each. | `hadk interview log --who "..." --verdict would_pay --quote "..."` |
| 12:30 | Lunch checkpoint: read the tally. More disconfirming than would-pay? Pivot NOW, not Sunday. | `hadk interview stats` |
| 13:30–17:00 | Interview sprint #2, adjusted from the morning. Chase pre-sales and letters of intent (`--presale`). | `hadk interview log ... --presale` |
| 15:00 | Mentors pass through. Show them the tally and kill thresholds — ask them to attack the business model. | `hadk interview stats`, `hadk startup status` |
| 17:00 | Business model session: revenue, acquisition, pricing hypothesis grounded in stated prices from interviews. | skills: `startup-business-model`, `startup-pricing-hypothesis` |
| 19:00 | Build only what the demo needs: landing page with live signup counter, clickable mockup, or one working flow. | `hadk scope`, `hadk scaffold` (optional) |
| 22:00 | Evening tally + decision: what is Sunday's single message? | `hadk interview stats` |

✅ **Milestone: by Saturday night you can say "N interviews, X would pay, Y pre-sales" out loud without checking notes.**

## Sunday — turn evidence into a 5-minute pitch (09:00–20:00)

| Time | Action | HADK |
|---|---|---|
| 09:00 | Last interview window (Sunday-morning markets are gold for consumer ideas). | `hadk interview log` |
| 11:00 | Freeze evidence collection. Build the pitch: problem → field proof (the tally) → business model → demo → ask. | `hadk interview stats --json`, skill: `startup-judge-simulator` |
| 12:00 | Judge prep: adversarial Q&A. The first question is always "how many people did you talk to?" — you have a number. | `hadk judge` (after `hadk video skip` — no video at a Startup Weekend) |
| 14:00 | Feeling the fear? That's normal and scheduled. | `hadk panic` |
| 14:30–17:00 | Rehearse the 5-minute pitch at least 3 times, once in front of another team. Time it. | `hadk demo` checklist discipline |
| 17:00 | Tech check, demo fallback ready (screenshots of the landing page + signup count). | — |
| 18:00 | Final pitches: 5 min + Q&A before ~5 judges. Lead with the traction line. | — |

✅ **Milestone: the pitch opens with evidence, not with the product.**

---

## The three numbers that win

1. **Interviews completed** — target 30+ for consumer, 10+ for B2B niche.
2. **Willingness to pay** — stated prices, and how many said yes.
3. **Pre-sales / letters of intent** — even 1 changes the room.

`hadk interview stats` prints all three as a ready-to-paste pitch line.

## Integrity rule (non-negotiable)

HADK organizes and counts evidence; it never invents it. Every
`hadk interview log` entry must be a real conversation a team member had
during the weekend. Fabricated traction is not just against the rules —
juries detect it in one follow-up question, and it ends the pitch.
