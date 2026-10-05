import { publicConfig } from "@/lib/paiflow";
import { StarterApp } from "@/components/starter-app";

export const dynamic = "force-dynamic";

export default function Page() {
  return <StarterApp config={publicConfig()} />;
}
