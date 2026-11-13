import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.top}>
          <div className={styles.brandCol}>
            <Link href="/" className={styles.brand} aria-label="Thea — home">
              <Image
                src="/art/thea-320.png"
                alt=""
                width={34}
                height={34}
                unoptimized
                className={styles.icon}
              />
              <span className={styles.wordmark}>Thea</span>
            </Link>
            <p className={styles.pitch}>
              A tiny pixel companion for Windows. Free, offline, and entirely
              yours.
            </p>
            <a href={site.download.href} download className={styles.download}>
              Download for Windows
              <span className={styles.size}>{site.download.sizeLabel}</span>
            </a>
            <p className={styles.signature}>
              Windows 10 / 11 · 64-bit · v{site.version}
            </p>
          </div>

          <nav className={styles.col} aria-label="Chapters">
            <h2 className={styles.colTitle}>The site</h2>
            <a href="/#meet">Meet Thea</a>
            <a href="/#faces">Faces</a>
            <a href="/#behaviour">Behaviour</a>
            <a href="/#controls">Controls</a>
            <a href="/#privacy">Privacy</a>
            <a href="/#download">Download</a>
            <a
              href={site.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.extLink}
            >
              GitHub repository <span aria-hidden>↗</span>
            </a>
          </nav>

          <nav className={styles.col} aria-label="Handbook">
            <h2 className={styles.colTitle}>Handbook</h2>
            {site.docs.map((doc) => (
              <Link key={doc.href} href={doc.href}>
                {doc.label}
              </Link>
            ))}
          </nav>

          <div className={styles.col} aria-label="Build details">
            <h2 className={styles.colTitle}>This build</h2>
            <dl className={styles.facts}>
              <dt>Version</dt>
              <dd>{site.version}</dd>
              <dt>Released</dt>
              <dd>{site.releaseLabel}</dd>
              <dt>Installer</dt>
              <dd>{site.download.sizeLabel}</dd>
              <dt>SHA-256</dt>
              <dd className={styles.hash}>{site.download.sha256.slice(0, 16)}…</dd>
              <dt>Source</dt>
              <dd>
                <a
                  href={site.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.sourceLink}
                >
                  GitHub ↗
                </a>
              </dd>
            </dl>
            <p className={styles.unsigned}>
              Unsigned indie build. Windows may show a SmartScreen prompt.
            </p>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© 2026 Thea — Your Digital Companion</p>
          <p className={styles.legal}>
            Made for Windows. Not a service, not a subscription. Settings stay
            in <code>%APPDATA%\Thea</code>.
          </p>
          <a href="#main" className={styles.topLink}>
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
