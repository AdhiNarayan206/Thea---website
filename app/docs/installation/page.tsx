import type { Metadata } from "next";
import Link from "next/link";
import CopyHash from "@/components/CopyHash";
import { site } from "@/lib/site";
import styles from "../docs.module.css";

export const metadata: Metadata = {
  title: { absolute: "Installation — Thea" },
  description:
    "How to install Thea on Windows 10 or 11: download the per-user installer, get past SmartScreen, verify the SHA-256 checksum, and uninstall cleanly.",
  alternates: { canonical: "/docs/installation" },
};

export default function InstallationPage() {
  return (
    <>
      <header className={styles.pageHead}>
        <p className={styles.kicker}>Handbook · 01</p>
        <h1 className={styles.title}>
          Installing <em>Thea.</em>
        </h1>
        <p className={styles.summary}>
          One installer, a few clicks, no administrator rights. This page covers
          the normal install, the SmartScreen warning you will probably see, how
          to check the file yourself, and how to remove her without leaving a
          trace.
        </p>
        <ul className={styles.headMeta}>
          <li>5 minutes</li>
          <li>Per-user</li>
          <li>No admin rights</li>
          <li>Uninstaller included</li>
        </ul>
      </header>

      <div className="prose">
        <h2 id="requirements">Before you start</h2>
        <ul>
          <li>
            <strong>Windows 10 build 17763 (1809) or newer</strong>, or Windows
            11. 64-bit only.
          </li>
          <li>
            About {site.download.sizeLabel} for the installer and roughly the
            same space again while Setup unpacks it.
          </li>
          <li>
            Thea must not be running. If she is, right-click her tray icon and
            choose <strong>Quit</strong>. Setup checks for her and stops if she
            is still open.
          </li>
          <li>
            A normal user account is enough. The app installs into your own
            profile, not into <code>Program Files</code>.
          </li>
        </ul>

        <h2 id="download">Download the installer</h2>
        <p>
          The download is a single file called{" "}
          <code>{site.download.filename}</code>. It is not the bare{" "}
          <code>Thea.exe</code>; it is an Inno Setup installer that places the
          app, adds a Start Menu shortcut and registers an uninstaller with
          Windows.
        </p>
      </div>

      <div className={styles.split}>
        <div className={styles.panel}>
          <p className={styles.panelTitle}>File</p>
          <p className={styles.panelBody}>
            <code>{site.download.filename}</code>
            <br />
            {site.download.sizeBytes.toLocaleString("en-GB")} bytes ·{" "}
            {site.download.sizeLabel}
          </p>
        </div>
        <div className={styles.panel}>
          <p className={styles.panelTitle}>Version</p>
          <p className={styles.panelBody}>
            {site.version} · {site.releaseLabel}
            <br />
            Built for Windows 10 / 11, 64-bit.
          </p>
        </div>
      </div>

      <div className="prose">
        <p>
          You can verify the checksum before running it. The expected SHA-256
          for this exact build is:
        </p>
      </div>

      <div className={styles.panel} style={{ marginTop: 14 }}>
        <p className={styles.panelTitle}>SHA-256 · over the whole file</p>
        <div style={{ marginTop: 10 }}>
          <CopyHash value={site.download.sha256} />
        </div>
      </div>

      <div className="prose">
        <h3 id="verify">Checking it in PowerShell</h3>
        <p>
          Open PowerShell in the folder you downloaded to and run:
        </p>
      </div>

      <pre className={styles.code}>
        <code>
          {`Get-FileHash .\\${site.download.filename} -Algorithm SHA256`}
        </code>
      </pre>

      <div className="prose">
        <p>
          The <code>Hash</code> value should match the string above,
          character for character. Letter case does not matter. If it does not
          match, delete the file and download it again — do not run it.
        </p>

        <h2 id="smart-screen">The SmartScreen warning</h2>
        <p>
          This build is <strong>not code-signed yet</strong>. A code-signing
          certificate costs money and this is an indie release, so Windows has
          no publisher signature to check. When you run the downloaded file,
          SmartScreen may show a blue panel saying{" "}
          <strong>“Windows protected your PC”</strong>.
        </p>
        <ol>
          <li>
            Click <strong>More info</strong> in the warning panel.
          </li>
          <li>
            Click <strong>Run anyway</strong> at the bottom.
          </li>
          <li>
            Setup starts normally. You will not see the warning again for this
            file.
          </li>
        </ol>
      </div>

      <div className={`${styles.callout} ${styles.warn}`}>
        <span className={styles.calloutIcon} aria-hidden>
          !
        </span>
        <div className={styles.calloutBody}>
          <p className={styles.calloutTitle}>
            Never bypass a warning for a file you did not expect.
          </p>
          <p className={styles.calloutText}>
            This advice applies to the file downloaded from this site. If you
            received the installer from somewhere else, or the checksum does not
            match, do not choose <strong>Run anyway</strong>. Download a fresh
            copy instead.
          </p>
        </div>
      </div>

      <div className="prose">
        <h2 id="install">Running Setup</h2>
        <p>
          Double-click the installer. The wizard is a standard Inno Setup
          window: a welcome page, a folder choice, an optional desktop shortcut,
          then install. There is no bundled software and no online step.
        </p>
      </div>

      <ol className={styles.steps}>
        <li className={styles.step}>
          <span className={styles.stepNo} aria-hidden />
          <div className={styles.stepBody}>
            <p className={styles.stepTitle}>Welcome and destination</p>
            <p className={styles.stepText}>
              Setup defaults to{" "}
              <code>%LOCALAPPDATA%\Programs\Thea</code>, which is inside your
              own profile. You can choose another folder, but the default keeps
              everything per-user and avoids permission problems.
            </p>
          </div>
        </li>
        <li className={styles.step}>
          <span className={styles.stepNo} aria-hidden />
          <div className={styles.stepBody}>
            <p className={styles.stepTitle}>Shortcuts</p>
            <p className={styles.stepText}>
              A Start Menu shortcut is always created. A desktop shortcut is
              offered but unticked by default. There is no quick-launch or
              startup folder entry.
            </p>
          </div>
        </li>
        <li className={styles.step}>
          <span className={styles.stepNo} aria-hidden />
          <div className={styles.stepBody}>
            <p className={styles.stepTitle}>Install</p>
            <p className={styles.stepText}>
              Setup unpacks the packaged app. It does not download anything, and
              it does not need to be online.
            </p>
          </div>
        </li>
        <li className={styles.step}>
          <span className={styles.stepNo} aria-hidden />
          <div className={styles.stepBody}>
            <p className={styles.stepTitle}>Launch her</p>
            <p className={styles.stepText}>
              The final page has a <strong>Launch Thea now</strong> checkbox,
              ticked. Untick it if you would rather start her yourself from the
              Start Menu.
            </p>
          </div>
        </li>
      </ol>

      <div className="prose">
        <h2 id="first-run">The first minute</h2>
        <p>
          Thea appears near the lower-right of your primary screen. There is no
          taskbar button; look for a small black-and-white icon in the
          notification area beside the clock. If Windows has hidden it, click
          the <strong>^</strong> chevron and drag her icon onto the visible part
          of the tray.
        </p>
        <ul>
          <li>
            Move your pointer over her. Her eyes should follow it, and the
            window becomes clickable only while you are actually on her body.
          </li>
          <li>
            Click her once for a hop. Double-click for a happy face and hearts.
          </li>
          <li>
            Right-click her for the full menu, including{" "}
            <strong>Dashboard / Numbers</strong> and <strong>Quit</strong>.
          </li>
        </ul>
        <p>
          She does not start with Windows. When you want her, launch her from
          the Start Menu. When you are done, quit her from the tray menu — or
          simply leave her running; she costs very little.
        </p>

        <h2 id="what-setup-does">What Setup changes</h2>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>The complete footprint of the installer</caption>
          <tbody>
            <tr>
              <th scope="row">Program files</th>
              <td>
                <code>%LOCALAPPDATA%\Programs\Thea</code>
              </td>
            </tr>
            <tr>
              <th scope="row">Start Menu</th>
              <td>A single shortcut, always created</td>
            </tr>
            <tr>
              <th scope="row">Desktop</th>
              <td>Optional shortcut, unticked by default</td>
            </tr>
            <tr>
              <th scope="row">Apps &amp; features</th>
              <td>
                “Thea” uninstall entry, publisher “Thea — Your Digital
                Companion”
              </td>
            </tr>
            <tr>
              <th scope="row">Registry</th>
              <td>Only the standard uninstall registration for the above</td>
            </tr>
            <tr>
              <th scope="row">Startup</th>
              <td>Nothing. No Run key, no startup folder entry, no service</td>
            </tr>
            <tr>
              <th scope="row">Network</th>
              <td>Nothing downloaded or phoned home during setup</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="prose">
        <h2 id="upgrading">Upgrading over an older build</h2>
        <p>
          Quit Thea first, then run the newer installer. It uses a stable
          application ID, so it replaces the program files in place and keeps
          your Start Menu shortcut. Her mood numbers live separately in{" "}
          <code>%APPDATA%\Thea\state.json</code> and are left alone, so she
          remembers you across an upgrade.
        </p>

        <h2 id="uninstall">Uninstalling her</h2>
        <ol>
          <li>
            Right-click her tray icon and choose <strong>Quit</strong>. If she
            is not running, skip this.
          </li>
          <li>
            Open <strong>Settings → Apps → Installed apps</strong>.
          </li>
          <li>
            Find <strong>Thea</strong>, open its menu and choose{" "}
            <strong>Uninstall</strong>.
          </li>
          <li>
            The standard uninstaller removes the program files, the Start Menu
            shortcut, any desktop shortcut and the uninstall entry.
          </li>
        </ol>
        <p>
          Your settings are deliberately left behind. To make her forget you
          completely, delete <code>%APPDATA%\Thea</code> as well. The next
          install then starts with a fresh pet: fullness 82, joy 74, energy 88,
          no meals eaten.
        </p>
      </div>

      <div className={`${styles.callout} ${styles.tip}`}>
        <span className={styles.calloutIcon} aria-hidden>
          i
        </span>
        <div className={styles.calloutBody}>
          <p className={styles.calloutTitle}>If Setup says Thea is running</p>
          <p className={styles.calloutText}>
            She holds a named mutex while she is open, and Setup refuses to
            overwrite a running copy. Quit her from the tray, then run Setup
            again. If the tray icon is missing, open Task Manager, find{" "}
            <code>Thea.exe</code> under Details and end that process.
          </p>
        </div>
      </div>

      <div className="prose">
        <h2 id="silent">Silent install, for the curious</h2>
        <p>
          Setup is a normal Inno Setup build, so the standard flags work. From a
          terminal in the download folder:
        </p>
      </div>

      <pre className={styles.code}>
        <code>
          {`.\\${site.download.filename} /VERYSILENT /SUPPRESSMSGBOXES /NORESTART /LOG="%TEMP%\\\\thea-setup.log"`}
        </code>
      </pre>

      <div className="prose">
        <p>
          This installs to the same per-user folder without a wizard. The log
          file is useful if something goes wrong. To uninstall silently, run the
          generated uninstaller with the same flags:
        </p>
      </div>

      <pre className={styles.code}>
        <code>{`& "$env:LOCALAPPDATA\\Programs\\Thea\\unins000.exe" /VERYSILENT /SUPPRESSMSGBOXES /NORESTART`}</code>
      </pre>

      <div className="prose">
        <p>
          Most people never need this. It is documented because a silent install
          is also the quickest way to confirm the installer is healthy on a
          machine you are testing.
        </p>
      </div>

      <div className={styles.nextPrev}>
        <Link href="/docs" className={styles.nextLink}>
          <span className={styles.nextLabel}>← Handbook</span>
          <span className={styles.nextTitle}>Start here</span>
        </Link>
        <Link
          href="/docs/controls"
          className={styles.nextLink}
          data-align="right"
        >
          <span className={styles.nextLabel}>Next · 02</span>
          <span className={styles.nextTitle}>Controls →</span>
        </Link>
      </div>
    </>
  );
}
