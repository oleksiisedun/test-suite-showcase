---
name: sync-showcase
description: This skill should be used when the user asks to "sync the showcase repo", "sync test-suite-showcase with the source repo", "check for updates from the source repo", "pull in fixes from the work repo", "bring the showcase up to date with the production suite", or otherwise wants changes from the private production test suite reviewed and ported into this public showcase repo.
---

# Sync this repo from the source repo

This repo (`test-suite-showcase`, public on GitHub) is a sanitized portfolio derivative of a private production Playwright suite (a betting-domain app, hosted on a private Bitbucket). This skill reviews what changed in the source repo since the last sync, decides what's actually portable (framework/pattern/convention improvements, not betting business logic), adapts it to this repo's SauceDemo domain, and applies it — without ever committing/pushing on its own and without ever leaking anything private into this public repo.

## Why this isn't a git merge

The two repos diverged in domain (betting app → saucedemo.com) and scope (this repo strips out anything betting-specific). There is no shared commit history, so this is a manual diff-review-adapt loop, not `git merge`/`cherry-pick`. Treat the source repo as read-only reference material — never write to it, never push to it.

## Locating the source repo

This skill is public, so the source repo's path is never written to disk anywhere in this repo. It must be supplied fresh each run, as an argument to the skill invocation:

```
/sync-showcase /path/to/private/source/repo
```

If no path was given, stop and ask the user for it before doing anything else — don't guess, and don't persist it to a file.

Providing the path (as an argument, or in answer to that question) is the user's per-session authorization to read it, satisfying the "named the path in the current conversation" requirement in the user's global working-directory-boundary rule.

## State file

Sync progress is tracked in `.claude/skills/sync-showcase/state.json` (this directory — gitignored, see Notes):

```json
{
  "sourceBranch": "origin/develop",
  "lastSyncedCommit": "<sha>",
  "lastSyncedAt": "YYYY-MM-DD"
}
```

If this file doesn't exist yet, this is the first run under this skill — see step 4.

## Procedure

1. **Check this repo's working tree is clean.** Run `git status`. If dirty, stop and ask the user whether to commit or stash first.

2. **Resolve the source repo path** as described above.

3. **Fetch the source repo's latest state (read-only).** Run `git -C <source> fetch origin`. This only updates remote-tracking refs, never the working tree or local branches — safe to run unconditionally. Determine its default branch the same way as the `sync-main` skill: `git -C <source> symbolic-ref refs/remotes/origin/HEAD --short`, falling back to `git -C <source> remote show origin | grep 'HEAD branch'` if that errors.

4. **Determine the commit range.**
   - If `state.json` exists, the range is `<lastSyncedCommit>..origin/<default-branch>`.
   - If `state.json` doesn't exist (first run), don't silently scan the entire repo history — ask the user how far back to look (e.g. a date, a commit SHA, or "last N commits"). Once they answer, treat their answer as the range start.

5. **List candidate commits:**
   ```
   git -C <source> log <range> --oneline
   ```
   Skip pure `Merge remote-tracking branch ...` noise commits (no independent content). For each remaining commit, use `git -C <source> show --stat <sha>` and `git -C <source> show <sha>` to see what changed.

6. **Classify each commit as portable or not**, using this repo's directory correspondence:

   | Source dir | This repo's dir | Portable? |
   |---|---|---|
   | `src/fixtures` | `src/fixtures` | Yes — direct analog |
   | `src/pages`, `src/pages/components` | `src/pages` | Yes — direct analog |
   | `src/steps` | `src/steps` | Yes — direct analog |
   | `src/helpers/users` | `src/helpers/users` | Yes — direct analog (`UserBuilder` pattern) |
   | `src/helpers/network-monitor` | `src/helpers/network-monitor` | Yes — direct analog |
   | generic `src/helpers/utils.ts`, `src/helpers/app.ts` equivalents | same | Yes |
   | `playwright.config.ts`, `tsconfig.json`, root configs, devDependency version bumps (Playwright, TypeScript, ESLint, Prettier) | same | Yes, if the bump/setting is generic (not tied to a private CI system or internal registry) |
   | `docs/*`, README/CLAUDE.md convention or architecture writeups | README.md / CLAUDE.md | Yes, but reword examples to use saucedemo.com concepts instead of betting concepts |
   | `src/helpers/api`, and any directories implementing betting-specific business logic (odds/wagering flows, CMS integration, regulatory/compliance modules, and similar) | *(no analog)* | No — betting-domain business logic, skip entirely |
   | business-flow test specs (pre-release procedures, regulation tests, etc.) | *(no analog)* | No, unless the commit demonstrates a generic testing *technique* worth porting into an analogous showcase test (rare — use judgment, and note the technique instead of copying the test) |
   | Internal CI config, source-control-platform-specific docs, internal ticket references, internal PR numbers, private-registry package names | — | No — never port |

7. **Present the candidate list to the user** before touching any files: one line per portable commit (source SHA, one-sentence summary, target file(s) here, adaptation needed). Ask which to apply — don't assume all are wanted, since some are judgment calls.

8. **Apply each approved change** by editing this repo's files directly (never by patching/cherry-picking from the source repo). While adapting:
   - Rename betting-domain concepts to their saucedemo.com equivalent, or drop the concept if there's no equivalent.
   - **Sanitization pass (mandatory, non-negotiable):** before finalizing any edit or doc/commit-message text, strip or generalize:
     - Internal hostnames/URLs and internal source-control links
     - Ticket IDs and internal PR numbers
     - Internal/private-registry package names
     - The employer/company name and any internal team jargon
     - Any real customer, account, or betting-business-logic detail
     If a change can't be cleanly sanitized without losing its meaning, skip it and tell the user why rather than including a redacted fragment.
   - Follow this repo's own `CLAUDE.md` conventions (JSDoc, `@step` decorators, path aliases, etc.) for anything ported into code.

9. **Update README/CLAUDE.md** if the applied changes affect architecture or conventions (per the standing global instruction — don't do this for routine internal fixes with no user-visible effect).

10. **Do not commit or push.** Summarize what was applied, suggest a logical commit split (per the project's "Git Commits" convention — one topic per commit), and wait for the user's explicit go-ahead, same as any other change in this repo.

11. **Update the state file** once the review is complete (regardless of how many candidates were actually applied — rejected ones were still reviewed and shouldn't resurface next time): set `lastSyncedCommit` to the `origin/<default-branch>` SHA fetched in step 3, and `lastSyncedAt` to today's date.

## Notes

- `.claude/skills/sync-showcase/state.json` must stay in this repo's `.gitignore` — it's local sync-progress bookkeeping (a commit SHA, branch name, and date) that's only meaningful on the machine that ran the sync. Everything else in this skill's directory, including this file, is tracked and public.
- Never write to, commit in, or push to the source repo — it's read-only reference material.
- Never copy a source commit's message or PR description verbatim into this repo's history — always write a fresh, sanitized message describing the showcase-side change.
- The source repo path is asked for fresh every run and never cached — if it's moved, just supply the new path when asked.
