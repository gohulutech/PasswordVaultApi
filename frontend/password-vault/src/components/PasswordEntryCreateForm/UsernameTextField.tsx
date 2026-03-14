import { useFormContext } from "react-hook-form";
import ControlledTextField from "../ControlledTextField/ControlledTextField";

export default function UserameTextField() {
  const { control } = useFormContext();

  return (
    <ControlledTextField
      controllerProps={{ name: "username", control: control }}
      textFieldProps={{
        label: "User Name",
      }}
    ></ControlledTextField>
  );
}
