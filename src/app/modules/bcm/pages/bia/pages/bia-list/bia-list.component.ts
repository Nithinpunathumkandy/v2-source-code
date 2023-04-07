import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';
import { BiaService } from 'src/app/core/services/bcm/bia/bia.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BCMDashboardStore } from 'src/app/stores/bcm/bcm-dashboard/bcm-dashboard-store';
import { BiaStore } from 'src/app/stores/bcm/bia/bia.store';
import { ProcessStore } from 'src/app/stores/bpm/process/processes.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';

declare var $: any;
@Component({
  selector: 'app-bia-list',
  templateUrl: './bia-list.component.html',
  styleUrls: ['./bia-list.component.scss']
})
export class BiaListComponent implements OnInit {

  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  AppStore = AppStore;
  AuthStore = AuthStore;
  BiaStore = BiaStore
  popupObject = {
    title: '',
    id: null,
    subtitle: '',
    type:null
  };

  deleteEventSubscription: any;
  filterSubscription: Subscription = null;
  constructor(
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,  
    private _router: Router,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _rightSidebarFilterService: RightSidebarFilterService,
    private _biaService:BiaService
  ) { }

  ngOnInit(): void {

    RightSidebarLayoutStore.showFilter = true;
    BiaStore.loaded = false
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.BiaStore.loaded = false;
      this.getBiaList(1);
    })
    NoDataItemStore.setNoDataItems({title: "Looks like we don't have any items added here!", subtitle: 'Add an item if there is any. To add, simply tap the button below.', buttonText: 'New Business Impact Analysis'});
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'IMPACT_ANALYSIS_LIST', submenuItem: {type: 'search'}},
        {activityName: 'IMPACT_ANALYSIS_LIST', submenuItem: {type: 'refresh'}},
        {activityName: 'UPDATE_IMPACT_ANALYSIS', submenuItem: {type: 'new_modal'}},
        // {activityName: null, submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_IMPACT_ANALYSIS', submenuItem: {type: 'export_to_excel'}},
      ]
      if(!AuthStore.getActivityPermission(100,'UPDATE_IMPACT_ANALYSIS')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(600, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            
            setTimeout(() => {
              this._router.navigateByUrl('bcm/business-impact-analysis/add');
              this._utilityService.detectChanges(this._cdr);
            }, 100);
            break;
          case "search":
            BiaStore.searchText = SubMenuItemStore.searchText;
            this.getBiaList(1);
            break;
          case "refresh":
            BiaStore.unsetBia();
              this.getBiaList(1);
              break;
          case "export_to_excel":
              this._biaService.exportToExcel();
            break;
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if(NoDataItemStore.clikedNoDataItem){
        this._router.navigateByUrl('bcm/business-impact-analysis/add');
        NoDataItemStore.unSetClickedNoDataItem();
      }
    })
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    SubMenuItemStore.setNoUserTab(true);
    BiaStore.selectedProcessId = null;
    BiaStore.businessAnalysisId = null;
    BiaStore.selectedBiaId = null;
    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    RightSidebarLayoutStore.filterPageTag = 'bcm_bia';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
    'organization_ids',
    'division_ids',
    'department_ids',
    'section_ids',
    'sub_section_ids',
    ]);

    this.getBiaList()
  }

  deleteConfirm(id: number) {
    event.stopPropagation();
    this.popupObject.id = id;
    this.popupObject.title='';
    this.popupObject.subtitle='bia_delete_subtitle';
    this.popupObject.type = 'are_you_sure_delete'
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  edit(processId:number){
    BiaStore.selectedProcessId = processId // To make procedure selected
    BiaStore.is_edit = true               //Make procedure select button disabled
    this._router.navigateByUrl('bcm/business-impact-analysis/edit');
  }

  getBiaList(newPage: number = null) {
    if (newPage) BiaStore.setCurrentPage(newPage);
    var additionalParams=''
    if (BCMDashboardStore.dashboardParameter) {
      additionalParams = BCMDashboardStore.dashboardParameter
    }
    this._biaService.getAllItems(false,additionalParams ? additionalParams : '').subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case 'are_you_sure_delete': this.deleteProcess(status)
        break;
      // case 'Activate': this.activateProcess(status)
      //   break;
      // case 'Deactivate': this.deactivateProcess(status)
      //   break;

    }
  }

  deleteProcess(status: boolean) {
    if (status && this.popupObject.id) {
      this._biaService.delete(this.popupObject.id).subscribe(resp => {
        this._utilityService.detectChanges(this._cdr);
        this.clearPopupObject();
        this.closeConfirmationPopup();
        this.getBiaList(1);
      },(error=>{
        if(error.status == 405){
          let id = this.popupObject.id;
          this.clearPopupObject();
          this.closeConfirmationPopup();
          this._utilityService.detectChanges(this._cdr);
        }
      })
      );
    }
    else {
      this._utilityService.detectChanges(this._cdr);
      this.closeConfirmationPopup();
      this.clearPopupObject();
    }  
    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  clearPopupObject() {
    this.popupObject.id = null;
    this.popupObject.title = '';
    this.popupObject.subtitle = '';
    this.popupObject.type = '';

}

setProcessSort(type) {
  BiaStore.setCurrentPage(1);
  this._biaService.sortList(type,SubMenuItemStore.searchText);
}

closeConfirmationPopup(){
  $(this.confirmationPopUp.nativeElement).modal('hide');
  setTimeout(() => {
    this._utilityService.detectChanges(this._cdr);
  }, 100);
}

  gotoBiaDetails(id,processId) {
    BiaStore.businessAnalysisId = id
    BiaStore.selectedProcessId = processId
    this._biaService.getImpactResult(id).subscribe(res=>{
      this._router.navigateByUrl("/bcm/business-impact-analysis/" + id);
    })
  }

  gotoProcessDetails(processId) {
    ProcessStore.process_id = processId
      this._router.navigateByUrl("/bpm/process/" + processId);
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    NoDataItemStore.unsetNoDataItems();
    SubMenuItemStore.makeEmpty();
    this.deleteEventSubscription.unsubscribe()
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
  }

}
