import { useFormContext } from "react-hook-form";
import ControlledTextField from "../ControlledTextField/ControlledTextField";
import { useTranslation } from "react-i18next";

export default function NameTextField() {
  const { control } = useFormContext();
  const { t } = useTranslation();

  return (
    <ControlledTextField
      controllerProps={{ name: "name", control: control }}
      textFieldProps={{
        label: t('common.name'),
        sx: { width: "100%" },
      }}
    ></ControlledTextField>
  );
}
