import { Component, OnInit, ElementRef, ViewChild, Renderer2, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { Router } from "@angular/router";

import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { StakeholdersListService } from "src/app/core/services/organization/stakeholder/stakeholders-list/stakeholders-list.service";
import { StakeholdersStore } from "src/app/stores/organization/stakeholders/stakeholders.store";
import { Stakeholder } from 'src/app/core/models/organization/stakeholder/stakeholder';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AppStore } from "src/app/stores/app.store";
import { AuthStore } from "src/app/stores/auth.store";
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { OrganizationfileService } from "src/app/core/services/organization/organization-file/organizationfile.service";
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { Subscription } from 'rxjs';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';

declare var $: any;
@Component({
  selector: 'app-stakeholders',
  templateUrl: './stakeholders.component.html',
  styleUrls: ['./stakeholders.component.scss']
})
export class StakeholdersComponent implements OnInit,OnDestroy {

  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  reactionDisposer: IReactionDisposer;
  StakeholdersStore = StakeholdersStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  stakeHolderObject = {
    component: 'Master',
    values: null,
    type: null
  };

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  stakeHolderSubscriptionEvent: any = null;
  popupControlOrganizationstakeHolderEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  filterSubscription: Subscription = null;

  constructor(private _renderer2: Renderer2,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _stakeholderListService: StakeholdersListService, 
    private _router: Router,
    private _helperService: HelperServiceService, 
    private _organizationFileService: OrganizationfileService,
    private _rightSidebarFilterService: RightSidebarFilterService) { }

  ngOnInit(): void {
    RightSidebarLayoutStore.showFilter = true;

    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.StakeholdersStore.loaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.pageChange();
    })

    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;

    AppStore.showDiscussion = false;

    // for deleting/activating/deactivating using delete modal
    this.popupControlOrganizationstakeHolderEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    // for closing the modal
    this.stakeHolderSubscriptionEvent = this._eventEmitterService.modalChange.subscribe(res => {
      this.closeFormModal();
    })

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

    NoDataItemStore.setNoDataItems({title: "stakeholder_nodata_title", subtitle: 'stakeholder_nodata_subtitle', buttonText: 'stakeholder_new_button'});

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'STAKEHOLDER_LIST', submenuItem: { type: 'search' }},
        {activityName: 'STAKEHOLDER_LIST', submenuItem: { type: 'refresh'}},
        {activityName: 'CREATE_STAKEHOLDER', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_STAKEHOLDER_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_STAKEHOLDER', submenuItem: {type: 'export_to_excel'}},
        {activityName: 'IMPORT_STAKEHOLDER', submenuItem: {type: 'import'}}
      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_STAKEHOLDER')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
 
      this._helperService.checkSubMenuItemPermissions(100,subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal": 
            setTimeout(() => {
              this.createNewStakeholder();
            }, 1000);
            break;
          case "template":
            this._stakeholderListService.generateTemplate();
            break;
          case "export_to_excel":
            this._stakeholderListService.exportToExcel();
            break;
          case "search":
            StakeholdersStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "refresh":
            SubMenuItemStore.searchText = '';
            StakeholdersStore.searchText = '';
            StakeholdersStore.unsetStakeholders();
            this.pageChange(1);
            break;
          case "import":
            ImportItemStore.setTitle('import_stakeholder');
            ImportItemStore.setImportFlag(true);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if(NoDataItemStore.clikedNoDataItem){
        this.createNewStakeholder();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      if(ImportItemStore.importClicked){
        ImportItemStore.importClicked = false;
        this._stakeholderListService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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

    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);

    SubMenuItemStore.setNoUserTab(true);

    RightSidebarLayoutStore.filterPageTag = 'stakeholder';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'stakeholder_type_ids'
    ]);

    this.pageChange(1);

  }

  pageChange(newPage: number = null) {
    if (newPage) StakeholdersStore.setCurrentPage(newPage);
    this._stakeholderListService.getItems('&status=all').subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  createNewStakeholder(){
    this.stakeHolderObject.type = 'Add';
    this.stakeHolderObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  gotoStakeholderDetails(id: number){
    this._router.navigateByUrl('/organization/stakeholder-details/'+id);
  }

  scrollEvent = (event: any): void => {
    if(event.target.documentElement){
      const number = event.target.documentElement.scrollTop;
      if(number > 50){
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','45px');
        this._renderer2.addClass(this.navBar.nativeElement,'affix');
        // this.plainDev.style.height = '45px';
      }
      else{
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
        this._renderer2.removeClass(this.navBar.nativeElement,'affix');
        // this.plainDev.nativeElement.style.height = 'auto';
      }
    }
  }

  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteStakeholder(status)
        break;
      case 'Activate': this.activateStakeholder(status)
        break;
      case 'Deactivate': this.deactivateStakeholder(status)
        break;

    }

  }

  // delete function call
  deleteStakeholder(status: boolean) {
    if (status && this.popupObject.id) {
      this._stakeholderListService.deleteItem(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopup();
        this.clearPopupObject();
      },(error=>{
        if(error.status == 405 && StakeholdersStore.getStakeholderById(this.popupObject.id).status_id == AppStore.activeStatusId){
          let id = this.popupObject.id;
          this.closeConfirmationPopup();
          this.clearPopupObject();
          setTimeout(() => {
            this.deactivateStakeholderConfirm(id);
          }, 500);
        }
        else{
          this.closeConfirmationPopup();
          this.clearPopupObject();
        }
      })
      );
    }
    else {
      this.closeConfirmationPopup();
      this.clearPopupObject();
    }
    // setTimeout(() => {
    //   $(this.confirmationPopUp.nativeElement).modal('hide');
    // }, 250);

  }


  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
    // this.popupObject.title = '';
    // this.popupObject.subtitle = '';
    // this.popupObject.type = '';
  }

  // calling activcate function

  activateStakeholder(status: boolean) {
    if (status && this.popupObject.id) {
      this._stakeholderListService.activateItem(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopup();
        this.clearPopupObject();
      });
    }
    else {
      this.closeConfirmationPopup();
      this.clearPopupObject();
    }
    // setTimeout(() => {
    //   $(this.confirmationPopUp.nativeElement).modal('hide');
    // }, 250);

  }

  // calling deactivate function

  deactivateStakeholder(status: boolean) {
    if (status && this.popupObject.id) {
      this._stakeholderListService.deactivateItem(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopup();
        this.clearPopupObject();
      });
    }
    else {
      this.closeConfirmationPopup();
      this.clearPopupObject();
    }
    // setTimeout(() => {
    //   $(this.confirmationPopUp.nativeElement).modal('hide');
    // }, 250);

  }

  // for activate 
  activateStakeholderConfirm(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'Activate Stakeholder?';
    this.popupObject.subtitle = 'are_you_sure_activate';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  // for deactivate
  deactivateStakeholderConfirm(id: number) {
    if(event) event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Stakeholder?';
    this.popupObject.subtitle = 'are_you_sure_deactivate';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  // for delete
  deleteStakeholderConfirm(id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Stakeholder?';
    this.popupObject.subtitle = 'are_you_sure_delete';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  editStakeholder(id: number){
    event.stopPropagation();
    const stakeholder: Stakeholder = StakeholdersStore.getStakeholderById(id);
    //set form value
    this.stakeHolderObject.values = {
      id: stakeholder.id,
      title: stakeholder.title,
      stakeholder_type_id: stakeholder.stakeholder_type_id,
      monitoring_method: stakeholder.monitoring_method
    }
    this.stakeHolderObject.type = 'Edit';
    this.openFormModal();
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.stakeHolderObject.type = null;
  }

  closeConfirmationPopup(){
    $(this.confirmationPopUp.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }

  sortTitle(type: string) {
    // this.StakeholdersStore.setCurrentPage(1);
    this._stakeholderListService.sortStakeholderList(type, SubMenuItemStore.searchText);
    this.pageChange(1);
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    window.removeEventListener('scroll',this.scrollEvent);
    this.stakeHolderSubscriptionEvent.unsubscribe();
    this.popupControlOrganizationstakeHolderEventSubscription.unsubscribe();
    SubMenuItemStore.makeEmpty();
    NoDataItemStore.unsetNoDataItems();
    NoDataItemStore.unSetClickedNoDataItem();
    StakeholdersStore.searchText = '';
    SubMenuItemStore.searchText = null;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    StakeholdersStore.unsetStakeholderDetails();
  }


}
