import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import NameTextField from "./NameTextField";
import UserameTextField from "./UsernameTextField";
import { Button, Card, CardContent, Stack } from "@mui/material";
import PasswordTextField from "./PasswordTextField";
import { createPasswordEntry } from "../../services/password-entry-service";
import type { PasswordEntryCreate } from "../../models/PasswordEntryCreate";
import type { PasswordEntryDetail } from "../../models/PasswordEntryDetail";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
              {t('common.create')}
            </Button>
          </Stack>
        </CardContent>
      </FormProvider>
    </Card>
  );
}
