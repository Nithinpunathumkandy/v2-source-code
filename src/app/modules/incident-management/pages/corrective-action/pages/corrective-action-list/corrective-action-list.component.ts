import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { IncidentCorrectiveActionService } from 'src/app/core/services/incident-management/incident-corrective-action/incident-corrective-action.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IncidentCorrectiveActionStore } from 'src/app/stores/incident-management/corrective-action/corrective-action-store';
import { IncidentDashBoardStore } from 'src/app/stores/incident-management/incident-dashboard/incident-dashboard.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;
@Component({
  selector: 'app-corrective-action-list',
  templateUrl: './corrective-action-list.component.html',
  styleUrls: ['./corrective-action-list.component.scss']
})
export class CorrectiveActionListComponent implements OnInit , OnDestroy{
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild ('formModal',{static:true}) formModal: ElementRef;

  reactionDisposer: IReactionDisposer;
  IncidentCorrectiveActionStore =IncidentCorrectiveActionStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  fileUploadPopupStore = fileUploadPopupStore;
  SubMenuItemStore = SubMenuItemStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore
  modalEventSubscription: any;
  fileUploadPopupSubscriptionEvent:any;
  popupControlEventSubscription: any;
  networkFailureSubscription: any;
	idleTimeoutSubscription: any;

  incidentCorrectiveActionObject = {
    type:null,
    values: null,
  }
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  filterSubscription: Subscription = null;

  constructor(private _utilityService:UtilityService,
              private _incidentCorrectiveActionService:IncidentCorrectiveActionService,
              private _cdr:ChangeDetectorRef,
              private _imageService:ImageServiceService,
              private _eventEmitterService: EventEmitterService,
              private _router:Router,
              private _helperService:HelperServiceService,
              private _renderer2: Renderer2,
              private _rightSidebarFilterService: RightSidebarFilterService
              ) { }

ngOnInit(): void {
  RightSidebarLayoutStore.showFilter = true;

  this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
    this.IncidentCorrectiveActionStore.loaded = false;
    this._utilityService.detectChanges(this._cdr);
    this.pageChange(1);
  })
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'INCIDENT_CORRECTIVE_ACTION_LIST', submenuItem: {type: 'search'}},
        {activityName: 'CREATE_INCIDENT_CORRECTIVE_ACTION', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_INCIDENT_CORRECTIVE_ACTION_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_INCIDENT_CORRECTIVE_ACTION', submenuItem: {type: 'export_to_excel'}},
        {activityName: 'IMPORT_INCIDENT_CORRECTIVE_ACTION', submenuItem: {type: 'import'}}
      ]
      
      this._helperService.checkSubMenuItemPermissions(100,subMenuItems);
      
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {   
          case "new_modal":
            setTimeout(() => {
              this.addIncidentCorrectiveActionItem();
            }, 1000)
            break;
          case "template":
            this._incidentCorrectiveActionService.generateTemplate();
            break;
          case "export_to_excel":
            this._incidentCorrectiveActionService.exportToExcel();
            break;
          case "search":
            IncidentCorrectiveActionStore.searchText = SubMenuItemStore.searchText;
              this.pageChange(1);
            break;
          case "import":
            ImportItemStore.setTitle('import_incident_corrective_action');
            ImportItemStore.setImportFlag(true);
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if(NoDataItemStore.clikedNoDataItem){
        this.addIncidentCorrectiveActionItem();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      if(ImportItemStore.importClicked){
        ImportItemStore.importClicked = false;
        this._incidentCorrectiveActionService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
          ImportItemStore.unsetFileDetails();
          ImportItemStore.setTitle('');
          ImportItemStore.setImportFlag(false);
          $('.modal-backdrop').remove();
          this.pageChange();
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
      NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_corrective_action'});
      BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    })

 

    this.modalEventSubscription = this._eventEmitterService.addIncidentCorrectiveAction.subscribe(res => {
      this.closeFormModal();
    });

    // for deleting/activating/deactivating using delete modal
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.changeZIndex();
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
			if(!status){
			  this.changeZIndex();
			}
		  })
		  this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
			if(!status){
			  this.changeZIndex();
			}
		  })

    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);

    RightSidebarLayoutStore.filterPageTag = 'incident_corrective';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
      'incident_ids',
      'incident_corrective_action_status_ids'
    ]);

    if (this._router.url.indexOf('corrective-actions-list') != -1) {
      IncidentCorrectiveActionStore.setSubMenuHide(true);
      this.pageChange();
      this._utilityService.detectChanges(this._cdr);
    }else{
      IncidentCorrectiveActionStore.setSubMenuHide(false);
      this.pageChange(1);
      this._utilityService.detectChanges(this._cdr);

    }
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
 
  addIncidentCorrectiveActionItem(){
    this.clearFIleUploadPopupData();
    this.incidentCorrectiveActionObject.type = 'Add';
    this.incidentCorrectiveActionObject.values=null;
    // this._router.navigateByUrl('incident-management/add-corrective-action');
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  clearFIleUploadPopupData() {
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearSystemFiles();
  }

  changeZIndex(){
		if($(this.formModal.nativeElement).hasClass('show')){
		  this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
		  this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
		}
  }

  pageChange(newPage: number = null) {
    if (newPage) IncidentCorrectiveActionStore.setCurrentPage(newPage);
    var additionalParams = ''
    if (IncidentDashBoardStore.incidentDashboardParam) {
			additionalParams = IncidentDashBoardStore.incidentDashboardParam;
		}
    this._incidentCorrectiveActionService.getItems(false, additionalParams ? additionalParams : '').subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  // for opening modal
  openFormModal() {

    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 100);
  }
  // for close modal
  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.incidentCorrectiveActionObject.type = null;
  }

  gotoCorrectiveActionDetails(id){
    if (AuthStore.getActivityPermission(100, 'INCIDENT_CORRECTIVE_ACTION_DETAILS')) {
    this._router.navigateByUrl('/incident-management/incident-corrective-actions/'+id);
    }
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }
    // Returns default image
    getDefaultImage(type) {
      return this._imageService.getDefaultImageUrl(type);
    }

  sortTitle(type: string) {
    this._incidentCorrectiveActionService.sortIncidentCorrectiveActionList(type, SubMenuItemStore.searchText);
    this.pageChange()
  }

     // for delete
     delete(id: number) {
      event.stopPropagation();
      this.popupObject.type = '';
      this.popupObject.id = id;
      this.popupObject.title = 'Delete Corrective Action?';
      this.popupObject.subtitle = 'delete_corrective_action';
      this._utilityService.detectChanges(this._cdr);
      $(this.confirmationPopUp.nativeElement).modal('show');
  
    }
  
      // for popup object clearing
      clearPopupObject() {
        this.popupObject.id = null;
        this.popupObject.title = '';
        this.popupObject.subtitle = '';
        this.popupObject.type = '';
    
      }
  
     // modal control event
     modalControl(status: boolean) {
      switch (this.popupObject.type) {
        case '': this.deleteIncidentCorrectiveAction(status)
          break;
      }
  
    }
  
    // delete function call
    deleteIncidentCorrectiveAction(status: boolean) {
      if (status && this.popupObject.id) {
        this._incidentCorrectiveActionService.delete(this.popupObject.id).subscribe(resp => {
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


    //edit start
    editICAItem(id) {
    event.stopPropagation();

    this._incidentCorrectiveActionService.getItem(id).subscribe(res => {
      let ActionDetails = res;
      if(res){
        this.incidentCorrectiveActionObject.values = {
          id: ActionDetails.id,
          title: ActionDetails.title ,
          responsible_user_id: ActionDetails.responsible_user, 
          watcher_ids:this._helperService.getArrayProcessed(ActionDetails.incident_corrective_action_watchers,'id'),
          description: ActionDetails.description,
          incident_id: ActionDetails.incident.id,
          start_date: this._helperService.processDate(ActionDetails.start_date,'split'),
          target_date: this._helperService.processDate(ActionDetails.target_date,'split'),
          budget: ActionDetails.budget,
          
        }
  
        this.incidentCorrectiveActionObject.type = 'Edit';
        // IncidentCorrectiveActionStore.editFlag=false;
        this._utilityService.detectChanges(this._cdr);
        this.openFormModal();
      }
      
    })
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    IncidentCorrectiveActionStore.searchText = null;
    SubMenuItemStore.searchText = '';
    this.modalEventSubscription.unsubscribe();
    this.popupControlEventSubscription.unsubscribe();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    this.networkFailureSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    IncidentDashBoardStore.incidentDashboardParam = '';
  }
}
