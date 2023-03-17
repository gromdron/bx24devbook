module.exports = {
    browsers: "defaults, not op_mini all, not IE < 12, not and_qq 10.4, not baidu 7.12",
    presets: [
        "@swissquote/crafty-preset-babel",
        "@swissquote/crafty-runner-rollup",
        "@swissquote/crafty-preset-postcss",
        "@swissquote/crafty-runner-gulp"
    ],
    destination_css: ".",
    destination_js: ".",
    stylelint_pattern: [
        "src/css/**/*.scss",
        "!*.min.css",
        "!**/vendor/**/*.scss"
    ],
    eslint: {
        settings: {
            react: {
                version: "16.0"
            }
        },
        rules: {
            "@swissquote/swissquote/react/no-deprecated": 0
        }
    },
    stylelint: {
        rules: {
            "swissquote/no-type-outside-scope": null,
            "plugin/no-unsupported-browser-features": null
        }
    },
    js: {
        search: {
            runner: "rollup",
            format: "iife",
            source: "src/js/search/index.js",
            destination: "daux_libraries/search.min.js"
        },
        theme_daux: {
            runner: "rollup",
            format: "iife",
            source: "src/js/theme_daux/index.js",
            destination: "themes/daux/js/daux.min.js"
        }
    },
    css: {
        theme_blue: {
            source: "src/css/theme_daux/theme-blue.scss",
            destination: "themes/daux/css/theme-blue.min.css",
            watch: ["src/css/**/*.scss"]
        },
        theme_green: {
            source: "src/css/theme_daux/theme-green.scss",
            destination: "themes/daux/css/theme-green.min.css",
            watch: ["src/css/**/*.scss"]
        },
        theme_navy: {
            source: "src/css/theme_daux/theme-navy.scss",
            destination: "themes/daux/css/theme-navy.min.css",
            watch: ["src/css/**/*.scss"]
        },
        theme_red: {
            source: "src/css/theme_daux/theme-red.scss",
            destination: "themes/daux/css/theme-red.min.css",
            watch: ["src/css/**/*.scss"]
        },
        daux_singlepage: {
            source: "src/css/theme_daux_singlepage/main.scss",
            destination: "themes/daux_singlepage/css/main.min.css",
            watch: ["src/css/**/*.scss"]
        }
    },
    postcss(crafty, config, bundle) {
        // Add postcss-page-break
        config.processor("postcss-page-break").before("autoprefixer");
    },
  /**
   * Represents the extension point for rollup configuration
   * @param {Crafty} crafty - The instance of Crafty.
   * @param {Gulp} gulp - The instance of Gulp.
   * @param {StreamHandler} StreamHandler - A wrapper to create your tasks.
   */
  gulp(crafty, gulp, StreamHandler) {
    // Create tasks
    gulp.task("katex", function() {
      const stream = new StreamHandler("node_modules/katex/dist/*.min.*", "daux_libraries");
      return stream.generate();
    });

    gulp.task("mermaid", function() {
        const stream = new StreamHandler("node_modules/mermaid/dist/mermaid.min.{js,js.map}", "daux_libraries");
        return stream.generate();
      });

    // Group tasks into other tasks
    gulp.task("vendors", gulp.parallel("katex", "mermaid"));

    // Register this task to run automatically
    crafty.addDefaultTask("vendors");
  }
};