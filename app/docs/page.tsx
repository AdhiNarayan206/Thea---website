import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import styles from "./docs.module.css";

export const metadata: Metadata = {
  title: { absolute: "Thea — Handbook" },
  description:
    "The handbook for Thea, a tiny pixel companion for Windows. Installation, controls, troubleshooting, answers and release notes.",
  alternates: { canonical: "/docs" },
};

const pages = [
  {
    href: "/docs/installation",
    no: "01",
    title: "Installation",
    blurb:
      "Download the installer, get past SmartScreen, verify the checksum, and remove her cleanly later.",
    link: "Install Thea",
  },
  {
    href: "/docs/controls",
    no: "02",
    title: "Controls",
    blurb:
      "Every gesture, both menus, the dashboard and its settings. What each one actually does.",
    link: "Learn the gestures",
  },
  {
    href: "/docs/troubleshooting",
    no: "03",
    title: "Troubleshooting",
    blurb:
      "She is missing, she will not wake, Space does not work, the installer refuses to run. Start here.",
    link: "Fix a problem",
  },
  {
    href: "/docs/faq",
    no: "04",
    title: "Questions",
    blurb:
      "Ten short answers about cost, privacy, monitors, uninstalling and what happens at login.",
    link: "Read the answers",
  },
  {
    href: "/docs/changelog",
    no: "05",
    title: "Changelog",
    blurb:
      "What shipped in 0.1.0, the limits that are deliberate, and what is being considered next.",
    link: "See what shipped",
  },
];

export default function DocsIndex() {
  return (
    <>
      <header className={styles.pageHead}>
        <p className={styles.kicker}>Handbook · start here</p>
        <h1 className={styles.title}>
          Everything you need
          <br />
          <em>to keep her happy.</em>
        </h1>
        <p className={styles.summary}>
          Thea is small enough to explain in a page and odd enough to deserve
          one. This handbook covers installing her, the handful of gestures she
          understands, and what to do when a Windows setting gets in the way.
        </p>
        <ul className={styles.headMeta}>
          <li>Version {site.version}</li>
          <li>Windows 10 / 11</li>
          <li>5 chapters</li>
          <li>No account needed</li>
        </ul>
      </header>

      <div className="prose">
        <p>
          She is a <strong>40 × 40 pixel companion</strong> who lives on top of
          your desktop. She blinks, naps, follows your cursor and gets hungry.
          There is no window to keep open, no account to sign into, and no
          network connection to make. Quit her and she is gone until you launch
          her again.
        </p>

        <h2>The short version</h2>
        <ol>
          <li>
            Run the installer. It is per-user, so Windows never asks for an
            administrator password.
          </li>
          <li>
            If SmartScreen appears, choose <strong>More info</strong>, then{" "}
            <strong>Run anyway</strong>. This build is unsigned;{" "}
            <Link href="/docs/installation#smart-screen">the guide explains why</Link>.
          </li>
          <li>
            Leave <strong>Launch Thea</strong> ticked at the end. She appears in
            the lower-right of your primary screen, and her tray icon appears
            near the clock.
          </li>
        </ol>
      </div>

      <div className={`${styles.callout} ${styles.warn}`}>
        <span className={styles.calloutIcon} aria-hidden>
          !
        </span>
        <div className={styles.calloutBody}>
          <p className={styles.calloutTitle}>
            This is an unsigned indie build.
          </p>
          <p className={styles.calloutText}>
            Windows SmartScreen may warn you the first time you run{" "}
            <code>{site.download.filename}</code>. That is expected. You can
            verify the SHA-256 checksum before running it — the installation
            guide includes the exact string and a one-line PowerShell command.
          </p>
        </div>
      </div>

      <div className={styles.block}>
        <div className={styles.blockHead}>
          <span className={styles.blockNo}>01</span>
          <h2 className={styles.blockTitle}>The chapters</h2>
          <span className={styles.blockRule} />
        </div>

        <div className={styles.cards}>
          {pages.map((page) => (
            <Link key={page.href} href={page.href} className={styles.card}>
              <span className={styles.cardNo}>{page.no}</span>
              <span className={styles.cardTitle}>{page.title}</span>
              <span className={styles.cardBlurb}>{page.blurb}</span>
              <span className={styles.cardLink}>{page.link} →</span>
            </Link>
          ))}
        </div>
      </div>

      <div className={styles.block}>
        <div className={styles.blockHead}>
          <span className={styles.blockNo}>02</span>
          <h2 className={styles.blockTitle}>The build, at a glance</h2>
          <span className={styles.blockRule} />
        </div>

        <dl className={styles.facts}>
          <div className={styles.fact}>
            <dt className={styles.factTerm}>Version</dt>
            <dd className={styles.factValue}>
              {site.version} · {site.releaseLabel}
            </dd>
          </div>
          <div className={styles.fact}>
            <dt className={styles.factTerm}>Installer</dt>
            <dd className={styles.factValue}>
              {site.download.filename} · {site.download.sizeLabel}
            </dd>
          </div>
          <div className={styles.fact}>
            <dt className={styles.factTerm}>Platform</dt>
            <dd className={styles.factValue}>Windows 10 or 11, 64-bit</dd>
          </div>
          <div className={styles.fact}>
            <dt className={styles.factTerm}>Installed size</dt>
            <dd className={styles.factValue}>{site.download.installedLabel}</dd>
          </div>
          <div className={styles.fact}>
            <dt className={styles.factTerm}>Install location</dt>
            <dd className={styles.factValue}>%LOCALAPPDATA%\Programs\Thea</dd>
          </div>
          <div className={styles.fact}>
            <dt className={styles.factTerm}>Settings file</dt>
            <dd className={styles.factValue}>%APPDATA%\Thea\state.json</dd>
          </div>
          <div className={styles.fact}>
            <dt className={styles.factTerm}>Runs at login</dt>
            <dd className={styles.factValue}>No, by design</dd>
          </div>
          <div className={styles.fact}>
            <dt className={styles.factTerm}>Network requests</dt>
            <dd className={styles.factValue}>None</dd>
          </div>
        </dl>
      </div>

      <div className={styles.block}>
        <div className={styles.blockHead}>
          <span className={styles.blockNo}>03</span>
          <h2 className={styles.blockTitle}>Before you install</h2>
          <span className={styles.blockRule} />
        </div>

        <ul className={styles.checklist}>
          <li>Windows 10 (build 17763 or newer) or Windows 11, 64-bit.</li>
          <li>About {site.download.sizeLabel} free for the installer, and the same again while it runs.</li>
          <li>
            The app itself is not running. Her tray menu has a{" "}
            <strong>Quit</strong> item.
          </li>
          <li>
            A primary display with a normal work area. She uses one monitor for
            now.
          </li>
        </ul>
      </div>

      <div className={styles.block}>
        <div className={styles.blockHead}>
          <span className={styles.blockNo}>04</span>
          <h2 className={styles.blockTitle}>Where things live</h2>
          <span className={styles.blockRule} />
        </div>

        <div className={styles.split}>
          <div className={styles.panel}>
            <p className={styles.panelTitle}>The program</p>
            <p className={styles.panelBody}>
              <code>%LOCALAPPDATA%\Programs\Thea</code>
              <br />
              Everything the app needs, including her icon and the packaged
              Python runtime. Remove it through Windows, not by deleting the
              folder.
            </p>
          </div>
          <div className={styles.panel}>
            <p className={styles.panelTitle}>Her memory</p>
            <p className={styles.panelBody}>
              <code>%APPDATA%\Thea\state.json</code>
              <br />
              Fullness, joy, energy, meals and her birthday. Delete the folder
              and she forgets everything — including that you met.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.nextPrev}>
        <Link href="/" className={styles.nextLink}>
          <span className={styles.nextLabel}>← The site</span>
          <span className={styles.nextTitle}>Back to Thea</span>
        </Link>
        <Link
          href="/docs/installation"
          className={styles.nextLink}
          data-align="right"
        >
          <span className={styles.nextLabel}>Next · 01</span>
          <span className={styles.nextTitle}>Installation →</span>
        </Link>
      </div>
    </>
  );
}
