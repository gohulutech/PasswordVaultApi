import { useState } from "react";
import "./App.css";
import Detail from "./components/Detail";
import SidePanel from "./components/SidePanel";
import type { PasswordEntryDetail } from "./models/PasswordEntryDetail";
import { getPasswordEntry } from "./services/password-entry-service";
import { Box } from "@mui/material";

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
    <Box sx={{ display: "flex" }}>
      <SidePanel onPasswordEntryClick={handlePasswordEntryClick} />
      <Box sx={{ flexGrow: 1 }}>
        {selectedPasswordEntry && (
          <Detail selectedPasswordEntry={selectedPasswordEntry} />
        )}
      </Box>
    </Box>
  );
}

export default App;
