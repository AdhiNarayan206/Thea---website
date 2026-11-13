"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import styles from "./DocsNav.module.css";

const PAGES = [
  {
    href: "/docs",
    no: "00",
    label: "Handbook",
    blurb: "Start here",
  },
  {
    href: "/docs/installation",
    no: "01",
    label: "Installation",
    blurb: "Install, verify, remove",
  },
  {
    href: "/docs/controls",
    no: "02",
    label: "Controls",
    blurb: "Gestures and menus",
  },
  {
    href: "/docs/troubleshooting",
    no: "03",
    label: "Troubleshooting",
    blurb: "When something is off",
  },
  {
    href: "/docs/faq",
    no: "04",
    label: "FAQ",
    blurb: "Short answers",
  },
  {
    href: "/docs/changelog",
    no: "05",
    label: "Changelog",
    blurb: "What shipped, what is next",
  },
] as const;

export default function DocsNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav} aria-label="Handbook contents">
      <p className={styles.heading}>Contents</p>

      <ol className={styles.list}>
        {PAGES.map((page) => {
          const active = pathname === page.href;
          return (
            <li key={page.href}>
              <Link
                href={page.href}
                className={styles.item}
                data-active={active || undefined}
                aria-current={active ? "page" : undefined}
              >
                <span className={styles.no}>{page.no}</span>
                <span className={styles.text}>
                  <span className={styles.label}>{page.label}</span>
                  <span className={styles.blurb}>{page.blurb}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      <div className={styles.download}>
        <p className={styles.dlMeta}>
          Windows 10 / 11 · {site.version}
        </p>
        <a href={site.download.href} download className={styles.dlLink}>
          <span>Download installer</span>
          <span className={styles.dlSize}>{site.download.sizeLabel}</span>
        </a>
        <p className={styles.dlNote}>
          Per-user install. No administrator rights. Unsigned build.
        </p>
      </div>

      <p className={styles.back}>
        <Link href="/">← Back to the site</Link>
      </p>
    </nav>
  );
}
