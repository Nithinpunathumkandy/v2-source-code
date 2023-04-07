import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { DivisionService } from 'src/app/core/services/masters/organization/division/division.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { DivisionMasterStore } from 'src/app/stores/masters/organization/division-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;
@Component({
  selector: 'app-division-details',
  templateUrl: './division-details.component.html',
  styleUrls: ['./division-details.component.scss']
})
export class DivisionDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('navigationBar') navigationBar: ElementRef;
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  AppStore = AppStore;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  DivisionMasterStore = DivisionMasterStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  popupControlOrganizationDivisionEventSubscription: any;
  divisionSubscriptionEvent: any = null;
  
  page = 1;
  pageSize = 5;
  selectedIndex: number = 0;
  filterdOptions = [];
  temporaryArray = [];
  selectedSearch:string='';

  divisionObject = {
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

  emptyMessage="look_like_we_don't_have_any_divisions_to_display_here";

  constructor(
    private _router:Router,
    private _renderer2: Renderer2,
    private _route: ActivatedRoute,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _divisionService: DivisionService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
  ) { }

  ngOnInit(): void {

    let id: number;
    this._route.params.subscribe(params => {
      id = +params['id']; 
      this._divisionService.saveDivisionId(id);
      this.getDetails(id);
    })

    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    this.reactionDisposer = autorun(() => {

      this.getSubmenu();

      if (SubMenuItemStore.clikedSubMenuItem) {
      
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            this.edit();
            break;
          case "delete":
            this.delete( DivisionMasterStore.individualDivisionDetials?.id);
            break;
          case "activate":
            this.activate(DivisionMasterStore.individualDivisionDetials?.id);
            break;
          case "deactivate":
            this.deactivate(DivisionMasterStore.individualDivisionDetials?.id);
            break;
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })

    window.addEventListener('scroll', this.scrollEvent, true);

    // for deleting/activating/deactivating using delete modal
    this.popupControlOrganizationDivisionEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    // for closing the modal
    this.divisionSubscriptionEvent = this._eventEmitterService.division.subscribe(res => {
      this.closeFormModal();
    })
    
    
  }

  getSubmenu(){

    if(DivisionMasterStore.individualDivisionDetials?.status_id == AppStore.activeStatusId){
      var subMenuItems = [
        { activityName: 'UPDATE_DIVISION', submenuItem: { type: 'edit_modal' } },
        { activityName: 'DELETE_DIVISION', submenuItem: { type: 'delete' } },
        { activityName: 'DEACTIVATE_DIVISION', submenuItem: { type: 'deactivate' } },
        { activityName: null, submenuItem: {type: 'close',path:'../'}},
      ]
    }else{
      var subMenuItems = [
        { activityName: 'UPDATE_DIVISION', submenuItem: { type: 'edit_modal' } },
        { activityName: 'DELETE_DIVISION', submenuItem: { type: 'delete' } },
        { activityName: 'ACTIVATE_DIVISION', submenuItem: { type: 'activate' } },
        { activityName: null, submenuItem: {type: 'close',path:'../'}},
      ]
    }

    this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
  }

  getDetails(id){
    this._divisionService.getItem(id).subscribe(res => {
      this.getSubmenu();
      this.temporaryArray=res.departments;
      this._utilityService.detectChanges(this._cdr);
    })
  }

  changePage(newPage: number = null){
    if(newPage) this.page = newPage;
    else this.page = 1;
    this.selectedIndex = 0;
    this._utilityService.scrollToTop();
    DivisionMasterStore.setCurrentDepartmentPage( this.page);
  }

  filterUsers() {
    DivisionMasterStore.setCurrentDepartmentPage(1);

    this.filterdOptions = this.temporaryArray.filter(
      item =>item.title.toLowerCase().includes(this.selectedSearch.toLowerCase())
    );
    DivisionMasterStore._departmentList=[...this.filterdOptions];
  }

  edit(){
    this.divisionObject.values = {
      id:  DivisionMasterStore.individualDivisionDetials?.id,
      title:  DivisionMasterStore.individualDivisionDetials?.title,
      organization_id:  DivisionMasterStore.individualDivisionDetials?.organization,
      head_id:  DivisionMasterStore.individualDivisionDetials?.head,
    }
    this.divisionObject.type = 'Edit';
    this.openFormModal();
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
  }

  closeFormModal() {
    this.getDetails(DivisionMasterStore.individualDivisionId.id?DivisionMasterStore.individualDivisionId.id:DivisionMasterStore.individualDivisionId);
    $(this.formModal.nativeElement).modal('hide');
    this.divisionObject.type = null;
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
        this._divisionService.delete(this.popupObject.id).subscribe(resp => {
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
          }, 500);
          this.getDetails(this.popupObject.id);
          this.closeConfirmationPopUp();
          this.clearPopupObject();
        },(error=>{
          if(error.status == 405 && DivisionMasterStore.getDivisionById(this.popupObject.id).status_id == AppStore.activeStatusId){
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
  
  activateDivision(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._divisionService.activate(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.getDetails(this.popupObject.id);
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
  
      this._divisionService.deactivate(this.popupObject.id).subscribe(resp => {
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
    this.popupObject.title = 'Activate Division?';
    this.popupObject.subtitle = 'are_you_sure_activate';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for deactivate
  deactivate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Division?';
    this.popupObject.subtitle = 'are_you_sure_deactivate';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for delete
  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Division?';
    this.popupObject.subtitle = 'are_you_sure_delete';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  
  }
  

  getEmployeePopupDetails(users, created?: string) { //user popup
    
    let userDetails: any = {};
      if(users){
        userDetails['first_name'] = users?.first_name?users?.first_name:users?.name;
        userDetails['last_name'] = users?.last_name;
        userDetails['image_token'] = users?.image?.token?users?.image.token:users?.image_token;
        userDetails['email'] = users?.email;
        userDetails['mobile'] = users?.mobile;
        userDetails['id'] = users?.id;
        // userDetails['department'] = users?.department?users.department : users?.department?.title ? users?.department?.title : null;
        userDetails['department'] = users?.department;
        userDetails['status_id'] = users?.status_id? users?.status_id:users?.status.id;
        userDetails['created_at'] =created? created:null;
        userDetails['designation'] = users?.designation?.title ? users?.designation?.title : users?.designation;
      }
    return userDetails;
  }
  
  scrollEvent = (event: any): void => {
    if (event.target.documentElement != undefined) {
      const number = event.target.documentElement.scrollTop;
      if (number > 50) {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', '45px');
        this._renderer2.addClass(this.navigationBar?.nativeElement, 'affix');
      }
      else {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
        this._renderer2.removeClass(this.navigationBar?.nativeElement, 'affix');
      }
    }
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.popupControlOrganizationDivisionEventSubscription.unsubscribe();
    this.divisionSubscriptionEvent.unsubscribe();
    DivisionMasterStore.unsetIndividualDivision();
  }

}
