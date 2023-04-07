import { Component, ChangeDetectorRef,OnInit } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ByDocumentTypeService } from 'src/app/core/services/business-assessments/assessments/by-document-type/by-document-type.service';
import { ByDocumentTypeStore } from 'src/app/stores/business-assessments/assessments/by-document-type.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';

@Component({
  selector: 'app-assessment-document-type',
  templateUrl: './assessment-document-type.component.html',
  styleUrls: ['./assessment-document-type.component.scss']
})
export class AssessmentDocumentTypeComponent implements OnInit {

  ByDocumentTypeStore = ByDocumentTypeStore;
  subMenuItems: { id: number, title: string }[];
  AppStore = AppStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  emptyMessage="no_data_found";
  constructor(
      private _byDocumentTypeService: ByDocumentTypeService,
      private _utilityService: UtilityService,
      private _cdr: ChangeDetectorRef,
  ) { }


  ngOnInit() {
   

    NoDataItemStore.setNoDataItems({title: "assessment_nodata_title"});


    this._byDocumentTypeService.getByDocumentTypeSummary().subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
    });
    
    this._byDocumentTypeService.getExcellentByDocumentTypes().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
            
}

getData(type: string) {
    this.setStatus(type);

    switch (type) {
        case "excellent":
            if(ByDocumentTypeStore.excellent_status == 'Active')
            this._byDocumentTypeService.getExcellentByDocumentTypes().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
            
            break;

        case "good":
            if (ByDocumentTypeStore.good_status == 'Active') {
                this._byDocumentTypeService.getGoodByDocumentTypes().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
            }
            break;

        case "average":
            if (ByDocumentTypeStore.average_status == 'Active') {
                this._byDocumentTypeService.getAverageByDocumentTypes().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
            }
            break;

        case "below_average":
            if (ByDocumentTypeStore.below_status == 'Active') {
                this._byDocumentTypeService.getBelowAverageByDocumentTypes().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
            }
            break;
    }
    this._utilityService.detectChanges(this._cdr);
}

setStatus(type) {
    switch (type) {
        case "excellent":
            if (ByDocumentTypeStore.excellent_status != 'Active')
                ByDocumentTypeStore.excellent_status = 'Active';
            else
                ByDocumentTypeStore.excellent_status = 'Inactive';
            break;

        case "good":
            if (ByDocumentTypeStore.good_status != 'Active')
                ByDocumentTypeStore.good_status = 'Active';
            else
                ByDocumentTypeStore.good_status = 'Inactive';
            break;
        case "average":
            if (ByDocumentTypeStore.average_status != 'Active')
                ByDocumentTypeStore.average_status = 'Active';
            else
                ByDocumentTypeStore.average_status = 'Inactive';
            break;

        case "below_average":
            if (ByDocumentTypeStore.below_status != 'Active')
                ByDocumentTypeStore.below_status = 'Active';
            else
                ByDocumentTypeStore.below_status = 'Inactive';
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
    ByDocumentTypeStore.summary_loaded = false;
}

}
