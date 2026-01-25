import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

const LOCAL_CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

export const getBrowser = async () => {
  const isProduction = process.env.NODE_ENV === "production";

  return await puppeteer.launch({
    args: isProduction 
      ? [...chromium.args, "--hide-scrollbars", "--disable-web-security"] 
      : ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: chromium.defaultViewport,
    executablePath: isProduction
      ? await chromium.executablePath()
      : LOCAL_CHROME_PATH,
    headless: isProduction ? chromium.headless : false,
    ignoreHTTPSErrors: true,
  });
};