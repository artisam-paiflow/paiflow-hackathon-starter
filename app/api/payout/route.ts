// anyone who can reach this server can choose a payout recipient; add your own check before you demo publicly.
import { preparePayout, submitPayout, requireIntegration } from "@/lib/paiflow";
import { handle, paymentBody, InputError } from "@/lib/http";
export async function POST(request: Request) {
  return handle(async () => {
    if (requireIntegration() === "demo")
      throw new InputError("Payouts require your team's deployment/token.");
    const body = await paymentBody(request, true);
    return "signedXdr" in body ? submitPayout(body) : preparePayout(body);
  });
}
