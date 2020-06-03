import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';

import { BaseComponent, BaseDependencies } from '../base/base.component';
import { CustomerPersona } from '../data/customer_persona';

@Component({
    templateUrl: './resources.component.html',
    styleUrls: ['resources.component.scss']
})
export class ResourcesComponent extends BaseComponent implements OnInit {
    public personas: CustomerPersona[] = [];

    constructor(dependencies: BaseDependencies, cdr: ChangeDetectorRef) {
        super(dependencies, cdr);

        super.subscribeToObservable(
            this.dependencies.languageService.langaugeChanged$.pipe(
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
                .items<CustomerPersona>()
                .type('customer_persona')
                .languageParameter(language)
                .toObservable()
                .pipe(
                    map((response) => {
                        this.personas = response.items.filter((m) => m.system.language === language);
                        super.markForCheck();
                    })
                )
        );
    }
}
