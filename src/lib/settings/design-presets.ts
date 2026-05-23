export type DesignSettings = {
  presetId: string;
  colors: {
    ink: string;
    paper: string;
    warmPaper: string;
    graphite: string;
    stone: string;
    coffee: string;
    line: string;
    success: string;
    danger: string;
    tabBackground: string;
    tabText: string;
    tabHoverBackground: string;
    tabHoverText: string;
    buttonPrimaryBackground: string;
    buttonPrimaryText: string;
    buttonSecondaryBackground: string;
    buttonSecondaryText: string;
  };
  typography: {
    fontFamily: string;
    persianFont?: string;
    englishFont?: string;
    customFontName: string;
    customFontDataUrl: string;
    customFontFormat: "woff2" | "woff" | "truetype" | "";
  };
  shape: {
    radius: number;
    cardRadius: number;
    buttonRadius: number;
    tabRadius: number;
    shadowIntensity: number;
    spacingScale: number;
  };
  styles: {
    header: "minimal" | "bordered" | "floating";
    footer: "dark" | "light" | "bordered";
    landing: "stacked" | "gallery" | "editorial";
    productCard: "bordered" | "soft" | "commercial";
    blogCard: "line" | "card" | "editorial";
    button: "square" | "soft" | "pill";
  };
};

export type DesignPreset = {
  id: string;
  name: string;
  description: string;
  settings: DesignSettings;
};

type DesignPresetOverrides = Omit<Partial<DesignSettings>, "colors" | "typography" | "shape" | "styles"> & {
  colors?: Partial<DesignSettings["colors"]>;
  typography?: Partial<DesignSettings["typography"]>;
  shape?: Partial<DesignSettings["shape"]>;
  styles?: Partial<DesignSettings["styles"]>;
};

const baseSettings: DesignSettings = {
  presetId: "minimal-light",
  colors: {
    ink: "#000000",
    paper: "#ffffff",
    warmPaper: "#f7f5f1",
    graphite: "#1f1f1f",
    stone: "#8a8178",
    coffee: "#6f4e37",
    line: "#000000",
    success: "#0f7a3b",
    danger: "#b42318",
    tabBackground: "#ffffff",
    tabText: "#000000",
    tabHoverBackground: "#f7f5f1",
    tabHoverText: "#000000",
    buttonPrimaryBackground: "#000000",
    buttonPrimaryText: "#ffffff",
    buttonSecondaryBackground: "#ffffff",
    buttonSecondaryText: "#000000",
  },
  typography: {
    fontFamily: "\"Vazirmatn\", \"IRANSansX\", \"Inter\", system-ui, sans-serif",
    persianFont: "Vazirmatn",
    englishFont: "Inter",
    customFontName: "",
    customFontDataUrl: "",
    customFontFormat: "",
  },
  shape: {
    radius: 0,
    cardRadius: 0,
    buttonRadius: 0,
    tabRadius: 0,
    shadowIntensity: 0,
    spacingScale: 1,
  },
  styles: {
    header: "bordered",
    footer: "dark",
    landing: "stacked",
    productCard: "bordered",
    blogCard: "line",
    button: "square",
  },
};

const preset = (
  id: string,
  name: string,
  description: string,
  settings: DesignPresetOverrides,
): DesignPreset => ({
  id,
  name,
  description,
  settings: {
    ...baseSettings,
    ...settings,
    presetId: id,
    colors: { ...baseSettings.colors, ...settings.colors },
    typography: { ...baseSettings.typography, ...settings.typography },
    shape: { ...baseSettings.shape, ...settings.shape },
    styles: { ...baseSettings.styles, ...settings.styles },
  },
});

export const designPresets: DesignPreset[] = [
  preset("minimal-light", "Minimal light", "Sharp black-and-white Azadi identity with white landing tabs and strict editorial spacing.", {}),
  preset("premium-dark", "Premium dark", "Dark showcase canvas, graphite cards, soft contrast, and restrained coffee accents.", {
    colors: {
      ink: "#f8f4ee",
      paper: "#0d0d0d",
      warmPaper: "#171411",
      graphite: "#24201c",
      stone: "#b7aca0",
      coffee: "#c49a6c",
      line: "#f8f4ee",
      tabBackground: "#ffffff",
      tabText: "#101010",
      tabHoverBackground: "#ece7df",
      buttonPrimaryBackground: "#f8f4ee",
      buttonPrimaryText: "#101010",
      buttonSecondaryBackground: "#171411",
      buttonSecondaryText: "#f8f4ee",
    },
    shape: { radius: 10, cardRadius: 18, buttonRadius: 999, tabRadius: 0, shadowIntensity: 28, spacingScale: 1.08 },
    styles: { header: "floating", footer: "dark", productCard: "soft", blogCard: "card", button: "pill" },
  }),
  preset("coffee-warm", "Coffee warm", "A warmer roastery palette with cream surfaces, brown ink, tactile cards, and softer controls.", {
    colors: {
      ink: "#24170f",
      paper: "#fffaf2",
      warmPaper: "#efe2d1",
      graphite: "#3a2a20",
      stone: "#806f5e",
      coffee: "#7a4a2b",
      line: "#3a2a20",
      tabBackground: "#ffffff",
      tabText: "#24170f",
      tabHoverBackground: "#efe2d1",
      buttonPrimaryBackground: "#3a2a20",
      buttonPrimaryText: "#fffaf2",
      buttonSecondaryBackground: "#fffaf2",
      buttonSecondaryText: "#24170f",
    },
    shape: { radius: 12, cardRadius: 18, buttonRadius: 12, tabRadius: 0, shadowIntensity: 18, spacingScale: 1.05 },
    styles: { header: "bordered", footer: "light", productCard: "soft", blogCard: "card", button: "soft" },
  }),
  preset("modern-editorial", "Modern editorial", "Magazine-like rhythm with pale surfaces, lighter borders, generous space, and elegant article cards.", {
    colors: {
      ink: "#111111",
      paper: "#fbfbf8",
      warmPaper: "#eeeeea",
      graphite: "#252525",
      stone: "#70706a",
      coffee: "#8a5b37",
      line: "#111111",
      tabBackground: "#ffffff",
      tabText: "#111111",
      tabHoverBackground: "#eeeeea",
    },
    typography: {
      fontFamily: "\"Vazirmatn\", \"Iowan Old Style\", Georgia, \"Times New Roman\", serif",
    },
    shape: { radius: 4, cardRadius: 4, buttonRadius: 999, tabRadius: 0, shadowIntensity: 8, spacingScale: 1.14 },
    styles: { header: "minimal", footer: "bordered", landing: "editorial", blogCard: "editorial", button: "pill" },
  }),
  preset("commercial-contrast", "High-contrast commercial", "Retail-forward contrast, compact spacing, strong CTAs, and clearer product-card containment.", {
    colors: {
      ink: "#050505",
      paper: "#ffffff",
      warmPaper: "#f2f2f2",
      graphite: "#111111",
      stone: "#5c5c5c",
      coffee: "#9a4f20",
      line: "#050505",
      tabBackground: "#ffffff",
      tabText: "#050505",
      tabHoverBackground: "#f2f2f2",
      buttonPrimaryBackground: "#050505",
      buttonPrimaryText: "#ffffff",
    },
    shape: { radius: 0, cardRadius: 0, buttonRadius: 0, tabRadius: 0, shadowIntensity: 0, spacingScale: 0.94 },
    styles: { header: "bordered", footer: "dark", productCard: "commercial", blogCard: "line", button: "square" },
  }),
];

export const defaultDesignSettings = designPresets[0].settings;
