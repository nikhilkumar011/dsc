import type { Metadata } from "next";
import { Anybody, Caveat_Brush, Doto, Instrument_Sans } from "next/font/google";
import "./globals.css";

const display = Anybody({ subsets: ["latin"], axes: ["wdth"], variable: "--f-display" });
const body = Instrument_Sans({ subsets: ["latin"], variable: "--f-body" });
const hand = Caveat_Brush({ subsets: ["latin"], weight: "400", variable: "--f-hand" });
const dots = Doto({ subsets: ["latin"], weight: "900", variable: "--f-dots" });

export const metadata: Metadata = {
  title: "Can humans beat AI? | Data Science Club, VIT Bhopal",
  description: "AI versus Human: a fun, interactive tech competition from the Data Science Club of VIT Bhopal.",
};

const theme = `var t;try{t=localStorage.getItem("theme")}catch(e){}document.documentElement.dataset.theme=t||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light")`;

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${body.variable} ${hand.variable} ${dots.variable}`}>
      <body>
        <script dangerouslySetInnerHTML={{ __html: theme }} />
        {children}
      </body>
    </html>
  );
}
