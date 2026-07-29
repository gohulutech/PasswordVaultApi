import { AccountCircle, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Alert,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";

interface ISignInModalProps {
  open: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export default function SignInModal({ open, onClose, onSwitchToRegister }: ISignInModalProps) {
  const { t } = useTranslation();
  const { login, register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const GUEST_EMAIL = "guest@demo.local";
  const GUEST_PASSWORD = "GuestDemo123!";

  const handleGuestDemo = async () => {
    setLoading(true);
    setError(null);

    let success = await register({ email: GUEST_EMAIL, password: GUEST_PASSWORD });

    if (!success) {
      success = await login({ email: GUEST_EMAIL, password: GUEST_PASSWORD });
    }

    if (success) {
      onClose();
    } else {
      setError(t("signInModal.invalidCredentials"));
    }

    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const success = await login({ email, password });
    if (success) {
      onClose();
    } else {
      setError(t("signInModal.invalidCredentials"));
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth sx={{ borderRadius: 2, overflow: "hidden" }}>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%" }}>
        <Lock /> {t("signInModal.title")}
      </DialogTitle>
      <DialogContent sx={{ px: 4, py: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
          {t("signInModal.signIn")}
        </Typography>

        <Stack component="form" onSubmit={handleSubmit} spacing={2} sx={{ mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label={t("signInModal.emailLabel")}
            type="email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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
          <Button
            type="submit"
            variant="outlined"
            fullWidth
            sx={{ py: 1, textTransform: "none" }}
            disabled={loading}
          >
            {loading ? t("auth.loggingIn") : t("signInModal.logIn")}
          </Button>
        </Stack>

        <Stack sx={{ alignItems: "center", mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {t("signInModal.noAccount")}{" "}
            <Link component="button" variant="body2" onClick={onSwitchToRegister} sx={{ cursor: "pointer" }}>
              {t("signInModal.register")}
            </Link>
          </Typography>
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
          <Button
            variant="contained"
            fullWidth
            sx={{ py: 1, textTransform: "none" }}
            onClick={handleGuestDemo}
            disabled={loading}
          >
            {loading ? t("auth.loggingIn") : t("signInModal.guestDemo")}
          </Button>
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 3, fontSize: "0.8rem" }}>
          {t("signInModal.guestNote")}
        </Typography>
      </DialogContent>
    </Dialog>
  );
}
