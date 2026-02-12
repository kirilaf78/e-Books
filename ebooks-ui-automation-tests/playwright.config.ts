import { defineConfig, devices } from "@playwright/test";

// Monocart-reporter custom columns
const ohceColumns = (defaultColumns: unknown[]) => {
  const columnsToBeRemoved = ["type", "retry", "expectedStatus", "status", "outcome"];
  columnsToBeRemoved.forEach((columnName) => {
    const columnIndex = defaultColumns.findIndex(
      (column: { id: string }) => column.id === columnName
    );
    defaultColumns.splice(columnIndex, 1);
  });

  // const defaultColumnIndex = defaultColumns.findIndex((column) => column.id === "duration");
  // defaultColumns.splice(
  //   defaultColumnIndex,
  //   0,
  //   {
  //     id: "jira",
  //     name: "JIRA Key",
  //     width: 150,
  //     align: "center",
  //     searchable: true,
  //     styleMap: {
  //       "font-weight": "normal"
  //     },
  //     formatter: (valueFormatted, rowItem, columnItem) => {
  //       const key = rowItem[columnItem.id];
  //       return `<a href="https://elsevier.atlassian.net/browse/${key}" target="_blank">${valueFormatted}</a>`;
  //     }
  //   },
  //   {
  //     id: "description",
  //     name: "Description",
  //     align: "left",
  //     width: 250,
  //     searchable: true,
  //     styleMap: {
  //       "font-weight": "normal"
  //     }
  //   }
  // );
};

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  globalSetup: "globalSetup.ts",
  timeout: 90000,
  expect: {
    timeout: 10 * 1000
  },
  reporter: [
    [process.env.CI ? "line" : "list"],
    [
      "monocart-reporter",
      {
        name: `OHCE Test Report. Environment: ${process.env.TEST_ENV}`,
        outputFile: "./test-results/index.html",
        attachmentPath: "./test-results/",
        columns: ohceColumns,
        logging: "off",
        clean: false,
        visitor: (data: { title: string; logs: string[]; errors: string[] }) => {
          const envVariablePatterns = [
            /.*_PASS$/,
            /.*_API_KEY$/,
            /.*_CLIENT_ID$/,
            /.*_CLIENT_SECRET$/
          ];

          const mySecrets = Object.keys(process.env)
            .filter((key) => envVariablePatterns.some((pattern) => pattern.test(key)))
            .map((key) => process.env[key])
            .filter((value) => value && value.length > 0);

          mySecrets.forEach((secret) => {
            if (secret) {
              // Create a global regex to replace all occurrences
              const secretRegex = new RegExp(secret.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");

              // remove from title
              data.title = data.title.replace(secretRegex, "***");
              // remove from logs
              if (data.logs) {
                data.logs = data.logs.map((item: string) => item.replace(secretRegex, "***"));
              }
              // remove from errors
              if (data.errors) {
                data.errors = data.errors.map((item: string) => item.replace(secretRegex, "***"));
              }
            }
          });
        }
      }
    ]
  ],
  use: {
    video: {
      mode: "on-first-retry",
      size: { width: 1280, height: 720 }
    },
    trace: "retain-on-failure",
    screenshot: "only-on-failure"
  },
  projects: [
    /* Custom projects */
    {
      name: "ebooks",
      grep: /@ebooks/,
      use: { ...devices["Desktop Chrome"], channel: "chrome" }
    },

    {
      name: "ebooks",
      grep: /@ebooks/,
      use: { ...devices["Desktop Firefox"] }
    },

    {
      name: "ebooks",
      grep: /@ebooks/,
      use: { ...devices["Desktop Safari"] }
    },

    {
      name: "ebooks",
      grep: /@ebooks/,
      use: { ...devices["Desktop Edge"], channel: "msedge" }
    },

    {
      name: "ebooks",
      grep: /@ebooks/,
      use: { ...devices["Pixel 7"] }
    },

    {
      name: "ebooks",
      grep: /@ebooks/,
      use: { ...devices["iPhone 13"] }
    },

    {
      name: "subtitles",
      grep: /@subtitles/,
      use: { ...devices["Desktop Chrome"], channel: "chrome" }
    },

    {
      name: "videoplayback",
      grep: /@videoplayback/,
      use: { ...devices["iPhone 13"] }
    },

    /* Default projects */
    {
      name: "chromium",
      grep: /@ui/,
      use: { ...devices["Desktop Chrome"] }
    },

    {
      name: "firefox",
      grep: /@ui/,
      use: { ...devices["Desktop Firefox"] }
    },

    {
      name: "webkit",
      grep: /@ui/,
      grepInvert: /@espadmin/,
      use: { ...devices["Desktop Safari"] }
    },

    /* Test against branded browsers. */
    {
      name: "msedge",
      grep: /@ui/,
      use: {
        ...devices["Desktop Edge"],
        channel: "msedge"
      }
    },
    {
      name: "chrome",
      grep: /@ui/,
      use: {
        ...devices["Desktop Chrome"],
        channel: "chrome"
      }
    },

    /* Test against mobile viewports. */
    {
      name: "android",
      grep: /@ui/,
      grepInvert: /@espadmin/,
      use: { ...devices["Pixel 7"] }
    },
    {
      name: "ios",
      grep: /@ui/,
      grepInvert: /@espadmin/,
      use: { ...devices["iPhone 13"] }
    }
  ]
});
