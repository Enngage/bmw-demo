import { ChangeDetectorRef, Directive, Injectable, OnDestroy } from '@angular/core';
import { IDeliveryClient } from '@kentico/kontent-delivery';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

import { observableHelper } from '../helpers/obsevable.helper';
import { KontentClientService } from '../services/kontent-client.service';
import { LanguageService } from '../services/language.service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class BaseDependencies {
    constructor(public kontentClientService: KontentClientService, public languageService: LanguageService, public router: Router) {}
}

@Directive()
export abstract class BaseComponent implements OnDestroy {
    protected readonly ngUnsubscribe: Subject<void> = new Subject<void>();
    protected readonly deliveryClient: IDeliveryClient;

    constructor(protected dependencies: BaseDependencies, protected cdr: ChangeDetectorRef) {
        this.deliveryClient = dependencies.kontentClientService.deliveryClient;
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    protected markForCheck(): void {
        this.cdr.markForCheck();
    }

    protected subscribeToObservables(observables: Observable<any>[]): void {
        this.subscribeToObservable(observableHelper.zipObservables(observables));
    }

    protected subscribeToObservable(observable: Observable<any>): void {
        observable
            .pipe(
                catchError((error) => {
                    return throwError(error);
                }),
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe(() => {
                this.markForCheck();
            });
    }

    protected getActiveLanguage(): string {
        return this.dependencies.languageService.languageSource.getValue();
    }
}
