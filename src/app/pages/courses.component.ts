import { ChangeDetectorRef, Component } from '@angular/core';

import { BaseComponent, BaseDependencies } from '../base/base.component';

@Component({
    templateUrl: './courses.component.html'
})
export class CoursesComponent extends BaseComponent {
    constructor(dependencies: BaseDependencies, cdr: ChangeDetectorRef) {
        super(dependencies, cdr);
    }
}
