import { useEffect, useState } from "react";
import type { PasswordEntryPreview } from "../models/PasswordEntryPreview";
import { getPasswordEntries } from "../services/password-entry-service";

export default function SidePanel() {
  const [passwordEntries, setPasswordEntries] = useState<
    PasswordEntryPreview[]
  >([]);

  console.log("passwordentries", passwordEntries);

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
        <div>{passwordEntry.name}</div>
      ))}
    </div>
  );
}
