import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {

    public readonly languageSource = new BehaviorSubject<string>('default');
    public readonly langaugeChanged$ = this.languageSource.asObservable();

    constructor(){
    }

    setLanguage(languageCodename: string) {
        this.languageSource.next(languageCodename);
    }
}
