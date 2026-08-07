export const C = {
  kumkum: "#C1440E",
  kumkumDark: "#9A360A",
  gold: "#D6A419",
  cream: "#FBF1DE",
  creamDeep: "#F3E6C9",
  green: "#3F6B4A",
  indigo: "#2B2340",
  ash: "#37312A",
};

export const GANAS = ["Baal", "Kishore", "Kishori", "Yuva", "Yuvati"];

export const GANA_COLORS = {
  Baal: "#3F6B4A",
  Kishore: "#1F6F8B",
  Kishori: "#8B4F9F",
  Yuva: "#C1440E",
  Yuvati: "#B08A00",
};

export function memberLabel(gana, count) {
  const plural = count !== 1;
  if (gana === "Kishori" || gana === "Yuvati") return plural ? "sevikas" : "sevika";
  if (gana === "Baal") return plural ? "baals & baalikas" : "baal & baalika";
  return plural ? "swayamsevaks" : "swayamsevak";
}
