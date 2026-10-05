# Paiflow hackathon starter

Paiflow is the money logic behind your app. This repo is the plumbing: replace the screens in `components/starter-app.tsx` with your idea and keep the server page wrapper in `app/page.tsx` and the guarded server-only client in `lib/paiflow.ts`. One deployment serves one business or group. Testnet only.

## October 12–13 preparation

Choose your idea now. After onboarding on **October 12, 2026, at 9:00 PM**, build your app's screens and features that don't involve payments. Keep payment features and the live feed disabled until October 14. Flow deployment, Paiflow API integration and live payment testing begin on October 14, when team account credentials are handed out.

1. Install **Node 22** and **pnpm 10** (`corepack enable`), then run `pnpm install` and `pnpm dev`. Open http://localhost:3000. With no configuration, the starter defaults to preparation mode.
2. Prepare dedicated testnet wallets for your customer and payout recipients. Install [Freighter](https://www.freighter.app/) and select **Testnet**. Fund new accounts with testnet XLM via [Friendbot](https://laboratory.stellar.org/#account-creator?network=test). If using USDC, add the exact trustline described below and obtain testnet USDC separately.
3. Build your non-payment screens and features in `components/starter-app.tsx`. Keep preparation mode enabled until October 14.

The server-only `PAIFLOW_MODE` setting controls integration:

| Mode                           | Behaviour                                                                                                               |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `prepare` (default when unset) | App screens work; wallet actions, payments and event polling are disabled. No Paiflow API calls or demo-token creation. |
| `demo`                         | Explicitly enables the shared XLM demo for October 14 testing.                                                          |
| `team`                         | Uses your team's deployment and API token. Missing or invalid configuration disables integration with a clear error.    |

To set preparation mode explicitly, copy `.env.example` to `.env.local` and keep `PAIFLOW_MODE=prepare`. Existing tokens do not enable payments while preparation mode is selected. An empty token does not select demo mode. Invalid mode values disable integration. Restart the server after changing configuration.

Keep the mode checks in both the client screens and server-only module when extending the starter. Direct calls to `/api/pay`, `/api/payout` and `/api/events` return HTTP 403 `PREPARATION_MODE` during preparation. A pending payment submitted before changing modes may still execute on-chain; changing mode does not cancel it. Confirm its status before switching.

## October 14 payment setup

1. Receive your team's Paiflow account credentials. Check that the customer and recipient wallets have testnet XLM, the exact USDC trustline if needed, and the required payment balances.
2. Deploy your team's flow and wait for **CONFIRMED**. Create its API token under **API access**.
3. Copy `.env.example` to `.env.local`. Set server-only `PAIFLOW_MODE=team`, `PAIFLOW_BASE_URL` to the supplied platform origin, `PAIFLOW_API_TOKEN` to your deployment's token and `PAIFLOW_DEPLOYMENT_ID` to its confirmed deployment UUID. Fill any required Dev values on the deployment page.
4. Run `pnpm dev` and open http://localhost:3000. Restart the server after changing configuration. Amounts use your flow's input asset.
5. Connect the customer wallet in Freighter and make a small test payment. Confirm **SUCCESS**, check the recipients' payout and save its transaction hash. To simulate another customer, switch accounts in Freighter and click **Refresh wallet** (window focus also refreshes).

### Optional shared demo on October 14

Set server-only `PAIFLOW_MODE=demo` and `PAIFLOW_BASE_URL` to the supplied platform origin, then restart. The starter then uses a shared **XLM** demo. Use a throwaway Friendbot-funded testnet wallet for a small payment, then switch to your team's deployment and token. Shared-demo payments do not qualify for prizes.

Demo mode is for initial payment testing on October 14; switch to your team's token for your project. Its token is cached in server memory until two minutes before its one-hour expiry (concurrent requests share one mint). Restarting or running multiple server instances consumes more tokens. Demo minting allows only **3 tokens/hour per IP**, including shared venue Wi-Fi.

**Public demo warning:** the deployment is shared, others can see your depositing address, and deposited testnet XLM goes to a Paiflow-owned account, not back to you. Use a throwaway Friendbot wallet.

Prepare your own dedicated testnet wallets beforehand. Wallet and funding support will be available on site on October 14, with ready-to-use wallets as a last resort. Organiser-provided fallback wallets are testnet-only; organisers hold copies of their keys. Never send real (mainnet) funds to them or import them into a wallet you use for real money. Anyone with the key can take what's in them.

**USDC trustlines:** a fresh Stellar wallet usually cannot hold USDC until it adds a trustline to that exact asset code and issuer. A missing recipient trustline can show `TrustlineMissingError` / `The payout recipient has no trustline for {asset}. The recipient must add a trustline for {asset} before this flow can pay them.` in simulation, surfaced as 422 `VALIDATION`; the whole payment reverts. A deploy warning does not block deployment or require acknowledgement, so successful deployment does not prove recipients are ready. In the recipient's testnet wallet, use Add asset / Add trustline for code `USDC`, issuer `GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5`, and have that wallet sign its change-trust transaction. Fund a new account with testnet XLM via Friendbot first so it exists and has reserves/fees. A trustline to another issuer's USDC will not work; native XLM needs no trustline. Check the exact trustline and required balances in every wallet, including any organiser-provided fallback wallet. Adding a trustline enables receipt, not a USDC balance: obtain testnet USDC separately, then prepare the failed payment again. Payouts checks recipient readiness before changing it; an inconclusive check also refuses mutation.

## Extending the app

- Read [llms.md](llms.md), the [staging OpenAPI spec](https://beta.app.paiflow.xyz/api/v1/openapi.json), and the [idea examples](llms.md#8-worked-examples).
- All Paiflow calls live in `lib/paiflow.ts`; no token is sent to the browser. `lib/amount.ts` converts decimal strings to integer stroop strings with bigint (7 decimals). Freighter signs; the app never holds customer keys.
- Execute preparations last **180 seconds**; payouts last **60 seconds**. SUCCESS is final, FAILED can be HTTP 200, and PENDING or transport/502 errors need **Check again** with the same signed envelope. Keep the tab open while uncertain; do not prepare a duplicate payment. API errors retain code/message, request id and Retry-After when supplied.
- In demo/team modes, the feed polls every five seconds while visible, drains cursor pages and deduplicates by eventId. It can lag; lack of an event alone does not mean payment failed.
- Per-payment recipients require a Dev-mode Pay with **Fill value via API** and your team's token. Serialise payouts; do not mix execute/direct/QR deposits or owner mutations while a payout is in progress. Wait for Retry-After on 409/429. Staging payouts/release-early are scheduled for the 6 Oct hackathon promotion; use a local Pinkraft `hackathon` before then (`PAIFLOW_BASE_URL=http://localhost:3000`, run this starter on :3001).
- **anyone who can reach this server can choose a payout recipient; add your own check before you demo publicly.** Auth is out of scope for this starter.
- `releaseEarly` is available in the server client for your authorised server handler. It authorises a relayer release without customer signing, so you must add your app's own authorisation. There is deliberately no release route or button here. Teams cannot obtain DevApiTokens; configure other dev values in Paiflow's Dev values panel.

## Checks

`pnpm typecheck`, `pnpm test`, `pnpm build`. Dependencies are limited to Next.js/React, Freighter and server-only, with TypeScript/types and Vitest for development. No database, Stellar SDK, UI library or state library. Run `pnpm audit` and scan `.next/static` for `pfk_`, `PAIFLOW_API_TOKEN` and your test token before publishing.
