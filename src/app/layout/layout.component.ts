import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { BaseComponent, BaseDependencies } from '../base/base.component';

interface ILanguage {
    title: string;
    codename: string;
}

@Component({
    templateUrl: './layout.component.html'
})
export class LayoutComponent extends BaseComponent {
    public readonly languages: ILanguage[] = [
        {
            codename: 'default',
            title: 'EN'
        },
        {
            codename: 'german',
            title: 'DE'
        }
    ];

    public activeLanguage: string;

    constructor(dependencies: BaseDependencies, cdr: ChangeDetectorRef, private activatedRoute: ActivatedRoute) {
        super(dependencies, cdr);

        this.activeLanguage = this.dependencies.languageService.languageSource.getValue();
    }

    setLanguage(codename: string): void {
        this.dependencies.languageService.setLanguage(codename);
        this.activeLanguage = codename;
    }
}
