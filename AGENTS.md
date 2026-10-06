Read the context pack for the participant’s event first: `llms.md` for JRU or `llms-web3-iloilo.md` for Web3 Iloilo. Each contains the hackathon API and product guide. Use only that event’s preparation and submission rules; do not combine dates, deadlines or onboarding instructions across events. If the event is unspecified, ask which event before giving event-specific instructions. This is starter code, not a supported package — edit freely.

- Call Paiflow only through server-only `lib/paiflow.ts`; keep the deployment token in server environment variables. Never use `NEXT_PUBLIC_` for configuration or return tokens to the browser.
- Never handle a customer's secret key. Freighter signs XDR in the browser, using the prepared network passphrase. Refuse mainnet.
- Use `lib/amount.ts` for money. Amounts are decimal/stroops strings with bigint arithmetic, never floating-point numbers.
- Keep signed envelopes for PENDING and uncertain submission errors; retry that same envelope, never duplicate a payment.
- The payout proxy is unauthenticated. Add your app's authorisation before exposing it publicly. Add authorisation before exposing `releaseEarly`; this starter has no release route.
- Run `pnpm typecheck`, `pnpm build && pnpm test` after edits. Check `.next/static` for credential leaks.
