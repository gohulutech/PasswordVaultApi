import { useFormContext } from "react-hook-form";
import ControlledTextField from "../ControlledTextField/ControlledTextField";
import { useTranslation } from "react-i18next";

export default function UserameTextField() {
  const { control } = useFormContext();
  const { t } = useTranslation();

  return (
    <ControlledTextField
      controllerProps={{ name: "username", control: control }}
      textFieldProps={{
        label: t('common.userName'),
        sx: { width: "100%" },
      }}
    ></ControlledTextField>
  );
}
