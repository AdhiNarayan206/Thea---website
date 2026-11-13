import type { Metadata } from "next";
import Link from "next/link";
import CopyHash from "@/components/CopyHash";
import { site } from "@/lib/site";
import styles from "../docs.module.css";

export const metadata: Metadata = {
  title: { absolute: "Changelog — Thea" },
  description:
    "Release notes for Thea 0.1.0: what shipped, the known limits of the first build, and what is being considered next.",
  alternates: { canonical: "/docs/changelog" },
};

export default function ChangelogPage() {
  return (
    <>
      <header className={styles.pageHead}>
        <p className={styles.kicker}>Handbook · 05</p>
        <h1 className={styles.title}>
          What shipped, <em>what is next.</em>
        </h1>
        <p className={styles.summary}>
          Thea is at the very beginning: one release, one installer, one small
          creature. This page records exactly what is in the build you can
          download, and which limits are deliberate.
        </p>
        <ul className={styles.headMeta}>
          <li>Version {site.version}</li>
          <li>{site.releaseLabel}</li>
          <li>First public build</li>
          <li>Unsigned</li>
        </ul>
      </header>

      <div className={`${styles.callout} ${styles.tip}`}>
        <span className={styles.calloutIcon} aria-hidden>
          ★
        </span>
        <div className={styles.calloutBody}>
          <p className={styles.calloutTitle}>
            0.1.0 — the first build · {site.releaseLabel}
          </p>
          <p className={styles.calloutText}>
            The first complete version of Thea: procedural art, eight
            expressions, moods, physics, chiptune, tray controls and a per-user
            Windows installer.
          </p>
        </div>
      </div>

      <div className={styles.block}>
        <div className={styles.blockHead}>
          <span className={styles.blockNo}>01</span>
          <h2 className={styles.blockTitle}>In this release</h2>
          <span className={styles.blockRule} />
        </div>

        <div className="prose">
          <ul>
            <li>
              <strong>Procedural 40 × 40 rig.</strong> Her body, sprout, limbs
              and face are drawn every frame, not loaded from sprites. Crisp at
              every scale.
            </li>
            <li>
              <strong>Eight expressions.</strong> Neutral, happy, sad, surprised,
              angry, eating, singing and sleeping — all within an unchanged
              silhouette.
            </li>
            <li>
              <strong>Three drifting moods.</strong> Fullness, joy and energy,
              saved to <code>%APPDATA%\Thea\state.json</code> every ten seconds
              and on quit.
            </li>
            <li>
              <strong>Physical interaction.</strong> Cursor tracking, blinking,
              hopping, dragging, throwing, feeding and a four-second temper.
            </li>
            <li>
              <strong>Global Space hook.</strong> A low-level Windows hook that
              only swallows Space while the pointer is inside her actual
              silhouette.
            </li>
            <li>
              <strong>Click-through overlay.</strong> The window ignores the
              mouse everywhere except her body, so your desktop keeps working.
            </li>
            <li>
              <strong>Tray app with two menus.</strong> The full right-click menu
              and a shorter tray menu. No taskbar button.
            </li>
            <li>
              <strong>Control Center dashboard.</strong> Status, Actions,
              Milestones, Settings and Inspector tabs, with a 2×–10× scale
              slider and a chiptune toggle.
            </li>
            <li>
              <strong>Chiptune voice.</strong> A small synth for songs and
              reactions, silent if no audio device is available.
            </li>
            <li>
              <strong>Per-user installer.</strong> No admin rights, Start Menu
              shortcut, optional desktop shortcut, optional launch, and a
              standard uninstaller.
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.block}>
        <div className={styles.blockHead}>
          <span className={styles.blockNo}>02</span>
          <h2 className={styles.blockTitle}>Build facts</h2>
          <span className={styles.blockRule} />
        </div>

        <dl className={styles.facts}>
          <div className={styles.fact}>
            <dt className={styles.factTerm}>Version</dt>
            <dd className={styles.factValue}>{site.version}</dd>
          </div>
          <div className={styles.fact}>
            <dt className={styles.factTerm}>Released</dt>
            <dd className={styles.factValue}>{site.releaseLabel}</dd>
          </div>
          <div className={styles.fact}>
            <dt className={styles.factTerm}>Installer</dt>
            <dd className={styles.factValue}>{site.download.filename}</dd>
          </div>
          <div className={styles.fact}>
            <dt className={styles.factTerm}>Installer size</dt>
            <dd className={styles.factValue}>
              {site.download.sizeBytes.toLocaleString("en-GB")} bytes ·{" "}
              {site.download.sizeLabel}
            </dd>
          </div>
          <div className={styles.fact}>
            <dt className={styles.factTerm}>Installed size</dt>
            <dd className={styles.factValue}>{site.download.installedLabel}</dd>
          </div>
          <div className={styles.fact}>
            <dt className={styles.factTerm}>Platform</dt>
            <dd className={styles.factValue}>
              Windows 10 build 17763+ / Windows 11 · x64
            </dd>
          </div>
          <div className={styles.fact}>
            <dt className={styles.factTerm}>Packaging</dt>
            <dd className={styles.factValue}>
              PyInstaller app, wrapped in an Inno Setup installer
            </dd>
          </div>
          <div className={styles.fact}>
            <dt className={styles.factTerm}>Code signing</dt>
            <dd className={styles.factValue}>
              None yet. SmartScreen may warn on first run.
            </dd>
          </div>
        </dl>

        <div className={styles.panel} style={{ marginTop: 18 }}>
          <p className={styles.panelTitle}>SHA-256 · {site.download.filename}</p>
          <div style={{ marginTop: 10 }}>
            <CopyHash value={site.download.sha256} />
          </div>
        </div>
      </div>

      <div className={styles.block}>
        <div className={styles.blockHead}>
          <span className={styles.blockNo}>03</span>
          <h2 className={styles.blockTitle}>Known limits, on purpose</h2>
          <span className={styles.blockRule} />
        </div>

        <div className="prose">
          <ul>
            <li>
              <strong>Windows only.</strong> The click-through overlay and the
              keyboard hook are Win32 features.
            </li>
            <li>
              <strong>Primary monitor only.</strong> She stays inside the
              primary display&rsquo;s work area.
            </li>
            <li>
              <strong>No start-with-Windows entry.</strong> Launching her is
              always a deliberate act. There is no Run key, startup shortcut or
              service.
            </li>
            <li>
              <strong>No auto-update.</strong> Checking for and installing a new
              version is entirely manual. The app never phones home.
            </li>
            <li>
              <strong>Unsigned installer.</strong> SmartScreen may warn once.
              Code signing is planned, not present.
            </li>
            <li>
              <strong>The Space hook respects Windows security.</strong> It is
              inert while an elevated window has focus.
            </li>
            <li>
              <strong>One copy at a time.</strong> A second launch exits
              quietly; there is no &ldquo;open a second pet&rdquo; mode.
            </li>
            <li>
              <strong>Settings survive uninstall.</strong>{" "}
              <code>%APPDATA%\Thea</code> is deliberately left alone until you
              delete it.
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.block}>
        <div className={styles.blockHead}>
          <span className={styles.blockNo}>04</span>
          <h2 className={styles.blockTitle}>Under consideration</h2>
          <span className={styles.blockRule} />
        </div>

        <div className="prose">
          <p>
            Nothing below is a promise, and nothing below is in 0.1.0. They are
            the directions that make sense next, roughly in order.
          </p>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <caption>Possible future work — not commitments</caption>
            <tbody>
              <tr>
                <th scope="row">Code signing</th>
                <td>
                  Remove the SmartScreen warning by signing the setup and the
                  uninstaller. The build script is already structured for it.
                </td>
              </tr>
              <tr>
                <th scope="row">Multi-monitor</th>
                <td>
                  Let her cross between displays instead of living on the
                  primary one.
                </td>
              </tr>
              <tr>
                <th scope="row">More expressions</th>
                <td>
                  New faces for boredom, curiosity or being petted — without
                  changing the silhouette rule.
                </td>
              </tr>
              <tr>
                <th scope="row">In-app check</th>
                <td>
                  An optional, manually triggered version check that respects the
                  no-network default.
                </td>
              </tr>
              <tr>
                <th scope="row">A portable build</th>
                <td>
                  A zip that runs without installing, for people who keep their
                  apps on a USB drive.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.block}>
        <div className={styles.blockHead}>
          <span className={styles.blockNo}>05</span>
          <h2 className={styles.blockTitle}>Version history</h2>
          <span className={styles.blockRule} />
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <caption>Releases</caption>
            <tbody>
              <tr>
                <th scope="row">{site.version}</th>
                <td>
                  {site.releaseLabel} — first public build. Procedural art, eight
                  expressions, moods, physics, chiptune, tray menus, dashboard
                  and a per-user installer.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.nextPrev}>
        <Link href="/docs/faq" className={styles.nextLink}>
          <span className={styles.nextLabel}>← Previous · 04</span>
          <span className={styles.nextTitle}>Questions</span>
        </Link>
        <Link href="/docs" className={styles.nextLink} data-align="right">
          <span className={styles.nextLabel}>↑ Handbook</span>
          <span className={styles.nextTitle}>Back to the start</span>
        </Link>
      </div>
    </>
  );
}
