import { Component, ChangeDetectorRef,OnInit } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ByPdcaService } from 'src/app/core/services/business-assessments/assessments/by-pdca/by-pdca.service';
import { ByPdcaStore } from 'src/app/stores/business-assessments/assessments/by-pdca.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';

@Component({
  selector: 'app-assessment-pdca',
  templateUrl: './assessment-pdca.component.html',
  styleUrls: ['./assessment-pdca.component.scss']
})
export class AssessmentPdcaComponent implements OnInit {

  ByPdcaStore = ByPdcaStore;
    subMenuItems: { id: number, title: string }[];
    AppStore = AppStore;
    SubMenuItemStore = SubMenuItemStore;
    AuthStore = AuthStore;
    constructor(
        private _byPdcaService: ByPdcaService,
        private _utilityService: UtilityService,
        private _cdr: ChangeDetectorRef,
    ) { }


    ngOnInit() {
  

      NoDataItemStore.setNoDataItems({title: "assessment_nodata_title"});


      this._byPdcaService.getByPdcaSummary().subscribe(res=>{
          this._utilityService.detectChanges(this._cdr);
      });
      
      this._byPdcaService.getExcellentByPdcas().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
      this._byPdcaService.getGoodByPdcas().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
      this._byPdcaService.getAverageByPdcas().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
      this._byPdcaService.getBelowAverageByPdcas().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
             
  }

  getData(type: string) {
      this.setStatus(type);

      switch (type) {
          case "excellent":
              if(ByPdcaStore.excellent_status == 'Active')
              this._byPdcaService.getExcellentByPdcas().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
              
              break;

          case "good":
              if (ByPdcaStore.good_status == 'Active') {
                  this._byPdcaService.getGoodByPdcas().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
              }
              break;

          case "average":
              if (ByPdcaStore.average_status == 'Active') {
                  this._byPdcaService.getAverageByPdcas().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
              }
              break;

          case "below_average":
              if (ByPdcaStore.below_status == 'Active') {
                  this._byPdcaService.getBelowAverageByPdcas().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
              }
              break;
      }
      this._utilityService.detectChanges(this._cdr);
  }

  setStatus(type) {
      switch (type) {
          case "excellent":
              if (ByPdcaStore.excellent_status != 'Active')
                  ByPdcaStore.excellent_status = 'Active';
              else
                  ByPdcaStore.excellent_status = 'Inactive';
              break;

          case "good":
              if (ByPdcaStore.good_status != 'Active')
                  ByPdcaStore.good_status = 'Active';
              else
                  ByPdcaStore.good_status = 'Inactive';
              break;
          case "average":
              if (ByPdcaStore.average_status != 'Active')
                  ByPdcaStore.average_status = 'Active';
              else
                  ByPdcaStore.average_status = 'Inactive';
              break;

          case "below_average":
              if (ByPdcaStore.below_status != 'Active')
                  ByPdcaStore.below_status = 'Active';
              else
                  ByPdcaStore.below_status = 'Inactive';
              break;
      }
  }

  ngOnDestroy() {
      SubMenuItemStore.makeEmpty();
      ByPdcaStore.summary_loaded = false;
  }

}
