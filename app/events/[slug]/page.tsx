import Link from "next/link";
import { notFound } from "next/navigation";
import { sessions } from "@/lib/events";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => sessions.map(({ slug }) => ({ slug }));

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return { title: sessions.find((s) => s.slug === slug)?.title };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const e = sessions.find((s) => s.slug === slug);
  if (!e) notFound();
  return (
    <article className="wrap page">
      <div className="detail-top">
        <div><p className="meta">{e.kind}</p><h1>{e.title}</h1></div>
        <p className="lede">{e.text}</p>
      </div>
      <img className="detail-img" src={e.img} alt="" width="1024" height="768" />
      <div className="detail-grid">
        <div>
          <h2>About the session</h2>
          <p className="lede">{e.more}</p>
          <div className="btn-row">
            {!e.past && <Link className="btn" href={`/register?event=${e.slug}`}>Register</Link>}
            <Link className="btn alt" href="/events">All events</Link>
          </div>
        </div>
        <dl className="specs">
          <div><dt>With</dt><dd>{e.host}<br /><span className="meta">{e.role}</span></dd></div>
          <div><dt>Date</dt><dd>{e.date}</dd></div>
          <div><dt>Time</dt><dd>{e.time}</dd></div>
          <div><dt>Venue</dt><dd>{e.where}</dd></div>
          <div><dt>Entry</dt><dd>{e.past ? "Closed" : e.entry}</dd></div>
        </dl>
      </div>
    </article>
  );
}
