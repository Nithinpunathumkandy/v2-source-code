import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs'
import { autorun, IReactionDisposer } from 'mobx';
import { AppStore } from 'src/app/stores/app.store';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { DepartmentDetails } from 'src/app/core/models/masters/organization/department';
import { DepartmentMasterStore } from 'src/app/stores/masters/organization/department-store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { DepartmentService } from 'src/app/core/services/masters/organization/department/department.service';
import { DepartmentStore } from 'src/app/stores/human-capital/assessment/department.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';

declare var $: any;
@Component({
  selector: 'app-department-details',
  templateUrl: './department-details.component.html',
  styleUrls: ['./department-details.component.scss']
})
export class DepartmentDetailsComponent implements OnInit, OnDestroy {

  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  emptyMessage="no_user_found";

  constructor(
    private _router: Router,
    private _renderer2: Renderer2,
    private _route: ActivatedRoute,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _departmentService: DepartmentService,
    private _eventEmitterService: EventEmitterService,
  ) { }

  AppStore= AppStore;
  NoDataItemStore = NoDataItemStore
  SubMenuItemStore = SubMenuItemStore
  reactionDisposer: IReactionDisposer
  DepartmentMasterStore = DepartmentMasterStore
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;

  popupControl: Subscription
  departmentSubscriptionEvent: Subscription

  departmentId: number = null
  selectedUser: any;
  filterdOptions = [];
  temporaryArray = [];

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

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      this.departmentId = params.id;
      this.getDetails();
    });
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: 'UPDATE_DEPARTMENT', submenuItem: { type: 'edit_modal' } },
        { activityName: 'DELETE_DEPARTMENT', submenuItem: { type: 'delete' } },
        { activityName: null, submenuItem: { type: 'close', path: '../' } },
      ];
      this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
      setTimeout(() => {
        NoDataItemStore.setNoDataItems({ title: "common_nodata_title" });
      }, 300);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            setTimeout(() => {
              this.editDepartment(this.departmentId)
            }, 1000);
            break;
          case "delete":
            this.delete(this.departmentId);
            break;
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    });

    // for deleting/activating/deactivating using delete modal
    this.popupControl = this._eventEmitterService.deletePopup.subscribe(item => {
      this.deleteDepartment(item)
    })

    // for closing the modal
    this.departmentSubscriptionEvent = this._eventEmitterService.departmentControl.subscribe(res => {
      this.closeFormModal();
    })
    
  }

  getDetails() {
    this._departmentService.getItem(this.departmentId).subscribe(res => {
      this.temporaryArray = [...DepartmentMasterStore.userList]
    })
  }

  pageChange(newPage: number = null) {
    if (newPage) {
      DepartmentMasterStore.setCurrentUserPage(newPage);
    }
    else {
      DepartmentMasterStore.setCurrentUserPage(1)
    }
  }

  filterUsers() {
    DepartmentMasterStore.setCurrentUserPage(1)
    this.filterdOptions = this.temporaryArray.filter(
      item => item.first_name.toLowerCase().includes(this.selectedUser.toLowerCase()) || item.last_name.toLowerCase().includes(this.selectedUser.toLowerCase())
    );
    DepartmentMasterStore._usersList = [...this.filterdOptions]
  }

  editDepartment(id: number) {
    //event.stopPropagation();
    this._departmentService.getItem(id).subscribe(res => {
      if (DepartmentMasterStore.individualLoaded) {
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

  // for delete
  delete(id: number) {
    //if(event) event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.subtitle = 'are_you_sure_delete';
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  // delete function call
  deleteDepartment(status: boolean) {
    if (status && this.popupObject.id) {
      this._departmentService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
          this._router.navigateByUrl('/human-capital/departments');
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      }, (error => {
        if (error.status == 405 && DepartmentMasterStore.getDepartmentById(this.popupObject.id).status_id == AppStore.activeStatusId) {
          let id = this.popupObject.id;
          this.closeConfirmationPopUp();
          this.clearPopupObject();
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
          }, 500);
        }
        else {
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

  closeConfirmationPopUp() {
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

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
  }

  closeFormModal() {
    this.getDetails();
    $(this.formModal.nativeElement).modal('hide');
    AppStore.disableLoading();
    this.departmentObject.type = null;
  }

  getUserList(users) {
    let userDetial: any = {};
    userDetial['first_name'] = users?.first_name;
    userDetial['last_name'] = users?.last_name;
    userDetial['image_token'] = users?.image_token;
    userDetial['email'] = users?.email;
    userDetial['mobile'] = users?.mobile;
    userDetial['id'] = users?.id;
    userDetial['department'] = users?.department;
    userDetial['status_id'] = users?.status_id ? users?.status_id : users?.status?.id;
    // userDetial['created_at'] = users?.created_at ;
    if (users?.designation?.id) {
      userDetial['designation'] = users?.designation?.title;
    } else {
      userDetial['designation'] = users?.designation
    }
    return userDetial;
  }

  getUserDetails(users, created?: string) {
    let userDetial: any = {};
    userDetial['first_name'] = users?.first_name;
    userDetial['last_name'] = users?.last_name;
    userDetial['image_token'] = users?.image?.token;
    userDetial['email'] = users?.email;
    userDetial['mobile'] = users?.mobile;
    userDetial['id'] = users?.id;
    userDetial['department'] = users?.department;
    userDetial['status_id'] = users?.status_id ? users?.status_id : users?.status?.id;
    userDetial['created_at'] = created ? created : null;
    if (users?.designation?.id) {
      userDetial['designation'] = users?.designation?.title;
    } else {
      userDetial['designation'] = users?.designation
    }
    return userDetial;
  }

  scrollEvent = (event: any): void => {
    if (event.target.documentElement) {
      const number = event.target.documentElement.scrollTop;
      if (number > 50) {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', '45px');
        this._renderer2.addClass(this.navBar.nativeElement, 'affix');
      }
      else {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
        this._renderer2.removeClass(this.navBar.nativeElement, 'affix');
      }
    }
  }

  getNoDataSource(type){
    let noDataSource = {
      noData: this.emptyMessage, border: false, imageAlign: type
    }
    return noDataSource;
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.departmentSubscriptionEvent.unsubscribe();
    this.popupControl.unsubscribe();
    DepartmentMasterStore.unsetDepartmentDetails()
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;

  }

  getStatusColorKey(){
    var label_color = DepartmentMasterStore?.individualDepartmentId?.status?.label.split('-');

    return 'draft-tag draft-tag-'+label_color[0]+' label-tag-style-tag label-left-arow-tag d-inline-block status-tag-new-one';
  }

}
