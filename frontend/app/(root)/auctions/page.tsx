import { redirect } from "next/navigation";

export default function AuctionsRedirectPage() {
  redirect("/auctions/live");
}
