import type { PasswordEntryPreview } from "../models/PasswordEntryPreview";
import {
  Button,
  Card,
  Drawer,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface ISidePanelProps {
  onPasswordEntryClick: (id: number) => void;
  onCreatePasswordEntry: () => void;
  passwordEntries: PasswordEntryPreview[];
  selectedEntryId?: number;
}

export default function SidePanel({
  onPasswordEntryClick,
  onCreatePasswordEntry,
  passwordEntries,
  selectedEntryId,
}: ISidePanelProps) {
  const { t } = useTranslation();
  const handleSelectPasswordEntry = (passwordEntry: PasswordEntryPreview) =>
    onPasswordEntryClick(passwordEntry.id);

  const drawerWidth = 240;

  return (
    <Drawer
      anchor="left"
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          padding: 1,
        },
      }}
    >
      <Button
        variant="contained"
        onClick={onCreatePasswordEntry}
        sx={{
          backgroundColor: "secondary.main",
          textTransform: "none",
          marginTop: "14px",
        }}
      >
        {t("sidePanel.createEntry")}
      </Button>
      <Typography variant="subtitle2" sx={{ marginTop: 2, marginBottom: 1 }}>
        {t("sidePanel.savedPasswords")}
      </Typography>
      <List sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {passwordEntries.map((passwordEntry) => (
          <Card
            key={passwordEntry.id}
            sx={{
              cursor: "pointer",
              backgroundColor:
                selectedEntryId === passwordEntry.id
                  ? "#f1f5f9"
                  : "transparent",
              "&:hover": { backgroundColor: "#f1f5f9" },
            }}
          >
            <ListItem onClick={() => handleSelectPasswordEntry(passwordEntry)}>
              <Stack>
                <Typography
                  sx={{
                    fontWeight: 600,
                    color: "#1e293b",
                    fontSize: "0.95rem",
                  }}
                >
                  {passwordEntry.name}
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 400,
                    color: "#64748b",
                    fontSize: "0.85rem",
                    marginTop: "2px",
                  }}
                >
                  {passwordEntry.username}
                </Typography>
              </Stack>
            </ListItem>
          </Card>
        ))}
      </List>
    </Drawer>
  );
}
