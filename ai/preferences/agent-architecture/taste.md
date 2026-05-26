# Agent Architecture
- Use a dynamic dual-orchestrator model: Primary Orchestrator leads execution, Shadow Co-Orchestrator provides strategic supervision with near-equal reasoning, planning, and agent-creation capabilities. Confidence: 0.90
- Do not rely on a static agent list — agents should be dynamically created, selected, paused, replaced, or removed based on task context, stage, complexity, risk, and real-time feedback. Confidence: 0.85
- Both orchestrators should challenge assumptions, compare strategies, detect risks, and prevent tunnel vision through continuous strategic supervision. Confidence: 0.80
- Prefer adaptive, evidence-based orchestration over fixed agent workflows — decisions driven by test results, build errors, agent confidence, and other real-time signals. Confidence: 0.80
- Use tiered oversight: skip review for trivial tasks, optional for simple, required for moderate+, full review for complex. Confidence: 0.70
- Govern the dual-orchestrator system with clear protocols to prevent chaos: the Shadow can request pauses, agent replacement, rollback, or user escalation, but final execution authority remains with the Primary to ensure controlled, auditable, and safe outcomes. Confidence: 0.70
