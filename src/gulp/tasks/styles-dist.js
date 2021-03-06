"use strict";

import AbstractTaskLoader from "../abstractTaskLoader";
import config from "../config";
//import utils from "../utils";

import sass from "gulp-sass";
import cssimport from "gulp-cssimport";
import concat from "gulp-concat";
import csso from "gulp-csso";
import minifyCss from "gulp-clean-css";
import size from "gulp-size";

class StylesDistTaskLoader extends AbstractTaskLoader {
    registerTask(gulp){
        super.registerTask(gulp);

        gulp.task("styles-dist", "Optimize and minimize stylesheets for production", () =>{
            return gulp.plumbedSrc(// handle errors nicely (i.e., without breaking watch)
                config.styles.srcWithoutVendor
                )

                // Display the files in the stream
                //.pipe(debug({title: "Stream contents:", minimal: true}))

                // Process Sass files
                .pipe(sass({
                    style: "compressed"
                    //errLogToConsole: true
                }))

                // Replace CSS imports by actual contents
                .pipe(cssimport())

                // Remove any unused CSS
                // Note that it breaks the sourcemaps (but we shouldn't care for dist since we don't need sourcemaps there)
                // Note that it also causes weird output during build in combination w/ Angular
                //.pipe($.uncss({
                //  html: [
                //    config.html.src
                //  ],
                //  // CSS Selectors for UnCSS to ignore
                //  ignore: [
                //  ]
                //}))

                // Regroup all files together
                .pipe(concat(config.styles.finalCssBundleFilename))

                // Optimize and minimize
                .pipe(csso()) // https://www.npmjs.com/package/gulp-csso
                .pipe(minifyCss(
                    config.minifyCss
                ))

                // Output file
                .pipe(gulp.dest(config.styles.destDist))

                // Task result
                .pipe(size({
                    title: "styles-dist"
                }));
        });
    }
}

module.exports = new StylesDistTaskLoader();
