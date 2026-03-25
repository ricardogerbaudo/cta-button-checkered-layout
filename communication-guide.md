# Colonist Communication Guide

Reference document for writing code comments, messages, and documentation
when communicating with the Colonist team.

---

## 1. Lead With the Answer (Pyramid Principle)

State your conclusion first, then support it. Don't build up to the point —
start with it.

- **Bad:** "I researched options A, B, and C. A has this problem, B has that
  problem, so I went with C."
- **Good:** "I chose option C. Here's why A and B didn't work: ..."

This is how McKinsey trains consultants (SCQA: Situation, Complication,
Question, Answer) and it's what Colonist expects.

## 2. Be Specific, Not Vague

Specificity builds credibility. Vagueness signals either dishonesty or lack
of understanding.

- **Bad:** "I improved the performance."
- **Good:** "Reduced load time from 3.2s to 1.1s by lazy-loading images."

The more concrete your statement, the fewer interpretations it allows.
One interpretation = clarity. Many interpretations = confusion.

## 3. Keep It Simple and Short

Remove unnecessary words. Don't use five words when two will do.

- Cut intensifiers ("very", "really", "extremely")
- Prefer short sentences over compound ones
- Use active voice: "The boy hit the ball" not "The ball was hit by the boy"
- If it doesn't need re-reading, you wrote it well

## 4. Avoid Doublespeak

Four patterns to avoid:

| Pattern           | What it is                              | Example to avoid                          |
|-------------------|-----------------------------------------|-------------------------------------------|
| Euphemism         | Softening harsh realities               | "negative growth" instead of "loss"       |
| Jargon            | Specialized terms that exclude others   | Unnecessary acronyms without context      |
| Gobbledygook      | Overcomplicating with convoluted wording | Long sentences that say nothing           |
| Inflated language | Making ordinary things sound important  | "utilize" instead of "use"                |

## 5. Answer the Actual Question

Don't sidestep or give tangential information. If someone asks "when will
it be done?", answer with a date, not a status update.

- **Bad:** "I'm working on it and making good progress."
- **Good:** "Thursday EOD. Two tasks remaining: X and Y."

## 6. Structure for Instant Comprehension

Proposals and updates should be graspable within 5 seconds. Use:

- Bullet points over paragraphs
- Tables for comparisons
- Clear headers
- "You -> do X, Team -> do Y" format for action items

**Example from Colonist values:**
- **Poor:** "We need to approve the version because after we approve it the
  QA team needs to go over it"
- **Better:** "You -> Approve version, QA team -> Final checks"

---

## Colonist Core Values (for context)

These values shape how communication is evaluated:

1. **Dependability** — Follow through. Deliver early. Be predictable.
2. **Act Like an Owner** — Take 120% responsibility. Don't wait to be told.
   Say "I looked into all the data, decided to go with X, here is my plan,
   let me know if I'm missing anything."
3. **Clear Communication** — Direct, concise, structured. Complex ideas
   understood at a glance.
4. **Efficient Execution** — Favor simple solutions. Have a plan:
   Docs -> Google -> ChatGPT -> Stack Overflow -> Ask the right person.
5. **Continuous Learning** — Seek feedback. Bring new tools and methods.
   Know your work inside and out.

---

## Applying This to Code Comments

When writing thought-process comments for the take-home test:

1. Start with the decision, then explain why
2. Use numbered lists, not prose paragraphs
3. Be specific about what was changed and why
4. Keep each point to 1-2 lines max
5. Show ownership: "I chose X because..." not "X was chosen because..."

---

*Sources: [colonist.io/values](https://colonist.io/values),
[colonist.io/values-examples](https://colonist.io/values-examples),
[demiculus.com/communication](https://demiculus.com/communication/),
[demiculus.com/specificity](https://demiculus.com/specificity/),
[Pyramid Principle (McKinsey)](https://medium.com/lessons-from-mckinsey/the-pyramid-principle-f0885dd3c5c7),
[demiculus.com/better-writer](https://demiculus.com/better-writer/)*
