const fs = require('fs');
const path = require('path');
const Terser = require('terser');
const CleanCSS = require('clean-css');

const minifyJS = async (inputFile, outputFile) => {
    try {
        const code = fs.readFileSync(inputFile, 'utf8');
        const result = await Terser.minify(code);
        if (result.error) {
            throw result.error;
        }
        fs.writeFileSync(outputFile, result.code);
        console.log(`Minified JS: ${inputFile} -> ${outputFile}`);
    } catch (err) {
        console.error(`Error minifying JS ${inputFile}:`, err);
    }
};

const minifyCSS = (inputFile, outputFile) => {
    try {
        const code = fs.readFileSync(inputFile, 'utf8');
        const output = new CleanCSS().minify(code);
        if (output.errors.length > 0) {
            throw new Error(output.errors.join('\n'));
        }
        fs.writeFileSync(outputFile, output.styles);
        console.log(`Minified CSS: ${inputFile} -> ${outputFile}`);
    } catch (err) {
        console.error(`Error minifying CSS ${inputFile}:`, err);
    }
};

// Paths
const jsInput = path.join(__dirname, 'js', 'main.js');
const jsOutput = path.join(__dirname, 'js', 'main.min.js');
const themeJsInput = path.join(__dirname, 'js', 'theme-switcher.js');
const themeJsOutput = path.join(__dirname, 'js', 'theme-switcher.min.js');
const cssInput = path.join(__dirname, 'css', 'style.css');
const cssOutput = path.join(__dirname, 'css', 'style.min.css');

// Run
(async () => {
    await minifyJS(jsInput, jsOutput);
    await minifyJS(themeJsInput, themeJsOutput);
    minifyCSS(cssInput, cssOutput);
})();
