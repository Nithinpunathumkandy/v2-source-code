import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { BcpService } from "src/app/core/services/bcm/bcp/bcp.service";
import { BcpStore } from 'src/app/stores/bcm/bcp/bcp-store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { Subscription } from 'rxjs';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { BusinessContinuityPlanStatusMasterStore } from 'src/app/stores/masters/bcm/business-continuity-plan-status.store';
import { BusinessContinuityPlanStatusService } from 'src/app/core/services/masters/bcm/business-continuity-plan-status/business-continuity-plan-status.service';

declare var $: any;

@Component({
  selector: 'app-bcp-list',
  templateUrl: './bcp-list.component.html',
  styleUrls: ['./bcp-list.component.scss']
})
export class BcpListComponent implements OnInit {

  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;
  
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  AppStore = AppStore;
  AuthStore = AuthStore;
  BcpStore = BcpStore;
  mailConfirmationData = 'share_bcp_message';
  bcpObject = {
    component: 'BCP',
    values: null,
    type: null
  };
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  bcpModalSubscription: any = null;
  popupControlSubscription: any = null;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  filterSubscription: Subscription = null;
  
  constructor(private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, private _router: Router,
    private _helperService: HelperServiceService, private _bcpService: BcpService,
    private _eventEmitterService: EventEmitterService, private _renderer2: Renderer2,
    private _rightSidebarFilterService: RightSidebarFilterService, private _bcpPlanStatusService: BusinessContinuityPlanStatusService) { }

  ngOnInit(): void {

    RightSidebarLayoutStore.showFilter = true;

    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.BcpStore.loaded = false;
      this.sortedStatusItems(BcpStore.selectedStatusCategory,1);
    })
    
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_bcp'});
    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'BUSINESS_CONTINUITY_PLAN_LIST', submenuItem: {type: 'search'}},
        {activityName: 'BUSINESS_CONTINUITY_PLAN_LIST', submenuItem: {type: 'refresh'}},
        {activityName: 'CREATE_BUSINESS_CONTINUITY_PLAN', submenuItem: {type: 'new_modal'}},
        // {activityName: null, submenuItem: {type: 'template'}},
        {activityName: null, submenuItem: {type: 'export_to_excel'}},
        // {activityName: null, submenuItem: {type: 'import'}},
      ]
      this._helperService.checkSubMenuItemPermissions(600, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.addNewBCP();
            break;
          case "search":
            BcpStore.searchText = SubMenuItemStore.searchText;
            this.sortedStatusItems(BcpStore.selectedStatusCategory,1);
            break;
          case "refresh":
            BcpStore.unsetBcpList();
            this.sortedStatusItems(BcpStore.selectedStatusCategory,1);
            break;
          case "template":
            this._bcpService.generateTemplate();
            break;
          case "export_to_excel":
            this._bcpService.exportToExcel();
            break;
          case "import":
            ImportItemStore.setTitle('import_division');
            ImportItemStore.setImportFlag(true);
            break;
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if(NoDataItemStore.clikedNoDataItem){
        this.addNewBCP();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      if(ImportItemStore.importClicked){
        ImportItemStore.importClicked = false;
        this._bcpService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
          ImportItemStore.unsetFileDetails();
          ImportItemStore.setTitle('');
          ImportItemStore.setImportFlag(false);
          $('.modal-backdrop').remove();
          this._utilityService.detectChanges(this._cdr);
        },(error)=>{
          if(error.status == 422){
            ImportItemStore.processFormErrors(error.error.errors);
          }
          else if(error.status == 500 || error.status == 403){
            ImportItemStore.unsetFileDetails();
            ImportItemStore.setImportFlag(false);
            $('.modal-backdrop').remove();
          }
          this._utilityService.detectChanges(this._cdr);
        })
      }
    })
    this.bcpModalSubscription = this._eventEmitterService.addBcpModal.subscribe(res=>{
      this.closeFormModal();
    });
    this.popupControlSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.deleteBcp(item);
    })
    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
      if (!status && $(this.formModal.nativeElement).hasClass('show')) {
        this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
        this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
      if (!status && $(this.formModal.nativeElement).hasClass('show')) {
        this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
        this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
      }
    })
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    SubMenuItemStore.setNoUserTab(true);

    RightSidebarLayoutStore.filterPageTag = 'bcm_bcp';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
      'bcp_status_ids',
    ]);
    BusinessContinuityPlanStatusMasterStore.loaded = false;
    this.sortedStatusItems(BcpStore.selectedStatusCategory,1);
  }

  pageChange(newPage: number = null){
    if (newPage) BcpStore.setCurrentPage(newPage);
    this._bcpService.getItems(false,null,true).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  sortedStatusItems(item,newPage: number = null,loading?){
    if (newPage) BcpStore.setCurrentPage(newPage);
    if(loading) BcpStore.loaded =false;
    if(BusinessContinuityPlanStatusMasterStore.loaded){
      this.getItems(item,newPage,loading)
    }
    else{
      this._bcpPlanStatusService.getItems().subscribe(res=>{
        this.getItems(item,newPage,loading);
      })
    }
    
  }

  getItems(item,newPage: number = null,loading?){
    switch (item) {
      case 'all':
        BcpStore.selectedStatusCategory = 'all';
        let ids=[];
        for (let i of BusinessContinuityPlanStatusMasterStore?.allItems) {
          if (i.type != 'archived') {
            ids.push(i.id);
          }
        }
        this._bcpService.getItems(false,'bcp_status_ids=' + ids.join() ).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
        break;
      case 'archived':
        BcpStore.selectedStatusCategory = 'archived';
        let archiveId;
        for (let i of BusinessContinuityPlanStatusMasterStore?.allItems) {
          if (i.type == 'archived'){
            archiveId = i.id;
          }
        }
        this._bcpService.getItems(false,'bcp_status_ids=' + archiveId).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
        break;
    }
  }

  scrollEvent = (event: any): void => {
    if(event.target.documentElement){
      const number = event.target.documentElement.scrollTop;
      if(number > 50){
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','45px');
        this._renderer2.addClass(this.navBar.nativeElement,'affix');
      }
      else{
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
        this._renderer2.removeClass(this.navBar.nativeElement,'affix');
      }
    }
  }

  addNewBCP(){
    this.bcpObject.type = 'Add';
    this.bcpObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  openFormModal() {
    // setTimeout(() => {
    //   $(this.formModal.nativeElement).modal('show');
    //   this._utilityService.detectChanges(this._cdr);
    // }, 100);
    setTimeout(() => {
      $('.modal-backdrop').add();
      document.body.classList.add('modal-open')
      this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'block');
      this._renderer2.removeAttribute(this.formModal.nativeElement, 'aria-hidden');
      setTimeout(() => {
        this._renderer2.addClass(this.formModal.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 100);
    }, 250);
  }

  closeFormModal() {
    // this._utilityService.detectChanges(this._cdr);
    // setTimeout(() => {
    //   this.bcpObject.type = null;
    //   this.bcpObject.values = null;
    //   $(this.formModal.nativeElement).modal('hide');
    //   this._utilityService.detectChanges(this._cdr);
    // }, 100);
    setTimeout(() => {
      this.bcpObject.type = null;
      this.bcpObject.values = null;
      document.body.classList.remove('modal-open')
      this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'none');
      this._renderer2.setAttribute(this.formModal.nativeElement, 'aria-hidden', 'true');
      $('.modal-backdrop').remove();
      setTimeout(() => {
        this._renderer2.removeClass(this.formModal.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 200);
    }, 100);
  }

  gotoBcpDetails(id: number){
    this._router.navigateByUrl('bcm/business-continuity-plan/'+id);
  }

  editBcp(id: number){
    event.stopPropagation();
    this._bcpService.getItem(id).subscribe(res=>{
      this.bcpObject.type = 'Edit';
      this.bcpObject.values = res;
      this.openFormModal();
    })
  }

  deleteConfirm(id: number){
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.subtitle = 'common_delete_subtitle';
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deleteBcp(status: boolean) {
    if (status && this.popupObject.id) {
      this._bcpService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
      });
    }
    else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
  }

  clearPopupObject() {
    this.popupObject.id = null;
  }

  setSort(type){
    this._bcpService.sortBcpList(type);
    this.sortedStatusItems(BcpStore.selectedStatusCategory,1);
  }

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.bcpModalSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.popupControlSubscription.unsubscribe();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    BcpStore.unsetBcpList();
  }

}
