import PageHead from "@/components/PageHead";
import { Suspense } from "react";
import { RegisterDesk } from "@/components/Forms";

export const metadata = { title: "Register" };

export default function Page() {
  return <><PageHead word="Register">Pick your event, tell us who you are, and take your seat.</PageHead><div className="wrap page"><Suspense><RegisterDesk /></Suspense></div></>;
}
