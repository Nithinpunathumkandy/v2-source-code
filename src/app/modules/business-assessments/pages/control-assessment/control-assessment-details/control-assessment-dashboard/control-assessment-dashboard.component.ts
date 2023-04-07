import { Component, OnInit , OnDestroy} from '@angular/core';
import { ControlAssessmentDetailsStore } from 'src/app/stores/business-assessments/control-assessment/control-assessment-details-store';

@Component({
  selector: 'app-control-assessment-dashboard',
  templateUrl: './control-assessment-dashboard.component.html',
  styleUrls: ['./control-assessment-dashboard.component.scss']
})
export class ControlAssessmentDashboardComponent implements OnInit,OnDestroy {
  ControlAssessmentDetailsStore=ControlAssessmentDetailsStore;
  constructor() { }

  ngOnInit(): void {
    ControlAssessmentDetailsStore.unSetControlAssessmentId();
  }

  ngOnDestroy()
  {
   
  }

}
