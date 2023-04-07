import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ControlAssessmentStore } from 'src/app/stores/business-assessments/control-assessment/control-assessment.store';

@Component({
  selector: 'app-control-assessment',
  templateUrl: './control-assessment.component.html',
  styleUrls: ['./control-assessment.component.scss']
})
export class ControlAssessmentComponent implements OnInit,OnDestroy {
  ControlAssessmentStore=ControlAssessmentStore;
  constructor(private _router: Router) { 
    if(!ControlAssessmentStore?.docversionId)
    {
      this._router.navigateByUrl('/business-assessments/control-assessments'); 
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy()
  {
    ControlAssessmentStore.unsetDocumentId();
  }
}
