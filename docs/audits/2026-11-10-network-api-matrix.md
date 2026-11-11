# Network API matrix

Evidence: **API observation** unless explicitly marked **source** or **inference**. Anonymous HTTPS GET only. No writes, authentication exchanges, provisioning or commerce tests. HTTP 200 verifies a response, not business correctness or delivery. 401/403 may be expected authorization. 404 on the network host for parent-only namespaces is not itself a deployment defect.

## Observed requests

| Time (Pacific) | URL | HTTP / error | Body SHA-256 |
|---|---|---|---|
| November 10, 2026, 11:21:15 PM PST | https://startempirewire.com/wp-json/ | 200 | 03bf78c0c1192ae17e99729c547f17b9bb1189187dcb7afd34a44fe110213472 |
| November 10, 2026, 11:21:18 PM PST | https://startempirewire.com/wp-json/sewn-connect/v1/health | TimeoutError | not received |
| November 10, 2026, 11:21:34 PM PST | https://startempirewire.com/wp-json/sewn-connect/v1/network/stats | 200 | ae0dda30d3e172622de8bfd6d5ba9f9a13902c6fffdb804389c20b2b67f56dd6 |
| November 10, 2026, 11:21:37 PM PST | https://startempirewire.com/wp-json/sewn-connect/v1/network/members | 502 | bb2fb7b51f18478e3ccde6376dc39285b20472f0394e7034fd2e0bdf6a5716e2 |
| November 10, 2026, 11:21:39 PM PST | https://startempirewire.com/wp-json/sewn-connect/v1/growth-partners | 401 | 5e624cc207e03d06cb1a83d7e8eb917c4aff2637077d8ddb4504cc2bf271da4b |
| November 10, 2026, 11:21:40 PM PST | https://startempirewire.com/wp-json/sew-wire/v1/feed | 200 | a676371b94c3cf062574006db7a2abf2d24db5117dccab46d6da66c1e4d43a65 |
| November 10, 2026, 11:21:42 PM PST | https://startempirewire.com/wp-json/sew-wire/v1/opportunities | 200 | 89ac4f7e92974669bb5f21610cc313ed94fac86369429325fdaa024d820c9d73 |
| November 10, 2026, 11:21:43 PM PST | https://startempirewire.com/wp-json/sew-wire/v1/wirebot/health | 200 | df79341cae1cdc03754aa019d9b47217f93405b1b0f9b751e1ae7a4bf0910ae6 |
| November 10, 2026, 11:21:44 PM PST | https://startempirewire.com/wp-json/wire-draftees/v1/draftees | 200 | c60a6203e978a52b621168f0746a404e2340b5c978205849eb2af6ea241248bf |
| November 10, 2026, 11:21:46 PM PST | https://startempirewire.network/wp-json/ | 200 | a9a2d1c7542915827dbbfbd7ae50285aae7520c40d21b2e44c851a134b4c2822 |
| November 10, 2026, 11:21:46 PM PST | https://startempirewire.network/wp-json/sewn-connect/v1/health | 404 | 321227fe038fc2f282fd904a174fbaf931eb5d763ce64eded0e6a3f31d32119f |
| November 10, 2026, 11:21:46 PM PST | https://startempirewire.network/wp-json/sewn-connect/v1/network/stats | 404 | 321227fe038fc2f282fd904a174fbaf931eb5d763ce64eded0e6a3f31d32119f |
| November 10, 2026, 11:21:46 PM PST | https://startempirewire.network/wp-json/sewn-connect/v1/network/members | 404 | 321227fe038fc2f282fd904a174fbaf931eb5d763ce64eded0e6a3f31d32119f |
| November 10, 2026, 11:21:46 PM PST | https://startempirewire.network/wp-json/sewn-connect/v1/growth-partners | 404 | 321227fe038fc2f282fd904a174fbaf931eb5d763ce64eded0e6a3f31d32119f |
| November 10, 2026, 11:21:47 PM PST | https://startempirewire.network/wp-json/sew-wire/v1/feed | 404 | 321227fe038fc2f282fd904a174fbaf931eb5d763ce64eded0e6a3f31d32119f |
| November 10, 2026, 11:21:47 PM PST | https://startempirewire.network/wp-json/sew-wire/v1/opportunities | 404 | 321227fe038fc2f282fd904a174fbaf931eb5d763ce64eded0e6a3f31d32119f |
| November 10, 2026, 11:21:47 PM PST | https://startempirewire.network/wp-json/sew-wire/v1/wirebot/health | 404 | 321227fe038fc2f282fd904a174fbaf931eb5d763ce64eded0e6a3f31d32119f |
| November 10, 2026, 11:21:47 PM PST | https://startempirewire.network/wp-json/wire-draftees/v1/draftees | 404 | 321227fe038fc2f282fd904a174fbaf931eb5d763ce64eded0e6a3f31d32119f |

## Fresh registered routes

This exhaustive priority-prefix inventory comes from each fresh REST index. Registration and method advertisement are verified; individual callback execution, persistence, authenticated journey and receiver delivery are **not verified** except for the bounded HTTP observations above. Unknown callback/auth/consumer fields must not be inferred from an index.

| Host | Registered route | Advertised methods |
|---|---|---|
| startempirewire.com | /sewn-connect/v1 | GET |
| startempirewire.com | /sewn-connect/v1/directory-sites | GET |
| startempirewire.com | /sewn/v1 | GET |
| startempirewire.com | /sewn/v1/passkey/register/options | POST |
| startempirewire.com | /sewn/v1/passkey/register/verify | POST |
| startempirewire.com | /sewn/v1/passkey/assert/options | POST |
| startempirewire.com | /sewn/v1/passkey/assert/verify | POST |
| startempirewire.com | /sewn/v1/passkey/remove | POST |
| startempirewire.com | /sewn/v1/passkey/status | GET |
| startempirewire.com | /mp/v1 | GET |
| startempirewire.com | /mp/v1/members | GET, POST |
| startempirewire.com | /mp/v1/members/(?P<id>[\d]+) | GET, POST, PUT, PATCH, DELETE |
| startempirewire.com | /mp/v1/members/schema | GET |
| startempirewire.com | /mp/v1/reminders | GET, POST |
| startempirewire.com | /mp/v1/reminders/(?P<id>[\d]+) | GET, POST, PUT, PATCH, DELETE |
| startempirewire.com | /mp/v1/reminders/schema | GET |
| startempirewire.com | /mp/v1/quizzes | GET, POST |
| startempirewire.com | /mp/v1/quizzes/(?P<id>[\d]+) | GET, POST, PUT, PATCH, DELETE |
| startempirewire.com | /mp/v1/quizzes/schema | GET |
| startempirewire.com | /mp/v1/quizzes/(?P<id>[\d]+)/start | POST |
| startempirewire.com | /mp/v1/quizzes/(?P<id>[\d]+)/complete | POST |
| startempirewire.com | /mp/v1/subscriptions | GET, POST |
| startempirewire.com | /mp/v1/subscriptions/(?P<id>[\d]+) | GET, POST, PUT, PATCH, DELETE |
| startempirewire.com | /mp/v1/subscriptions/schema | GET |
| startempirewire.com | /mp/v1/subscriptions/(?P<id>[\d]+)/cancel | POST, PUT, PATCH |
| startempirewire.com | /mp/v1/subscriptions/(?P<id>[\d]+)/expire | POST, PUT, PATCH |
| startempirewire.com | /mp/v1/groups | GET, POST |
| startempirewire.com | /mp/v1/groups/(?P<id>[\d]+) | GET, POST, PUT, PATCH, DELETE |
| startempirewire.com | /mp/v1/groups/schema | GET |
| startempirewire.com | /mp/v1/courses | GET, POST |
| startempirewire.com | /mp/v1/courses/(?P<id>[\d]+) | GET, POST, PUT, PATCH, DELETE |
| startempirewire.com | /mp/v1/courses/schema | GET |
| startempirewire.com | /mp/v1/courses/settings | GET |
| startempirewire.com | /mp/v1/courses/authors | GET |
| startempirewire.com | /mp/v1/courses/(?P<id>[\d]+)/sections | GET |
| startempirewire.com | /mp/v1/courses/(?P<id>[\d]+)/start | POST |
| startempirewire.com | /mp/v1/courses/(?P<id>[\d]+)/complete | POST |
| startempirewire.com | /mp/v1/courses/(?P<id>[\d]+)/comments | GET, POST |
| startempirewire.com | /mp/v1/courses/(?P<id>[\d]+)/comments/(?P<comment_id>[\d]+)/reply | POST |
| startempirewire.com | /mp/v1/courses/(?P<id>[\d]+)/comments/(?P<comment_id>[\d]+)/edit | POST |
| startempirewire.com | /mp/v1/me | GET |
| startempirewire.com | /mp/v1/validate-login | POST |
| startempirewire.com | /mp/v1/webhooks/subscribe | POST |
| startempirewire.com | /mp/v1/events/poll | GET |
| startempirewire.com | /mp/v1/webhooks/unsubscribe/(?P<id>[\d]+) | DELETE |
| startempirewire.com | /mp/v1/coupons | GET, POST |
| startempirewire.com | /mp/v1/coupons/(?P<id>[\d]+) | GET, POST, PUT, PATCH, DELETE |
| startempirewire.com | /mp/v1/coupons/schema | GET |
| startempirewire.com | /mp/v1/rules | GET, POST |
| startempirewire.com | /mp/v1/rules/(?P<id>[\d]+) | GET, POST, PUT, PATCH, DELETE |
| startempirewire.com | /mp/v1/rules/schema | GET |
| startempirewire.com | /mp/v1/assignments | GET, POST |
| startempirewire.com | /mp/v1/assignments/(?P<id>[\d]+) | GET, POST, PUT, PATCH, DELETE |
| startempirewire.com | /mp/v1/assignments/schema | GET |
| startempirewire.com | /mp/v1/assignments/(?P<id>[\d]+)/start | POST |
| startempirewire.com | /mp/v1/assignments/(?P<id>[\d]+)/complete | POST |
| startempirewire.com | /mp/v1/assignments/(?P<id>[\d]+)/submissions/(?P<user_id>[\d]+) | DELETE |
| startempirewire.com | /mp/v1/lessons | GET, POST |
| startempirewire.com | /mp/v1/lessons/(?P<id>[\d]+) | GET, POST, PUT, PATCH, DELETE |
| startempirewire.com | /mp/v1/lessons/schema | GET |
| startempirewire.com | /mp/v1/lessons/(?P<id>[\d]+)/start | POST |
| startempirewire.com | /mp/v1/lessons/(?P<id>[\d]+)/complete | POST |
| startempirewire.com | /mp/v1/lessons/(?P<id>[\d]+)/comments | GET, POST |
| startempirewire.com | /mp/v1/lessons/(?P<id>[\d]+)/comments/(?P<comment_id>[\d]+)/reply | POST |
| startempirewire.com | /mp/v1/lessons/(?P<id>[\d]+)/comments/(?P<comment_id>[\d]+)/edit | POST |
| startempirewire.com | /mp/v1/events | GET, POST |
| startempirewire.com | /mp/v1/events/(?P<id>[\d]+) | GET, POST, PUT, PATCH, DELETE |
| startempirewire.com | /mp/v1/events/schema | GET |
| startempirewire.com | /mp/v1/transactions | GET, POST |
| startempirewire.com | /mp/v1/transactions/(?P<id>[\d]+) | GET, POST, PUT, PATCH, DELETE |
| startempirewire.com | /mp/v1/transactions/schema | GET |
| startempirewire.com | /mp/v1/transactions/(?P<id>[\d]+)/refund | POST, PUT, PATCH |
| startempirewire.com | /mp/v1/transactions/(?P<id>[\d]+)/refund_and_cancel | POST, PUT, PATCH |
| startempirewire.com | /mp/v1/memberships | GET, POST |
| startempirewire.com | /mp/v1/memberships/(?P<id>[\d]+) | GET, POST, PUT, PATCH, DELETE |
| startempirewire.com | /mp/v1/memberships/schema | GET |
| startempirewire.com | /sew-wire/v1 | GET |
| startempirewire.com | /sew-wire/v1/queue | GET, POST |
| startempirewire.com | /sew-wire/v1/queue/(?P<id>\d+) | PATCH, DELETE |
| startempirewire.com | /sew-wire/v1/run | POST |
| startempirewire.com | /sew-wire/v1/runs | GET |
| startempirewire.com | /sew-wire/v1/runs/pending | GET |
| startempirewire.com | /sew-wire/v1/run/(?P<id>\d+) | PATCH |
| startempirewire.com | /sew-wire/v1/win | POST |
| startempirewire.com | /sew-wire/v1/wins | GET, GET |
| startempirewire.com | /sew-wire/v1/wins/public | GET |
| startempirewire.com | /sew-wire/v1/wins/(?P<id>\d+)/toggle-privacy | POST |
| startempirewire.com | /sew-wire/v1/wins/pending | GET |
| startempirewire.com | /sew-wire/v1/wins/(?P<id>\d+)/review | POST |
| startempirewire.com | /sew-wire/v1/wins/(?P<id>\d+)/gp-verify | POST |
| startempirewire.com | /sew-wire/v1/feed | GET |
| startempirewire.com | /sew-wire/v1/vote/(?P<id>\d+) | POST |
| startempirewire.com | /sew-wire/v1/votes/(?P<id>\d+) | GET |
| startempirewire.com | /sew-wire/v1/discuss/(?P<id>\d+) | GET, POST |
| startempirewire.com | /sew-wire/v1/settings | POST, GET, POST |
| startempirewire.com | /sew-wire/v1/submit-signal | POST |
| startempirewire.com | /sew-wire/v1/quick-queue | POST |
| startempirewire.com | /sew-wire/v1/webhook/youtube | POST |
| startempirewire.com | /sew-wire/v1/webhook/rss | POST |
| startempirewire.com | /sew-wire/v1/profile | GET |
| startempirewire.com | /sew-wire/v1/wins/scoreboard | GET |
| startempirewire.com | /sew-wire/v1/wins/feed | GET |
| startempirewire.com | /sew-wire/v1/wins/history | GET |
| startempirewire.com | /sew-wire/v1/wins/health | GET |
| startempirewire.com | /sew-wire/v1/wirebot | GET |
| startempirewire.com | /sew-wire/v1/wirebot/chat | POST |
| startempirewire.com | /sew-wire/v1/wirebot/coach | POST |
| startempirewire.com | /sew-wire/v1/wirebot/reflect | POST |
| startempirewire.com | /sew-wire/v1/wirebot/analyze | POST |
| startempirewire.com | /sew-wire/v1/wirebot/health | GET |
| startempirewire.com | /sew-wire/v1/wirebot/standup | GET |
| startempirewire.com | /sew-wire/v1/opportunities | GET |
| startempirewire.com | /sew-wire/v1/opportunities/(?P<id>\d+)/claim | POST |
| startempirewire.com | /sew-wire/v1/claims/(?P<id>\d+) | PATCH |
| startempirewire.com | /sew-wire/v1/claims/(?P<id>\d+)/review | POST |
| startempirewire.com | /sew-wire/v1/my-claims | GET |
| startempirewire.com | /sew-wire/v1/leaderboard | GET |
| startempirewire.com | /sew-wire/v1/reputation/(?P<user_id>\d+) | GET |
| startempirewire.com | /sew-wire/v1/runs/(?P<id>\d+)/delegate | POST |
| startempirewire.com | /sew-wire/v1/delegations | GET |
| startempirewire.com | /sew-wire/v1/delegations/(?P<run_id>\d+)/review | POST |
| startempirewire.com | /sew-wire/v1/delegations/(?P<run_id>\d+)/progress | POST |
| startempirewire.com | /sewn-connect/v1/deploy/pull | POST |
| startempirewire.com | /sewn-connect/v1/deploy/status | GET |
| startempirewire.com | /sewn-connect/v1/content/(?P<type>[a-z]+) | GET |
| startempirewire.com | /sewn-connect/v1/network/stats | GET |
| startempirewire.com | /sewn-connect/v1/network/members | GET |
| startempirewire.com | /sewn-connect/v1/member/me | GET |
| startempirewire.com | /sewn-connect/v1/member/scoreboard | GET |
| startempirewire.com | /sewn-connect/v1/growth-partners | GET, POST |
| startempirewire.com | /sewn-connect/v1/growth-partners/(?P<partner_id>\d+)/accept | PUT |
| startempirewire.com | /sewn-connect/v1/growth-partners/(?P<partner_id>\d+)/decline | PUT |
| startempirewire.com | /sewn-connect/v1/growth-partners/(?P<partner_id>\d+) | DELETE |
| startempirewire.com | /sewn-connect/v1/auth/exchange | POST |
| startempirewire.com | /sewn-connect/v1/auth/sso | GET |
| startempirewire.com | /sewn-connect/v1/health | GET |
| startempirewire.com | /sewn-connect/v1/user/(?P<id>\d+) | GET |
| startempirewire.com | /sewn-connect/v1/user/(?P<id>\d+)/friends | GET |
| startempirewire.com | /wire-draftees/v1 | GET |
| startempirewire.com | /wire-draftees/v1/draftees | GET |
| startempirewire.com | /wire-draftees/v1/draftees/(?P<id>\d+) | GET |
| startempirewire.com | /wire-draftees/v1/draftees/(?P<id>\d+)/dispatches | GET |
| startempirewire.com | /wire-draftees/v1/leaderboard | GET |
| startempirewire.com | /wire-draftees/v1/departments | GET |
| startempirewire.com | /wire-draftees/v1/dispatches | POST |
| startempirewire.com | /wire-draftees/v1/hire | POST |
| startempirewire.com | /wire-draftees/v1/my-hires | GET |
| startempirewire.com | /wire-draftees/v1/hires/(?P<hire_id>\d+)/messages | POST |
| startempirewire.com | /sew-pwa/v1 | GET |
| startempirewire.com | /sew-pwa/v1/subscribe | POST |
| startempirewire.com | /sew-pwa/v1/unsubscribe | DELETE |
| startempirewire.com | /sew-pwa/v1/preferences | GET, POST |
| startempirewire.com | /sew-pwa/v1/has-subscription | GET |
| startempirewire.com | /sew-pwa/v1/track-install | POST |
| startempirewire.com | /sew-pwa/v1/vapid-key | GET |
| startempirewire.com | /wirebot-prov/v1 | GET |
| startempirewire.com | /wirebot-prov/v1/provision/(?P<user_id>\d+) | POST |
| startempirewire.com | /wirebot-prov/v1/suspend/(?P<user_id>\d+) | POST |
| startempirewire.com | /wirebot-prov/v1/reactivate/(?P<user_id>\d+) | POST |
| startempirewire.com | /wirebot-prov/v1/retry-provision/(?P<user_id>\d+) | POST |
| startempirewire.com | /wirebot-prov/v1/status/(?P<user_id>\d+) | GET |
| startempirewire.com | /wirebot-prov/v1/health | GET |
| startempirewire.com | /wirebot-prov/v1/system-health | GET |
| startempirewire.com | /wirebot-prov/v1/tenants | GET |
| startempirewire.com | /wirebot-prov/v1/audit | GET |
| startempirewire.com | /wirebot-prov/v1/analytics | GET |
| startempirewire.com | /wirebot-prov/v1/budget/(?P<user_id>\d+) | GET |
| startempirewire.com | /wirebot-prov/v1/budget/(?P<user_id>\d+)/override | POST |
| startempirewire.com | /wirebot-prov/v1/training/(?P<user_id>\d+) | GET, POST |
| startempirewire.com | /wirebot-prov/v1/training/(?P<user_id>\d+)/(?P<entry_id>[a-f0-9-]+) | DELETE |
| startempirewire.com | /wirebot-prov/v1/training/(?P<user_id>\d+)/rate | POST |
| startempirewire.com | /wirebot-prov/v1/onboarding/(?P<user_id>\d+) | GET |
| startempirewire.com | /wirebot-prov/v1/consent/(?P<user_id>\d+) | POST |
| startempirewire.com | /wirebot-prov/v1/onboarding/(?P<user_id>\d+)/complete | POST |
| startempirewire.com | /wirebot-prov/v1/config/(?P<user_id>\d+) | GET, PUT |
| startempirewire.com | /wirebot-prov/v1/checkin/(?P<user_id>\d+) | POST |
| startempirewire.com | /wirebot-prov/v1/metrics/(?P<user_id>\d+) | GET |
| startempirewire.com | /wirebot-prov/v1/support-info/(?P<user_id>\d+) | GET |
| startempirewire.com | /wirebot-prov/v1/facts/(?P<user_id>\d+) | GET, POST |
| startempirewire.com | /wirebot-prov/v1/facts/(?P<user_id>\d+)/(?P<fact_id>[a-f0-9]+) | PATCH, DELETE |
| startempirewire.com | /wirebot-prov/v1/facts/(?P<user_id>\d+)/all | DELETE |
| startempirewire.com | /wirebot-prov/v1/exa-optout/(?P<user_id>\d+) | GET, POST |
| startempirewire.com | /wirebot-prov/v1/notifications/(?P<user_id>\d+) | GET, PATCH |
| startempirewire.com | /wirebot-prov/v1/notifications/(?P<user_id>\d+)/unsubscribe | POST |
| startempirewire.com | /wirebot-prov/v1/skills/(?P<user_id>\d+) | GET |
| startempirewire.com | /wirebot-prov/v1/push-callback | POST |
| startempirewire.com | /wirebot-prov/v1/dispatch-bridge | POST |
| startempirewire.com | /wirebot-prov/v1/discord/resolve | GET |
| startempirewire.com | /wirebot-prov/v1/discord/link | POST |
| startempirewire.com | /wirebot-prov/v1/discord/users | GET |
| startempirewire.com | /buddyboss/v1 | GET |
| startempirewire.com | /buddyboss/v1/bb-topics | GET, POST |
| startempirewire.com | /buddyboss/v1/bb-topics/(?P<id>[\d]+) | GET, POST, PUT, PATCH, DELETE |
| startempirewire.com | /buddyboss/v1/bb-topics/order | POST, PUT, PATCH |
| startempirewire.com | /buddyboss/v1/components | GET, POST, PUT, PATCH |
| startempirewire.com | /buddyboss/v1/settings | GET, POST |
| startempirewire.com | /buddyboss/v1/members | GET, POST |
| startempirewire.com | /buddyboss/v1/members/(?P<id>[\d]+) | GET, POST, PUT, PATCH, DELETE |
| startempirewire.com | /buddyboss/v1/members/me | GET, POST, PUT, PATCH, DELETE |
| startempirewire.com | /buddyboss/v1/members/me/permissions | GET |
| startempirewire.com | /buddyboss/v1/members/action/(?P<id>[\d]+) | POST, PUT, PATCH |
| startempirewire.com | /buddyboss/v1/members/presence | POST |
| startempirewire.com | /buddyboss/v1/members/details | GET |
| startempirewire.com | /buddyboss/v1/members/(?P<id>[\d]+)/detail | GET |
| startempirewire.com | /buddyboss/v1/members/profile-dropdown | GET |
| startempirewire.com | /buddyboss/v1/members/(?P<id>[\d]+)/info | GET |
| startempirewire.com | /buddyboss/v1/members/(?P<user_id>[\d]+)/avatar | GET, POST, DELETE |
| startempirewire.com | /buddyboss/v1/subscriptions | GET, POST |
| startempirewire.com | /buddyboss/v1/subscriptions/(?P<id>[\d]+) | GET, DELETE |
| startempirewire.com | /buddyboss/v1/subscription-types | GET |
| startempirewire.com | /buddyboss/v1/reactions | GET |
| startempirewire.com | /buddyboss/v1/user-reactions | GET, POST |
| startempirewire.com | /buddyboss/v1/user-reactions/(?P<id>[\d]+) | GET, DELETE |
| startempirewire.com | /buddyboss/v1/mention | GET |
| startempirewire.com | /buddyboss/v1/members/(?P<user_id>[\d]+)/cover | GET, POST, DELETE |
| startempirewire.com | /buddyboss/v1/signup/form | GET |
| startempirewire.com | /buddyboss/v1/signup | GET, POST |
| startempirewire.com | /buddyboss/v1/signup/(?P<id>[\w-]+) | GET, DELETE |
| startempirewire.com | /buddyboss/v1/signup/activate/(?P<activation_key>[\w-]+) | POST, PUT, PATCH |
| startempirewire.com | /buddyboss/v1/xprofile/fields | GET, POST |
| startempirewire.com | /buddyboss/v1/xprofile/fields/(?P<id>[\d]+) | GET, POST, PUT, PATCH, DELETE |
| startempirewire.com | /buddyboss/v1/xprofile/groups | GET, POST |
| startempirewire.com | /buddyboss/v1/xprofile/groups/(?P<id>[\d]+) | GET, POST, PUT, PATCH, DELETE |
| startempirewire.com | /buddyboss/v1/xprofile/(?P<field_id>[\d]+)/data/(?P<user_id>[\d]+) | GET, POST, PUT, PATCH, DELETE |
| startempirewire.com | /buddyboss/v1/xprofile/update | POST, PUT, PATCH |
| startempirewire.com | /buddyboss/v1/xprofile/repeater/(?P<id>[\d]+) | POST, DELETE |
| startempirewire.com | /buddyboss/v1/xprofile/repeater/order/(?P<id>[\d]+) | POST, PUT, PATCH |
| startempirewire.com | /buddyboss/v1/xprofile/search | GET |
| startempirewire.com | /buddyboss/v1/xprofile/types | GET |
| startempirewire.com | /buddyboss/v1/account-settings | GET |
| startempirewire.com | /buddyboss/v1/account-settings/(?P<nav>[\w-]+) | GET, POST, PUT, PATCH |
| startempirewire.com | /buddyboss/v1/notifications | GET, POST |
| startempirewire.com | /buddyboss/v1/notifications/(?P<id>[\d]+) | GET, POST, PUT, PATCH, DELETE |
| startempirewire.com | /buddyboss/v1/notifications/bulk/read | POST, PUT, PATCH |
| startempirewire.com | /buddyboss/v1/groups | GET, POST |
| startempirewire.com | /buddyboss/v1/groups/(?P<id>[\d]+) | GET, POST, PUT, PATCH, DELETE |
| startempirewire.com | /buddyboss/v1/groups/details | GET |
| startempirewire.com | /buddyboss/v1/groups/(?P<id>[\d]+)/detail | GET |
| startempirewire.com | /buddyboss/v1/groups/(?P<id>[\d]+)/info | GET |
| startempirewire.com | /buddyboss/v1/groups/(?P<group_id>[\d]+)/members | GET, POST |
| startempirewire.com | /buddyboss/v1/groups/(?P<group_id>[\d]+)/members/(?P<user_id>[\d]+) | POST, PUT, PATCH, DELETE |
| startempirewire.com | /buddyboss/v1/groups/(?P<id>[\d]+)/settings | GET, POST, PUT, PATCH |
| startempirewire.com | /buddyboss/v1/groups/invites | GET, POST |
| startempirewire.com | /buddyboss/v1/groups/invites/(?P<invite_id>[\d]+) | GET, POST, PUT, PATCH, DELETE |
| startempirewire.com | /buddyboss/v1/groups/invites/multiple | POST |
| startempirewire.com | /buddyboss/v1/groups/membership-requests | GET, POST |
| startempirewire.com | /buddyboss/v1/groups/membership-requests/(?P<request_id>[\d]+) | GET, POST, PUT, PATCH, DELETE |
| startempirewire.com | /buddyboss/v1/groups/types | GET |
| startempirewire.com | /buddyboss/v1/groups/(?P<group_id>[\d]+)/avatar | GET, POST, DELETE |
| startempirewire.com | /buddyboss/v1/groups/(?P<group_id>[\d]+)/cover | GET, POST, DELETE |
| startempirewire.com | /buddyboss/v1/forums | GET |
| startempirewire.com | /buddyboss/v1/forums/(?P<id>[\d]+) | GET |
| startempirewire.com | /buddyboss/v1/forums/subscribe/(?P<id>[\d]+) | POST, PUT, PATCH |
| startempirewire.com | /buddyboss/v1/topics | GET, POST |
| startempirewire.com | /buddyboss/v1/topics/(?P<id>[\d]+) | GET, POST, PUT, PATCH, DELETE |
| startempirewire.com | /buddyboss/v1/topics/merge/(?P<id>[\d]+) | POST |
| startempirewire.com | /buddyboss/v1/topics/split/(?P<id>[\d]+) | POST |
| startempirewire.com | /buddyboss/v1/topics/action/(?P<id>[\d]+) | POST |
| startempirewire.com | /buddyboss/v1/topics/dropdown/(?P<id>[\d]+) | GET |
| startempirewire.com | /buddyboss/v1/reply | GET, POST |
| startempirewire.com | /buddyboss/v1/reply/(?P<id>[\d]+) | GET, POST, PUT, PATCH, DELETE |
| startempirewire.com | /buddyboss/v1/reply/action/(?P<id>[\d]+) | POST |
| startempirewire.com | /buddyboss/v1/reply/move/(?P<id>[\d]+) | POST |
| startempirewire.com | /buddyboss/v1/forums/link-preview | GET |
| startempirewire.com | /buddyboss/v1/activity | GET, POST |
| startempirewire.com | /buddyboss/v1/activity/(?P<id>[\d]+) | GET, POST, PUT, PATCH, DELETE |
| startempirewire.com | /buddyboss/v1/activity/(?P<id>[\d]+)/favorite | POST, PUT, PATCH |
| startempirewire.com | /buddyboss/v1/activity/(?P<id>[\d]+)/pin | POST, PUT, PATCH |
| startempirewire.com | /buddyboss/v1/activity/(?P<id>[\d]+)/close-comments | POST, PUT, PATCH |
| startempirewire.com | /buddyboss/v1/activity/(?P<id>[\d]+)/notification | POST, PUT, PATCH |
| startempirewire.com | /buddyboss/v1/activity/(?P<id>[\d]+)/comment | GET, POST |
| startempirewire.com | /buddyboss/v1/activity/(?P<id>[\d]+)/comment/(?P<comment_id>[\d]+) | GET, POST, PUT, PATCH, DELETE |
| startempirewire.com | /buddyboss/v1/activity/details | GET |
| startempirewire.com | /buddyboss/v1/activity/link-preview | GET |
| startempirewire.com | /buddyboss/v1/messages | GET, POST |
| startempirewire.com | /buddyboss/v1/messages/search-recipients | GET |
| startempirewire.com | /buddyboss/v1/messages/search-thread | GET |
| startempirewire.com | /buddyboss/v1/messages/(?P<id>[\d]+) | GET, POST, PUT, PATCH, DELETE |
| startempirewire.com | /buddyboss/v1/messages/starred/(?P<id>[\d]+) | POST, PUT, PATCH |
| startempirewire.com | /buddyboss/v1/messages/group | POST |
| startempirewire.com | /buddyboss/v1/messages/action/(?P<id>[\d]+) | POST |
| startempirewire.com | /buddyboss/v1/friends | GET, POST, DELETE |
| startempirewire.com | /buddyboss/v1/friends/(?P<id>[\w-]+) | GET, POST, PUT, PATCH, DELETE |
| startempirewire.com | /buddyboss/v1/poll | POST |
| startempirewire.com | /buddyboss/v1/poll/(?P<id>[\d]+) | GET, POST, PUT, PATCH, DELETE |
| startempirewire.com | /buddyboss/v1/poll/(?P<id>[\d]+)/options | GET, POST |
| startempirewire.com | /buddyboss/v1/poll/(?P<id>[\d]+)/options/(?P<option_id>[\d]+) | GET, POST, PUT, PATCH, DELETE |
| startempirewire.com | /buddyboss/v1/poll/(?P<id>[\d]+)/options/(?P<option_id>[\d]+)/vote | GET, POST |
| startempirewire.com | /buddyboss/v1/poll/(?P<id>[\d]+)/options/(?P<option_id>[\d]+)/vote/(?P<vote_id>[\d]+) | DELETE |
| startempirewire.com | /buddyboss/v1/activity/featured-image/upload | POST |
| startempirewire.com | /buddyboss/v1/activity/featured-image/upload/(?P<id>\d+) | POST, PUT, PATCH, DELETE |
| startempirewire.com | /buddyboss/v1/pusher/data | GET |
| startempirewire.com | /buddyboss/v1/pusher/auth | POST, PUT, PATCH |
| startempirewire.com | /buddyboss/v1/pusher/user-auth | POST, PUT, PATCH |
| startempirewire.network | /sewn/v1 | GET |
| startempirewire.network | /sewn/v1/auth/validate | POST |
| startempirewire.network | /sewn/v1/auth/token | POST |
| startempirewire.network | /sewn/v1/auth/issue | POST |
| startempirewire.network | /sewn/v1/auth/refresh | POST |
| startempirewire.network | /sewn/v1/auth/membership/current | POST |
| startempirewire.network | /sewn/v1/content | GET |
| startempirewire.network | /sewn/v1/content/posts | GET |
| startempirewire.network | /sewn/v1/content/events | GET |
| startempirewire.network | /sewn/v1/content/podcasts | GET |
| startempirewire.network | /sewn/v1/content/directory | GET |
| startempirewire.network | /sewn/v1/content/listings | GET |
| startempirewire.network | /sewn/v1/content/activity | GET |
| startempirewire.network | /sewn/v1/content/forums | GET |
| startempirewire.network | /sewn/v1/content/topics | GET |
| startempirewire.network | /sewn/v1/content/member-directory | GET |
| startempirewire.network | /sewn/v1/screenshots/capture | POST |
| startempirewire.network | /sewn/v1/network/stats | GET |
| startempirewire.network | /sewn/v1/network/members | GET |
| startempirewire.network | /sewn/v1/member/me | GET |
| startempirewire.network | /sewn/v1/member/scoreboard | GET |
| startempirewire.network | /sewn/v1/member/profile | GET, POST |
| startempirewire.network | /sewn/v1/member/integrations | GET |
| startempirewire.network | /sewn/v1/member/growth-partners | GET, POST |
| startempirewire.network | /sewn/v1/member/growth-partners/(?P<partner_id>\d+) | DELETE |
| startempirewire.network | /sewn/v1/cache/flush | POST |
| startempirewire.network | /sewn/v1/webring/position | GET |
| startempirewire.network | /sewn/v1/webring/sites | GET |
| startempirewire.network | /sewn/v1/webring/random | GET |
| startempirewire.network | /sewn/v1/member/recommendations | GET |
| startempirewire.network | /sewn/v1/member/connections | GET, POST |
| startempirewire.network | /sewn/v1/member/connections/graph | GET |
| startempirewire.network | /sewn/v1/member/network-score | GET |
| startempirewire.network | /sewn/v1/health | GET |
| startempirewire.network | /sewn/v1/webhooks/memberpress | POST |
| startempirewire.network | /sewn/v1/webhooks/event | POST |

## Interpretation and remaining work

**API observation:** parent index has 1,749 routes; network index has 217. Parent network/members returned 502 once; Connect health timed out once. These are failed observations requiring bounded diagnosis, not proof of permanent outage. Growth Partners returned expected anonymous denial. Public feed/opportunities/Draftees/health returned JSON 200; records were discarded and not published.

**Source:** Connect owns network proxy reads and SSO. Ring Leader owns tier-aware network/content access. BuddyBoss and MemberPress retain social and entitlement ownership. Handler-level authentication matters even when a registration permission callback is public.

**Deployment observation:** installed controllers were located for sew-the-wire, its Wirebot subnamespace, Draftees, provisioning, PWA and SSO. Source-only review shows queue/run/win tables and current-user filters. No database records were queried.

**Unverified:** per-route deployed callback/auth hash mapping; authenticated allowed/denied identity cases; message-board object visibility; upstream error translation; actual cache/retry behavior; notification receipt; commerce and provisioning. No mutating method was invoked.
