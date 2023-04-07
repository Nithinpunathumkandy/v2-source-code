import { Component, OnDestroy, OnInit } from '@angular/core';
import { MaturityMatrixPlanStore } from 'src/app/stores/event-monitoring/event-maturity-matrix/event-maturity-matrix-plan-store';
@Component({
  selector: 'app-maturity-matrix',
  templateUrl: './maturity-matrix.component.html',
  styleUrls: ['./maturity-matrix.component.scss']
})
export class MaturityMatrixComponent implements OnInit,OnDestroy {
  MaturityMatrixPlanStore=MaturityMatrixPlanStore
  constructor() { }

  ngOnInit(): void {
  }
  ngOnDestroy() {
    MaturityMatrixPlanStore.unsetMaturityMatrixPlanList();
  }

}
