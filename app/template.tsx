export default function Template({ children }: { children: React.ReactNode }) {
  return <><div className="wipe" aria-hidden="true"><i /><i /></div>{children}</>;
}
