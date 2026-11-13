import type { Metadata } from "next";
import Link from "next/link";
import Faq, { FAQ_ITEMS } from "@/components/Faq";
import { site } from "@/lib/site";
import styles from "../docs.module.css";

export const metadata: Metadata = {
  title: { absolute: "Questions — Thea" },
  description:
    "Frequently asked questions about Thea: price, privacy, Windows support, SmartScreen, monitors, uninstalling, scaling and running two copies.",
  alternates: { canonical: "/docs/faq" },
};

export default function FaqPage() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqLd).replace(/</g, "\\u003c"),
        }}
      />

      <header className={styles.pageHead}>
        <p className={styles.kicker}>Handbook · 04</p>
        <h1 className={styles.title}>
          The short <em>answers.</em>
        </h1>
        <p className={styles.summary}>
          The things people ask before letting a small creature onto their
          desktop. If your question is about something going wrong rather than
          how she works, the troubleshooting chapter is more useful.
        </p>
        <ul className={styles.headMeta}>
          <li>10 questions</li>
          <li>No sign-up</li>
          <li>No telemetry</li>
          <li>Windows only</li>
        </ul>
      </header>

      <Faq items={FAQ_ITEMS} />

      <div className={styles.block}>
        <div className={styles.blockHead}>
          <span className={styles.blockNo}>↳</span>
          <h2 className={styles.blockTitle}>Still curious?</h2>
          <span className={styles.blockRule} />
        </div>

        <div className={styles.split}>
          <Link href="/docs/installation" className={styles.panel}>
            <p className={styles.panelTitle}>Installation guide →</p>
            <p className={styles.panelBody}>
              Every step from download to uninstall, including the checksum
              command and the exact SmartScreen clicks.
            </p>
          </Link>
          <Link href="/docs/troubleshooting" className={styles.panel}>
            <p className={styles.panelTitle}>Troubleshooting →</p>
            <p className={styles.panelBody}>
              A missing tray icon, a Space key that does nothing, an installer
              that will not finish. Symptom by symptom.
            </p>
          </Link>
        </div>

        <div className={`${styles.callout} ${styles.warn}`}>
          <span className={styles.calloutIcon} aria-hidden>
            !
          </span>
          <div className={styles.calloutBody}>
            <p className={styles.calloutTitle}>
              One warning, one more time
            </p>
            <p className={styles.calloutText}>
              {site.fullName} is an unsigned 0.1.0 build. Windows may show a
              SmartScreen panel the first time you run the installer. Choose{" "}
              <strong>More info → Run anyway</strong>, or verify the SHA-256
              first. The checksum is printed on the{" "}
              <Link href="/#download">download chapter</Link> and in the{" "}
              <Link href="/docs/installation#verify">installation guide</Link>.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.nextPrev}>
        <Link
          href="/docs/troubleshooting"
          className={styles.nextLink}
        >
          <span className={styles.nextLabel}>← Previous · 03</span>
          <span className={styles.nextTitle}>Troubleshooting</span>
        </Link>
        <Link href="/docs/changelog" className={styles.nextLink} data-align="right">
          <span className={styles.nextLabel}>Next · 05</span>
          <span className={styles.nextTitle}>Changelog →</span>
        </Link>
      </div>
    </>
  );
}
