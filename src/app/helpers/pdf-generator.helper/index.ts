import pdfMake from 'pdfmake/build/pdfmake';
import { CourseNew } from 'src/app/data/course_new.js';

import { A4Document, BMWLogo, Divider, H1, H2, List, Text, UnbreakableStack } from './components';
import pdfFonts from './vfs_fonts.js';

export class PdfGeneratorHelper {
    constructor() {
        // Load fonts into the PdfMake virtual file system
        pdfMake.vfs = pdfFonts;
        pdfMake.fonts = {
            SourceSansPro: {
                normal: 'SourceSansPro-Regular.ttf',
                bold: 'SourceSansPro-Bold.ttf',
                italics: 'SourceSansPro-Italic.ttf',
                bolditalics: 'SourceSansPro-BoldItalic.ttf'
            }
        };
    }

    stripHtml(html: string): string {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }

    generateCourseSummary(course: CourseNew) {
        const courseCodename = course.system.codename;
        const courseName = course.title.value;
        const courseDescription = this.stripHtml(course.shortSummary.value);

        const modules: Array<any> = [];

        for (const module of course.modules.value) {
            modules.push({
                name: module.title.value,
                description: this.stripHtml(module.shortSummary.value),
                structure: module.selectChapters.value.map((chapter) => {
                    return {
                        name: chapter.title.value
                    };
                })
            });
        }

        pdfMake
            .createPdf(
                A4Document([
                    BMWLogo(),
                    H1(`${courseName} course summary`),
                    Text(courseDescription),
                    Divider(),
                    ...modules.map((m, index) =>
                        UnbreakableStack([
                            H2(`Module ${index + 1}: ${m.name}`),
                            Text(m.description),
                            Text('Module structure:', { margin: [0, 16, 0, 16] }),
                            List(m.structure.map((part) => Text(part.name))),
                            index + 1 !== modules.length ? Divider() : null
                        ])
                    )
                ])
            )
            .download(`${courseCodename}_course_overview.pdf`);
    }
}

export const pdfGeneratorHelper = new PdfGeneratorHelper();
