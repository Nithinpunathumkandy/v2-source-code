import { Component, ChangeDetectorRef,OnInit } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ByMsTypeService } from 'src/app/core/services/business-assessments/assessments/by-ms-type/by-ms-type.service';
import { ByMsTypeStore } from 'src/app/stores/business-assessments/assessments/by-ms-type.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';

@Component({
  selector: 'app-assessment-ms-type',
  templateUrl: './assessment-ms-type.component.html',
  styleUrls: ['./assessment-ms-type.component.scss']
})
export class AssessmentMsTypeComponent implements OnInit {

  ByMsTypeStore = ByMsTypeStore;
  subMenuItems: { id: number, title: string }[];
  AppStore = AppStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  emptyMessage="no_data_found";
  constructor(
      private _byMsTypeService: ByMsTypeService,
      private _utilityService: UtilityService,
      private _cdr: ChangeDetectorRef,
  ) { }


  ngOnInit() {
  

    NoDataItemStore.setNoDataItems({title: "assessment_nodata_title"});


    this._byMsTypeService.getByMsTypeSummary().subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
    });
    
    this._byMsTypeService.getExcellentByMsTypes().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
            
}

getData(type: string) {
    this.setStatus(type);

    switch (type) {
        case "excellent":
            if(ByMsTypeStore.excellent_status == 'Active')
            this._byMsTypeService.getExcellentByMsTypes().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
            
            break;

        case "good":
            if (ByMsTypeStore.good_status == 'Active') {
                this._byMsTypeService.getGoodByMsTypes().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
            }
            break;

        case "average":
            if (ByMsTypeStore.average_status == 'Active') {
                this._byMsTypeService.getAverageByMsTypes().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
            }
            break;

        case "below_average":
            if (ByMsTypeStore.below_status == 'Active') {
                this._byMsTypeService.getBelowAverageByMsTypes().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
            }
            break;
    }
    this._utilityService.detectChanges(this._cdr);
}

setStatus(type) {
    switch (type) {
        case "excellent":
            if (ByMsTypeStore.excellent_status != 'Active')
                ByMsTypeStore.excellent_status = 'Active';
            else
                ByMsTypeStore.excellent_status = 'Inactive';
            break;

        case "good":
            if (ByMsTypeStore.good_status != 'Active')
                ByMsTypeStore.good_status = 'Active';
            else
                ByMsTypeStore.good_status = 'Inactive';
            break;
        case "average":
            if (ByMsTypeStore.average_status != 'Active')
                ByMsTypeStore.average_status = 'Active';
            else
                ByMsTypeStore.average_status = 'Inactive';
            break;

        case "below_average":
            if (ByMsTypeStore.below_status != 'Active')
                ByMsTypeStore.below_status = 'Active';
            else
                ByMsTypeStore.below_status = 'Inactive';
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
    ByMsTypeStore.summary_loaded = false
}

}
