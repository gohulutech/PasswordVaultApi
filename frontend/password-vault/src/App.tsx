import { useState } from "react";
import "./App.css";
import Detail from "./components/Detail";
import SidePanel from "./components/SidePanel";
import type { PasswordEntryDetail } from "./models/PasswordEntryDetail";
import { getPasswordEntry } from "./services/password-entry-service";

function App() {
  const [selectedPasswordEntry, setSelectedPasswordEntry] = useState<
    PasswordEntryDetail | undefined
  >(undefined);

  const handlePasswordEntryClick = async (id: number) => {
    if (!id) return;
    const passwordEntry = await getPasswordEntry(id);
    if (!passwordEntry) return;
    setSelectedPasswordEntry(passwordEntry);
  };

  return (
    <div>
      <SidePanel onPasswordEntryClick={handlePasswordEntryClick} />
      {selectedPasswordEntry && (
        <Detail selectedPasswordEntry={selectedPasswordEntry} />
      )}
    </div>
  );
}

export default App;
