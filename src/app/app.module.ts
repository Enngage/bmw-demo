import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { CourseOverviewComponent } from './pages/course-overview.component';
import { CoursesComponent } from './pages/courses.component';
import { LoginComponent } from './pages/login.component';
import { ResourcesComponent } from './pages/resources.component';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

@NgModule({
    declarations: [
        AppComponent,
        LayoutComponent,
        CourseOverviewComponent,
        LoginComponent,
        CoursesComponent,
        ResourcesComponent
    ],
    imports: [FontAwesomeModule, FlexLayoutModule, BrowserModule, AppRoutingModule, RouterModule],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
  constructor(faIconLib: FaIconLibrary) {
    // Add an icon to the library for convenient access in other components
    faIconLib.addIconPacks(fas, far);
  }
}
