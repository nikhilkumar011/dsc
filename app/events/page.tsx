import PageHead from "@/components/PageHead";
import Link from "next/link";
import { Schedule } from "@/components/Club";
import { EventList } from "@/components/EventPages";

export const metadata = { title: "Events" };

export default function Page() {
  return <><PageHead word="Events">From 36-hour hackathons to deep learning bootcamps. And one fight with a machine.</PageHead><div className="wrap page"><Link className="feature" href="/events/ai-vs-human"><span>Human</span><span>AI</span><div><strong>Can humans beat AI?</strong><span className="btn">See the event</span></div></Link><EventList /><Schedule link={false} /></div></>;
}
