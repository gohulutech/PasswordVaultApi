import { Stack, Typography } from "@mui/material";
import type { PasswordEntryDetail } from "../models/PasswordEntryDetail";

export interface IDetailProps {
  selectedPasswordEntry: PasswordEntryDetail;
}

export default function Detail({ selectedPasswordEntry }: IDetailProps) {
  if (!selectedPasswordEntry) return null;

  return (
    <Stack>
      <Typography>{selectedPasswordEntry.name}</Typography>
      <Typography>{selectedPasswordEntry.username}</Typography>
      <Typography>{selectedPasswordEntry.encryptedPassword}</Typography>
    </Stack>
  );
}
