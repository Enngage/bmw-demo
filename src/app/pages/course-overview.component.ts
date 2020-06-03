import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

import { BaseComponent, BaseDependencies } from '../base/base.component';
import { CourseNew } from '../data/course_new';
import { CustomerPersona } from '../data/customer_persona';
import { pdfGeneratorHelper } from '../helpers/pdf-generator.helper';

@Component({
    templateUrl: './course-overview.component.html',
    styleUrls: ['course-overview.component.scss']
})
export class CourseOverviewComponent extends BaseComponent implements OnInit {
    public readonly courseCodename: string;

    public courseNotAvailable = false;
    public course?: CourseNew;
    public personas?: CustomerPersona[];

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

      return new Intl.NumberFormat(locale, { style: 'currency', currency}).format(this.course.price.value);
  }

    constructor(dependencies: BaseDependencies, cdr: ChangeDetectorRef, activatedRoute: ActivatedRoute) {
        super(dependencies, cdr);
        this.courseCodename = activatedRoute.snapshot.paramMap.get('codename');

        super.subscribeToObservable(
            this.dependencies.languageService.langaugeChanged$.pipe(
                map((newLanguage) => {
                    this.loadCourse(newLanguage, this.courseCodename);
                    this.loadPersonas(this.getActiveLanguage());
                })
            )
        );
    }

    ngOnInit(): void {
        this.loadCourse(this.getActiveLanguage(), this.courseCodename);
        this.loadPersonas(this.getActiveLanguage());
    }

    /**
     * https://github.com/MrRio/jsPDF
     */
    generatePdf(): void {
        if (!this.course) {
            return;
        }
        pdfGeneratorHelper.generateCourseSummary(this.course);
    }

    getPersonaImage(persona: CustomerPersona): string {
      return persona.image.value[0].url;
    }

    loadPersonas(language: string): void {
        super.subscribeToObservable(
            this.deliveryClient
                .items<CustomerPersona>()
                .type('customer_persona')
                .languageParameter(language)
                .depthParameter(5)
                .toObservable()
                .pipe(
                    map((response) => {
                        this.personas = response.items.filter((m) => m.system.language === language);
                        super.markForCheck();
                    })
                )
        );
    }

    loadCourse(language: string, itemCodename: string): void {
        super.subscribeToObservable(
            this.deliveryClient
                .item<CourseNew>(itemCodename)
                .languageParameter(language)
                .depthParameter(5)
                .toObservable()
                .pipe(
                    map((response) => {
                        if (response.item.system.language === language) {
                            this.course = response.item;
                            this.courseNotAvailable = false;
                        } else {
                            this.courseNotAvailable = true;
                            this.course = undefined;
                        }

                        super.markForCheck();
                        console.log(response);
                    })
                )
        );
    }
}