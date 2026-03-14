import { useFormContext } from "react-hook-form";
import ControlledTextField from "../ControlledTextField/ControlledTextField";

export default function PasswordTextField() {
  const { control } = useFormContext();

  return (
    <ControlledTextField
      controllerProps={{ name: "password", control: control }}
      textFieldProps={{
        label: "Password",
      }}
    ></ControlledTextField>
  );
}
