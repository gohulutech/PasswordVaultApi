import { AccountCircle, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Alert,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
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

interface IRegisterModalProps {
  open: boolean;
  onClose: () => void;
  onSwitchToSignIn: () => void;
}

export default function RegisterModal({ open, onClose, onSwitchToSignIn }: IRegisterModalProps) {
  const { t } = useTranslation();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(t("registerModal.passwordMismatch"));
      return;
    }

    if (password.length < 6) {
      setError(t("registerModal.passwordMinLength"));
      return;
    }

    setLoading(true);
    const success = await register({ email, password });
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
        <Lock /> {t("registerModal.title")}
      </DialogTitle>
      <DialogContent sx={{ px: 4, py: 3 }}>
        <Stack component="form" onSubmit={handleSubmit} spacing={2} sx={{ mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label={t("registerModal.emailLabel")}
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
            label={t("registerModal.passwordLabel")}
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
          <TextField
            label={t("registerModal.confirmPasswordLabel")}
            type={showPassword ? "text" : "password"}
            fullWidth
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ py: 1, textTransform: "none" }}
            disabled={loading}
          >
            {loading ? t("auth.registering") : t("registerModal.createAccount")}
          </Button>
        </Stack>

        <Stack sx={{ alignItems: "center", mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {t("registerModal.alreadyHaveAccount")}{" "}
            <Link component="button" variant="body2" onClick={onSwitchToSignIn} sx={{ cursor: "pointer" }}>
              {t("registerModal.signIn")}
            </Link>
          </Typography>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
