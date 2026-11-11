# Network gaps and architecture review

## Summary and priority

**P0:** no confirmed P0 incident established by this bounded audit. Absence of proof is not a clean security audit.

**P1 — API observation:** member directory proxy returned 502 twice. Connect health first timed out, then returned 503 in 16.99 seconds. Diagnose proxy/upstream mapping and error translation read-only before a separately scoped repair. Neither response establishes a specific cause.

**P1 — deployment observation:** Connect, Ring Leader and WebSockets deployed HEADs differ from reviewed source heads. Compare actual working-file hashes, route wiring and deployment provenance before relying on source tests. No automatic upgrade is proposed.

**P1 — source review:** SSO trust, service issuance, cross-site identity mapping and revocation require independent security qualification before federation. Sensitive mechanics omitted below.

**P2 — incomplete evidence:** other member sites, authenticated journey, object-level permissions, database effects, notification receipt, queue retry and cache freshness remain unverified. These are explicit review blockers, not implied successes.

## Proposed sequence — inference, not a deployment grant
1. Reconcile deployed files and current source; diagnose failing proxy reads.
2. Qualify existing identity/entitlement and SSO using isolated fixtures, current membership and revocation.
3. Complete route-by-route deployed callback/auth/persistence mapping; resolve all unknowns in the matrix.
4. Approve a synthetic account and nonfinancial test environment separately, then test complete member journey and actual received notifications.
5. Add only the smallest read-first, consented agent projection using the integration-map owners.

## Tests and tooling
Wirebot directly ran node --check on the reviewed WebSocket auth module: exit 0, syntax only. Local PHP CLI is unavailable; membership regression did not run. A combined shell command ended 0 because Node followed the missing PHP command; that is not a PHP test pass. No packages installed, production tests run, service restarted or mutations invoked. Route introspection attempt produced an empty file despite exit 0; no absence-of-routes conclusion is drawn. Session-generation/admission interruption delayed collection; execution later resumed through the supported tool.

## Source evidence and bounded review

# Network PR 2 — source research

## Scope and evidence state
Wirebot's source-research sub-agent read the complete pinned handoff, all 1,113 lines of bigpicture.mdx, and all 242 lines of wirebot_chat_gpt_brainstorm.mdx at Network commit 5f79f3303376ed0b5c097e322db94f9e66fe01be. Read-only GitHub retrieval used the registered SSH KH route. No production inspection, GitHub mutation, commits, comments, deployments or descendants occurred. Related default-branch snapshots are identified by immutable SHA in the citations below. These are source snapshots, NOT installed-version evidence.

Coverage is bounded: complete historical documents; targeted entry points, route registrations and authorization implementations for five network components; README/current architecture passages for adjacent products; Draftees route/ownership code. This is not a complete security audit or exhaustive repository review. Archives include dependencies and historical files that were not read. Database and runtime-data files were not inspected.

## Historical design versus current source
- **Spec:** Parent WordPress/MemberPress/BuddyBoss owns membership and premium content; Ring Leader distributes it; Connect renders on member sites; WebSockets carries events; Screenshots supplies previews. [Historical topology](https://github.com/Startempire-Wire/Startempire-Wire-Network/blob/5f79f3303376ed0b5c097e322db94f9e66fe01be/docs/bigpicture.mdx#L3-L175).
- **Spec:** Mentor/Collaborator/Mentee participation includes owner-selective sharing; standalone Wirebot does not automatically imply network social access. [Original requirements](https://github.com/Startempire-Wire/Startempire-Wire-Network/blob/5f79f3303376ed0b5c097e322db94f9e66fe01be/docs/wirebot_chat_gpt_brainstorm.mdx#L9-L61), [membership clarification](https://github.com/Startempire-Wire/Startempire-Wire-Network/blob/5f79f3303376ed0b5c097e322db94f9e66fe01be/docs/wirebot_chat_gpt_brainstorm.mdx#L207-L227). Most assistant replies in the exported brainstorm are explicitly omitted summaries; do not reconstruct missing decisions.
- **Source:** Ring Leader currently registers authentication, content, network, member, profile, integration and cache routes. Public registration callbacks are not proof of absent authentication: handlers perform their own checks. [Controller](https://github.com/Startempire-Wire/Startempire-Wire-Network-Ring-Leader/blob/76ce5c611ad6b272de87a74ac1deb7d2677653cf/includes/api/class-rest-controller.php#L39-L165).
- **Source:** Ring Leader checks JWT or parent credentials, derives tiers from verified tokens, and reserves cache flush for manage_options. [Authorization](https://github.com/Startempire-Wire/Startempire-Wire-Network-Ring-Leader/blob/76ce5c611ad6b272de87a74ac1deb7d2677653cf/includes/api/class-rest-controller.php#L657-L712). Parent validation calls the parent authenticated user endpoint; signed membership snapshots explicitly are not current MemberPress membership proof. [Parent auth](https://github.com/Startempire-Wire/Startempire-Wire-Network-Ring-Leader/blob/76ce5c611ad6b272de87a74ac1deb7d2677653cf/includes/class-auth.php#L34-L113).
- **Source:** Connect exposes content/network reads, authenticated member reads and auth exchange, public SSO and health. [Routes](https://github.com/Startempire-Wire/Startempire-Wire-Network-Connect/blob/f9d4af6d823ade07a9c4c880d0c73b204ef765de/inc/class-rest-api.php#L30-L112). Its SSO flow reads the WordPress session and calls Ring Leader issuance. [Flow](https://github.com/Startempire-Wire/Startempire-Wire-Network-Connect/blob/f9d4af6d823ade07a9c4c880d0c73b204ef765de/inc/class-rest-api.php#L210-L285).
- **Source:** Parent-Core's main PHP file is a plugin header ending with an implementation placeholder, not an implemented central hub. Other parent plugins may implement these responsibilities; this snapshot alone cannot establish their absence. [Entire entry point](https://github.com/Startempire-Wire/Startempire-Wire-Network-Parent-Core/blob/fec5b1e57a2f2fab54e6dc09eb389e1690b57158/startempire-wire-network-parent-core.php#L1-L25).
- **Source:** WebSockets has an Express/Socket.IO server and separate auth module. The auth module references jwt without an import and calls helper methods not defined in the inspected module; wiring/runtime reachability remain unchecked. Tier mapping in that module lacks ExtraWire, while the historical spec includes it. [Auth module](https://github.com/Startempire-Wire/Startempire-Wire-Network-Websockets/blob/ff8a909a40a9131d9de496b16e48af3dc0054554/node-server/lib/auth-manager.js#L1-L77). Do not declare the deployed server broken from this alone.
- **Source:** Screenshots registers capture, preview, status, cache, authentication and network routes; the inspected primary permission path checks admin, rate limits, API key, JWT and OAuth, then returns 401. This differs from the historical anonymous free-tier promise. Other preview paths need separate qualification. [Routes](https://github.com/Startempire-Wire/Startempire-Wire-Network-Screenshots/blob/b6538544847304ea17086fa9e7c55211abf23734/includes/class-rest-controller.php#L388-L481), [Permission implementation](https://github.com/Startempire-Wire/Startempire-Wire-Network-Screenshots/blob/b6538544847304ea17086fa9e7c55211abf23734/includes/class-rest-controller.php#L920-L998).

## Current adjacent architecture, not deployment claims
- Wirebot is an operating partner using OpenClaw and Focusa, not a universal database or new authority. [Core README](https://github.com/Startempire-Wire/wirebot-core/blob/2920f4e93cba16065d32a2f2582bcf3d659deca6/README.md#L9-L65).
- Wirebot App separates recommendation, approval and execution; native and hosted session transports preserve owner isolation. [App](https://github.com/Startempire-Wire/Wirebot-App/blob/fe370aa13889f2dabb69aa0d2018502d44eefdfe/README.md#L5-L51).
- Focusa owns scoped Workpoints, Evidence, continuity and governed work; its current README distinguishes source/readiness/dispatch/completion and installed behavior. [Focusa](https://github.com/Startempire-Wire/focusa/blob/2be40060f6d7304878046ebd362f33f426b55129/README.md#L21-L51).
- SOVOS is doctrine/integration substrate, not another runtime/database. The repository slug remains agent-driven-life-business-os. [SOVOS](https://github.com/Startempire-Wire/agent-driven-life-business-os/blob/f2c6fcd185635d87e3dfc5cb88957ca3e06ffe7f/README.md#L1-L30).
- W.I.N.S. is optional progression, MeriFolio owns portable standing, Network owns community/federation, and Draftees owns marketplace discovery; local work remains Focusa governed. [Ownership](https://github.com/Startempire-Wire/agent-driven-life-business-os/blob/f2c6fcd185635d87e3dfc5cb88957ca3e06ffe7f/CURRENT_ECOSYSTEM_ARCHITECTURE.md#L332-L370).
- WorkRouter owns opportunity ingestion/matching/routing; source systems retain jobs/applications. [WorkRouter](https://github.com/Startempire-Wire/workrouter.live/blob/eeec5d13c24158a5d6c954308139d95f3cf62fc5/README.md#L17-L40).
- MeriFolio distinguishes Worker, Runtime, Engine and Session. [MeriFolio](https://github.com/Startempire-Wire/MeriFolio/blob/d58cab7c4d8b4c87f9a319b9553e632d3732bdaa/README.md#L1-L61).
- Draftees has public discovery; dispatch creation requires admin; hire access is separately checked; message handler verifies hire ownership beyond login. [Routes](https://github.com/Startempire-Wire/wire-draftees/blob/21c663eb5740e010ac2696b8a1c074e813384df6/inc/class-rest-api.php#L11-L105), [message ownership](https://github.com/Startempire-Wire/wire-draftees/blob/21c663eb5740e010ac2696b8a1c074e813384df6/inc/class-rest-api.php#L310-L339).

## Redacted static risk notes
These are source-review concerns, not demonstrated attacks or production findings. No exploit requests were made.
- **P1 review:** Connect SSO destination validation and credential handoff need security review before agent federation. Sensitive mechanics deliberately omitted from publishable summary. Source: Connect SSO link above.
- **P1 review:** Ring Leader service-mediated issuance trusts upstream identity/role assertions after service authentication. Verify least privilege, identity mapping and key custody in the main audit. [Issuance](https://github.com/Startempire-Wire/Startempire-Wire-Network-Ring-Leader/blob/76ce5c611ad6b272de87a74ac1deb7d2677653cf/includes/api/class-rest-controller.php#L227-L289). Never equate a membership JWT with authority to commit work or spend money.
- **P1 review:** Membership/profile mapping across parent, network and member-site identifiers requires explicit namespace binding; independent WordPress numeric IDs are not inherently the same identity.
- **P2 review:** Screenshots has more than one route-registration/authorization area; complete callback reachability, URL safety, cache access and request logging need further source review. Do not claim SSRF or disclosure without proof.
- **P2 gap:** WebSocket auth helper completeness and tier parity require isolated tests and verified runtime wiring.

## Tests and remaining gaps
A source-only membership regression is present at Ring Leader tests/current-membership-bridge.php; its inspected setup stubs WordPress/provider calls and checks service authorization, IDs, membership normalization and no-store responses. It does not prove installed WordPress or real MemberPress behavior. Test execution attempts encountered tool timeouts without a retained terminal result; **no passing test claimed**. The sub-agent Node attempt had no retained result; Wirebot later independently obtained syntax-check exit 0, as recorded above. Other suites were not executed. Do not run package install scripts, browser automation, live integration tests or production methods as part of this source task.

Related snapshots were available except veridoxa-os retrieval failed (CalledProcessError; exact HTTP reason not retained). SOVOS was successfully reviewed in its canonical compatibility-named repository; veridoxa-os is not assumed to be SOVOS. No claim of exhaustive routes, full auth correctness, deployed health, actual member journey or completed federation is made. Wirebot retains the incomplete deployed checks and publication responsibility.
