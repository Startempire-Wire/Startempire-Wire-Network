# Wirebot handoff — Startempire Wire Network deployed-system reconnaissance
Date: 2026-11-10
Status: ACTION REQUIRED — read-only reconnaissance; update this pull request with evidence
Owner: Server-resident Wirebot / OpenClaw chief of staff
Reviewers: Startempire Wire architecture / ChatGPT (this or subsequent conversation)

## Purpose and canonical location
This document lives in the **Startempire-Wire-Network** repository because it owns the original network architecture and historical Big Picture specification. This is a **handoff and evidence-collection PR**, not approval to deploy new architecture. Preserve `docs/bigpicture.mdx` as historical baseline. Compare deployed reality, source, and planned capabilities; do not silently replace the original design.

## Sources to read
- `docs/bigpicture.mdx` (parent WordPress + BuddyBoss + MemberPress, Ring Leader, Connect, WebSockets, member-site federation, roles)
- `docs/wirebot_chat_gpt_brainstorm.mdx` (Mentor, Collaborator, Mentee relationships and selective sharing)
- Repositories: `Startempire-Wire-Network-Ring-Leader`, `Startempire-Wire-Network-Connect`, `Startempire-Wire-Network-Parent-Core`, `Startempire-Wire-Network-Websockets`, `Startempire-Wire-Network-Screenshots`, Wirebot Core/App, Focusa, SOVOS, WorkRouter, Draftees, MeriFolio as relevant.
- User-provided WordPress REST index snapshot of `https://startempirewire.com/wp-json/`. This is a **route registration snapshot**, not proof of live behavior. Obtain a fresh sanitized inventory on the server and record timestamp and HTTP response codes.

## Server reconnaissance (READ ONLY)
1. Identify hosts/sites and boundaries: `startempirewire.com` parent, `startempirewire.network` Ring Leader, Connect member sites, WebSocket service, WordPress, BuddyBoss, MemberPress, proxy, queues/cron, databases, and authentication bridges. Record **actual** deployed versions and code commit IDs, with sanitized evidence.
2. Trace one complete member journey: registration, membership level/role, shared login, directory, Growth Partner relationship, discussion/message board, distributed content, notifications. Use safe non-mutating observations; do not impersonate users or disclose member data.
3. Trace Ring Leader -> Connect -> member site and WebSocket paths, including trust boundaries, failure/retry and permissions. Identify dormant versus healthy versus not deployed.
4. For each relevant API route, map namespace, methods, source controller, auth/capability checks, upstream/downstream consumers, persistence, tests, observed status. Mark **registered / implemented / deployed / verified** separately.
5. Prioritize namespaces `sewn-connect/v1`, `sew-wire/v1`, `sew-wire/v1/wirebot`, `wire-draftees/v1`, `wirebot-prov/v1`, `buddyboss/v1`, `mp/v1`, `sew-pwa/v1`, and `sewn/v1`. Example routes: `sewn-connect/v1/health`, `network/stats`, `network/members`, `growth-partners`, `sew-wire/v1/feed`, `discuss/{id}`, `opportunities`, `sew-wire/v1/wirebot/health`, `wire-draftees/v1/draftees`. **Never invoke mutating methods**, even when a route is labeled health/deploy/test.
6. Review auth/authorization of sensitive operations (deploy pull, SSO/token exchange, provisioning, webhooks, memberships, commerce) statically. Report risks privately/redacted; do not publish exploit instructions or credentials.
7. Assess agent-first reuse: operator-controlled agent identity, consented federation, Mentor/Collaborator/Mentee, agent message boards, opportunity matching, WorkRouter, Draftees, MeriFolio, Wirebot/OpenClaw, Focusa authority, Portable Memory, Master Loop, Master Observer, UIAI Engine. Do not duplicate identity, memory, workflow, or messaging primitives. Preserve human sovereignty and explicit approval for commitments. Proximity/romance remain out of scope.

## Required PR updates from Wirebot
**Commit findings to this same branch and update this PR; do not open a disconnected PR.** Add:
- `docs/audits/2026-11-10-network-deployment-topology.md` — diagram, component ownership, hosts (generalized), version/commit references, trust boundaries.
- `docs/audits/2026-11-10-network-api-matrix.md` — route/method, owner, auth, status classification, sanitized HTTP observations, test references.
- `docs/audits/2026-11-10-network-gaps.md` — P0/P1/P2 risks, code/deploy drift, missing tests, proposed repair sequence, non-duplication review.
- `docs/audits/2026-11-10-agent-integration-map.md` — existing integration points, minimal viable agent participation, cross-repo ownership, acceptance tests and unresolved decisions.
- Update **this file** with a brief executive summary, exact evidence links, branch commit SHA, test commands/results, blockers, and questions for review.
- Update PR description with a compact summary and explicit **READY FOR ARCHITECTURE REVIEW** only after deliverables are complete. Leave PR unmerged for independent review.

For every claim label evidence as **spec**, **source**, **deployment observation**, **API observation**, or **inference**. Distinguish 401/403 expected auth from actual breakage. Record date, environment and relevant commit SHA. Use redacted output only; no secrets, customer records, server IPs or session tokens in GitHub.

## Completion criteria
A future ChatGPT session can open this PR, inspect all four audit documents, independently trace evidence, and decide where Wirebot should attach without requesting the conversation transcript. Do not deploy, restart, modify production, run state-changing tests, or merge this PR as part of reconnaissance.

## Wirebot findings / return handoff
**Status: PARTIAL AUDIT — NOT READY FOR ARCHITECTURE REVIEW.**

Four bounded evidence reports are committed on this same branch:
- [Topology](../audits/2026-11-10-network-deployment-topology.md)
- [API matrix](../audits/2026-11-10-network-api-matrix.md)
- [Gaps and source citations](../audits/2026-11-10-network-gaps.md)
- [Agent integration map](../audits/2026-11-10-agent-integration-map.md)

Wirebot directly collected two-site deployment inventory and 18 anonymous HTTP observations plus two rechecks. A source-research sub-agent supplied bounded immutable source citations. Parent directory returned 502 twice; Connect health timed out then returned 503. Three installed network component HEADs differ from reviewed source. Node syntax check passed; PHP regression not executed because local PHP CLI is absent. No production mutation or merge.

Original obligations remain open: full deployed route callback/auth/consumer/persistence mapping, member-site enumeration, complete safe member-journey evidence and independent citation validation. Authenticated receiver delivery is not proven. Documents preserve these unknowns rather than imply readiness. Review questions: exact federation scopes, cross-site identity mapping, selective sharing and entitlement freshness. No architecture deployment authorized. This commit's exact SHA is recorded in the PR description/comment after remote content readback.


## Follow-through evidence update

Wirebot added the previously retained deployed callback/permission mapping for 462 registrations to the API matrix. This narrows the route-binding gap; consumers, persistence, safe complete member journey, authenticated notification receipt and remaining independent source validation are still open. Status remains PARTIAL — NOT READY FOR ARCHITECTURE REVIEW. No production change, state-changing test or merge.
