import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Website",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "google",
      tagId: "GTM-TV582WMS",
    },
    locale: "en-US",
    baseUrl: "clemorl.fr",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "JetBrains Mono",
        body: "Geist",
        code: "JetBrains Mono",
      },
colors: {
  lightMode: {
    light: "#eff1f5",        // Latte Base
    lightgray: "#e6e9ef",    // Latte Mantle
    gray: "#bcc0cc",         // Latte Surface1
    darkgray: "#4c4f69",     // Latte Text
    dark: "#d20f39",         // Latte Red (Accents/Titles)
    secondary: "#1e66f5",    // Latte Blue (Links/Headings)
    tertiary: "#40a02b",     // Latte Green (Success/Checkmarks)
    highlight: "rgba(30, 102, 245, 0.15)", // Translucent Blue
    textHighlight: "#df8e1d88", // Latte Yellow (Highlight)
  },
  darkMode: {
    light: "#24273a",        // Macchiato Base
    lightgray: "#1e2030",    // Macchiato Mantle
    gray: "#5b6078",         // Macchiato Surface1
    darkgray: "#cad3f5",     // Macchiato Text
    dark: "#ed8796",         // Macchiato Red (Accents/Titles)
    secondary: "#8aadf4",    // Macchiato Blue (Links/Headings)
    tertiary: "#a6da95",     // Macchiato Green (Success/Checkmarks)
    highlight: "rgba(138, 173, 244, 0.15)", // Translucent Blue
    textHighlight: "#eed49f88", // Macchiato Yellow (Highlight)
  },
},
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      Plugin.CustomOgImages(),
    ],
  },
}

export default config
