import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import styles from "../docs.module.css";

export const metadata: Metadata = {
  title: { absolute: "Troubleshooting — Thea" },
  description:
    "Fix common Thea problems on Windows: SmartScreen warnings, a missing pet or tray icon, Space not working, install and uninstall errors, sound and scale issues.",
  alternates: { canonical: "/docs/troubleshooting" },
};

export default function TroubleshootingPage() {
  return (
    <>
      <header className={styles.pageHead}>
        <p className={styles.kicker}>Handbook · 03</p>
        <h1 className={styles.title}>
          When something <em>is off.</em>
        </h1>
        <p className={styles.summary}>
          Most problems are Windows being careful: SmartScreen, an elevated
          window, a hidden tray icon or a second copy of the app quietly
          refusing to start. Work through the three checks first, then find the
          symptom that matches.
        </p>
        <ul className={styles.headMeta}>
          <li>Start with three checks</li>
          <li>12 symptoms covered</li>
          <li>No logs to send us</li>
          <li>No account required</li>
        </ul>
      </header>

      <div className="prose">
        <h2 id="first-checks">First, three checks</h2>
        <ol>
          <li>
            <strong>Is she already running?</strong> Open Task Manager and look
            for <code>Thea.exe</code> under Details. A second launch exits
            silently on purpose — only one copy can run.
          </li>
          <li>
            <strong>Is the tray icon hidden?</strong> Click the{" "}
            <strong>^</strong> chevron beside the clock. Windows hides new tray
            icons by default on many machines.
          </li>
          <li>
            <strong>Are you on the primary monitor?</strong> She uses the
            primary display&rsquo;s work area only. If you are looking at a
            second screen, she is on the first.
          </li>
        </ol>
      </div>

      <div className={`${styles.callout} ${styles.tip}`}>
        <span className={styles.calloutIcon} aria-hidden>
          ✓
        </span>
        <div className={styles.calloutBody}>
          <p className={styles.calloutTitle}>The universal reset</p>
          <p className={styles.calloutText}>
            Quit her from the tray, then launch her again from the Start Menu.
            Position and animation state start fresh. Her moods survive, because
            they live in <code>%APPDATA%\Thea\state.json</code>.
          </p>
        </div>
      </div>

      <div className="prose">
        <h2 id="smart-screen">Windows says “Windows protected your PC”</h2>
        <p>
          This build is unsigned. SmartScreen has no publisher to vouch for it,
          so it shows a warning the first time you run the installer. That is
          expected, and it is not a sign that the file is damaged.
        </p>
        <ol>
          <li>
            Click <strong>More info</strong>.
          </li>
          <li>
            Click <strong>Run anyway</strong>.
          </li>
          <li>
            If you want certainty first, verify the SHA-256 checksum in the{" "}
            <Link href="/docs/installation#verify">installation guide</Link>.
          </li>
        </ol>
        <p>
          If <strong>Run anyway</strong> is missing, the file may have been
          blocked by policy on a managed machine, or quarantined by antivirus.
          Check Windows Security → Protection history, and restore the file only
          if you trust where it came from.
        </p>

        <h2 id="still-running">Setup says “Thea is still running”</h2>
        <p>
          She holds a named mutex while open, and Setup will not overwrite a
          running copy.
        </p>
        <ol>
          <li>
            Right-click her tray icon and choose <strong>Quit</strong>.
          </li>
          <li>
            If the tray icon is gone, open Task Manager → Details, find{" "}
            <code>Thea.exe</code> and choose <strong>End task</strong>.
          </li>
          <li>Run the installer again.</li>
        </ol>
        <p>
          The same rule applies to uninstalling: quit her first, then uninstall.
        </p>

        <h2 id="not-visible">She is running, but I cannot see her</h2>
        <p>
          Work through these in order. Each one is common enough to be worth
          checking before reinstalling anything.
        </p>
        <ul>
          <li>
            <strong>Full-screen app.</strong> An exclusive full-screen game can
            cover a topmost overlay completely. Switch the game to borderless
            windowed mode, or quit Thea while you play.
          </li>
          <li>
            <strong>She is at a screen edge.</strong> She bounces inside the
            work area, so she should not leave it — but a very large scale on a
            small screen can push her mostly out of view. Open the dashboard from
            the tray menu and set scale back to 5×.
          </li>
          <li>
            <strong>The taskbar covers her.</strong> She lives in the work area,
            so the taskbar should not hide her. If auto-hide is on, move the
            pointer to where she last was; she may be behind the hidden bar.
          </li>
          <li>
            <strong>Display changed.</strong> After unplugging a monitor or
            changing resolution, quit and relaunch her so she re-reads the work
            area.
          </li>
        </ul>

        <h2 id="tray-missing">The tray icon has disappeared</h2>
        <p>
          Windows sometimes loses tray icons when Explorer restarts, or hides
          them in the overflow area.
        </p>
        <ul>
          <li>
            Click the <strong>^</strong> chevron beside the clock and look for
            her icon.
          </li>
          <li>
            Open <strong>Settings → Personalisation → Taskbar → Other system
            tray icons</strong> and switch Thea on.
          </li>
          <li>
            If the process is running but the icon is truly gone, quit{" "}
            <code>Thea.exe</code> in Task Manager and launch her again.
          </li>
        </ul>

        <h2 id="space-nothing">Space does nothing</h2>
        <p>
          Space is deliberately narrow: it fires only while the pointer is
          actually inside her silhouette, and only when a normal window has
          focus.
        </p>
        <ul>
          <li>
            <strong>Move the pointer onto her body or sprout.</strong> One pixel
            outside the outline and the key is passed through untouched.
          </li>
          <li>
            <strong>Click away from an administrator window.</strong> Windows
            blocks low-level hooks while an elevated window has focus. This is a
            security boundary; Thea cannot override it.
          </li>
          <li>
            <strong>Check security software.</strong> Some endpoint protection
            blocks global keyboard hooks outright. If Space never works while
            clicks do, this is the likely cause.
          </li>
          <li>
            <strong>Try the menu instead.</strong> Feed, Play and Sleep are all
            available from the right-click and tray menus without a keyboard.
          </li>
        </ul>

        <h2 id="wont-wake">She will not wake up</h2>
        <p>
          She naps on her own after roughly 150 seconds without attention, and
          only when her energy is below 45. A click, a double-click or Space
          wakes her with a startled <strong>!</strong>.
        </p>
        <p>
          If clicking does nothing, check that you are clicking her actual
          silhouette rather than the empty square around her. If she still does
          not respond, quit and relaunch — a stuck state is rare, but a relaunch
          clears it.
        </p>

        <h2 id="always-angry">She seems angry or sad all the time</h2>
        <p>
          These are two different systems:
        </p>
      </div>

      <div className={styles.split}>
        <div className={styles.panel}>
          <p className={styles.panelTitle}>Angry</p>
          <p className={styles.panelBody}>
            Caused by holding her in the air for more than four seconds. Put her
            down, wait a moment, then double-click her to bring her mood back up.
          </p>
        </div>
        <div className={styles.panel}>
          <p className={styles.panelTitle}>Sad</p>
          <p className={styles.panelBody}>
            Fullness below 25. Drag her to the top 16% of the screen to feed her,
            or choose <strong>Feed Thea</strong> from the menu. One meal adds 34
            fullness.
          </p>
        </div>
      </div>

      <div className="prose">
        <p>
          Fullness drains at roughly 3.3 points per minute while she is awake.
          If she looks permanently sad, feed her twice and check the dashboard
          meters to confirm the number moved.
        </p>

        <h2 id="install-fails">The installer will not finish</h2>
        <ul>
          <li>
            <strong>Quit her first.</strong> See{" "}
            <Link href="#still-running">the running-app check</Link> above.
          </li>
          <li>
            <strong>Free some space.</strong> The installer needs{" "}
            {site.download.sizeLabel}, and the installed app takes{" "}
            {site.download.installedLabel}.
          </li>
          <li>
            <strong>Run it from a local folder.</strong> Launching an installer
            directly from a network share or a synced cloud placeholder can fail.
            Copy it to your Downloads folder and try again.
          </li>
          <li>
            <strong>Use the log.</strong> Run{" "}
            <code>{site.download.filename} /LOG="%TEMP%\\thea-setup.log"</code>{" "}
            and read the end of that file. It names the exact step that failed.
          </li>
          <li>
            <strong>Antivirus quarantine.</strong> Check Windows Security →
            Protection history. An unsigned installer is a common false positive.
          </li>
        </ul>

        <h2 id="wont-launch">The app will not start at all</h2>
        <ul>
          <li>
            <strong>Look for an existing copy.</strong> A second launch exits
            immediately. Check Task Manager for <code>Thea.exe</code>.
          </li>
          <li>
            <strong>Wait a few seconds after uninstall or reinstall.</strong>{" "}
            Windows can hold the old process briefly.
          </li>
          <li>
            <strong>Launch from the Start Menu shortcut</strong> rather than the
            installer&rsquo;s final checkbox, to rule out a stale shortcut.
          </li>
          <li>
            <strong>Reinstall over the top.</strong> A repair install replaces
            the program files and leaves <code>%APPDATA%\Thea</code> untouched.
          </li>
        </ul>

        <h2 id="no-sound">She is silent</h2>
        <p>
          Her voice is optional. Check, in order: the{" "}
          <strong>Enable Chiptune Voice</strong> checkbox in{" "}
          <strong>Dashboard → Settings</strong>; the Windows volume mixer, where
          Thea has her own slider; and whether any output device is connected.
          With no usable device the app stays silent rather than failing.
        </p>

        <h2 id="too-big">She is too big or too small</h2>
        <p>
          Open the dashboard&rsquo;s Settings tab. The scale slider runs from 2×
          (80 px tall) to 10× (400 px tall). The default is 5×. Changes apply
          immediately. If the slider seems stuck, close and reopen the
          dashboard; the value is read when the window opens.
        </p>

        <h2 id="forget">I want her to forget everything</h2>
        <p>
          Quit her, then delete <code>%APPDATA%\Thea</code>. That removes{" "}
          <code>state.json</code>: her moods, meal count and birthday. The next
          launch is a fresh pet with fullness 82, joy 74 and energy 88.
        </p>
        <p>
          Deleting the folder does not uninstall the app. To remove the program
          as well, use <strong>Settings → Apps → Installed apps → Thea →
          Uninstall</strong>.
        </p>

        <h2 id="uninstall-fails">Uninstall leaves something behind</h2>
        <p>
          The uninstaller removes the program files and shortcuts but
          deliberately leaves <code>%APPDATA%\Thea</code> so a reinstall
          remembers your pet. If you want a completely clean machine, delete
          that folder after uninstalling.
        </p>
        <p>
          If the uninstaller itself will not run, make sure Thea is quit, then
          use <strong>Apps → Installed apps → Thea → Uninstall</strong> rather
          than running the uninstaller directly from a half-removed folder.
        </p>

        <h2 id="report">Nothing here matches</h2>
        <p>
          The <Link href="/docs/faq">FAQ</Link> covers the questions people ask
          before installing. If your problem is not covered anywhere, the most
          useful things to note down are: your Windows version, whether the tray
          icon exists, what the dashboard&rsquo;s Inspector tab shows, and
          whether the problem survives a quit-and-relaunch.
        </p>
      </div>

      <div className={styles.nextPrev}>
        <Link href="/docs/controls" className={styles.nextLink}>
          <span className={styles.nextLabel}>← Previous · 02</span>
          <span className={styles.nextTitle}>Controls</span>
        </Link>
        <Link href="/docs/faq" className={styles.nextLink} data-align="right">
          <span className={styles.nextLabel}>Next · 04</span>
          <span className={styles.nextTitle}>Questions →</span>
        </Link>
      </div>
    </>
  );
}
