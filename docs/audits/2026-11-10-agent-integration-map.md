# Minimal agent integration map — proposed, not implemented

## Recommendation
Attach a consented, read-first network projection to the existing Wirebot partner. Do not create a new agent platform inside Ring Leader. Preserve the original human community and Mentor/Collaborator/Mentee design. Network participation is optional; membership does not authorize private-work access.

| Responsibility | Existing owner | Minimal attachment |
|---|---|---|
| Human membership and social relationships | Parent WordPress/MemberPress/BuddyBoss | Read verified membership and explicitly shared relationship fields; do not copy the private user database |
| Network distribution and tier-aware content | Ring Leader | Reuse verified content/member interfaces with provenance and freshness |
| Member-site presentation | Connect | Render allowed projections only; do not mint independent identity or work authority |
| Operating partner and conversation | Wirebot/OpenClaw, Wirebot App | Summarize permitted network context; present proposed actions and received results |
| Local work scope, delegated authority, evidence and continuation | Focusa | Bind accepted work to exact owner/project/workstream and existing governed work records |
| Opportunity normalization, matching and routing | WorkRouter | Consume permissioned network opportunities with source IDs; do not duplicate a matching engine in Ring Leader |
| Marketplace jobs, applications and hire messages | Draftees/source systems | Preserve originating records and hire ownership checks; route references, not uncontrolled copies |
| Portable worker identity and standing | MeriFolio | Link worker identity and permitted evidence-backed presentations; runtime/session are not the worker |
| Network notification transport | Existing WebSockets and social/message services | Qualify existing event delivery/permissions before reuse; an event never authorizes work |
| Browser observation and proof | UIAI Engine | Use existing governed browser path, not the public Screenshots service as an agent browser |
| Private memory, Master Loop and Observer | Existing Core/Focusa owners | Supply scoped inputs and source-qualified outcome references; do not export memory or create parallel schedulers |
| Optional progression | W.I.N.S. | Project verified outcomes only after opt-in; never make scores a permission or payment truth |
| Doctrine and cross-product boundaries | SOVOS | Preserve owner authority and source ownership; no new central database |

## Smallest useful journey
1. Owner explicitly enables network participation and chooses shared fields and recipients.
2. Existing identity/session establishes the owner and network membership; separately bind the delegated agent identity and exact grant. Fail closed on mismatch, revocation or stale entitlement.
3. Wirebot reads permitted content, relationship projections and opportunities from existing owners. Preserve source identity, timestamp and visibility.
4. WorkRouter returns advisory matches. Wirebot presents reasons and missing facts. No application, commitment, message or purchase is implied.
5. An authorized action uses Focusa's existing exact work scope and the originating service's permission checks. Consequential commitments retain the owner's reserved decision.
6. Receive the actual destination result, attach evidence and reconcile uncertain effects before retry. Only then optionally share a selected outcome to Network/W.I.N.S./MeriFolio.

These are proposed connections, not verified existing adapters. No claim of implementation, deployment or functioning routes is made.

## Qualification before implementation
- Verify parent/network/member-site identity namespaces; do not join users merely by local numeric ID.
- Fix and independently qualify SSO handoff and service-issuance trust before agent participation.
- Verify current membership separately from cached/signed issuance claims.
- Test selective sharing, recipient changes, revoked consent, expired sessions and cross-owner isolation using synthetic fixtures.
- Test Mentor/Collaborator/Mentee permissions per field. None implies administrator access or unrestricted private memory.
- Test duplicate/delayed events, replay, denied actions, unavailable upstream, stale membership, retries and cancellation without double effects.
- Verify source record, Focusa receipt and actual receiver readback agree. A dashboard success message is insufficient.
- Confirm matching does not apply/hire automatically, Draftees hire messages retain ownership, and MeriFolio publication is selective.
- Test W.I.N.S.-off and network-off as valid private operating modes.
- Qualify existing message boards/notifications before adding an agent board; public network events must contain no private work or memory.

## Evidence
Immutable source citations, exact pinned SHAs and limits are in 2026-11-10-network-gaps.md. Primary ownership anchors:
- [Historical selective sharing](https://github.com/Startempire-Wire/Startempire-Wire-Network/blob/5f79f3303376ed0b5c097e322db94f9e66fe01be/docs/wirebot_chat_gpt_brainstorm.mdx#L37-L53)
- [Current domain owners](https://github.com/Startempire-Wire/agent-driven-life-business-os/blob/f2c6fcd185635d87e3dfc5cb88957ca3e06ffe7f/CURRENT_ECOSYSTEM_ARCHITECTURE.md#L332-L370)
- [WorkRouter boundaries](https://github.com/Startempire-Wire/workrouter.live/blob/eeec5d13c24158a5d6c954308139d95f3cf62fc5/README.md#L32-L40)
- [MeriFolio identity separation](https://github.com/Startempire-Wire/MeriFolio/blob/d58cab7c4d8b4c87f9a319b9553e632d3732bdaa/README.md#L46-L61)
- [Core operating partner and governance](https://github.com/Startempire-Wire/wirebot-core/blob/2920f4e93cba16065d32a2f2582bcf3d659deca6/README.md#L25-L65)

## Open decisions and verification limits
Exact agent federation scopes, recipient policies, transport schemas and entitlement mapping require architecture review. Relationship, discussion, provisioning, webhook and commerce implementations outside the inspected files remain unreviewed. This source-only task does not authorize deploying adapters or testing state-changing endpoints. Proximity, romance and token/crypto incentives are outside the minimal proposal. Main Wirebot owns deployed observations, final report assembly and PR publication; this draft is not READY FOR ARCHITECTURE REVIEW by itself.

Master Observer must use existing observation and evidence interfaces; it must not become a second work-authority service. No adapter implementation or runtime readiness is established.
