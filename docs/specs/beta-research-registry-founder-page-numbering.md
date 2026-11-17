# SKYNZ — Research Test Registry, Production Page Numbers, Founder Badges

Status: **Proposed feature specification, not implemented.** Captures creator requirements from 2026-11-17. No production account/page numbers are allocated by this document.

## Internal/pre-beta research accounts
- Count and retain **every** account and page created during internal testing before external beta testers are invited.
- Store records in a dedicated research/test registry with unique internal IDs, environment/cohort, created date, build/version, test outcomes, and optional notes.
- Keep historical records available for authorized research, with privacy controls, retention rules, and no unnecessary personally identifying data.
- Research accounts/pages must **not** count toward the real production creator-page sequence, the Founder cohort, public page totals, monetization metrics, or any public directory.
- Preserve existing test data; never wipe it simply to reset production numbering.

## Real production page numbering
- The platform creator's **first real page is Page 001**.
- Test registrations, sandbox pages, drafts, previews, rejected proposals, and external beta testing do not consume real page numbers unless explicitly promoted under a documented production activation workflow.
- Number only after approved activation of a genuine production creator page. Store an immutable sequential display number, separate from account ID, draft ID, internal UUID, and mint/token ID.
- Allocation must be atomic; numbers cannot collide under concurrency and should not be silently reused after archival/deletion.
- Audit every allocation, activation, archival, and promotion from testing to production.

## Founder badge
- Reserve a distinctive premium **Founder** insignia for the initial cohort of real creator pages, with each page's permanent 3-digit number clearly shown.
- Requested cohort: **Founder 30**; confirm whether that means pages **001–030 including the creator** or **30 additional founders after Page 001** before locking eligibility.
- Visual direction: small high-contrast dashboard medallion/shield, brushed charcoal/metal with restrained soft neon-green edge, SKYNZ identity mark, large legible `001` and small `FOUNDER` label. Strong enough to feel exclusive without consuming dashboard space.
- Include screen-reader text and a tooltip (e.g. `SKYNZ Founder, Page 001`); never communicate eligibility through color alone.
- Badge is read-only and tied to the production page record; test accounts never receive it. No self-service editing or reassignment.
- Dashboard badge first; any public badge display is a separate approval decision.

## Acceptance tests
1. Create N internal test accounts and test pages: research counts increment, production count remains zero.
2. Preserve test records across restarts, backups, and software upgrades.
3. The first approved genuine production page is 001 and shows Founder 001.
4. Subsequent production activations receive unique, gap-aware permanent numbers; badge eligibility follows confirmed cohort boundaries.
5. Concurrent activations cannot duplicate or skip numbers accidentally.
6. Deleting/archiving a page preserves audit history and does not recycle its number.
7. Research records never inflate public production counts or leak private test data.
8. Badge remains readable on low-end 1366x768 displays, keyboard-accessible, and screen-reader-friendly.
9. No mint, public publish, payment, or live production activation occurs merely because this feature is being tested.

## Build safety
- Do not alter the current installed SKYNZ Beta 3 release until its existing state and rollback are verified.
- Implement schema + migration + tests in a candidate branch; demonstrate with synthetic data before any live account data is touched.
- Keep internal research registry and production page numbering logically separate.

## Open confirmation
Does **Founder 30** include Page 001, or are there 30 Founder pages *in addition* to Page 001?
