import styles from "./Faq.module.css";

export type FaqItem = {
  q: string;
  a: string;
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: "Is Thea really free?",
    a: "Yes. The installer is free, there is no account, no advertising, and no paid tier. She works entirely offline.",
  },
  {
    q: "Does she need an internet connection?",
    a: "No. The app never makes a network request. The only network activity involved is downloading the installer in the first place.",
  },
  {
    q: "Will she start with Windows?",
    a: "No. There is deliberately no start-with-Windows entry. You launch her from the Start Menu when you want her, and quit her from the tray when you do not.",
  },
  {
    q: "Why does Windows warn me about the installer?",
    a: "This build is not code-signed yet, so SmartScreen may say “Windows protected your PC”. Choose More info, then Run anyway. You can verify the SHA-256 checksum first — the installation guide shows how.",
  },
  {
    q: "Which monitors does she use?",
    a: "One: the primary display, for now. She stays inside that monitor's work area and does not follow windows between screens.",
  },
  {
    q: "How do I uninstall her?",
    a: "Quit her from the tray, then open Settings → Apps → Installed apps → Thea → Uninstall. Her settings are left behind in %APPDATA%\\Thea; delete that folder if you want her to forget everything.",
  },
  {
    q: "Is there a Mac or Linux version?",
    a: "No. Thea is Windows 10 and 11 only. The transparent overlay, click-through hit testing and global Space hook are built on Windows APIs.",
  },
  {
    q: "Does she collect anything?",
    a: "No accounts, no analytics, no telemetry, no cookies. Her three mood numbers live in a single JSON file on your PC.",
  },
  {
    q: "Can I make her bigger?",
    a: "Yes. Right-click her, choose Dashboard / Numbers, then open the Settings tab. The sprite scale runs from 2× (80 px tall) to 10× (400 px tall); the default is 5× (200 px tall).",
  },
  {
    q: "What happens if I open her twice?",
    a: "A named Windows mutex keeps her single. A second launch quietly exits — look for her in the notification area rather than on the taskbar.",
  },
];

type Props = {
  items?: readonly FaqItem[];
  className?: string;
};

export default function Faq({ items = FAQ_ITEMS, className }: Props) {
  return (
    <div className={[styles.list, className].filter(Boolean).join(" ")}>
      {items.map((item) => (
        <details key={item.q} className={styles.item}>
          <summary className={styles.question}>
            <span>{item.q}</span>
            <span className={styles.mark} aria-hidden>
              <i />
              <i />
            </span>
          </summary>
          <p className={styles.answer}>{item.a}</p>
        </details>
      ))}
    </div>
  );
}
