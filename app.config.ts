export default defineAppConfig({
  ui: {
    primary: "sky",
    gray: "zinc",
    table: {
      td: {
        base: "whitespace-normal",
      },
    },
    button: {
      variant: {
        soft: "text-{color}-500 dark:text-{color}-400 bg-{color}-100 hover:bg-{color}-100 disabled:bg-{color}-50 dark:bg-{color}-800 dark:hover:bg-{color}-900 dark:disabled:bg-{color}-950 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-{color}-500 dark:focus-visible:ring-{color}-400",
      },
    },
    breadcrumb: {
      li: "text-2xl",
      base: "font-normal",
      active: "text-gray-700 dark:text-gray-200",
      inactive: "text-gray-500 dark:text-gray-400",
    },
  },
});
