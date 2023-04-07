import { Component, OnDestroy, OnInit } from '@angular/core';
import { MaturityMatrixPlanStore } from 'src/app/stores/event-monitoring/event-maturity-matrix/event-maturity-matrix-plan-store';
@Component({
  selector: 'app-maturity-matrix-plan-details',
  templateUrl: './maturity-matrix-plan-details.component.html',
  styleUrls: ['./maturity-matrix-plan-details.component.scss']
})
export class MaturityMatrixPlanDetailsComponent implements OnInit,OnDestroy {
  MaturityMatrixPlanStore=MaturityMatrixPlanStore;
  constructor() { }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
  MaturityMatrixPlanStore.unsetMatricPlanDetails();
  }

}
