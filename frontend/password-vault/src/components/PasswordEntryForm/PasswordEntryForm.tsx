import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import NameTextField from "./NameTextField";
import UserameTextField from "./UsernameTextField";
import { Button, Card, CardContent, Stack } from "@mui/material";
import PasswordTextField from "./PasswordTextField";
import {
  createPasswordEntry,
  updatePasswordEntry,
} from "../../services/password-entry-service";
import type { PasswordEntryCreate } from "../../models/PasswordEntryCreate";
import type { PasswordEntryUpdate } from "../../models/PasswordEntryUpdate";
import type { PasswordEntryDetail } from "../../models/PasswordEntryDetail";
import { useTranslation } from "react-i18next";

export interface IFormInput {
  id?: number;
  name: string;
  username: string;
  password: string;
}

interface IPasswordEntryFormProps {
  onPasswordEntrySaved: (
    newPasswordEntry: PasswordEntryDetail,
  ) => Promise<void>;
  defaultValues?: IFormInput;
}

export function PasswordEntryForm({
  onPasswordEntrySaved,
  defaultValues,
}: IPasswordEntryFormProps) {
  const { t } = useTranslation();
  const methods = useForm<IFormInput>({
    defaultValues: defaultValues ?? {
      name: "",
      username: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    let passwordEntryDetail: PasswordEntryDetail | undefined;

    if (data.id) {
      const passwordEntryUpdate: PasswordEntryUpdate = {
        id: data.id,
        name: data.name,
        username: data.username,
        password: data.password,
      };
      passwordEntryDetail = await updatePasswordEntry(passwordEntryUpdate);
    } else {
      const newPasswordEntry: PasswordEntryCreate = {
        name: data.name,
        username: data.username,
        password: data.password,
      };
      passwordEntryDetail = await createPasswordEntry(newPasswordEntry);
    }

    if (!passwordEntryDetail) return;
    await onPasswordEntrySaved(passwordEntryDetail);
  };

  return (
    <Card sx={{ width: "400px", margin: 1 }}>
      <FormProvider {...methods}>
        <CardContent>
          <Stack sx={{ gap: "16px", alignItems: "start" }}>
            <NameTextField />
            <UserameTextField />
            <PasswordTextField />
            <Button
              variant="contained"
              onClick={methods.handleSubmit(onSubmit)}
              sx={{ backgroundColor: "primary.main", textTransform: "none" }}
            >
              {methods.getValues().id ? t("common.save") : t("common.create")}
            </Button>
          </Stack>
        </CardContent>
      </FormProvider>
    </Card>
  );
}
