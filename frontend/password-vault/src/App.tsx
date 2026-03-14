import { useEffect, useState } from "react";
import "./App.css";
import Detail from "./components/Detail";
import SidePanel from "./components/SidePanel";
import type { PasswordEntryDetail } from "./models/PasswordEntryDetail";
import {
  getPasswordEntries,
  getPasswordEntry,
} from "./services/password-entry-service";
import { Box } from "@mui/material";
import { PasswordEntryCreateForm } from "./components/PasswordEntryCreateForm/PasswordEntryCreateForm";
import type { PasswordEntryPreview } from "./models/PasswordEntryPreview";

function App() {
  const [selectedPasswordEntry, setSelectedPasswordEntry] = useState<
    PasswordEntryDetail | undefined
  >(undefined);
  const [isCreate, setIsCreate] = useState<boolean>(false);
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

  const handlePasswordEntryClick = async (id: number) => {
    if (!id) return;
    const passwordEntry = await getPasswordEntry(id);
    if (!passwordEntry) return;
    setIsCreate(false);
    setSelectedPasswordEntry(passwordEntry);
  };

  const handlePasswordEntryCreated = async (
    newPasswordEntry: PasswordEntryDetail,
  ) => {
    setIsCreate(false);
    const passwordEntries = await getPasswordEntries();
    if (passwordEntries) setPasswordEntries(passwordEntries);
    setSelectedPasswordEntry(newPasswordEntry);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <SidePanel
        onPasswordEntryClick={handlePasswordEntryClick}
        onCreatePasswordEntry={() => setIsCreate(true)}
        passwordEntries={passwordEntries}
      />
      <Box sx={{ flexGrow: 1 }}>
        {selectedPasswordEntry && !isCreate && (
          <Detail selectedPasswordEntry={selectedPasswordEntry} />
        )}
        {isCreate && (
          <PasswordEntryCreateForm
            onPasswordEntryCreated={handlePasswordEntryCreated}
          />
        )}
      </Box>
    </Box>
  );
}

export default App;
