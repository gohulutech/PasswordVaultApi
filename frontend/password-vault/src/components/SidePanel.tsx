import { useEffect, useState } from "react";
import type { PasswordEntryPreview } from "../models/PasswordEntryPreview";
import { getPasswordEntries } from "../services/password-entry-service";

interface ISidePanelProps {
  onPasswordEntryClick: (id: number) => void;
}

export default function SidePanel({ onPasswordEntryClick }: ISidePanelProps) {
  const [passwordEntries, setPasswordEntries] = useState<
    PasswordEntryPreview[]
  >([]);

  useEffect(() => {
    getPasswordEntries()
      .then((passwordEntries) => {
        if (passwordEntries) setPasswordEntries(passwordEntries);
      })
      .catch(() => console.error("Could not load password entries"));
  }, []);

  return (
    <div>
      {passwordEntries.map((passwordEntry) => (
        <div key={passwordEntry.id}>
          <button onClick={() => onPasswordEntryClick(passwordEntry.id)}>
            {passwordEntry.name}
          </button>
        </div>
      ))}
    </div>
  );
}
