import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy, Renderer2 } from '@angular/core';
import {  DepartmentDetails } from 'src/app/core/models/masters/organization/department';
import{DepartmentMasterStore} from 'src/app/stores/masters/organization/department-store';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { DepartmentService } from 'src/app/core/services/masters/organization/department/department.service';
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { HumanCapitalService } from "src/app/core/services/human-capital/human-capital-service/human-capital.service";
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { Subscription } from 'rxjs';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { Router } from '@angular/router';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { HumanCapitalDashboardStore } from 'src/app/stores/human-capital/dashboard/dashboard-store';

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit,OnDestroy {
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('navigationBar') navigationBar: ElementRef;
    @ViewChild('plainDev') plainDev: ElementRef;
  reactionDisposer: IReactionDisposer;
  DepartmentMasterStore = DepartmentMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  filterSubscription: Subscription = null;
  departmentObject = {
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

  userDetailObject = {
    first_name:'',
    last_name:'',
    designation:'',
    image_token:'',
    mobile:null,
    email:'',
    id:null,
    department:'',
    status_id:null,
  }


  departmentSubscriptionEvent: any = null;
  popupControlOrganizationDepartmentEventSubscription: any;
  idleTimeoutSubscription:any;
  networkFailureSubscription:any;




  constructor(
    private _router:Router,
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef, 
    private _humanCpitalService: HumanCapitalService,
    private _departmentService: DepartmentService, 
    private _imageService: ImageServiceService,
    private _renderer2:Renderer2, 
    private _helperService: HelperServiceService,
    private _rightSidebarFilterService: RightSidebarFilterService,
    ) { }

  ngOnInit(): void {

    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.DepartmentMasterStore.loaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.pageChange(1);
    })
    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_department_button'});

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'DEPARTMENT_LIST', submenuItem: { type: 'search' }},
        {activityName: 'DEPARTMENT_LIST', submenuItem: {type: 'refresh'}},
        {activityName: 'CREATE_DEPARTMENT', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_DEPARTMENT_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_DEPARTMENT', submenuItem: {type: 'export_to_excel'}},
        {activityName: 'CREATE_DEPARTMENT', submenuItem: {type: 'import'}}
      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_DEPARTMENT')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(200, subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {

        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.addNewDepartment();
            }, 1000);
            break;
          case "template":
            this._departmentService.generateTemplate();
            break;
          case "export_to_excel":
            this._departmentService.exportToExcel();
            break;
          case "search":
            DepartmentMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            //this.searchDepartment(SubMenuItemStore.searchText);
            break;
          case "import":
            ImportItemStore.setTitle('import_department');
            ImportItemStore.setImportFlag(true);
            break;
          case "refresh":
            SubMenuItemStore.searchText = '';
            DepartmentMasterStore.searchText = '';
            DepartmentMasterStore.loaded = false;
            this.pageChange(1);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if(NoDataItemStore.clikedNoDataItem){
        this.addNewDepartment();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      if(ImportItemStore.importClicked){
        ImportItemStore.importClicked = false;
        this._departmentService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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

      // for deleting/activating/deactivating using delete modal
      this.popupControlOrganizationDepartmentEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
        this.modalControl(item);
      })
  
      // for closing the modal
      this.departmentSubscriptionEvent = this._eventEmitterService.departmentControl.subscribe(res => {
        this.closeFormModal();
      })

      this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
        if(!status){
          this.changeZIndex();
        }
      })
  
      this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
        if(!status){
          this.changeZIndex();
        }
      })

   
    this.pageChange(1);
    RightSidebarLayoutStore.filterPageTag = 'department';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids',
      'division_ids',
      // 'department_ids',
      // 'section_ids',
      // 'sub_section_ids',
    ]);
  }

  addNewDepartment(){
    this.departmentObject.type = 'Add';
    this.departmentObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  setPerPage(perPage){
    DepartmentMasterStore.itemsPerPage=perPage;
    this.pageChange(1);
}

  pageChange(newPage: number = null) {
    if (newPage) DepartmentMasterStore.setCurrentPage(newPage);
    var additionalParams=''
      if (HumanCapitalDashboardStore.dashboardParam) {
        additionalParams = HumanCapitalDashboardStore.dashboardParam
      }
      this._departmentService.getItems(false,additionalParams ? additionalParams : '', true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
    }

  changeZIndex(){
    if($(this.formModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
    }
  
  }

  scrollEvent = (event: any): void => {
    if (event.target.documentElement != undefined) {
      const number = event.target.documentElement.scrollTop;
      if (number > 50) {
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','45px');
        this._renderer2.addClass(this.navigationBar.nativeElement, 'affix');
      }
      else {
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
        this._renderer2.removeClass(this.navigationBar.nativeElement, 'affix');
      }
    }
  }

  getPopupDetails(user){
    // $('.modal-backdrop').remove(); 
      this.userDetailObject.first_name = user.head_first_name;
      this.userDetailObject.last_name = user.head_last_name;
      this.userDetailObject.designation = user.head_designation;
      this.userDetailObject.image_token = user.head_image_token;
      this.userDetailObject.email = user.head_email;
      this.userDetailObject.mobile = user.head_mobile;
      this.userDetailObject.id = user.head_id;
      this.userDetailObject.department = user.head_department?user.head_department:null;
      this.userDetailObject.status_id = user.status?.id?user.status?.id:1;
      return this.userDetailObject;
    
  }



  
  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    AppStore.disableLoading();
    this.departmentObject.type = null;
  }

  getToDetails(id){
    this._router.navigateByUrl(`/human-capital/departments/${id}`)
  }

  /**
   * Get particular competency group item
   * @param id  id of department
   */

  getDepartment(id: number) {
    event.stopPropagation();
    this._departmentService.getItem(id).subscribe(res=>{
      if(DepartmentMasterStore.individualLoaded){
        // DepartmentMasterStore.individualDepartmentId
        const department: DepartmentDetails = DepartmentMasterStore.individualDepartmentId;
        this.departmentObject.values = {
          id: department.id,
          title: department.title,
          organization_id: department.organization,
          division_id: department.division,
          head_id: department.head,
          code: department.code,
          color_code: department.color_code,
          order: department.order
        }
        this.departmentObject.type = 'Edit';
        this.openFormModal();
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  
  // modal control event
 modalControl(status: boolean) {
  switch (this.popupObject.type) {
    case '': this.deleteDepartment(status)
      break;

    case 'Activate': this.activateDepartment(status)
      break;

    case 'Deactivate': this.deactivateDepartment(status)
      break;

  }

}


// delete function call
deleteDepartment(status: boolean) {
  if (status && this.popupObject.id) {
    this._departmentService.delete(this.popupObject.id).subscribe(resp => {
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      this.closeConfirmationPopUp();
      this.clearPopupObject();
    },(error=>{
      if(error.status == 405 && DepartmentMasterStore.getDepartmentById(this.popupObject.id).status_id == AppStore.activeStatusId){
        let id = this.popupObject.id;
        this.closeConfirmationPopUp();
        this.clearPopupObject();
        setTimeout(() => {
          this.deactivate(id);
          this._utilityService.detectChanges(this._cdr);
        }, 500);
      }
      else{
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      }
    })
    );
  }
  else {
    this.closeConfirmationPopUp();
    this.clearPopupObject();
  }
}

closeConfirmationPopUp(){
  $(this.confirmationPopUp.nativeElement).modal('hide');
  this._utilityService.detectChanges(this._cdr);
}

// for popup object clearing
clearPopupObject() {
  this.popupObject.id = null;
  // this.popupObject.title = '';
  // this.popupObject.subtitle = '';
  // this.popupObject.type = '';

}

// calling activcate function

activateDepartment(status: boolean) {
  if (status && this.popupObject.id) {

    this._departmentService.activate(this.popupObject.id).subscribe(resp => {
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

getDefaultGeneralImage() {
  return this._imageService.getDefaultImageUrl('user-logo');
}

createImageUrl(type, token) {
  return this._humanCpitalService.getThumbnailPreview(type, token);
}

// calling deactivate function

deactivateDepartment(status: boolean) {
  if (status && this.popupObject.id) {

    this._departmentService.deactivate(this.popupObject.id).subscribe(resp => {
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

// for activate 
activate(id: number) {
  event.stopPropagation();
  this.popupObject.type = 'Activate';
  this.popupObject.id = id;
  this.popupObject.subtitle = 'are_you_sure_activate';
  $(this.confirmationPopUp.nativeElement).modal('show');
}

// for deactivate
deactivate(id: number) {
  if(event) event.stopPropagation();
  this.popupObject.type = 'Deactivate';
  this.popupObject.id = id;
  this.popupObject.subtitle = 'are_you_sure_deactivate';
  $(this.confirmationPopUp.nativeElement).modal('show');
}

// for delete
delete(id: number) {
  if(event) event.stopPropagation();
  this.popupObject.type = '';
  this.popupObject.id = id;
  this.popupObject.subtitle = 'are_you_sure_delete';
  $(this.confirmationPopUp.nativeElement).modal('show');
}


// for sorting
sortTitle(type: string) {
  
  // DepartmentMasterStore.setCurrentPage(1);
  this._departmentService.sortDepartmentlList(type, SubMenuItemStore.searchText);
  this.pageChange();
}

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.departmentSubscriptionEvent.unsubscribe();
    this.popupControlOrganizationDepartmentEventSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    DepartmentMasterStore.searchText = null;
    DepartmentMasterStore.loaded = false;
  }

}

