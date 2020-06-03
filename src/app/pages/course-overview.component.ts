import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { BaseComponent, BaseDependencies } from '../base/base.component';
import { pdfGeneratorHelper } from '../helpers/pdf-generator.helper';

@Component({
  templateUrl: './course-overview.component.html',
})
export class CourseOverviewComponent extends BaseComponent implements OnInit {
  public readonly courseCodename: string;

  constructor(dependencies: BaseDependencies, cdr: ChangeDetectorRef, activatedRoute: ActivatedRoute) {
    super(dependencies, cdr);
    this.courseCodename = activatedRoute.snapshot.paramMap.get('codename');
  }

  ngOnInit(): void {
    super.subscribeToObservable(
      this.deliveryClient
        .items()
        .toObservable()
        .pipe(
          map((response) => {
            console.log(response);
          }),
        ),
    );
  }

  /**
   * https://github.com/MrRio/jsPDF
   */
  generatePdf(): void {
    pdfGeneratorHelper.generateCourseSummary();
  }
}
