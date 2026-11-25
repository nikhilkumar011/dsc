import PageHead from "@/components/PageHead";
import { Gallery } from "@/components/EventPages";

export const metadata = { title: "Gallery" };

export default function Page() {
  return <><PageHead word="Gallery">From 36-hour hackathons, hardware bootcamps, and technical keynotes across campus.</PageHead><div className="wrap page"><Gallery /></div></>;
}
