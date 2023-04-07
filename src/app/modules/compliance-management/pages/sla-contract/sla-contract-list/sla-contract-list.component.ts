import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IReactionDisposer,autorun } from 'mobx';
import { Subscription } from 'rxjs';
import { SlaContractService } from 'src/app/core/services/compliance-management/sla-contract/sla-contract.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { SlaStatusesService } from 'src/app/core/services/masters/compliance-management/sla-statuses/sla-statuses.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { SLAContractStore } from 'src/app/stores/compliance-management/sla-contract/sla-contract-store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { SlaStatusesMasterStore } from 'src/app/stores/masters/compliance-management/sla-statuses-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any

@Component({
  selector: 'app-sla-contract-list',
  templateUrl: './sla-contract-list.component.html',
  styleUrls: ['./sla-contract-list.component.scss']
})
export class SlaContractListComponent implements OnInit {

  @ViewChild('formModal', { static: false }) formModal: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;

  AppStore = AppStore;
  SLAContractStore = SLAContractStore;
  AuthStore = AuthStore;
  UsersStore = UsersStore;
  SlaStatusesMasterStore = SlaStatusesMasterStore;

  reactionDisposer: IReactionDisposer;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  slaContractSubscriptionEvent: any = null;
  deleteEventSubscription:any;
  networkFailureSubscription: any;
  controlSlaCategorySubscriptionEvent:any = null;
  filterSubscription: Subscription = null;

  // selectedStatus:string = 'valid';
  deleteObject = {
    id: null,
    position: null,
    type: '',
    title: '',
    subtitle:'',
    category:''
  };

  formObject = {
    id: null,
    type : null,
    values : null
  };

  constructor(private _slaContractService:SlaContractService,
    private _helperService:HelperServiceService,
    private _cdr:ChangeDetectorRef,
    private _router:Router,
    private _utilityService:UtilityService,
    private _eventEmitterService:EventEmitterService,
    private _renderer2: Renderer2,
    private _rightSidebarFilterService: RightSidebarFilterService,
    private _slaStatusesService:SlaStatusesService,
    private _imageService:ImageServiceService,) { }

  ngOnInit(): void {
    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.SLAContractStore.loaded = false;

      this.sortedStatusItems(SLAContractStore.selectedStatusCategory);
      // this.getItems();
    })
    
    AppStore.showDiscussion = false;
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_sla_contract'});
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName:null, submenuItem: {type: 'refresh'}},
        { activityName: null, submenuItem: { type: 'search'} },
        { activityName: 'CREATE_SERVICE_LEVEL_AGREEMENT_AND_CONTRACT', submenuItem: { type: 'new_modal' } },
        // { activityName: 'SERVICE_LEVEL_AGREEMENT_AND_CONTRACT_TEMPLATE', submenuItem: { type: 'template' } },
        { activityName: 'EXPORT_SERVICE_LEVEL_AGREEMENT_AND_CONTRACT', submenuItem: { type: 'export_to_excel' } },
      ]
      if(AuthStore.userPermissionsLoaded && !AuthStore.getActivityPermission(100,'CREATE_SERVICE_LEVEL_AGREEMENT_AND_CONTRACT')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      if(NoDataItemStore.clikedNoDataItem){
        this.addSLAContract();
        NoDataItemStore.unSetClickedNoDataItem();
      }

      this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case 'refresh':
            SLAContractStore.unsetSLAContracts();
            this.sortedStatusItems(SLAContractStore.selectedStatusCategory,1);
            break
          case "new_modal":
            setTimeout(() => {
              this._utilityService.detectChanges(this._cdr);
              this.addSLAContract();
            }, 1000);
            break;
            case "template":
              this._slaContractService.generateTemplate();
            break;
          case "export_to_excel":
            this._slaContractService.exportToExcel();
            break;
            case "search":
              SLAContractStore.searchText = SubMenuItemStore.searchText;
              // this.getItems(1);
              this.sortedStatusItems(SLAContractStore.selectedStatusCategory,1);
              break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })
    this.getStatuses();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    
    this.slaContractSubscriptionEvent = this._eventEmitterService.slaCOntractModal.subscribe(res => {
      this.closeFormModal();
    });

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      if(this.deleteObject.category == 'delete')
      this.delete(item);
      else
      this.Archieve(item);
    });

    this.controlSlaCategorySubscriptionEvent = this._eventEmitterService.slaCategory.subscribe(res => {
      this.changeZIndex();
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
      if(!status){
        this.changeZIndex();
      }
    })

    RightSidebarLayoutStore.filterPageTag = 'sla_contract';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
      'sla_category_ids',
      'expiry_date'
    ]);
    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);

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
  getStatuses(){
    this._slaStatusesService.getItems(false, null).subscribe(() => {
      this.sortedStatusItems(SLAContractStore.selectedStatusCategory);
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getDetails(id){
    if (AuthStore.getActivityPermission(100, 'SERVICE_LEVEL_AGREEMENT_AND_CONTRACT_DETAILS')) {
      SLAContractStore.sla_contract_id = id;
    this._router.navigateByUrl('/compliance-management/sla-and-contracts/'+id);
    }
  }

  addSLAContract(){
    this.formObject.type = 'Add';
    this.formObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  editSLAContract(id,value){
    this.formObject.id = id;
    this.formObject.type = 'Edit';
    this.formObject.values = value; 
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
  }

  closeFormModal() {
    this.formObject.type = null;
    this.formObject.values = null;
    $(this.formModal.nativeElement).modal('hide');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }

  deleteSLAContract(id){
    this.deleteObject.id = id;
    this.deleteObject.type = 'are_you_sure_delete';
    this.deleteObject.category = 'delete'
    this.deleteObject.title = ''
    this.deleteObject.subtitle = 'sla_contract_delete_subtitile'
    $(this.deletePopup.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  clearDeleteObject() {
    this.deleteObject.id = null;
    this.deleteObject.position = null;
  }

  delete(status) {
    if (status && this.deleteObject.id) {
      this._slaContractService.delete(this.deleteObject.id).subscribe(resp => {
        this.clearDeleteObject();
        this.sortedStatusItems(SLAContractStore.selectedStatusCategory);
        this._utilityService.detectChanges(this._cdr);
      },
        (err: HttpErrorResponse) => {
          if (err.status != 405)
          this._utilityService.showErrorMessage('Error :', err.error.message ? err.error.message : 'something_went_wrong_try_again' );
        });
    }
    else {
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('hide');
    }, 250);
  }

  setSLAContractSort(type){
    this._slaContractService.sortSLAContractList(type);
    this.sortedStatusItems(SLAContractStore.selectedStatusCategory);
  }

  ArchieveSLAContract(id){
    this.deleteObject.id = id;
    this.deleteObject.type = 'Confirm';
    this.deleteObject.category = 'Archieve'
    this.deleteObject.subtitle = "archieve_sla_contract"
    $(this.deletePopup.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  Archieve(status){
    if (status && this.deleteObject.id) {
      this._slaContractService.ArchieveSlaContract(this.deleteObject.id).subscribe(resp => {
        this.clearDeleteObject();
        // this.getItems();
        this.sortedStatusItems(SLAContractStore.selectedStatusCategory);
        this._utilityService.detectChanges(this._cdr);
      },
        (err: HttpErrorResponse) => {
          this._utilityService.showErrorMessage('Error :', err.error.message ? err.error.message : 'something_went_wrong_try_again' );
        });
    }
    else {
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('hide');
    }, 250);
  }

  changeZIndex(){
    if($(this.formModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
    }
  }

  sortedStatusItems(item,newPage: number = null,loading?){
    if (newPage) SLAContractStore.setCurrentPage(newPage);
    if(loading) SLAContractStore.loaded =false;
    switch (item) {
      case 'valid':
        SLAContractStore.selectedStatusCategory = 'valid';
        let validId;
        let renewId;
        for (let i of SlaStatusesMasterStore?.slaStatuses) {
          if (i.type == 'Valid') {
            validId = i.id;
          }
          else if (i.type == 'Renewed') {
            renewId = i.id;
          }
        }
        this._slaContractService.getItems(false,'&sla_status_ids=' + validId +','+renewId).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
        break;
      case 'expired':
        SLAContractStore.selectedStatusCategory = 'expired';
        let expiredId;
        let endContractId;
        for (let i of SlaStatusesMasterStore?.slaStatuses) {
          if (i.type == 'Expired') {
            expiredId = i.id;
          }
          else if (i.type == 'End Contract') {
            endContractId = i.id;
          }
        }
        this._slaContractService.getItems(false,'&sla_status_ids=' + expiredId +','+ endContractId).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
        break;
      case 'archived':
        SLAContractStore.selectedStatusCategory = 'archived';
        let archiveId;
        for (let i of SlaStatusesMasterStore?.slaStatuses) {
          if (i.type == 'Archive')
          archiveId = i.id;
        }
        this._slaContractService.getItems(false,'&sla_status_ids=' + archiveId).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
        break;
    }
    
  }

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    NoDataItemStore.unsetNoDataItems();
    SubMenuItemStore.makeEmpty();
    this.slaContractSubscriptionEvent.unsubscribe();
    this.deleteEventSubscription.unsubscribe();
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    this.networkFailureSubscription.unsubscribe();
    this.controlSlaCategorySubscriptionEvent.unsubscribe();
    SLAContractStore.searchText = null;
    SubMenuItemStore.searchText = '';
    SLAContractStore.unsetSLAContracts();
  }

}
