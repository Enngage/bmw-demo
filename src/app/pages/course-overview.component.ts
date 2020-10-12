import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, skip } from 'rxjs/operators';

import { BaseComponent, BaseDependencies } from '../base/base.component';
import { CourseNew } from '../data/course_new';
import { CustomerPersona } from '../data/customer_persona';
import { Module } from '../data/module_01a2a1b';
import { pdfGeneratorHelper } from '../helpers/pdf-generator.helper';
import { PdfService } from '../services/pdf.service';

@Component({
    templateUrl: './course-overview.component.html',
    styleUrls: ['course-overview.component.scss']
})
export class CourseOverviewComponent extends BaseComponent implements OnInit {
    public readonly courseCodename: string;

    public itemLanguage: string;

    public courseNotAvailable = false;
    public course?: CourseNew;
    public personas?: CustomerPersona[];
    private readonly usePreview: boolean;

    public get translationArr(): number {
        if (this.itemLanguage === 'german') {
            return 1;
        }
        return 0;
    }
    public translations = {
        courseOverview: ['Course overview', 'Kursüberblick'],
        courseAudience: ['Course audience', 'Kurspublikum'],
        buyFor: ['Buy for', 'Kaufen Sie den Kurs für'],
        modules: ['Modules', 'Module'],
        moduleStructure: ['Module structure', 'Modulstruktur'],
        viewPersona: ['View persona', 'Persona anzeigen'],
        targetPersona: ['Target persona', 'Zielperson'],
        downloadPdf: ['Download course as PDF', 'Kurszusammenfassung als PDF herunterladen'],

    };

    public get courseImage(): string {
        if (!this.course) {
            return '';
        }

        return this.course.headerImage.value[0].url;
    }

    public get coursePrice(): string {
        if (!this.course) {
            return '';
        }

        const locale = this.getActiveLanguage() === 'default' ? 'en-US' : 'de-DE';
        const currency = this.course.currency.value[0].codename;

        return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(this.course.price.value);
    }

    public openedModuleCodenames: string[] = [];

    constructor(dependencies: BaseDependencies, cdr: ChangeDetectorRef, activatedRoute: ActivatedRoute) {
        super(dependencies, cdr);
        this.courseCodename = activatedRoute.snapshot.paramMap.get('codename');

        if (activatedRoute.snapshot.queryParamMap.has('isPreview')) {
            this.usePreview = true;
        }

        if (activatedRoute.snapshot.queryParamMap.has('previewLang')) {
            this.itemLanguage = activatedRoute.snapshot.queryParamMap.get('previewLang');
        } else {
            this.itemLanguage = super.getActiveLanguage();
        }

        super.subscribeToObservable(
            this.dependencies.languageService.langaugeChanged$.pipe(
                skip(1),
                map((newLanguage) => {
                    this.itemLanguage = newLanguage;
                    this.loadCourse(this.courseCodename);
                })
            )
        );
    }

    getText(key: string): string {
        return this.translations[key][this.translationArr];
    }

    ngOnInit(): void {
        this.loadCourse(this.courseCodename);
    }

    generatePdf(): void {
        if (!this.course) {
            return;
        }
        pdfGeneratorHelper.generateCourseSummary(this.course);
    }

    async generatePdfAlternate(): Promise<void> {
        if (!this.course) {
            return;
        }

        const pdfService = new PdfService();
        await pdfService.createSamplePdf();
    }

    getPersonaImage(persona: CustomerPersona): string {
        return persona.image.value[0].url;
    }

    isModuleOpened(module: Module): boolean {
        return this.openedModuleCodenames.includes(module.system.codename);
    }

    toggleModule(module: Module): void {
        if (this.isModuleOpened(module)) {
            this.openedModuleCodenames = this.openedModuleCodenames.filter((m) => m !== module.system.codename);
        } else {
            this.openedModuleCodenames.push(module.system.codename);
        }
        super.markForCheck();
    }

    loadCourse(itemCodename: string): void {
        super.subscribeToObservable(
            this.deliveryClient
                .item<CourseNew>(itemCodename)
                .queryConfig({
                    usePreviewMode: this.usePreview
                })
                .languageParameter(this.itemLanguage)
                .depthParameter(5)
                .toObservable()
                .pipe(
                    map((response) => {
                        if (response.item.system.language === this.itemLanguage) {
                            this.course = response.item;
                            this.courseNotAvailable = false;

                            this.personas = response.item.courseAudience.value;
                        } else {
                            this.courseNotAvailable = true;
                            this.course = undefined;
                            this.personas = [];
                        }

                        super.markForCheck();
                    })
                )
        );
    }
}
