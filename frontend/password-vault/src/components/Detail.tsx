import type { PasswordEntryDetail } from "../models/PasswordEntryDetail";

export interface IDetailProps {
  selectedPasswordEntry: PasswordEntryDetail;
}

export default function Detail({ selectedPasswordEntry }: IDetailProps) {
  if (!selectedPasswordEntry) return null;

  return <div>{selectedPasswordEntry.name}</div>;
}
