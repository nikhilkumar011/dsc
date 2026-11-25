import Motion from "@/components/Motion";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Rounds from "@/components/Rounds";
import { About, Contact, Domains, Events, Footer, Team, Venue } from "@/components/Club";

export default function Page() {
  return (
    <Motion>
      <a className="skip" href="#main">Skip to content</a>
      <Nav />
      <main id="main">
        <Hero /><Rounds /><About /><Domains /><Events /><Venue /><Team /><Contact />
      </main>
      <Footer />
    </Motion>
  );
}
