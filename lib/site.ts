export const site = {
  name: "Thea",
  fullName: "Thea — Your Digital Companion",
  tagline: "Your Digital Companion",
  description:
    "Thea is a tiny, black-and-white pixel companion for Windows. She blinks, naps, follows your cursor and gets a little hungry. Free, offline, and entirely yours.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  version: "0.1.0",
  releaseDate: "2026-11-13",
  releaseLabel: "13 November 2026",
  requirements: "Windows 10 or 11 · 64-bit",
  githubUrl: "https://github.com/AdhiNarayan206/Thea---Your-Digital-Companion",
  download: {
    filename: "Thea-Setup-0.1.0.exe",
    // Points directly to the latest GitHub release installer, with fallback to local download
    href: "https://github.com/AdhiNarayan206/Thea---Your-Digital-Companion/releases/latest/download/Thea-Setup-0.1.0.exe",
    fallbackHref: "/downloads/Thea-Setup-0.1.0.exe",
    latestReleaseUrl: "https://github.com/AdhiNarayan206/Thea---Your-Digital-Companion/releases/latest",
    sizeBytes: 46_844_668,
    sizeLabel: "44.7 MB",
    sha256: "978C963C75EC3894428212EF583E02D07AB41413A92868E929D3508A3C0AF9FE",
    installedLabel: "≈ 165 MB installed",
  },
  chapters: [
    { id: "meet", index: "01", label: "Meet" },
    { id: "faces", index: "02", label: "Faces" },
    { id: "behaviour", index: "03", label: "Behaviour" },
    { id: "controls", index: "04", label: "Controls" },
    { id: "privacy", index: "05", label: "Privacy" },
    { id: "download", index: "06", label: "Download" },
  ],
  docs: [
    { href: "/docs", label: "Handbook" },
    { href: "/docs/installation", label: "Installation" },
    { href: "/docs/controls", label: "Controls" },
    { href: "/docs/troubleshooting", label: "Troubleshooting" },
    { href: "/docs/faq", label: "FAQ" },
    { href: "/docs/changelog", label: "Changelog" },
  ],
} as const;

export type Chapter = (typeof site.chapters)[number];
export type DocLink = (typeof site.docs)[number];
