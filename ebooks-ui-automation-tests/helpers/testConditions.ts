export const isDev = process.env.TEST_ENV === "dev";
export const isProduction = process.env.TEST_ENV === "prod";
export const isCI = !!process.env.CI;
export const isNotSafariOrNotMobile = ({ browserName, isMobile }) =>
  browserName !== "webkit" || !isMobile;
export const isNotChromium = ({ browserName }) => browserName !== "chromium";
export const isMobileChromium = ({ browserName, isMobile }) =>
  browserName === "chromium" && isMobile;
export const isDesktopSafari = ({ browserName, isMobile }) => browserName === "webkit" && !isMobile;
export const isMobileSafari = ({ browserName, isMobile }) => browserName === "webkit" && isMobile;
