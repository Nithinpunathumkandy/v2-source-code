import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import{RiskStatusMasterStore} from 'src/app/stores/masters/risk-management/risk-status-store';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RiskStatusService } from 'src/app/core/services/masters/risk-management/risk-status/risk-status.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';


declare var $: any;


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-risk-status',
  templateUrl: './risk-status.component.html',
  styleUrls: ['./risk-status.component.scss']
})
export class RiskStatusComponent implements OnInit, OnDestroy {
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;
  reactionDisposer: IReactionDisposer;
  RiskStatusMasterStore = RiskStatusMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_risk_status_message';



  constructor(  private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _riskStatusService: RiskStatusService){}

  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'RISK_STATUS_LIST', submenuItem: { type: 'search' }},
        {activityName: 'EXPORT_RISK_STATUS', submenuItem: {type: 'export_to_excel'}},
        {activityName: 'SHARE_RISK_STATUS', submenuItem: {type: 'share'}},
        {activityName: null, submenuItem: {type: 'close', path: 'risk-management'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    
          if (SubMenuItemStore.clikedSubMenuItem) {
    
            switch (SubMenuItemStore.clikedSubMenuItem.type) {
              case "export_to_excel":
                this._riskStatusService.exportToExcel();
                break;
              case "search":
                RiskStatusMasterStore.searchText = SubMenuItemStore.searchText;
                this.pageChange(1);
                break;
              case "share":
                ShareItemStore.setTitle('share_risk_status_title');
                ShareItemStore.formErrors = {};
                break;
              default:
                break;
            }
            // Don't forget to unset clicked item immediately after using it
            SubMenuItemStore.unSetClickedSubMenuItem();
          }
          if(NoDataItemStore.clikedNoDataItem){
          
            NoDataItemStore.unSetClickedNoDataItem();
          }
          if(ShareItemStore.shareData){
            this._riskStatusService.shareData(ShareItemStore.shareData).subscribe(res=>{
                ShareItemStore.unsetShareData();
                ShareItemStore.setTitle('');
                ShareItemStore.unsetData();
                $('.modal-backdrop').remove();
                document.body.classList.remove('modal-open');
                setTimeout(() => {
                  $(this.mailConfirmationPopup.nativeElement).modal('show');              
                }, 200);
            },(error)=>{
              if(error.status == 422){
                ShareItemStore.processFormErrors(error.error.errors);
              }
              ShareItemStore.unsetShareData();
              this._utilityService.detectChanges(this._cdr);
              $('.modal-backdrop').remove();
              console.log(error);
            });
          }
        })

       

    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) RiskStatusMasterStore.setCurrentPage(newPage);
    this._riskStatusService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  

  

  sortTitle(type: string) {
    //RiskStatusMasterStore.setCurrentPage(1);
    this._riskStatusService.sortRiskStatusList(type, null);
    this.pageChange();
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    RiskStatusMasterStore.searchText = '';
    RiskStatusMasterStore.currentPage = 1 ;
  }

}
