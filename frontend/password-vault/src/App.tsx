import { useState } from "react";
import "./App.css";
import Detail from "./components/Detail";
import SidePanel from "./components/SidePanel";
import type { PasswordEntryDetail } from "./models/PasswordEntryDetail";
import { getPasswordEntry } from "./services/password-entry-service";
import { Box } from "@mui/material";
import { PasswordEntryCreateForm } from "./components/PasswordEntryCreateForm/PasswordEntryCreateForm";

function App() {
  const [selectedPasswordEntry, setSelectedPasswordEntry] = useState<
    PasswordEntryDetail | undefined
  >(undefined);
  const [isCreate, setIsCreate] = useState<boolean>(false);

  const handlePasswordEntryClick = async (id: number) => {
    if (!id) return;
    const passwordEntry = await getPasswordEntry(id);
    if (!passwordEntry) return;
    setSelectedPasswordEntry(passwordEntry);
  };

  const handlePasswordEntryCreated = () => {
    setIsCreate(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <SidePanel
        onPasswordEntryClick={handlePasswordEntryClick}
        onCreatePasswordEntry={() => setIsCreate(true)}
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
