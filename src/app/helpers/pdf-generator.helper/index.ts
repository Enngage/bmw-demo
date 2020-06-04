import pdfMake from 'pdfmake/build/pdfmake';
import { CourseNew } from 'src/app/data/course_new.js';

import { A4Document, BMWLogo, Divider, H1, H2, HeaderImage, List, Text, UnbreakableStack } from './components';
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
        bolditalics: 'SourceSansPro-BoldItalic.ttf',
      },
    };
  }

  stripHtml(html: string): string {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  getImageBase64(imageUrl?: string): Promise<string | null> {
    if (!imageUrl) {
      return Promise.resolve(null);
    }

    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = imageUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const container = { width: 515, height: 85 };

        const imgRatio = img.height / img.width;
        const containerRatio = container.height / container.width;

        canvas.height = container.height;
        canvas.width = container.width;

        if (imgRatio > containerRatio) {
          const h = container.width * imgRatio;
          ctx.drawImage(img, 0, (container.height - h) / 2, container.width, h);
        } else {
          const w = container.width * containerRatio / imgRatio;
          ctx.drawImage(img, (container.width - w) / 2, 0, w, container.height);
        }

        resolve(canvas.toDataURL('image/jpeg'));
      };
      img.onerror = () => resolve(null);
    });
  }

  async generateCourseSummary(course: CourseNew) {
    const courseName = course.title.value;
    const courseDescription = this.stripHtml(course.shortSummary.value);

    const modules: Array<any> = [];

    for (const module of course.modules.value) {
      modules.push({
        name: module.title.value,
        description: this.stripHtml(module.shortSummary.value),
        structure: module.selectChapters.value.map((chapter) => {
          return {
            name: chapter.title.value,
          };
        }),
      });
    }

    const headerImageUrl = course.headerImage.value?.[0]?.url;
    const headerImageBase64 = await this.getImageBase64(headerImageUrl);

    pdfMake
      .createPdf(
        A4Document([
          BMWLogo(),
          headerImageBase64 ? HeaderImage(headerImageBase64) : null,
          H1(`${courseName} - learning path`),
          Text(courseDescription),
          Divider(),
          ...modules.map((m, index) =>
            UnbreakableStack([
              H2(`Module ${index + 1}: ${m.name}`),
              Text(m.description),
              Text('Module structure:', { margin: [0, 16, 0, 16] }),
              List(m.structure.map((part) => Text(part.name))),
              index + 1 !== modules.length ? Divider() : null,
            ]),
          ),
        ]),
      )
      .download(`BMW - One Pager - ${courseName}.pdf`);
  }
}

export const pdfGeneratorHelper = new PdfGeneratorHelper();
