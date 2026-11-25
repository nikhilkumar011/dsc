import Link from "next/link";
import PageHead from "@/components/PageHead";

export default function NotFound() {
  return <div className="lost"><PageHead word="404">Neither human nor machine could find this page.</PageHead><div className="wrap"><Link className="btn" href="/">Back home</Link></div></div>;
}
