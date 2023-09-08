import fs from 'fs';
import path from 'path';
import glob from 'glob';
import * as cheerio from 'cheerio';

const distDir = "./dist"

function insertSvgToHtmlFile(filePath) {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(fileContents, {
        xmlMode: false,
        selfClosingTags: false,
    });

    $('.inline-svg').each((i, el) => {
        const src = $(el).attr('src');
        const savedClass = $(el).attr('class');
        if (src) {
            const svgFilePath = path.join(distDir, src);
            try {
                const svgContent = fs.readFileSync(svgFilePath, 'utf8');
                const $svg = cheerio.load(svgContent, {
                    xmlMode: false,
                    selfClosingTags: false,
                });
                $svg('svg').addClass(savedClass);
                $(el).replaceWith($svg.html());

            } catch (error) {
                console.error(`Error reading SVG file: ${svgFilePath}`, error);
            }
        }
    });
    fs.writeFileSync(filePath, $.html(), 'utf8');
}

const htmlFiles = glob.sync(`${distDir}/**/*.html`);

htmlFiles.forEach((filePath) => {
    insertSvgToHtmlFile(filePath);
});