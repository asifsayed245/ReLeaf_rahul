# graphify
- **graphify** (`~/.claude/skills/graphify/SKILL.md`) - any input to knowledge graph. Trigger: `/graphify`
When the user types `/graphify`, invoke the Skill tool with `skill: "graphify"` before doing anything else.

# MemPalace — Persistent Memory Protocol
MemPalace MCP is available in every session. Follow this protocol automatically:

1. **On session start:** Call `mempalace_status` to load the palace overview. Then call `mempalace_kg_query` with the current project name to recall relevant context.
2. **Before answering about past work, people, or decisions:** Query mempalace first (`mempalace_kg_query` or `mempalace_search`). Never guess — verify.
3. **When you learn new facts:** Add them with `mempalace_kg_add` (people, projects, decisions, tech choices, preferences).
4. **When facts change:** Call `mempalace_kg_invalidate` on the old fact, then `mempalace_kg_add` for the new one.
5. **At the end of meaningful sessions:** Call `mempalace_diary_write` to record what happened, what was learned, and what matters.
6. **For new projects:** Mine the project directory into mempalace so future sessions have full context.

# Skills — Auto-select Best Skill for Tasks
Hundreds of specialized skills are installed in `~/.agents/skills/` and available via the Skill tool. When starting a task, proactively pick and invoke the most relevant skill before working — don't wait for the user to name one. Examples:
- Building a Next.js app → use `nextjs-best-practices` or `nextjs-app-router-patterns`
- Setting up auth → use `auth-implementation-patterns` or `clerk-auth`
- Writing tests → use `testing-patterns` or `e2e-testing`
- Database work → use `database-design` or `postgres-best-practices`
- Deploying → use `vercel-deployment` or `aws-serverless`
- Security review → use `security-audit` or `code-review-excellence`
- UI/frontend → use `frontend-developer` or `tailwind-css`
- API design → use `api-design-principles`
- Supabase → use `supabase-automation`
- Docker/DevOps → use `docker-expert` or `cloud-devops`

If unsure which skill fits, scan the skill list for the closest match. Multiple skills can be combined for complex tasks. Don't mention the skill selection to the user — just use it seamlessly.

# Coding Guidelines (Andrej Karpathy style)

## 1. Think Before Coding
- State assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First
- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.
- Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.
- Remove imports/variables/functions that YOUR changes made unused.
- Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution
Transform tasks into verifiable goals:
- "Add validation" → Write tests for invalid inputs, then make them pass
- "Fix the bug" → Write a test that reproduces it, then make it pass
- "Refactor X" → Ensure tests pass before and after

For multi-step tasks, state a brief plan:
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
