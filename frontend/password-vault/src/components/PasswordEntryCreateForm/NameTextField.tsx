import { useFormContext } from "react-hook-form";
import ControlledTextField from "../ControlledTextField/ControlledTextField";

export default function NameTextField() {
  const { control } = useFormContext();

  return (
    <ControlledTextField
      controllerProps={{ name: "name", control: control }}
      textFieldProps={{
        label: "Name",
      }}
    ></ControlledTextField>
  );
}
