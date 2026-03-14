import { useEffect, useState } from "react";
import type { PasswordEntryPreview } from "../models/PasswordEntryPreview";
import { getPasswordEntries } from "../services/password-entry-service";
import { Drawer, List, ListItem, Stack, Typography } from "@mui/material";
import type { PasswordEntryDetail } from "../models/PasswordEntryDetail";

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
        },
      }}
    >
      <List>
        {passwordEntries.map((passwordEntry) => (
          <ListItem
            key={passwordEntry.id}
            onClick={() => handleSelectPasswordEntry(passwordEntry)}
          >
            <Stack>
              <Typography>{passwordEntry.name}</Typography>
              <Typography>{passwordEntry.username}</Typography>
            </Stack>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
