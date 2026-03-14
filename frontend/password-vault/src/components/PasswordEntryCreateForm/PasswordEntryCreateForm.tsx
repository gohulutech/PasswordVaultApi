import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import NameTextField from "./NameTextField";
import UserameTextField from "./UsernameTextField";
import { Button, Stack } from "@mui/material";
import PasswordTextField from "./PasswordTextField";

interface IFormInput {
  name: string;
  username: string;
  password: string;
}

interface IPasswordEntryCreateFormProps {
  onPasswordEntryCreated: () => void;
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

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data);
    onPasswordEntryCreated();
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
