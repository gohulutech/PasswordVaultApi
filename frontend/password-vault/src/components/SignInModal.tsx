import { AccountCircle, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface ISignInModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SignInModal({ open, onClose }: ISignInModalProps) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth sx={{ borderRadius: 2, overflow: "hidden" }}>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%" }}>
        <Lock /> {t("signInModal.title")}
      </DialogTitle>
      <DialogContent sx={{ px: 4, py: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
          {t("signInModal.signIn")}
        </Typography>

        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label={t("signInModal.emailLabel")}
            type="email"
            fullWidth
            variant="outlined"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            label={t("signInModal.passwordLabel")}
            type={showPassword ? "text" : "password"}
            fullWidth
            variant="outlined"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      aria-label={showPassword ? t("passwordToggle.hide") : t("passwordToggle.show")}
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <Button variant="outlined" fullWidth sx={{ py: 1, textTransform: "none" }}>
            {t("signInModal.logIn")}
          </Button>
        </Stack>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            OR
          </Typography>
        </Divider>

        <Stack spacing={2}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            {t("signInModal.quickAccess")}
          </Typography>
          <Button variant="contained" fullWidth sx={{ py: 1, textTransform: "none" }}>
            {t("signInModal.guestDemo")}
          </Button>
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 3, fontSize: "0.8rem" }}>
          {t("signInModal.guestNote")}
        </Typography>
      </DialogContent>
    </Dialog>
  );
}
