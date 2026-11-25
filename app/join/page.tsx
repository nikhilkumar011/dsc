import PageHead from "@/components/PageHead";
import { JoinForm } from "@/components/Forms";

export const metadata = { title: "Join" };

export default function Page() {
  return <><PageHead word="Join">Build machine learning pipelines, engineer distributed systems, design visual identities, and run the university&apos;s flagship hackathons. Pick a team to start.</PageHead><div className="wrap page"><JoinForm /></div></>;
}
