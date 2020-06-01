import { Component, ChangeDetectorRef } from '@angular/core';

import { BaseComponent, BaseDependencies } from '../base/base.component';

@Component({
    templateUrl: './layout.component.html'
})
export class LayoutComponent extends BaseComponent {
    constructor(dependencies: BaseDependencies, cdr: ChangeDetectorRef) {
        super(dependencies, cdr);
    }
}
