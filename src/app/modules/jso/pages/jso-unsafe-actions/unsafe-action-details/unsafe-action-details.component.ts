import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { JsoUnsafeActionsService } from 'src/app/core/services/jso/unsafe-actions/jso-unsafe-actions.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { JsoUnsafeActionStore } from 'src/app/stores/jso/unsafe-actions/jso-unsafe-actions-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any

@Component({
  selector: 'app-unsafe-action-details',
  templateUrl: './unsafe-action-details.component.html',
  styleUrls: ['./unsafe-action-details.component.scss']
})
export class UnsafeActionDetailsComponent implements OnInit {

  @ViewChild('formModal', { static: false }) formModal: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('closeStatusFormModal', { static: true }) closeStatusFormModal: ElementRef;

  JsoUnsafeActionStore = JsoUnsafeActionStore;
  AppStore = AppStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  reactionDisposer: IReactionDisposer;
  jsoSubscriptionEvent: any = null;
  deleteEventSubscription:any;
  jsoUnsafeActionCategorySubscriptionEvent:any = null;
 jsoUnsafeActionSubCategorySubscriptionEvent:any = null;
 jsoUnsafeActionObservedGroupSubscriptionEvent:any = null;
 closeUnsafeActionEventSubscription:any = null;
 selectedTab:number = 0;
  Id:number;
  userDetailObject = {
    id: null,
    first_name: '',
    last_name: '',
    designation: '',
    image_token: '',
    mobile: null,
    email: '',
    department: '',
    status_id: null
  }
  formObject = {
    id: null,
    type : null,
    values : null
  };
  deleteObject = {
    id: null,
    position: null,
    type: '',
    subtitle:'',
    category:''
  };

 closeObject = {
    type:null,
    id: null
  }

  constructor(private _helperService:HelperServiceService,
    private _renderer2: Renderer2,
    private _utilityService:UtilityService,
    private _eventEmitterService:EventEmitterService,
    private _unsafeActionService:JsoUnsafeActionsService,
    private _route:ActivatedRoute,
    private _router:Router,
    private _cdr:ChangeDetectorRef) { 
    
    }

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      this.Id = params.id;
      this.getItem();
    });
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: 'UPDATE_JSO_OBSERVATION_UNSAFE_ACTION', submenuItem: { type: 'edit_modal' } },
        { activityName: 'DELETE_JSO_OBSERVATION_UNSAFE_ACTION', submenuItem: { type: 'delete' } },
        {activityName: null, submenuItem: {type: 'close', path: "/jso/unsafe-actions"}}, 
      ]

      this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            setTimeout(() => {
              this._utilityService.detectChanges(this._cdr);
              this.editUnsafeActions();
            }, 1000);
            break;
          case "delete":
            setTimeout(() => {
              this._utilityService.detectChanges(this._cdr);
              this.deleteUnsafeAction();
            }, 1000);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })
    
    this.closeUnsafeActionEventSubscription = this._eventEmitterService.closeUnsafeActionModel.subscribe(() => {
      this.hideCloseFormModal();
    });

    this.jsoSubscriptionEvent = this._eventEmitterService.JsoUnsafeActionModel.subscribe(() => {
      this.closeFormModal();
    })

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      if(this.deleteObject.category =='unsafeAction')
      this.delete(item);
      else if(this.deleteObject.category =='statusChange')
      this.unsafeActionStatusChange(item); 
    });

    this.jsoUnsafeActionCategorySubscriptionEvent = this._eventEmitterService.jsoUnsafeActionCategory.subscribe(res => {
      this.changeZIndex();
    })
    this.jsoUnsafeActionSubCategorySubscriptionEvent = this._eventEmitterService.jsoUnsafeActionSubCategory.subscribe(res => {
      this.changeZIndex();
    })
    this.jsoUnsafeActionObservedGroupSubscriptionEvent = this._eventEmitterService.jsoUnsafeActionObservedGroup.subscribe(res => {
      this.changeZIndex();
    })

    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    
  }

  getItem(){
    this._unsafeActionService.getItem(this.Id).subscribe(res => {
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100)
    });
  }

  getPopupDetails() {

    let user = JsoUnsafeActionStore.jsoUnsafeActionsDetails?.corrective_action_responsible_user;
    this.userDetailObject.first_name = user?.first_name ? user?.first_name : null;
    this.userDetailObject.last_name = user?.last_name ? user?.last_name : null;
    this.userDetailObject.designation = user?.designation ? user?.designation : null;
    this.userDetailObject.image_token = user?.image?.token ? user?.image?.token : null;
    this.userDetailObject.email = user?.email ? user?.email : null;
    this.userDetailObject.mobile = user?.mobile ? user?.mobile : null;
    this.userDetailObject.id = user?.id ? user?.id : null;
    this.userDetailObject.department = user?.department ? user?.department : null;
    this.userDetailObject.status_id = user?.status?.id ? user?.status?.id : 1;
    return this.userDetailObject;
  }
  
  getCreatedByPopupDetails(users, created?:string){
    let userDetial: any = {};
    userDetial['first_name'] = users?.first_name;
    userDetial['last_name'] = users?.last_name;
    userDetial['designation'] = users?.designation;
    userDetial['image_token'] = users?.image?.token;
    userDetial['email'] = users?.email;
    userDetial['mobile'] = users?.mobile;
    userDetial['id'] = users?.id;
    userDetial['department'] = users?.department;
    userDetial['status_id'] = users?.status?.id ? users?.status?.id : 1;
    userDetial['created_at'] = created? created:null;
   return userDetial;

  }

  closeFormModal() {
    // this.getItem();
    // this._utilityService.detectChanges(this._cdr);
    $(this.formModal.nativeElement).modal('hide');
    this.formObject.type = null;
    this.formObject.values = null;
  }

  deleteUnsafeAction(){
    this.deleteObject.id = this.Id;
    // this.deleteObject.type = '';
    // this.deleteObject.category ='unsafeAction';
    // this.deleteObject.subtitle = "Are you sure you want to delete this JSO Unsafe Action?"
    this.deleteObject.type = 'are_you_sure_delete';
    this.deleteObject.category = 'unsafeAction'
    this.deleteObject.subtitle = "jso_unsafe_action_delete_subtitile" 
    $(this.deletePopup.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  clearDeleteObject() {

    this.deleteObject.id = null;
    this.deleteObject.position = null;
    this.deleteObject.type = '';
    this.deleteObject.subtitle = '';
  }

  delete(status) {
    if (status && this.deleteObject.id) {
      this._unsafeActionService.delete(this.deleteObject.id).subscribe(resp => {
        // setTimeout(() => {
        //   this._utilityService.detectChanges(this._cdr);
        //   if (JsoUnsafeActionStore.currentPage > 1) {
        //     JsoUnsafeActionStore.currentPage = Math.ceil(JsoUnsafeActionStore.totalItems / 15);
        //   }
        // }, 500);
        this.clearDeleteObject();
        this._router.navigateByUrl('/jso/unsafe-actions');
        this._utilityService.detectChanges(this._cdr);
      },
        (err: HttpErrorResponse) => {
          // console.log(err)
          // if (err.status == 422) {

          //   this._utilityService.showErrorMessage(err.error.message, 'Error :');
          // }
          this._utilityService.showErrorMessage('Error :', err.error.message ? err.error.message : 'Something Went Wrong Try Again Later' );
        });
    }
    else {
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('hide');
    }, 250);
  }

  editUnsafeActions(){
    this.formObject.id = this.Id;
    this.formObject.type = 'Edit';
    this.formObject.values = JsoUnsafeActionStore.jsoUnsafeActionsDetails; 
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
  }


  statusChange(){
    this.deleteObject.id = this.Id;
    this.deleteObject.type = 'Confirm';
    this.deleteObject.category ='statusChange'
    this.deleteObject.subtitle = "Are you sure you want to resolve this unsafe action?";
    $(this.deletePopup.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  closeStatus(){
    this.closeObject.id = this.Id;
    this.closeObject.type = 'Close';
    $(this.closeStatusFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.closeStatusFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }

  hideCloseFormModal() {
    this.getItem();
    $(this.closeStatusFormModal.nativeElement).modal('hide');
    this.closeObject.type = null;
    this.closeObject.id = null;
  }

  unsafeActionStatusChange(status) {
    if (status && this.deleteObject.id) {
      let save;
    // if(JsoUnsafeActionStore.jsoUnsafeActionsDetails?.unsafe_action_status?.type == 'new')
     save = this._unsafeActionService.resolveUnsafeAction(this.Id);
    // else if(JsoUnsafeActionStore.jsoUnsafeActionsDetails?.unsafe_action_status?.type == 'resolved')
    // save = this._unsafeActionService.closeUnsafeAction(this.Id);

      save.subscribe(resp => {
        this.clearDeleteObject();
        this.getItem();
      },
        (err: HttpErrorResponse) => {
          // console.log(err)
          // if (err.status == 422) {
          //   this._utilityService.showErrorMessage(err.error.message, 'Error :');
          // }
          // else if (err.status == 500 || err.status == 404) {
          //   AppStore.disableLoading();
          // }
          // else {
          //   this._utilityService.showErrorMessage('Error', 'Something Went Wrong Try Again Later');
          // }
          this._utilityService.showErrorMessage('Error :', err.error.message ? err.error.message : 'Something Went Wrong Try Again Later' );
          this.clearDeleteObject();
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
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

  openAccordian(value){
    if(this.selectedTab == value)
    this.selectedTab = null;
    else
    this.selectedTab = value;

    this._utilityService.detectChanges(this._cdr);
  }

  getTimezoneFormatted(time){
    return this._helperService.timeZoneFormatted(time);
  }

  ngOnDestroy(){
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    JsoUnsafeActionStore.unsafeAction_id = null;
    JsoUnsafeActionStore.unsetIndividualJsoUnsafeAction();
    this.jsoUnsafeActionCategorySubscriptionEvent.unsubscribe();
    this.jsoUnsafeActionSubCategorySubscriptionEvent.unsubscribe();
    this.jsoUnsafeActionObservedGroupSubscriptionEvent.unsubscribe();
    this.closeUnsafeActionEventSubscription.unsubscribe();
    this.jsoSubscriptionEvent.unsubscribe();
    this.deleteEventSubscription.unsubscribe();
  }

}
