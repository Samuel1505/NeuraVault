/* eslint-disable @typescript-eslint/no-empty-object-type */

// Reown AppKit Web Component type declarations
declare namespace JSX {
  interface IntrinsicElements {
    "appkit-button": {
      label?: string;
      loadingLabel?: string;
      disabled?: boolean;
      balance?: "show" | "hide";
      size?: "md" | "sm";
    };
    "appkit-account-button": {
      disabled?: boolean;
      balance?: "show" | "hide";
    };
    "appkit-connect-button": {
      label?: string;
      loadingLabel?: string;
      disabled?: boolean;
      size?: "md" | "sm";
    };
    "appkit-network-button": {
      disabled?: boolean;
    };
  }
}
