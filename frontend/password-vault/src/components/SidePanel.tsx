import type { PasswordEntryPreview } from "../models/PasswordEntryPreview";
import {
  Button,
  Drawer,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";

interface ISidePanelProps {
  onPasswordEntryClick: (id: number) => void;
  onCreatePasswordEntry: () => void;
  passwordEntries: PasswordEntryPreview[];
}

export default function SidePanel({
  onPasswordEntryClick,
  onCreatePasswordEntry,
  passwordEntries,
}: ISidePanelProps) {
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
      <Button onClick={onCreatePasswordEntry}>Create Password Entry</Button>
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
