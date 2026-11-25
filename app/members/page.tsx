import PageHead from "@/components/PageHead";
import Link from "next/link";
import Roster from "@/components/Roster";

export const metadata = { title: "Team" };

export default function Page() {
  return <><PageHead word="Team">The presidents, domain leads, machine learning researchers, and developers behind DSC VIT Bhopal.</PageHead><div className="wrap page"><Roster /><div className="closed"><h2>Want to join our roster?</h2><p className="lede">Apply across technical development, AI research, event ops, and creative design.</p><Link className="btn" href="/join">Apply for the core team</Link></div></div></>;
}
