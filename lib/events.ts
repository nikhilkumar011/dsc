export type Session = {
  slug: string; kind: string; title: string; host: string; role: string; date: string; time: string; where: string;
  img: string; entry: string; text: string; more: string; past: boolean;
};

export const sessions: Session[] = [
  { slug: "llms-in-production", kind: "Tech talk", title: "LLMs in Production: Architecture & Telemetry", host: "Rohan Varma", role: "Staff Platform Engineer & Open Source Contributor", date: "Wednesday, Dec 02, 2026", time: "5:30 PM to 7:30 PM IST", where: "Seminar Hall 2, virtual stream available", img: "/event-talk.jpg", entry: "Open registration", past: false, text: "A deep technical breakdown of high-throughput model serving, prompt caching strategies, semantic vector routing, and minimizing GPU memory latency.", more: "Explore real production architectural telemetry from systems serving millions of daily inferences. Understand latency bottlenecks, quantized inference, and evaluation guardrails." },
  { slug: "datahacks-26", kind: "Hackathon", title: "DataHacks '26: 36-Hour Hackathon", host: "DSC Executive Board & Industry Judges", role: "Central India flagship collegiate hackathon", date: "Nov 14 to 16, 2026", time: "9:00 AM Friday to 9:00 PM Sunday", where: "Innovation Center & Central Auditorium", img: "/event-hackathon.jpg", entry: "₹2,50,000+ prize pool", past: true, text: "Over 400 collegiate engineers on campus for 36 hours of relentless building across Generative AI, Distributed Data Pipelines, and Civic Intelligence.", more: "DataHacks '26 features direct mentorship from top engineering teams, 1Gbps fiber connectivity, midnight catering, compute credits, and a dedicated hardware lab." },
  { slug: "pytorch-bootcamp", kind: "Bootcamp", title: "PyTorch Deep Learning Sprint", host: "Dr. Alok Ranjan", role: "Deep Learning Specialist & Associate Professor", date: "Saturday, Oct 24, 2026", time: "10:00 AM to 4:00 PM IST", where: "Lab Complex 3, AB-1 High-Perf Lab", img: "/event-workshop.jpg", entry: "Free student pass", past: true, text: "A hands-on, hardware-accelerated deep dive into neural tensor architectures, gradient descent graph compilation, and fine-tuning computer vision backbones.", more: "This 6-hour intensive bootcamp guides developers through tensor manipulation, building custom autoencoders, and deploying models to mobile and edge backends using TensorRT and ONNX runtime." },
  { slug: "datahacks-25", kind: "Hackathon", title: "DataHacks '25", host: "DSC Core Team & Faculty Mentors", role: "National hackathon", date: "Oct 20, 2025", time: "36 continuous hours", where: "Innovation Center, VIT Bhopal", img: "/event-hackathon.jpg", entry: "Completed", past: true, text: "240 collegiate builders, 62 functional machine learning prototypes, and ₹1,50,000 distributed in bounties across 4 competitive tracks.", more: "DataHacks '25 established our benchmark for collegiate AI hackathons, featuring live telemetry dashboards, automated test pipelines, and guest mentors from top tech companies." },
  { slug: "python-for-data", kind: "Workshop", title: "Python for Data & Analytics Sprint", host: "DSC Technical Leads", role: "Core curriculum workshop", date: "Aug 08, 2025", time: "2:00 PM to 6:00 PM IST", where: "Lab Complex 3", img: "/event-workshop.jpg", entry: "Completed", past: true, text: "Comprehensive training covering multi-indexed Pandas dataframes, vectorized NumPy mathematics, and publication-ready statistical visualizations.", more: "Over 180 freshmen and sophomore students completed the hands-on sprint and earned verifiable certificate badges logged to their student dossiers." },
  { slug: "onboarding-2025", kind: "Community", title: "DSC Onboarding & Keynote Reveal", host: "Club Presidents & Domain Leads", role: "Community welcome sprint", date: "Aug 02, 2025", time: "6:00 PM to 8:30 PM IST", where: "Open Air Theatre (OAT)", img: "/event-team.jpg", entry: "Completed", past: true, text: "Welcoming our 2025 student cohort with lightning architecture demos, project showcase unveilings, and open networking sessions.", more: "An electric evening bringing together 600+ students across campus to discover open research domains, recruitment tracks, and technical bootcamps." },
];

export const rounds = [
  ["Real or generated", "Identify the AI-generated image before it fools you.", "Observation"],
  ["Guess the song", "A few notes, no lyrics. Your ear against its index.", "Memory"],
  ["Drawing battle", "You draw by hand, it answers in pixels.", "Creativity"],
  ["Prompt engineering", "Find the words that make the machine do what you mean.", "Problem solving"],
  ["Rapid fire", "Answer faster than you can doubt yourself.", "Logical thinking"],
];

export const desk = [
  { slug: "ai-vs-human", title: "Humans vs AI", tag: "Competition", when: "To be announced", where: "To be announced", fee: "To be announced", open: true },
  { slug: "llms-in-production", title: "Talks: LLMs in Production", tag: "Tech talk", when: "Dec 02, 2026", where: "Seminar Hall 2, VIT Bhopal", fee: "Free", open: true },
  { slug: "datahacks-26", title: "DataHacks '26", tag: "Hackathon", when: "Nov 14 to 16, 2026", where: "Innovation Center & Central Auditorium", fee: "₹299", open: false },
  { slug: "pytorch-bootcamp", title: "PyTorch Bootcamp", tag: "Bootcamp", when: "Oct 24, 2026", where: "AB-1, VIT Bhopal", fee: "Free", open: false },
];

export const gallery = [
  ["/event-hackathon.jpg", "DataHacks '25 Main Stage", "Hackathon"],
  ["/event-workshop.jpg", "PyTorch Deep Learning Lab", "Bootcamp"],
  ["/event-talk.jpg", "AI Platforms Keynote", "Tech talk"],
  ["/event-team.jpg", "Core Developer Sprint", "Team"],
  ["/event-workshop.jpg", "Neural Networks Setup", "Lab session"],
  ["/event-talk.jpg", "Industry Telemetry Meetup", "Community"],
  ["/event-hackathon.jpg", "Campus Datathon Sprint", "Hackathon"],
  ["/event-team.jpg", "Onboarding Keynote Celebration", "Annual reveal"],
];

type Q = { label: string; long?: boolean; required?: boolean };
export const openTeams: { name: string; short: string; text: string; tools: string; qs: Q[] }[] = [
  { name: "Technical", short: "Full-stack web applications, microservices, cloud infrastructure, and developer tools.", text: "The Technical domain engineers the club's core digital platforms, internal tools, and open-source packages. You will collaborate on modern web systems with React, TypeScript, Rust/Python services, and automated CI/CD.", tools: "React/Next.js, TypeScript, Node.js / Python, Git / GitHub Actions, Cloud & Docker", qs: [{ label: "GitHub profile or code repository URL", required: true }, { label: "Describe your best technical project, tech stack used, and key challenges solved", long: true, required: true }] },
  { name: "AI & Data Science", short: "Machine learning architectures, computer vision, NLP, statistical modeling, and data pipelines.", text: "Build deep learning workflows, research novel architectures, analyze campus datasets, and organize datathons and ML bootcamps.", tools: "PyTorch / TensorFlow, Pandas & NumPy, Computer Vision / NLP, scikit-learn, Model Deployment", qs: [{ label: "Kaggle, Hugging Face, or research link (if any)" }, { label: "What machine learning libraries or models have you trained or deployed?", long: true, required: true }] },
  { name: "Design & Media", short: "Visual identity, UI/UX interaction systems, event branding, 3D motion, and typography.", text: "Design user experiences, social collateral, posters, digital badges, and interactive web elements for DSC events and hackathons.", tools: "Figma, Adobe Illustrator / Photoshop, UI/UX Prototyping, Motion Graphics, 3D / Blender", qs: [{ label: "Figma, Behance, or Dribbble portfolio link", required: true }, { label: "Which design software do you feel most fluent in, and what inspires your design style?", long: true, required: true }] },
  { name: "Content & Editorial", short: "Technical writing, research articles, documentation, event newsletters, and thought leadership.", text: "Craft compelling narratives around cutting-edge data science topics, write post-event reports, manage social announcements, and curate our tech blog.", tools: "Technical Writing, Copywriting, Research Summaries, Documentation, SEO", qs: [{ label: "Link to a published blog, Medium article, or writing sample" }, { label: "Pitch a brief 3-sentence blog post topic you would write for DSC", long: true, required: true }] },
  { name: "Management & PR", short: "Event logistics, sponsor outreach, stage operations, public relations, and cross-team coordination.", text: "Drive campus outreach, secure corporate sponsorships, manage speaker logistics, and ensure events run with precision.", tools: "Event Operations, Corporate Sponsorship, Public Speaking, Negotiation, Crisis Resolution", qs: [{ label: "Share prior experience organizing club events, fests, or school teams", long: true, required: true }, { label: "How would you handle a keynote speaker cancelling 30 minutes before an event?", long: true, required: true }] },
];

export const branches = ["Computer Science & Engineering (Core)", "CSE with AI & Machine Learning", "CSE with Data Science", "CSE with Cyber Security & Digital Forensics", "CSE with Cloud Computing & Automation", "CSE with Gaming Technology", "Electronics & Communication Engineering", "Mechanical Engineering", "Aerospace Engineering", "Bioengineering", "Integrated M.Tech (CSE / Software)", "Other / Multidisciplinary"];
export const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
export const schools = ["SCSE (Computer Science & Engineering)", "SASL (Applied Sciences & Languages)", "SEEE (Electrical & Electronics)", "SMEC (Mechanical & Civil)", "VBS (Business School)"];
