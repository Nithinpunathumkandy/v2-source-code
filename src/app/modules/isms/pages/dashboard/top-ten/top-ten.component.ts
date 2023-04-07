import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { IsmsDashboardService } from 'src/app/core/services/isms/dashboard/isms-dashboard.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ISMSDashboardStore } from 'src/app/stores/isms/dashboard/isms-dashboard-store';

@Component({
  selector: 'app-top-ten',
  templateUrl: './top-ten.component.html'
})
export class TopTenComponent implements OnInit {

  ISMSDashboardStore = ISMSDashboardStore;
  AppStore = AppStore;
  reactionDisposer: IReactionDisposer;
  top10Empty ='isms_risk_top_10_title_nodata';
  
  constructor(private _ismsDashboardService: IsmsDashboardService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    ) { }

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof TopTenComponent
   */
  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: null , submenuItem: { type: 'close', path: "/isms/dashboard" } },    
    
      ]

      this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
    
     
    })
    // NoDataItemStore.setNoDataItems({ title: "isms_risk_top_10_title_nodata"});
    setTimeout(() => {
      this.getIsmsRisk();
      }, 1000);
  }

  getIsmsRisk(){
    this._ismsDashboardService.getRisk(false, null).subscribe(res=>{
    this._utilityService.detectChanges(this._cdr);
    })
  }

}
