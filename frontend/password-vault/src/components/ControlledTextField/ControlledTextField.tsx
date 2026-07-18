import {
  useController,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form";
import TextField, { type TextFieldProps } from "@mui/material/TextField";

interface ControlledTextFieldProps<T extends FieldValues> {
  controllerProps: UseControllerProps<T>;
  textFieldProps?: TextFieldProps;
}

export default function ControlledTextField<T extends FieldValues>({
  controllerProps,
  textFieldProps,
}: ControlledTextFieldProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController(controllerProps);

  return (
    <TextField
      variant="outlined"
      {...field}
      {...textFieldProps}
      error={!!error}
      helperText={error?.message ?? textFieldProps?.helperText}
    />
  );
}
