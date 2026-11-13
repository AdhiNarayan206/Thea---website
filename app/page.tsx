import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CopyHash from "@/components/CopyHash";
import Faq, { FAQ_ITEMS } from "@/components/Faq";
import Footer from "@/components/Footer";
import HeroPet from "@/components/HeroPet";
import SiteHeader from "@/components/SiteHeader";
import { site } from "@/lib/site";
import styles from "./page.module.css";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const faces = [
  {
    name: "Neutral",
    file: "neutral",
    no: "01",
    caption: "Her resting face. A flat little line of a mouth.",
  },
  {
    name: "Happy",
    file: "happy",
    no: "02",
    caption: "Double-click her. Closed eyes, a grin, dithered blush.",
  },
  {
    name: "Sad",
    file: "sad",
    no: "03",
    caption: "Fullness below 25. A tear, a crumb, a frown.",
  },
  {
    name: "Surprised",
    file: "surprised",
    no: "04",
    caption: "Picked up, or woken from a nap. Wide eyes, small mouth.",
  },
  {
    name: "Angry",
    file: "angry",
    no: "05",
    caption: "Held for more than four seconds. Steam and a scowl.",
  },
  {
    name: "Eating",
    file: "eating",
    no: "06",
    caption: "Dropped on the shelf, or fed from her menu.",
  },
  {
    name: "Singing",
    file: "sing",
    no: "07",
    caption: "A chiptune song, a moving mouth, a few floating notes.",
  },
  {
    name: "Sleeping",
    file: "sleep",
    no: "08",
    caption: "Left alone and low on energy. Z's drift upward.",
  },
];

const moods = [
  {
    name: "Delight",
    file: "delight",
    tag: "Joy ↑",
    body: "Double-click her, play with her, or put a meal on the shelf. Hearts rise, she bobs, and her joy climbs. Above 88, the dashboard calls her delighted.",
  },
  {
    name: "Hunger",
    file: "hungry",
    tag: "Fullness ↓",
    body: "Fullness drains at roughly 3.3 points a minute. Under 25 her face falls. Drag her to the top of the screen — or choose Feed Thea — to put 34 points back.",
  },
  {
    name: "Sleep",
    file: "sleepy",
    tag: "Energy ↑",
    body: "Left alone long enough, and low on energy, she naps. Sleep restores energy, slows hunger, and stops the chiptune. A click wakes her with a start.",
  },
  {
    name: "Cross",
    file: "cross",
    tag: "4 seconds",
    body: "Hold her in the air for more than four seconds and she stops enjoying it. Steam, a scowl, and a short temper when you finally set her down.",
  },
];

const gestures = [
  {
    keys: ["Move"],
    title: "Her eyes follow you",
    body: "Even when she is not focused. She only turns her whole body when you move far away.",
  },
  {
    keys: ["Click"],
    title: "One small hop",
    body: "A squash on the way down, a puff of dust at her feet.",
  },
  {
    keys: ["2× click"],
    title: "Happy",
    body: "Hearts, a bounce, and eight points of joy. The fastest way to cheer her up.",
  },
  {
    keys: ["Drag"],
    title: "Pick her up",
    body: "She looks surprised, and her arms swing while you carry her. Throw her if you like.",
  },
  {
    keys: ["Drop high"],
    title: "Feed her",
    body: "Let go in the top 16% of the work area. A bowl appears; fullness goes up by 34.",
  },
  {
    keys: ["Hold 4s"],
    title: "She gets cross",
    body: "Four seconds is a long time to be held in the air. She will let you know.",
  },
  {
    keys: ["Space"],
    title: "Run to the cursor",
    body: "A global hook, active while your pointer is over her — and while a non-elevated window has focus.",
  },
  {
    keys: ["Right-click"],
    title: "The menu",
    body: "Feed, sing, play, numbers, sleep, quit. Her vitals sit in the header.",
  },
];

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: site.name,
    alternateName: site.fullName,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Windows 10, Windows 11",
    softwareVersion: site.version,
    description: site.description,
    downloadUrl: `${site.url}${site.download.href}`,
    installUrl: `${site.url}/docs/installation`,
    fileSize: `${site.download.sizeBytes} B`,
    datePublished: site.releaseDate,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    publisher: {
      "@type": "Organization",
      name: site.fullName,
    },
    featureList: [
      "Live pixel pet on the Windows desktop",
      "Eight hand-built expressions",
      "Cursor tracking, hopping, dragging and feeding",
      "Offline, no account, no telemetry",
      "Per-user installer with uninstaller",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <SiteHeader />

      <main id="main" className={styles.page}>
        {/* Hero ------------------------------------------------------------ */}
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={`container ${styles.heroGrid}`}>
            <div className={styles.heroCopy}>
              <p className="eyebrow">
                <span className="dot" aria-hidden />
                Thea · a pixel companion for Windows
              </p>
              <h1 id="hero-title" className={`display ${styles.heroTitle}`}>
                <span className={styles.heroLine}>A small life</span>
                <span className={styles.heroLine}>
                  <em>on your desktop.</em>
                </span>
              </h1>
              <p className={`lede ${styles.heroLede}`}>
                She blinks, naps, follows your cursor and gets a little hungry.
                Thea is a 40 × 40 pixel companion who lives quietly on top of
                your work — no feed, no account, no cloud.
              </p>

              <div className={styles.heroCtas}>
                <a
                  href={site.download.href}
                  download
                  className="btn btn-primary"
                >
                  Download for Windows
                  <span className="arrow" aria-hidden>
                    ↓
                  </span>
                  <small>{site.download.sizeLabel}</small>
                </a>
                <Link href="/docs" className="btn btn-ghost">
                  Read the handbook
                  <span aria-hidden>→</span>
                </Link>
              </div>

              <ul className={styles.heroMeta}>
                <li>Windows 10 / 11</li>
                <li>64-bit</li>
                <li>Version {site.version}</li>
                <li>Free</li>
              </ul>

              <p className={styles.heroNote}>
                An installer, not a loose .exe — per-user, no admin rights, and
                a real uninstaller.
              </p>
            </div>

            <div className={styles.heroRight}>
              <span className={styles.glow} aria-hidden />
              <HeroPet />
            </div>
          </div>

          <div className={`container ${styles.specRail}`} aria-label="At a glance">
            <div className={styles.spec}>
              <span className={styles.specValue}>40 × 40</span>
              <span className={styles.specLabel}>pixel grid, drawn live</span>
            </div>
            <div className={styles.spec}>
              <span className={styles.specValue}>8</span>
              <span className={styles.specLabel}>expressions, one body</span>
            </div>
            <div className={styles.spec}>
              <span className={styles.specValue}>0</span>
              <span className={styles.specLabel}>accounts or trackers</span>
            </div>
            <div className={styles.spec}>
              <span className={styles.specValue}>{site.download.sizeLabel}</span>
              <span className={styles.specLabel}>installer, 64-bit</span>
            </div>
          </div>
        </section>

        {/* 01 — Meet ------------------------------------------------------ */}
        <section
          id="meet"
          data-chapter="01"
          className="section"
          aria-labelledby="meet-title"
        >
          <div className="container">
            <div className="chapter-head">
              <span className="no">01</span>
              <span className="label">Meet</span>
              <span className="rule" />
              <span className="mono">Specimen 001</span>
            </div>

            <div className={styles.meetGrid}>
              <div className={styles.specimen}>
                <figure className={styles.specimenCard}>
                  <span className={styles.plate}>Plate 001</span>
                  <span className={styles.plateMeta}>40 × 40 px</span>
                  <span className={`${styles.corner} ${styles.cornerTl}`} />
                  <span className={`${styles.corner} ${styles.cornerTr}`} />
                  <span className={`${styles.corner} ${styles.cornerBl}`} />
                  <span className={`${styles.corner} ${styles.cornerBr}`} />
                  <Image
                    src="/art/thea-320.png"
                    alt="Thea, a round black-and-white pixel creature with a two-leaf sprout, standing in her neutral expression."
                    width={320}
                    height={320}
                    unoptimized
                    className={styles.specimenArt}
                  />
                  <figcaption className={styles.specimenFoot}>
                    <span>neutral</span>
                    <span>5× scale · 200 px</span>
                  </figcaption>
                </figure>

                <div className={styles.swatches} aria-label="The four-value palette">
                  {[
                    ["Ink", "#000000", "#000000"],
                    ["Paper", "#ffffff", "#ffffff"],
                    ["Shade", "#b9b9b9", "#b9b9b9"],
                    ["Deep", "#696969", "#696969"],
                  ].map(([name, hex, chip]) => (
                    <div key={name} className={styles.swatch}>
                      <span
                        className={styles.swatchChip}
                        style={{ background: chip }}
                      />
                      <span className={styles.swatchName}>{name}</span>
                      <span className={styles.swatchHex}>{hex}</span>
                    </div>
                  ))}
                </div>

                <p className={styles.caption}>
                  Rendered from the same procedural rig the desktop app runs.
                  No sprite sheets, no upscaled photography.
                </p>
              </div>

              <div className={styles.copyCol}>
                <h2 id="meet-title" className="h2">
                  A whole character
                  <br />
                  <em>in 1,600 pixels.</em>
                </h2>
                <p className={`lede ${styles.copyLede}`}>
                  Thea is not a picture pasted onto your screen. She is a small
                  piece of software that draws herself, forty pixels by forty
                  pixels, sixty times a second.
                </p>
                <p className={styles.copyPara}>
                  Her body is a set of ellipses and a one-pixel outline. Her
                  face lives inside a twelve-by-eight rectangle. Her moods are
                  numbers that drift, not animations that loop. The result is
                  something that feels less like a widget and more like a
                  creature who happens to be there.
                </p>
                <p className={styles.copyPara}>
                  Four values do all the work: ink, paper, and two grays. Where
                  she needs to look lighter or darker, she dithers — the same
                  checkerboard a 1-bit illustration would use. Nothing on her
                  body is ever coloured in.
                </p>

                <div className={styles.principles}>
                  <article className={styles.principle}>
                    <span className={styles.principleNo}>01</span>
                    <div>
                      <h3 className={styles.principleTitle}>
                        Four values, no colour
                      </h3>
                      <p className={styles.principleText}>
                        Lighter and darker are patterns, not new palette
                        entries. Her blush is a checkerboard; so is her shadow.
                      </p>
                    </div>
                  </article>
                  <article className={styles.principle}>
                    <span className={styles.principleNo}>02</span>
                    <div>
                      <h3 className={styles.principleTitle}>
                        The body never changes
                      </h3>
                      <p className={styles.principleText}>
                        Emotion belongs to the face and to indicators outside
                        the silhouette. Her sprout, hands and feet are identical
                        in every expression.
                      </p>
                    </div>
                  </article>
                  <article className={styles.principle}>
                    <span className={styles.principleNo}>03</span>
                    <div>
                      <h3 className={styles.principleTitle}>
                        Every frame is generated
                      </h3>
                      <p className={styles.principleText}>
                        Crisp at 2× or 10×, on any display. Nothing is resampled
                        because there is nothing to resample.
                      </p>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 02 — Faces ----------------------------------------------------- */}
        <section
          id="faces"
          data-chapter="02"
          className="section"
          aria-labelledby="faces-title"
        >
          <div className="container">
            <div className="chapter-head">
              <span className="no">02</span>
              <span className="label">Faces</span>
              <span className="rule" />
              <span className="mono">Eight expressions</span>
            </div>

            <h2 id="faces-title" className="h2">
              Eight faces. <em>One body.</em>
            </h2>
            <p className={`lede ${styles.copyLede}`}>
              Everything she feels is painted inside the same tiny face
              rectangle. Nothing about her shape moves to show it — which is
              precisely why she always looks like herself.
            </p>

            <div className={styles.facesGrid} style={{ marginTop: "42px" }}>
              {faces.map((face) => (
                <figure key={face.file} className={styles.faceCard}>
                  <div className={styles.faceArt}>
                    <Image
                      src={`/art/faces/${face.file}.png`}
                      alt={`Thea's ${face.name.toLowerCase()} expression. ${face.caption}`}
                      width={400}
                      height={400}
                      unoptimized
                      sizes="(max-width: 980px) 45vw, 22vw"
                    />
                  </div>
                  <figcaption>
                    <div className={styles.faceName}>
                      <span>{face.name}</span>
                      <span className={styles.faceNo}>{face.no}</span>
                    </div>
                    <p className={styles.faceCaption}>{face.caption}</p>
                  </figcaption>
                </figure>
              ))}
            </div>

            <p className={styles.facesNote}>
              Eating and singing are transient faces, not moods. Her silhouette
              — sprout, body, hands and feet — is identical in all eight.
            </p>
          </div>
        </section>

        {/* 03 — Behaviour ------------------------------------------------- */}
        <section
          id="behaviour"
          data-chapter="03"
          className="section"
          aria-labelledby="behaviour-title"
        >
          <div className="container">
            <div className="chapter-head">
              <span className="no">03</span>
              <span className="label">Behaviour</span>
              <span className="rule" />
              <span className="mono">Field notes</span>
            </div>

            <div className={styles.behaviourGrid}>
              <div className={styles.behaviourSticky}>
                <h2 id="behaviour-title" className="h2">
                  A day in <em>her life.</em>
                </h2>
                <p className={`lede ${styles.copyLede}`}>
                  She is not a screensaver. Fullness, joy and energy drift all
                  day; what you do changes where they land.
                </p>

                <dl className={styles.specTable}>
                  <div className={styles.specRow}>
                    <dt>Run speed</dt>
                    <dd>270 px / s</dd>
                  </div>
                  <div className={styles.specRow}>
                    <dt>Gravity</dt>
                    <dd>1,500 px / s²</dd>
                  </div>
                  <div className={styles.specRow}>
                    <dt>Blink</dt>
                    <dd>every 2.4 – 5.8 s</dd>
                  </div>
                  <div className={styles.specRow}>
                    <dt>Naps</dt>
                    <dd>after 150 s idle, energy low</dd>
                  </div>
                  <div className={styles.specRow}>
                    <dt>State saved</dt>
                    <dd>every 10 s</dd>
                  </div>
                  <div className={styles.specRow}>
                    <dt>Time to anger</dt>
                    <dd>4 s in your hand</dd>
                  </div>
                </dl>
              </div>

              <div>
                <div className={styles.moodList}>
                  {moods.map((mood) => (
                    <article key={mood.name} className={styles.moodCard}>
                      <div className={styles.moodArt}>
                        <Image
                          src={`/art/moods/${mood.file}.png`}
                          alt={`Thea looking ${mood.name.toLowerCase()}, with her emotion indicators around her.`}
                          width={480}
                          height={480}
                          unoptimized
                          sizes="(max-width: 560px) 88px, (max-width: 1100px) 156px, 156px"
                        />
                      </div>
                      <div className={styles.moodBody}>
                        <span className={styles.moodTag}>{mood.tag}</span>
                        <h3>{mood.name}</h3>
                        <p>{mood.body}</p>
                      </div>
                    </article>
                  ))}
                </div>

                <div className={styles.vitals}>
                  <div className={styles.vitalsHead}>
                    <h3>Her numbers, on a fresh install</h3>
                    <span>No stats on her face</span>
                  </div>
                  <div className={styles.meters}>
                    {[
                      ["Fullness", 82],
                      ["Joy", 74],
                      ["Energy", 88],
                    ].map(([label, value]) => (
                      <div key={label} className={styles.meter}>
                        <div className={styles.meterTop}>
                          <span>{label}</span>
                          <span className={styles.meterValue}>{value}</span>
                        </div>
                        <div
                          className={styles.meterBar}
                          role="img"
                          aria-label={`${label}: ${value} out of 100`}
                        >
                          <div
                            className={styles.meterFill}
                            style={{ width: `${value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className={styles.vitalsNote}>
                    Dashboard / Numbers shows the same three meters, plus a
                    meal count, a birthday and a state inspector. Open it from
                    her right-click menu.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 04 — Controls -------------------------------------------------- */}
        <section
          id="controls"
          data-chapter="04"
          className="section"
          aria-labelledby="controls-title"
        >
          <div className="container">
            <div className="chapter-head">
              <span className="no">04</span>
              <span className="label">Controls</span>
              <span className="rule" />
              <span className="mono">Small gestures</span>
            </div>

            <div className={styles.controlsGrid}>
              <div>
                <h2 id="controls-title" className="h2">
                  Small gestures.
                  <br />
                  <em>Big feelings.</em>
                </h2>
                <p className={`lede ${styles.copyLede}`}>
                  There is no window to open and no mode to switch. You interact
                  with her the way you would with a cat on a desk.
                </p>

                <div className={styles.gestureList} style={{ marginTop: "36px" }}>
                  {gestures.map((gesture) => (
                    <div key={gesture.title} className={styles.gesture}>
                      <div className={styles.gestureKeys}>
                        {gesture.keys.map((key) => (
                          <span key={key} className={styles.key}>
                            {key}
                          </span>
                        ))}
                      </div>
                      <div className={styles.gestureBody}>
                        <strong>{gesture.title}</strong>
                        <p>{gesture.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.menuWrap}>
                <div className={styles.menuCard} aria-hidden>
                  <div className={styles.menuHeader}>
                    <span>Thea</span>
                    <span>happy · food 82 · joy 74</span>
                  </div>
                  <div className={styles.menuRow}>
                    <span>Feed Thea</span>
                    <span>+34</span>
                  </div>
                  <div className={styles.menuRow}>
                    <span>Sing a song</span>
                    <span>♪</span>
                  </div>
                  <div className={styles.menuRow}>
                    <span>Play</span>
                    <span>+8</span>
                  </div>
                  <div className={`${styles.menuRow} ${styles.menuHot}`}>
                    <span>Dashboard / Numbers</span>
                    <span>→</span>
                  </div>
                  <div className={styles.menuRow}>
                    <span>Go to sleep</span>
                    <span>z</span>
                  </div>
                  <div className={styles.menuSep} />
                  <div className={`${styles.menuRow} ${styles.menuMuted}`}>
                    <span>Quit</span>
                    <span>×</span>
                  </div>
                </div>
                <p className={styles.menuCaption}>
                  Right-click her. The header is her vitals.
                </p>
                <p className={styles.controlsNote}>
                  The tray icon opens a shorter menu: Feed, Sing, Play, Sleep /
                  wake, Quit. She has no taskbar button, so the notification
                  area is where to find her.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 05 — Privacy --------------------------------------------------- */}
        <section
          id="privacy"
          data-chapter="05"
          className={`${styles.privacy} on-paper`}
          aria-labelledby="privacy-title"
        >
          <div className="container">
            <div className="chapter-head">
              <span className="no">05</span>
              <span className="label">Privacy</span>
              <span className="rule" />
              <span className="mono">Local by construction</span>
            </div>

            <h2 id="privacy-title" className={`h2 ${styles.privacyTitle}`}>
              She lives on your machine.
              <br />
              <em>Nothing else.</em>
            </h2>
            <p className={`lede ${styles.privacyLede}`}>
              No account. No network calls. No analytics, no cookies, no update
              pings. Thea is a desktop pet, not a service that happens to have a
              pet in it.
            </p>

            <div className={styles.privacyGrid}>
              <div className={styles.privacyCard}>
                <span className={styles.privacyNo}>01</span>
                <h3>No account</h3>
                <p>
                  There is nothing to sign up for. She knows you by proximity,
                  not by email address. Install her and she is yours.
                </p>
              </div>
              <div className={styles.privacyCard}>
                <span className={styles.privacyNo}>02</span>
                <h3>No network</h3>
                <p>
                  The app makes no requests at all. No telemetry, no analytics,
                  no advertising, no silent update check. Pull the cable out;
                  she behaves exactly the same.
                </p>
              </div>
              <div className={styles.privacyCard}>
                <span className={styles.privacyNo}>03</span>
                <h3>One small file</h3>
                <p>
                  Her moods are saved every ten seconds to a JSON file you can
                  open, read, edit or delete. That file is the entire record of
                  your time together.
                </p>
              </div>
            </div>

            <div className={styles.stateCard}>
              <div>
                <span className={styles.stateMeta}>
                  The only file she writes
                </span>
                <code className={styles.statePath}>
                  %APPDATA%\Thea\state.json
                </code>
              </div>
              <p className={styles.stateNote}>
                Fullness, joy, energy, meals eaten and the day she was born.
                Delete the folder and she forgets you completely.
              </p>
            </div>
          </div>
        </section>

        {/* 06 — Download -------------------------------------------------- */}
        <section
          id="download"
          data-chapter="06"
          className="section"
          aria-labelledby="download-title"
        >
          <div className="container">
            <div className="chapter-head">
              <span className="no">06</span>
              <span className="label">Download</span>
              <span className="rule" />
              <span className="mono">Windows 10 / 11 · 64-bit</span>
            </div>

            <div className={styles.downloadCard}>
              <span className={styles.watermark} aria-hidden>
                {site.version}
              </span>

              <div className={styles.downloadCopy}>
                <h2 id="download-title" className="h2">
                  Take her <em>home.</em>
                </h2>
                <p className="lede">
                  One installer. About the size of a photo album, and she
                  unpacks into less space than most games save files.
                </p>

                <div className={styles.downloadActions}>
                  <a
                    href={site.download.href}
                    download
                    className="btn btn-primary"
                  >
                    Download installer
                    <span className="arrow" aria-hidden>
                      ↓
                    </span>
                    <small>{site.download.sizeLabel}</small>
                  </a>
                  <Link href="/docs/installation" className="btn btn-ghost">
                    Installation guide
                    <span aria-hidden>→</span>
                  </Link>
                  <a
                    href={site.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost"
                  >
                    ★ Star on GitHub
                    <span aria-hidden>↗</span>
                  </a>
                </div>

                <dl className={styles.fileFacts}>
                  <div className={styles.fileFact}>
                    <dt>File</dt>
                    <dd className={styles.fileName}>
                      {site.download.filename}
                    </dd>
                  </div>
                  <div className={styles.fileFact}>
                    <dt>Size</dt>
                    <dd>
                      {site.download.sizeBytes.toLocaleString("en-GB")} bytes
                    </dd>
                  </div>
                  <div className={styles.fileFact}>
                    <dt>Version</dt>
                    <dd>
                      {site.version} · {site.releaseLabel}
                    </dd>
                  </div>
                  <div className={styles.fileFact}>
                    <dt>Installs</dt>
                    <dd>{site.download.installedLabel}</dd>
                  </div>
                  <div
                    className={`${styles.fileFact} ${styles.fileFactWide}`}
                  >
                    <dt>SHA-256</dt>
                    <dd>
                      <CopyHash value={site.download.sha256} />
                    </dd>
                  </div>
                </dl>
              </div>

              <aside className={styles.reqCard} aria-label="What the installer does">
                <div className={styles.reqHead}>
                  <span>Setup</span>
                  <span>{site.download.sizeLabel}</span>
                </div>
                <h3 className={styles.reqTitle}>Windows 10 or 11</h3>
                <p className={styles.reqSub}>64-bit · no administrator rights</p>
                <ul className={styles.reqList}>
                  <li>Per-user install, {site.download.installedLabel}</li>
                  <li>Start Menu shortcut, always</li>
                  <li>Optional desktop shortcut</li>
                  <li>Optional “Launch Thea” at the end</li>
                  <li>Standard Apps &amp; features uninstaller</li>
                </ul>
                <div className={styles.reqFoot}>
                  <span>Installs to</span>
                  <code>%LOCALAPPDATA%\Programs\Thea</code>
                </div>
                <div className={styles.reqFoot}>
                  <span>Startup entry</span>
                  <code>none, by design</code>
                </div>
              </aside>
            </div>

            <div className={styles.warning}>
              <span className={styles.warningIcon} aria-hidden>
                !
              </span>
              <div>
                <strong>Windows may warn you once.</strong>
                <p>
                  This build is unsigned, so SmartScreen can say “Windows
                  protected your PC”. If you downloaded the file here, choose{" "}
                  <em>More info → Run anyway</em>. Verify the SHA-256 checksum
                  above if you want certainty.{" "}
                  <Link href="/docs/troubleshooting">
                    Why this happens and what to do
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Questions ------------------------------------------------------ */}
        <section className="section" aria-labelledby="faq-title">
          <div className={`container ${styles.faqWrap}`}>
            <div className={styles.faqIntro}>
              <p className="eyebrow">
                <span className="dot" aria-hidden />
                Questions
              </p>
              <h2 id="faq-title" className="h2">
                The short <em>answers.</em>
              </h2>
              <p className="lede">
                The things people ask before letting a small creature onto
                their desktop.
              </p>
              <Link href="/docs/faq" className="text-link">
                All questions
                <span aria-hidden>→</span>
              </Link>
            </div>

            <Faq items={FAQ_ITEMS.slice(0, 6)} />
          </div>
        </section>

        {/* Closing -------------------------------------------------------- */}
        <section className={styles.closing} aria-labelledby="closing-title">
          <div className={`container ${styles.closingInner}`}>
            <span className={styles.closingBadge} aria-hidden>
              <Image
                src="/art/thea-320.png"
                alt=""
                width={320}
                height={320}
                unoptimized
              />
            </span>
            <h2 id="closing-title" className={`display ${styles.closingTitle}`}>
              She’ll be <em>here.</em>
            </h2>
            <p className={styles.closingText}>
              Small, quiet, and glad you came by. Download her for Windows, or
              read the handbook first and make sure you two get along.
            </p>
            <div className={styles.closingCtas}>
              <a
                href={site.download.href}
                download
                className="btn btn-primary"
              >
                Download Thea
                <span className="arrow" aria-hidden>
                  ↓
                </span>
                <small>{site.download.sizeLabel}</small>
              </a>
              <Link href="/docs" className="text-link">
                Read the handbook
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
