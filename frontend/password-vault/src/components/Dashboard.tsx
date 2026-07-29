import { Box, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

interface IDashboardProps {
  onCreatePasswordEntry: () => void;
  onLoadSampleData: () => void;
}

export default function Dashboard({ onCreatePasswordEntry, onLoadSampleData }: IDashboardProps) {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "calc(100% - 280px)",
        gap: 1,
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        {t("dashboard.emptyTitle")}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {t("dashboard.emptySubtitle")}
      </Typography>
      <Button variant="contained" onClick={onCreatePasswordEntry} sx={{ textTransform: "none", marginTop: 1 }}>
        {t("dashboard.createFirstEntry")}
      </Button>
      <Button variant="text" onClick={onLoadSampleData} sx={{ textTransform: "none" }}>
        {t("dashboard.loadSampleData")}
      </Button>
    </Box>
  );
}
