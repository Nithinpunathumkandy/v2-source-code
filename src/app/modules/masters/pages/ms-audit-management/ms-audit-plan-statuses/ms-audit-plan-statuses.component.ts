import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { MsAuditPlanStatusService } from 'src/app/core/services/masters/ms-audit-management/ms-audit-plan-status/ms-audit-plan-status.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { MsAditPlanStatusMasterStore } from 'src/app/stores/masters/ms-audit-management/ms-audit-plan-status-store';

declare var $: any;

@Component({
  selector: 'app-ms-audit-plan-statuses',
  templateUrl: './ms-audit-plan-statuses.component.html',
  styleUrls: ['./ms-audit-plan-statuses.component.scss']
})
export class MsAuditPlanStatusesComponent implements OnInit {
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  
  MsAditPlanStatusMasterStore = MsAditPlanStatusMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  AuthStore = AuthStore;
  AppStore = AppStore;

  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  
  constructor(
    private _msAuditPlanStatusService: MsAuditPlanStatusService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2
  ) { }

  ngOnInit(): void {
    
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle'});

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'MS_AUDIT_PLAN_STATUS_LIST', submenuItem: { type: 'search' }},
        //{activityName: '', submenuItem: {type: 'new_modal'}},
        {activityName: 'EXPORT_MS_AUDIT_PLAN_STATUS', submenuItem: {type: 'export_to_excel'}},
        {activityName: null, submenuItem: {type: 'close', path: '/masters/ms-audit-management'}},
      ]
      if(!AuthStore.getActivityPermission(100,'')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
                           
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "search":
            MsAditPlanStatusMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
            case "export_to_excel":
            this._msAuditPlanStatusService.exportToExcel();
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })
    // for deleting/activating/deactivating using delete modal

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
      if(!status && $(this.formModal.nativeElement).hasClass('show')){
        this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
        this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
      if(!status && $(this.formModal.nativeElement).hasClass('show')){
        this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
        this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
      }
    })
    this.pageChange(1);
  }


  pageChange(newPage: number = null) {
    if (newPage) MsAditPlanStatusMasterStore.setCurrentPage(newPage);
    this._msAuditPlanStatusService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  sortTitle(type: string) {
    this._msAuditPlanStatusService.sortAditPlanStatus(type, null);
    this.pageChange();
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    MsAditPlanStatusMasterStore.searchText = '';
    MsAditPlanStatusMasterStore.currentPage = 1 ;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    MsAditPlanStatusMasterStore.unsetAditPlanStatus();
  }


}
