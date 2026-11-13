import type { Metadata } from "next";
import DocsNav from "@/components/docs/DocsNav";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";
import styles from "./docs.module.css";

export const metadata: Metadata = {
  title: {
    default: "Handbook",
    template: "%s — Thea Handbook",
  },
  description:
    "The Thea handbook: installation, controls, troubleshooting, frequently asked questions and release notes for the Windows desktop companion.",
};

export default function DocsLayout({ children }: LayoutProps<"/docs">) {
  return (
    <>
      <SiteHeader variant="docs" />

      <div className={styles.backdrop} aria-hidden />

      <main id="main" className={styles.main}>
        <div className={`container ${styles.shell}`}>
          <aside className={styles.sidebar}>
            <DocsNav />
          </aside>
          <div className={styles.content}>{children}</div>
        </div>
      </main>

      <Footer />
    </>
  );
}
