import Axios from 'axios';
import { saveAs } from 'filesaver.js';

export interface IPdfTableColumnValue {
    value: string | any[];
    isBold?: boolean;
}

export interface IPdfTableRow {
    values: IPdfTableColumnValue[];
}

export interface IPdfTable {
    rows: IPdfTableRow[];
    columnWidths: (string | number)[];
}

export class PdfService {
    private readonly generatePdfUrl: string =
        'https://richardsfunctionsnode.azurewebsites.net/api/CreatePdf?code=4faKnkS4FTovzC44SckDkjBjW4VaGopYEyTactjpoYyBoR32b9wJ3A==';

    constructor() {}

    public components = {
        list: (children: any[]) => ({
            listType: 'circle',
            ul: children
        }),

        table: (table: IPdfTable) => {
            const columnWidths = table.columnWidths;

            return {
                margin: [0, 16, 0, 0],
                layout: 'lightHorizontalLines', // optional
                table: {
                    // headers are automatically repeated if the table spans over multiple pages
                    // you can declare how many rows should be treated as headers
                    headerRows: 1,
                    widths: columnWidths,

                    body: table.rows.map((row) => {
                        if (row.values.length !== table.columnWidths.length) {
                            throw Error(
                                `Invalid number of values & column definitions. Values length '${row.values.length}' !== table def '${table.columnWidths.length}'`
                            );
                        }
                        const columns = row.values.map((m) => ({
                            text: m.value,
                            bold: m.isBold ?? false
                        }));

                        return columns;
                    })
                }
            };
        },

        unbreakableStack: (children: any[]) => ({
            unbreakable: true,
            stack: children
        }),

        headerImage: (data: { imageBase64: string; heightPx: number }) => ({
            image: data.imageBase64,
            height: data.heightPx,
            width: 595 - 32, // A4 width - page margins
            margin: [0, 4, 0, 0]
        }),

        divider: () => ({
            canvas: [
                {
                    type: 'line',
                    x1: 0,
                    y1: 0,
                    x2: 515,
                    y2: 0,
                    lineWidth: 1,
                    color: '#777777'
                }
            ],
            margin: [0, 16, 0, 0]
        }),

        h1: (text: string) => ({
            alignment: 'left',
            bold: true,
            color: '#062e4d',
            fontSize: 26,
            lineHeight: 1,
            margin: [0, 16, 0, 0],
            text
        }),

        h2: (text: string) => ({
            bold: true,
            color: '#1b1b1b',
            fontSize: 20,
            margin: [0, 16, 0, 0],
            text
        }),

        h3: (text: string) => ({
            bold: true,
            color: '#1b1b1b',
            fontSize: 16,
            margin: [0, 16, 0, 0],
            text
        }),

        h3Primary: (text: string) => ({
            bold: true,
            color: '#062e4d',
            fontSize: 16,
            margin: [0, 16, 0, 0],
            text
        }),

        h4: (text: string) => ({
            bold: true,
            color: '#1b1b1b',
            fontSize: 14,
            margin: [0, 16, 0, 0],
            text
        }),

        text: (text: string, options: any = {}) => ({
            margin: [0, 16, 0, 0],
            color: '#1b1b1b',
            fontSize: 13,
            text,
            ...options
        }),

        topMargin: () => ({
            margin: [0, 16, 0, 0],
            fontSize: 13,
            text: ''
        }),

        highlightText: (text: string, options: any = {}) => ({
            margin: [0, 16, 0, 0],
            color: '#000000',
            fontSize: 13,
            text,
            ...options
        }),

        lightText: (text: string, options: any = {}) => ({
            margin: [0, 16, 0, 0],
            color: '#484644',
            fontSize: 12,
            text,
            ...options
        }),

        lightTextCenter: (text: string, options: any = {}) => ({
            margin: [0, 16, 0, 0],
            color: '#484644',
            alignment: 'center',
            fontSize: 12,
            text,
            ...options
        }),

        header: (text: string, options: any = {}) => ({
            margin: [16, 4, 16, 4],
            alignment: 'right',
            color: '#484644',
            fontSize: 10,
            text,
            ...options
        }),

        notes: (text: string, options: any = {}) => ({
            margin: [0, 16, 0, 0],
            fontSize: 13,
            table: {
                widths: '*',
                body: [
                    [
                        {
                            border: [false, false, false, false],
                            fillColor: '#f1f4f6',
                            text
                        }
                    ]
                ]
            },
            ...options
        })
    };

    async createSamplePdf(): Promise<void> {
        await this.createPdf({
            pdfGenerateFilename: `sample.pdf`,
            onError: (error) => {
                console.error(`error creating pdf`, error);
            },
            pdfData: this.getPdfDocument({
                content: [
                    this.components.headerImage({
                        imageBase64: await this.getImageBase64(
                            'https://assets-eu-01.kc-usercontent.com/f623579d-b3db-01c8-4a3e-a116bb5905a3/462b0554-dbac-48be-9af9-461256218d1d/hero.png'
                        ),
                        heightPx: 200
                    }),
                    this.components.h1('Title'),
                    this.components.text('Text'),
                    this.components.lightText(`Light text`),
                    this.components.divider(),
                    this.components.topMargin(),
                    this.components.lightText(`Another text`)
                ]
            })
        });
    }

    async createPdf(data: { pdfGenerateFilename: string; pdfData: any; onError: (error: any) => void }): Promise<void> {
        const pdfResponse = await Axios.post(
            this.generatePdfUrl,
            {
                filename: `${data.pdfGenerateFilename}`,
                pdfData: data.pdfData
            },
            {
                responseType: 'arraybuffer'
            }
        );

        // force download file
        const pdfBlob = new Blob([pdfResponse.data]);
        saveAs(pdfBlob, data.pdfGenerateFilename);
    }

    async getImageBase64(imageUrl?: string): Promise<string | null> {
        if (!imageUrl) {
            return Promise.resolve(null);
        }

        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = imageUrl;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    throw Error(`Invalid ctx`);
                }
                ctx.drawImage(img, 0, 0);
                const dataURL = canvas.toDataURL('image/png');
                resolve(dataURL);
            };
            img.onerror = () => resolve(null);
        });
    }

    private getPdfDocument(data: { content: any[] }): any {
        return {
            pageSize: 'A4',
            pageOrientation: 'portrait',
            pageMargins: [16, 16],
            content: data.content
        };
    }
}
