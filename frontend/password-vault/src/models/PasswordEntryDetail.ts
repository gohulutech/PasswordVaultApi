export type PasswordEntryDetail = {
  id: number;
  name: string;
  username: string;
  encryptedPassword: string;
  salt: string;
  IV: string;
};
