import { Component, OnInit ,ChangeDetectorRef, OnDestroy} from '@angular/core';
import { MaturityMatrixPlanStore } from 'src/app/stores/event-monitoring/event-maturity-matrix/event-maturity-matrix-plan-store';
import { MaturityMatrixService } from 'src/app/core/services/event-monitoring/event-maturity-matrix/maturity-matrix.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
@Component({
  selector: 'app-maturity-matrix-list',
  templateUrl: './maturity-matrix-list.component.html',
  styleUrls: ['./maturity-matrix-list.component.scss']
})
export class MaturityMatrixListComponent implements OnInit,OnDestroy {
  NoDataItemStore=NoDataItemStore;
  selectedIndex=0;
  AppStore=AppStore;
  MaturityMatrixPlanStore=MaturityMatrixPlanStore;
  constructor(private _maturityMatrixService: MaturityMatrixService,private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,) { }

  ngOnInit(): void {
    setTimeout(() => {
      NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'maturity_matrix_subtitle' });
    }, 300);
    this.matrixType();
  }

  matrixType() {
   
      this._maturityMatrixService.getMatrixType().subscribe(res => {
        // if(res)
        // {
        //   this.changeIndex(0,res[0].id);
        // }
		     
				this._utilityService.detectChanges(this._cdr)
			})
  }
  changeIndex(index,id)
  {
    this.selectedIndex=index;
  
  }

  ngOnDestroy() {
    MaturityMatrixPlanStore.unsetMatrixTypeList(); 
  }

}
