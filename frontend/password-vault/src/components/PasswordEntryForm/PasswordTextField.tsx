import { useState } from "react";
import { useFormContext } from "react-hook-form";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import ControlledTextField from "../ControlledTextField/ControlledTextField";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useTranslation } from "react-i18next";

export default function PasswordTextField() {
  const { control } = useFormContext();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <ControlledTextField
      controllerProps={{ name: "password", control }}
      textFieldProps={{
        label: t('common.password'),
        sx: { width: "100%" },
        type: showPassword ? "text" : "password",
        slotProps: {
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? t('passwordToggle.hide') : t('passwordToggle.show')
                  }
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          },
        },
      }}
    />
  );
}
