import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { map, skip } from 'rxjs/operators';

import { BaseComponent, BaseDependencies } from '../base/base.component';
import { CourseNew } from '../data/course_new';
import { Training } from '../data/training';

@Component({
    templateUrl: './courses.component.html',
    styleUrls: ['courses.component.scss']
})
export class CoursesComponent extends BaseComponent implements OnInit {
    public courses: CourseNew[] = [];

    constructor(dependencies: BaseDependencies, cdr: ChangeDetectorRef) {
        super(dependencies, cdr);

        super.subscribeToObservable(
            this.dependencies.languageService.langaugeChanged$.pipe(
                skip(1),
                map((newLanguage) => {
                    this.loadCourses(newLanguage);
                })
            )
        );
    }

    ngOnInit(): void {
        this.loadCourses(this.getActiveLanguage());
    }

    private loadCourses(language: string): void {
        super.subscribeToObservable(
            this.deliveryClient
                .item<Training>('technical_qualification')
                .languageParameter(language)
                .toObservable()
                .pipe(
                    map((response) => {
                        this.courses = response.item.courses.value.filter((m) => m.system.language === language);
                        super.markForCheck();
                    })
                )
        );
    }
}
