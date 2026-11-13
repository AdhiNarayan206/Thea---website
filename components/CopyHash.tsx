"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./CopyHash.module.css";

type Props = {
  value: string;
};

export default function CopyHash({ value }: Props) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);

  useEffect(() => {
    return () => window.clearTimeout(timer.current);
  }, []);

  const copy = async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(value);
      ok = true;
    } catch {
      const field = document.createElement("textarea");
      field.value = value;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      try {
        ok = document.execCommand("copy");
      } catch {
        ok = false;
      }
      document.body.removeChild(field);
    }

    if (!ok) return;
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className={styles.wrap}>
      <code className={styles.hash}>{value}</code>
      <button
        type="button"
        onClick={copy}
        className={styles.button}
        aria-label="Copy the SHA-256 checksum"
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Checksum copied to the clipboard." : ""}
      </span>
    </div>
  );
}
