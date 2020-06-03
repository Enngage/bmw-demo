import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from './vfs_fonts.js';
import { A4Document, BMWLogo, Divider, H1, H2, List, Text, UnbreakableStack } from './components';

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
  
  generateCourseSummary() {
    const courseCodename = 'soft_skills';
    const courseName = `Soft skills`;
    const courseDescription = 'This course is meant for salespeople, technicians and other professions that regularly communicate with BMW Group customers. In this course, you will learn how to skillfully communicate with customers so that they are happy with interacting with our company.';
    const modules: Array<any> = [
      {
        name: 'Introduction',
        description: 'This is the introduction of the course.',
        structure: [
          { name: 'Welcome' },
          { name: 'Overview' },
          { name: 'Clarifying expectations' },
          { name: 'Introducing the participants' },
        ],
      },
      {
        name: 'Basics of communication',
        description: 'Learn the fundamentals of communicating with customers',
        structure: [
          { name: 'Features of communication' },
          { name: 'The 4 sides of a message' },
          { name: 'Active listening' },
        ],
      },
      {
        name: 'Steering discussions',
        description: 'Learn the different question types and expand your repertoire.',
        structure: [
          { name: 'Steering discussions' },
          { name: 'Tricky or difficult conversations/negotitations' },
        ],
      },
      {
        name: 'Tricky conversations/negotiations',
        description: 'This is the introduction of the course.',
        structure: [
          { name: 'Steering discussions' },
          { name: 'Tricky or difficult conversations/negotitations' },
        ],
      },
      {
        name: 'Tricky discussions',
        description: 'Learn the fundamentals of communicating with customers',
        structure: [
          { name: 'Features of communication' },
          { name: 'The 4 sides of a message' },
          { name: 'Active listening' },
        ],
      },
    ];

    pdfMake
      .createPdf(
        A4Document([
          BMWLogo(),
          H1(`${courseName} course summary`),
          Text(courseDescription),
          Divider(),
          ...(modules.map((m, index) => (
            UnbreakableStack([
              H2(`Module ${index + 1}: ${m.name}`),
              Text(m.description),
              Text('Module structure:', { margin: [0, 16, 0, 16] }),
              List(m.structure.map(part => Text(part.name))),
              ((index + 1) !== modules.length ? Divider() : null),
            ])),
          )),
        ]),
      )
      .download(`${courseCodename}_course_overview.pdf`);
  }
}

export const pdfGeneratorHelper = new PdfGeneratorHelper();
