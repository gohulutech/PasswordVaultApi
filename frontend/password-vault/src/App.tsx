import { useEffect, useMemo, useState } from "react";
import "./App.css";
import SidePanel from "./components/SidePanel";
import type { PasswordEntryDetail } from "./models/PasswordEntryDetail";
import {
  createSampleData,
  getPasswordEntries,
  getPasswordEntry,
  setAccessTokenProvider,
} from "./services/password-entry-service";
import { Stack, Box } from "@mui/material";
import { PasswordEntryForm } from "./components/PasswordEntryForm/PasswordEntryForm";
import type { PasswordEntryPreview } from "./models/PasswordEntryPreview";
import SignInModal from "./components/SignInModal";
import RegisterModal from "./components/RegisterModal";
import { useAuth } from "./contexts/AuthContext";
import Dashboard from "./components/Dashboard";

function App() {
  const { isAuthenticated, accessToken, refreshAccessToken, logout } = useAuth();
  const [selectedPasswordEntry, setSelectedPasswordEntry] = useState<PasswordEntryDetail | undefined>(undefined);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [filterText, setFilterText] = useState<string>("");
  const [passwordEntries, setPasswordEntries] = useState<PasswordEntryPreview[]>([]);
  const [authModalOpen, setAuthModalOpen] = useState<"signin" | "register" | null>("signin");

  useEffect(() => {
    setAccessTokenProvider(accessToken, refreshAccessToken);
  }, [accessToken, refreshAccessToken]);

  useEffect(() => {
    if (!isAuthenticated) return;
    getPasswordEntries()
      .then((passwordEntries) => {
        if (passwordEntries) setPasswordEntries(passwordEntries);
      })
      .catch(() => console.error("Could not load password entries"));
  }, [isAuthenticated]);

  const handlePasswordEntryClick = async (id: number) => {
    if (!id) return;
    const passwordEntry = await getPasswordEntry(id);
    if (!passwordEntry) return;
    setIsCreate(false);
    setSelectedPasswordEntry(passwordEntry);
  };

  const handlePasswordEntrySaved = async (newPasswordEntry: PasswordEntryDetail) => {
    setIsCreate(false);
    const passwordEntries = await getPasswordEntries();
    if (passwordEntries) setPasswordEntries(passwordEntries);
    setSelectedPasswordEntry(newPasswordEntry);
  };

  const handleOnCreate = () => {
    setSelectedPasswordEntry(undefined);
    setIsCreate(true);
  };

  const handleLoadSampleData = async () => {
    const result = await createSampleData();
    if (result.length === 0) return;
    const passwordEntries = await getPasswordEntries();
    if (passwordEntries) setPasswordEntries(passwordEntries);
    setSelectedPasswordEntry(result[0]);
  };

  const filteredPasswordEntries = useMemo(
    () => passwordEntries.filter((entry) => entry.name.includes(filterText) || entry.username.includes(filterText)),
    [passwordEntries, filterText],
  );

  const getDefaultValues = () => {
    if (!selectedPasswordEntry) return null;
    const { encryptedPassword, ...entry } = selectedPasswordEntry;
    return { ...entry, password: encryptedPassword };
  };

  const handleLogOut = () => {
    setAuthModalOpen("signin");
    setSelectedPasswordEntry(undefined);
    logout();
  };

  if (!isAuthenticated) {
    return (
      <>
        <SignInModal
          open={authModalOpen === "signin"}
          onClose={() => setAuthModalOpen(null)}
          onSwitchToRegister={() => setAuthModalOpen("register")}
        />
        <RegisterModal
          open={authModalOpen === "register"}
          onClose={() => setAuthModalOpen(null)}
          onSwitchToSignIn={() => setAuthModalOpen("signin")}
        />
      </>
    );
  }

  return (
    <Stack sx={{ flexDirection: "row", minHeight: "100vh", gap: 1 }}>
      <SidePanel
        onPasswordEntryClick={handlePasswordEntryClick}
        onCreatePasswordEntry={() => handleOnCreate()}
        onLogout={handleLogOut}
        passwordEntries={filteredPasswordEntries}
        selectedEntryId={selectedPasswordEntry?.id}
        setFilterText={setFilterText}
        filterText={filterText}
      />
      {!selectedPasswordEntry && !isCreate && passwordEntries.length === 0 ? (
        <Dashboard onCreatePasswordEntry={handleOnCreate} onLoadSampleData={handleLoadSampleData} />
      ) : (
        <Box sx={{ flexGrow: 1 }}>
          {(isCreate || selectedPasswordEntry) && (
            <PasswordEntryForm
              key={selectedPasswordEntry?.id}
              onPasswordEntrySaved={handlePasswordEntrySaved}
              defaultValues={getDefaultValues() ?? undefined}
            />
          )}
        </Box>
      )}
    </Stack>
  );
}

export default App;
