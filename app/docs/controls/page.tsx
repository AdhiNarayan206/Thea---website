import type { Metadata } from "next";
import Link from "next/link";
import styles from "../docs.module.css";

export const metadata: Metadata = {
  title: { absolute: "Controls — Thea" },
  description:
    "Every Thea gesture and menu: hover, click, double-click, drag, feed, throw, Space to run, right-click, the tray menu and the dashboard tabs.",
  alternates: { canonical: "/docs/controls" },
};

export default function ControlsPage() {
  return (
    <>
      <header className={styles.pageHead}>
        <p className={styles.kicker}>Handbook · 02</p>
        <h1 className={styles.title}>
          Small gestures, <em>read carefully.</em>
        </h1>
        <p className={styles.summary}>
          Thea has no window to open and no mode to switch. You interact with
          her the way you would with a cat on a desk: move near her, pick her up,
          put her down, feed her, and occasionally apologise.
        </p>
        <ul className={styles.headMeta}>
          <li>8 gestures</li>
          <li>2 menus</li>
          <li>5 dashboard tabs</li>
          <li>1 global key</li>
        </ul>
      </header>

      <div className="prose">
        <h2 id="gestures">The gestures</h2>
        <p>
          Every interaction below works on her body and her sprout. The window
          around her is click-through, so anything one pixel outside her
          silhouette behaves as if she were not there.
        </p>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>Gesture reference · default 5× scale</caption>
          <tbody>
            <tr>
              <th scope="row">Move the pointer</th>
              <td>
                Her eyes follow your cursor. Move far away and she turns her
                whole body toward you.
              </td>
            </tr>
            <tr>
              <th scope="row">Click</th>
              <td>
                One hop with a squash on landing and a puff of dust. Wakes her if
                she is asleep.
              </td>
            </tr>
            <tr>
              <th scope="row">Double-click</th>
              <td>
                A happy face, hearts and a bounce. Joy rises by 8 points.
              </td>
            </tr>
            <tr>
              <th scope="row">Drag</th>
              <td>
                Pick her up. She looks surprised while held, and her arms swing
                as you carry her.
              </td>
            </tr>
            <tr>
              <th scope="row">Drop in the top 16%</th>
              <td>
                The feeding shelf. She lands, eats, and fullness rises by 34
                points. Crumbs included.
              </td>
            </tr>
            <tr>
              <th scope="row">Fling and release</th>
              <td>
                She keeps the pointer&rsquo;s velocity, then gravity takes over.
                She bounces off the edges of the work area rather than leaving
                the screen.
              </td>
            </tr>
            <tr>
              <th scope="row">Hold for 4 seconds</th>
              <td>
                Being held that long makes her cross. Steam, a scowl, and she
                stays annoyed briefly after you put her down.
              </td>
            </tr>
            <tr>
              <th scope="row">Hover, then Space</th>
              <td>
                She runs toward the cursor&rsquo;s side of her body and hops when
                she reaches it. Works while she is asleep too — it wakes her.
              </td>
            </tr>
            <tr>
              <th scope="row">Right-click</th>
              <td>
                The full menu: Feed, Sing, Play, Dashboard, Sleep/wake and Quit.
                Her three numbers are in the header.
              </td>
            </tr>
            <tr>
              <th scope="row">Click the tray icon</th>
              <td>
                The shorter tray menu. Left-click opens it too; right-click opens
                the standard Windows tray menu.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="prose">
        <h2 id="space">Space, precisely</h2>
        <p>
          Space is the only key she listens for. It is read by a low-level
          Windows keyboard hook that runs inside the app — there is no helper
          process and nothing installed system-wide.
        </p>
        <p>
          The key is swallowed <strong>only while your pointer is inside her
          silhouette</strong>. One pixel outside her outline and Space passes
          straight through to whatever you were typing in. That is deliberate:
          she should never eat a space in your editor.
        </p>
      </div>

      <div className={styles.split}>
        <div className={styles.panel}>
          <p className={styles.panelTitle}>Works when</p>
          <p className={styles.panelBody}>
            Your pointer is over her body or sprout, and the focused window is a
            normal, non-elevated application.
          </p>
        </div>
        <div className={styles.panel}>
          <p className={styles.panelTitle}>Does not work when</p>
          <p className={styles.panelBody}>
            An elevated (administrator) window has focus. Windows blocks
            low-level hooks across that boundary; it is a security feature, not
            a bug.
          </p>
        </div>
      </div>

      <div className="prose">
        <h2 id="menus">Two menus</h2>
        <p>
          Both menus do the same kind of things, but they are not the same menu.
          The right-click menu is the full one. The tray menu is the short one
          you can reach when she is somewhere awkward on screen.
        </p>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>Right-click menu</caption>
          <tbody>
            <tr>
              <th scope="row">Header</th>
              <td>
                Her current mood and vitals, for example{" "}
                <code>happy · food 82 · joy 74</code>
              </td>
            </tr>
            <tr>
              <th scope="row">Feed Thea</th>
              <td>Adds 34 fullness and starts the eating animation</td>
            </tr>
            <tr>
              <th scope="row">Sing a song</th>
              <td>
                A short chiptune melody, a moving mouth and floating notes — if
                sound is enabled and an output device exists
              </td>
            </tr>
            <tr>
              <th scope="row">Play</th>
              <td>The same reaction as a double-click: hearts and 8 joy</td>
            </tr>
            <tr>
              <th scope="row">Dashboard / Numbers</th>
              <td>Opens the Control Center window</td>
            </tr>
            <tr>
              <th scope="row">Go to sleep / Wake up</th>
              <td>Puts her to sleep or wakes her immediately</td>
            </tr>
            <tr>
              <th scope="row">Quit</th>
              <td>Saves her state and exits. The tray icon disappears with her.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>Tray menu · shorter by design</caption>
          <tbody>
            <tr>
              <th scope="row">Feed Thea</th>
              <td>Same as the right-click Feed</td>
            </tr>
            <tr>
              <th scope="row">Sing a song</th>
              <td>Same as the right-click Sing</td>
            </tr>
            <tr>
              <th scope="row">Play</th>
              <td>Same as the right-click Play</td>
            </tr>
            <tr>
              <th scope="row">Sleep / wake</th>
              <td>Toggles her nap state</td>
            </tr>
            <tr>
              <th scope="row">Quit</th>
              <td>Saves and exits</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className={styles.callout}>
        <span className={styles.calloutIcon} aria-hidden>
          i
        </span>
        <div className={styles.calloutBody}>
          <p className={styles.calloutTitle}>There is no taskbar button.</p>
          <p className={styles.calloutText}>
            She is a tray app. If you cannot see her on screen and cannot find
            the tray icon, she may be behind a full-screen window or the icon may
            be in the hidden tray. Click the <strong>^</strong> chevron beside
            the clock and drag her icon out to pin it.
          </p>
        </div>
      </div>

      <div className="prose">
        <h2 id="dashboard">The Control Center</h2>
        <p>
          Right-click her and choose <strong>Dashboard / Numbers</strong> to open
          a normal window called <strong>Thea // Control Center</strong>. It has
          five tabs.
        </p>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>Dashboard tabs</caption>
          <tbody>
            <tr>
              <th scope="row">Status</th>
              <td>
                Mood label and three meters: fullness / satiety, joy / happiness
                and energy / stamina. Quick Feed and Play buttons.
              </td>
            </tr>
            <tr>
              <th scope="row">Actions</th>
              <td>
                Feed (Snack), Play (Double-Tap), Sing a Song, Toggle Sleep, Hop,
                and Save State Now. A small status line confirms a save time.
              </td>
            </tr>
            <tr>
              <th scope="row">Milestones</th>
              <td>
                When she was born, her age, total meals eaten, and the exact path
                to her state file.
              </td>
            </tr>
            <tr>
              <th scope="row">Settings</th>
              <td>
                Sprite scale from 2× to 10× (80 px to 400 px tall) and an{" "}
                <strong>Enable Chiptune Voice</strong> checkbox.
              </td>
            </tr>
            <tr>
              <th scope="row">Inspector</th>
              <td>
                Live state, position, velocity, active expression, facing
                direction and particle count. Read-only; useful when something
                looks wrong.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="prose">
        <h2 id="scale">Changing her size</h2>
        <p>
          Open the dashboard&rsquo;s <strong>Settings</strong> tab and move the
          sprite scale slider. The range is 2× (80 px tall) to 10× (400 px tall);
          the default is 5× (200 px tall). The change is immediate — she resizes
          in place, and the label beside the slider shows the current pixel
          height.
        </p>
        <p>
          If you lose her after enlarging the window near a screen edge, shrink
          her back to 2× and she will fit inside the work area again.
        </p>

        <h2 id="sound">Sound</h2>
        <p>
          Her voice is a small chiptune synth, not a recorded sound. The{" "}
          <strong>Enable Chiptune Voice</strong> checkbox in Settings turns it
          off and on. If there is no working output device, the app simply stays
          silent rather than reporting an error.
        </p>
      </div>

      <div className={`${styles.callout} ${styles.tip}`}>
        <span className={styles.calloutIcon} aria-hidden>
          ✓
        </span>
        <div className={styles.calloutBody}>
          <p className={styles.calloutTitle}>The fastest way to a happy pet</p>
          <p className={styles.calloutText}>
            Double-click her twice: the first opens the happy reaction, the
            second repeats it. Each one adds 8 joy, which is usually enough to
            pull her out of a sulk. Feeding fixes fullness; sleep fixes energy.
          </p>
        </div>
      </div>

      <div className={styles.nextPrev}>
        <Link href="/docs/installation" className={styles.nextLink}>
          <span className={styles.nextLabel}>← Previous · 01</span>
          <span className={styles.nextTitle}>Installation</span>
        </Link>
        <Link
          href="/docs/troubleshooting"
          className={styles.nextLink}
          data-align="right"
        >
          <span className={styles.nextLabel}>Next · 03</span>
          <span className={styles.nextTitle}>Troubleshooting →</span>
        </Link>
      </div>
    </>
  );
}
