import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login.component';
import { LayoutComponent } from './layout/layout.component';
import { CoursesComponent } from './pages/courses.component';
import { CourseOverviewComponent } from './pages/course-overview.component';


const routes: Routes = [
  {
    path: '', component: LoginComponent, children: [
    ]
  },
  {
    path: 'auth', component: LayoutComponent, children: [
      { path: 'courses', component: CoursesComponent },
      { path: 'view/:codename', component: CourseOverviewComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
