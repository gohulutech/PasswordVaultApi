import type { Components } from "@mui/material/styles";
import ClearIcon from "@mui/icons-material/Clear"; // Or your preferred icon
import i18n from ".";
import React from "react";

const getMuiComponents = (): Components => ({
  MuiCheckbox: {
    defaultProps: {
      slotProps: {
        input: {
          "aria-label": i18n.t("mui.checkBox.ariaLabel"),
        },
      },
    },
  },
  MuiSwitch: {
    defaultProps: {
      slotProps: {
        input: {
          "aria-label": i18n.t("mui.switch.ariaLabel"),
        },
      },
    },
  },
  MuiSlider: {
    defaultProps: {
      "aria-label": i18n.t("mui.slider.ariaLabel"),
    },
  },
  MuiRating: {
    defaultProps: {
      "aria-label": i18n.t("mui.rating.ariaLabel"),
    },
  },
  MuiCircularProgress: {
    defaultProps: {
      "aria-label": i18n.t("mui.loadingProgress.ariaLabel"),
    },
  },
  MuiChip: {
    defaultProps: {
      deleteIcon: React.createElement(ClearIcon, {
        "aria-label": i18n.t("mui.chip.deleteIconAriaLabel"),
      }),
    },
  },
  MuiTablePagination: {
    defaultProps: {
      "aria-label": i18n.t("mui.pagination.ariaLabel"),
      labelRowsPerPage: i18n.t("mui.pagination.itemsPerPage"),
      labelDisplayedRows: ({ from, to, count }) =>
        `${from}-${to} ${i18n.t("mui.pagination.of")} ${count}`,
    },
  },
  MuiSelect: {
    defaultProps: {
      "aria-label": i18n.t("mui.select.ariaLabel"),
    },
  },
  MuiDialog: {
    defaultProps: {
      "aria-labelledby": "dialog-title",
    },
  },
  MuiDrawer: {
    defaultProps: {
      ModalProps: {
        "aria-labelledby": "drawer-title",
      },
    },
  },
});

export default getMuiComponents;
