import Link from "next/link";

export function LegalUpdated({ date }: { date: string }) {
  return <p className="legal-updated">Last updated: {date}</p>;
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="legal-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export function LegalSubsection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="legal-subsection">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

export function LegalLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="legal-link">
      {children}
    </Link>
  );
}

export function LegalList({ items }: { items: string[] }) {
  return (
    <ul className="legal-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}