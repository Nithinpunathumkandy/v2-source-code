import { Component, ChangeDetectorRef,OnInit } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ByDepartmentService } from 'src/app/core/services/business-assessments/assessments/by-department/by-department.service';
import { ByDepartmentStore } from 'src/app/stores/business-assessments/assessments/by-department.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';

@Component({
  selector: 'app-assessment-department',
  templateUrl: './assessment-department.component.html',
  styleUrls: ['./assessment-department.component.scss']
})
export class AssessmentDepartmentComponent implements OnInit {

  ByDepartmentStore = ByDepartmentStore;
  subMenuItems: { id: number, title: string }[];
  AppStore = AppStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  emptyMessage="no_data_found";
  constructor(
      private _byDepartmentService: ByDepartmentService,
      private _utilityService: UtilityService,
      private _cdr: ChangeDetectorRef,
  ) { }


  ngOnInit() {
    NoDataItemStore.setNoDataItems({title: "assessment_nodata_title"});

    this._byDepartmentService.getByDepartmentSummary().subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
    });
    
    this._byDepartmentService.getExcellentByDepartments().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
            
}

getData(type: string) {
    this.setStatus(type);

    switch (type) {
        case "excellent":
            if(ByDepartmentStore.excellent_status == 'Active')
            this._byDepartmentService.getExcellentByDepartments().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
            
            break;

        case "good":
            if (ByDepartmentStore.good_status == 'Active') {
                this._byDepartmentService.getGoodByDepartments().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
            }
            break;

        case "average":
            if (ByDepartmentStore.average_status == 'Active') {
                this._byDepartmentService.getAverageByDepartments().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
            }
            break;

        case "below_average":
            if (ByDepartmentStore.below_status == 'Active') {
                this._byDepartmentService.getBelowAverageByDepartments().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
            }
            break;
    }
    this._utilityService.detectChanges(this._cdr);
}

setStatus(type) {
    switch (type) {
        case "excellent":
            if (ByDepartmentStore.excellent_status != 'Active')
                ByDepartmentStore.excellent_status = 'Active';
            else
                ByDepartmentStore.excellent_status = 'Inactive';
            break;

        case "good":
            if (ByDepartmentStore.good_status != 'Active')
                ByDepartmentStore.good_status = 'Active';
            else
                ByDepartmentStore.good_status = 'Inactive';
            break;
        case "average":
            if (ByDepartmentStore.average_status != 'Active')
                ByDepartmentStore.average_status = 'Active';
            else
                ByDepartmentStore.average_status = 'Inactive';
            break;

        case "below_average":
            if (ByDepartmentStore.below_status != 'Active')
                ByDepartmentStore.below_status = 'Active';
            else
                ByDepartmentStore.below_status = 'Inactive';
            break;
    }
}

getNoDataSource(type){
    let noDataSource = {
      noData: this.emptyMessage, border: false, imageAlign: type
    }
    return noDataSource;
  }

ngOnDestroy() {
    SubMenuItemStore.makeEmpty();
    ByDepartmentStore.summary_loaded = false;
}

}
