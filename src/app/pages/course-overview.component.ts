import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';

import { BaseComponent, BaseDependencies } from '../base/base.component';

@Component({
    templateUrl: './course-overview.component.html'
})
export class CourseOverviewComponent extends BaseComponent implements OnInit {
    public readonly courseCodename: string;

    constructor(dependencies: BaseDependencies, cdr: ChangeDetectorRef) {
        super(dependencies, cdr);
        this.courseCodename = this.dependencies.activatedRoute.snapshot.paramMap.get('codename');
    }

    ngOnInit(): void {
        super.subscribeToObservable(
            this.deliveryClient
                .items()
                .toObservable()
                .pipe(
                    map((response) => {
                        console.log(response);
                    })
                )
        );
    }
}
