import { useEffect, useMemo, useState } from "react";
import "./App.css";
import SidePanel from "./components/SidePanel";
import type { PasswordEntryDetail } from "./models/PasswordEntryDetail";
import { getPasswordEntries, getPasswordEntry, setAccessTokenProvider } from "./services/password-entry-service";
import { Box } from "@mui/material";
import { PasswordEntryForm } from "./components/PasswordEntryForm/PasswordEntryForm";
import type { PasswordEntryPreview } from "./models/PasswordEntryPreview";
import SignInModal from "./components/SignInModal";
import RegisterModal from "./components/RegisterModal";
import { useAuth } from "./contexts/AuthContext";

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
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <SidePanel
        onPasswordEntryClick={handlePasswordEntryClick}
        onCreatePasswordEntry={() => handleOnCreate()}
        onLogout={handleLogOut}
        passwordEntries={filteredPasswordEntries}
        selectedEntryId={selectedPasswordEntry?.id}
        setFilterText={setFilterText}
        filterText={filterText}
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
