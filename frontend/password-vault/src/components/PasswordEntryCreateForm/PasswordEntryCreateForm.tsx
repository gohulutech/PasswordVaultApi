import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import NameTextField from "./NameTextField";
import UserameTextField from "./UsernameTextField";
import { Button, Stack } from "@mui/material";
import PasswordTextField from "./PasswordTextField";
import { createPasswordEntry } from "../../services/password-entry-service";
import type { PasswordEntryCreate } from "../../models/PasswordEntryCreate";
import type { PasswordEntryDetail } from "../../models/PasswordEntryDetail";

interface IFormInput {
  name: string;
  username: string;
  password: string;
}

interface IPasswordEntryCreateFormProps {
  onPasswordEntryCreated: (
    newPasswordEntry: PasswordEntryDetail,
  ) => Promise<void>;
}

export function PasswordEntryCreateForm({
  onPasswordEntryCreated,
}: IPasswordEntryCreateFormProps) {
  const methods = useForm<IFormInput>({
    defaultValues: {
      name: "",
      username: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const newPasswordEntry: PasswordEntryCreate = {
      name: data.name,
      username: data.username,
      password: data.password,
    };
    const passwordEntryDetail = await createPasswordEntry(newPasswordEntry);
    if (!passwordEntryDetail) return;
    await onPasswordEntryCreated(passwordEntryDetail);
  };

  return (
    <FormProvider {...methods}>
      <Stack sx={{ gap: "16px" }}>
        <NameTextField />
        <UserameTextField />
        <PasswordTextField />
        <Button onClick={methods.handleSubmit(onSubmit)}>Create</Button>
      </Stack>
    </FormProvider>
  );
}
