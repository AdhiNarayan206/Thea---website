"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import styles from "./SiteHeader.module.css";

type Props = {
  variant?: "home" | "docs";
};

export default function SiteHeader({ variant = "home" }: Props) {
  const pathname = usePathname();
  const [active, setActive] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const frame = useRef(0);

  // Close mobile drawer on route change or when resized to desktop
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 840) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const update = () => {
      frame.current = 0;

      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
      setScrolled(window.scrollY > 12);

      if (variant !== "home" || pathname !== "/") return;

      const sections = Array.from(
        document.querySelectorAll<HTMLElement>("[data-chapter]"),
      );
      if (!sections.length) return;

      const mark = 132;
      let current = sections[0].id;
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= mark) current = section.id;
      }
      if (window.scrollY + window.innerHeight >= doc.scrollHeight - 8) {
        current = sections[sections.length - 1].id;
      }
      setActive(current);
    };

    const onScroll = () => {
      if (!frame.current) frame.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [pathname, variant]);

  return (
    <header className={styles.header} data-scrolled={scrolled || undefined}>
      <div className={styles.bar}>
        <Link href="/" className={styles.brand} aria-label="Thea — home">
          <Image
            src="/art/thea-320.png"
            alt=""
            width={30}
            height={30}
            unoptimized
            className={styles.brandIcon}
            priority
          />
          <span className={styles.wordmark}>Thea</span>
          <span className={styles.tagline}>Your Digital Companion</span>
        </Link>

        <nav
          className={styles.nav}
          aria-label={variant === "home" ? "Chapters" : "Handbook"}
        >
          {variant === "home"
            ? site.chapters.map((chapter) => {
                const isActive = active === chapter.id;
                return (
                  <a
                    key={chapter.id}
                    href={`#${chapter.id}`}
                    className={styles.navItem}
                    data-active={isActive || undefined}
                    aria-current={isActive ? "true" : undefined}
                  >
                    <span className={styles.no}>{chapter.index}</span>
                    {chapter.label}
                  </a>
                );
              })
            : site.docs.map((doc) => {
                const isActive = pathname === doc.href;
                return (
                  <Link
                    key={doc.href}
                    href={doc.href}
                    className={styles.navItem}
                    data-active={isActive || undefined}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {doc.label}
                  </Link>
                );
              })}
        </nav>

        <div className={styles.right}>
          <Link
            href={variant === "home" ? "/docs" : "/"}
            className={styles.quiet}
          >
            {variant === "home" ? "Handbook" : "Home"}
          </Link>
          <a
            href={site.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.starBtn}
            aria-label="Star Thea on GitHub"
          >
            <span className={styles.starIcon} aria-hidden>★</span>
            <span>Star</span>
          </a>
          <a
            href={site.download.href}
            download
            className={styles.download}
            aria-label={`Download Thea ${site.version} for Windows`}
          >
            Download
            <span>v{site.version}</span>
          </a>

          <button
            type="button"
            className={styles.menuToggle}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span className={styles.burgerIcon} data-open={menuOpen || undefined}>
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={styles.mobileDrawer}
        data-open={menuOpen || undefined}
        aria-hidden={!menuOpen}
      >
        <div className={styles.drawerInner}>
          <p className={styles.drawerSectionTitle}>
            {variant === "home" ? "Chapters" : "Handbook"}
          </p>

          <nav className={styles.drawerNav}>
            {variant === "home"
              ? site.chapters.map((chapter) => (
                  <a
                    key={chapter.id}
                    href={`#${chapter.id}`}
                    className={styles.drawerItem}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className={styles.drawerNo}>{chapter.index}</span>
                    <span>{chapter.label}</span>
                  </a>
                ))
              : site.docs.map((doc) => (
                  <Link
                    key={doc.href}
                    href={doc.href}
                    className={styles.drawerItem}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span>{doc.label}</span>
                  </Link>
                ))}
          </nav>

          <div className={styles.drawerDivider} />

          <div className={styles.drawerLinks}>
            <Link
              href={variant === "home" ? "/docs" : "/"}
              className={styles.drawerSecondaryLink}
              onClick={() => setMenuOpen(false)}
            >
              {variant === "home" ? "📖 Open Handbook" : "← Back to Home"}
            </Link>
            <a
              href={site.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.drawerSecondaryLink}
              onClick={() => setMenuOpen(false)}
            >
              ★ Star on GitHub ↗
            </a>
            <a
              href={site.download.href}
              download
              className={styles.drawerDownload}
              onClick={() => setMenuOpen(false)}
            >
              Download Thea v{site.version} ({site.download.sizeLabel})
            </a>
          </div>
        </div>
      </div>

      <div
        className={styles.progress}
        style={{ transform: `scaleX(${progress})` }}
        aria-hidden
      />
    </header>
  );
}
