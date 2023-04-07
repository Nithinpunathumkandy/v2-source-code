import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy, Renderer2 } from '@angular/core';
import { Department, DepartmentDetails } from 'src/app/core/models/masters/organization/department';
import{DepartmentMasterStore} from 'src/app/stores/masters/organization/department-store';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { DepartmentService } from 'src/app/core/services/masters/organization/department/department.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { AppStore } from 'src/app/stores/app.store';

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

  reactionDisposer: IReactionDisposer;
  DepartmentMasterStore = DepartmentMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  
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
  AppStore = AppStore;
  AuthStore = AuthStore;
  departmentSubscriptionEvent: any = null;
  popupControlOrganizationDepartmentEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor(private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _departmentService: DepartmentService,
    private _helperService: HelperServiceService) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_department_button'});
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'DEPARTMENT_LIST', submenuItem: { type: 'search' }},
        // {activityName: 'DEPARTMENT_LIST', submenuItem: {type: 'refresh'}},
        {activityName: 'CREATE_DEPARTMENT', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_DEPARTMENT_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_DEPARTMENT', submenuItem: {type: 'export_to_excel'}},
        {activityName: 'CREATE_DEPARTMENT', submenuItem: {type: 'import'}},
        {activityName: null, submenuItem: {type: 'close', path: 'organization'}},
      ]
      if(AuthStore.userPermissionsLoaded && !AuthStore.getActivityPermission(100,'CREATE_DEPARTMENT')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(200, subMenuItems);
    
      if (SubMenuItemStore.clikedSubMenuItem) {

        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.addNewItem();
            }, 1000);
            break;
          case "template":
            this._departmentService.generateTemplate();
            break;
          case "export_to_excel":
            this._departmentService.exportToExcel();
            break;
          case "search":
            this.searchDepartment(SubMenuItemStore.searchText);
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
        this.addNewItem();
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

  addNewItem(){
    this.departmentObject.type = 'Add';
    this.departmentObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }
  pageChange(newPage: number = null) {
    if (newPage) DepartmentMasterStore.setCurrentPage(newPage);
    this._departmentService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }


  
  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.departmentObject.type = null;
  }

  /**
   * Get particular competency group item
   * @param id  id of department
   */

  getDepartment(id: number) {
    
    this._departmentService.getItem(id).subscribe(res=>{
      if(DepartmentMasterStore.individualLoaded){
        // DivisionMasterStore.individualDivisionId
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
    case '': this.deleteDivision(status)
      break;

    case 'Activate': this.activateDivision(status)
      break;

    case 'Deactivate': this.deactivateDivision(status)
      break;

  }

}


  // delete function call
  deleteDivision(status: boolean) {
    if (status && this.popupObject.id) {
      this._departmentService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      },(error=>{
        if(error.status == 405){
          let id = this.popupObject.id;
          this.closeConfirmationPopUp();
          this.clearPopupObject();
          setTimeout(() => {
            this.deactivate(id);
            this._utilityService.detectChanges(this._cdr);
          }, 500);
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
}

// calling activcate function

activateDivision(status: boolean) {
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

// calling deactivate function

deactivateDivision(status: boolean) {
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
  this.popupObject.title = 'Activate Department?';
  this.popupObject.subtitle = 'are_you_sure_activate';

  $(this.confirmationPopUp.nativeElement).modal('show');
}
// for deactivate
deactivate(id: number) {
  event.stopPropagation();
  this.popupObject.type = 'Deactivate';
  this.popupObject.id = id;
  this.popupObject.title = 'Deactivate Department?';
  this.popupObject.subtitle = 'are_you_sure_deactivate';

  $(this.confirmationPopUp.nativeElement).modal('show');
}
// for delete
delete(id: number) {
  event.stopPropagation();
  this.popupObject.type = '';
  this.popupObject.id = id;
  this.popupObject.title = 'Delete Department?';
  this.popupObject.subtitle = 'are_you_sure_delete';

  $(this.confirmationPopUp.nativeElement).modal('show');

}


// for sorting
sortTitle(type: string) {
  // DepartmentMasterStore.setCurrentPage(1);
  // this._departmentService.sortDepartmentlList(type, SubMenuItemStore.searchText);
  this._departmentService.sortDepartmentlList(type, null);
  this.pageChange();
}
 // Sub-Menu Search 
 searchDepartment(term: string) {
  this._departmentService.getItems(false, `&q=${term}`).subscribe(res => {
    this._utilityService.detectChanges(this._cdr);
  });
}

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.departmentSubscriptionEvent.unsubscribe();
    this.popupControlOrganizationDepartmentEventSubscription.unsubscribe();
    DepartmentMasterStore.searchText = '';
    DepartmentMasterStore.currentPage = 1 ;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }
  

}

