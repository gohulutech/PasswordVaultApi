import { useEffect, useState } from "react";
import "./App.css";
import SidePanel from "./components/SidePanel";
import type { PasswordEntryDetail } from "./models/PasswordEntryDetail";
import {
  getPasswordEntries,
  getPasswordEntry,
} from "./services/password-entry-service";
import { Box } from "@mui/material";
import { PasswordEntryForm } from "./components/PasswordEntryForm/PasswordEntryForm";
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

  const handlePasswordEntrySaved = async (
    newPasswordEntry: PasswordEntryDetail,
  ) => {
    setIsCreate(false);
    const passwordEntries = await getPasswordEntries();
    if (passwordEntries) setPasswordEntries(passwordEntries);
    setSelectedPasswordEntry(newPasswordEntry);
  };

  const handleOnCreate = () => {
    setSelectedPasswordEntry(undefined);
    setIsCreate(true);
  };

  const getDefaultValues = () => {
    if (!selectedPasswordEntry) return null;
    const { encryptedPassword, ...entry } = selectedPasswordEntry;
    return { ...entry, password: encryptedPassword };
  };
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <SidePanel
        onPasswordEntryClick={handlePasswordEntryClick}
        onCreatePasswordEntry={() => handleOnCreate()}
        passwordEntries={passwordEntries}
        selectedEntryId={selectedPasswordEntry?.id}
      />
      <Box sx={{ flexGrow: 1 }}>
        {(isCreate || selectedPasswordEntry) && (
          <PasswordEntryForm
            key={selectedPasswordEntry?.id}
            onPasswordEntrySaved={handlePasswordEntrySaved}
            defaultValues={getDefaultValues() ?? undefined}
          />
        )}
      </Box>
    </Box>
  );
}

export default App;
