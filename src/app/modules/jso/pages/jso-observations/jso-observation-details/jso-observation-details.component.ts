import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { JsoObservationsService } from 'src/app/core/services/jso/jso-observations/jso-observations.service';
import { JsoUnsafeActionsService } from 'src/app/core/services/jso/unsafe-actions/jso-unsafe-actions.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { JsoObservationStore } from 'src/app/stores/jso/jso-observations/jso-observations-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any

@Component({
  selector: 'app-jso-observation-details',
  templateUrl: './jso-observation-details.component.html',
  styleUrls: ['./jso-observation-details.component.scss']
})
export class JsoObservationDetailsComponent implements OnInit {
  @ViewChild('formModal', { static: false }) formModal: ElementRef;
  @ViewChild('unsafeActionFormModal', { static: false }) unsafeActionFormModal: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('closeStatusFormModal', { static: true }) closeStatusFormModal: ElementRef;

  JsoObservationStore = JsoObservationStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;
  jsoSubscriptionEvent: any = null;
  unsafeSubscriptionEvent: any = null;
  deleteEventSubscription:any;
  Id:number;

  jsoUnsafeActionCategorySubscriptionEvent:any = null;
 jsoUnsafeActionSubCategorySubscriptionEvent:any = null;
 jsoUnsafeActionObservedGroupSubscriptionEvent:any = null;
 closeUnsafeActionEventSubscription:any = null;

  userDetailObject = {
    id: null,
    first_name: '',
    last_name: '',
    designation: '',
    image_token: '',
    mobile: null,
    email: '',
    department: '',
    status_id: null,
    created_at:null
  }
  formObject = {
    id: null,
    type : null,
    category:null,
    values : null
  };
  deleteObject = {
    id: null,
    position: null,
    type: '',
    subtitle:'',
    category:null,
    index:null
  };
  
  closeObject = {
    type:null,
    id: null
  }

  constructor(private _jsoObservationservice:JsoObservationsService,
    private _route: ActivatedRoute,
    private _renderer2: Renderer2,
    private _utilityService:UtilityService,
    private _humanCapitalService :HumanCapitalService,
    private _unsafeActionService:JsoUnsafeActionsService,
    private _imageService:ImageServiceService,
    private _helperService:HelperServiceService,
    private _eventEmitterService:EventEmitterService,
    private router:Router,
    private _cdr:ChangeDetectorRef) {
   
   }

  ngOnInit(): void {
    AppStore.showDiscussion = false;
    this._route.params.subscribe(params => {
      this.Id = params.id;
      JsoObservationStore.jso_id = this.Id;
      this.getItem();
    });
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: 'UPDATE_JSO_OBSERVATION', submenuItem: { type: 'edit_modal' } },
        { activityName: 'DELETE_JSO_OBSERVATION', submenuItem: { type: 'delete' } },
        {activityName: null, submenuItem: {type: 'close', path: "/jso/jso-observations"}}, 
      ]

      this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            this.editJsoObservations();
            break;
          case "delete":
            this.deleteJsoObservation();
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

    this.jsoSubscriptionEvent = this._eventEmitterService.JsoModel.subscribe(res => {
      this.closeFormModal();
    })

    this.unsafeSubscriptionEvent = this._eventEmitterService.JsoUnsafeActionModel.subscribe(res => {
      this.closeUnsafeActionFormModal();
      this.changeZIndex();
    })

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      if(this.deleteObject.category =='jsoObservation')
      this.delete(item);
      else if(this.deleteObject.category =='unsafeAction')
      this.deleteUnsafe(item);
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

  getItem() {
    this._jsoObservationservice.getItem(this.Id).subscribe(res => {
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100);
      JsoObservationStore.getJsoObservationsDetails();
      this._utilityService.detectChanges(this._cdr);
    });
  }

  createImagePreview(type, token) {
    return this._humanCapitalService.getThumbnailPreview(type, token);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  getPopupDetails(user, created?:string) {
    this.userDetailObject.first_name = user?.first_name ? user?.first_name : null;
    this.userDetailObject.last_name = user?.last_name ? user?.last_name : null;
    this.userDetailObject.designation = user?.designation ? user?.designation : null;
    this.userDetailObject.image_token = user?.image_token ? user?.image_token : user?.image?.token;
    this.userDetailObject.email = user?.email ? user?.email : null;
    this.userDetailObject.mobile = user?.mobile ? user?.mobile : null;
    this.userDetailObject.id = user?.id ? user?.id : null;
    this.userDetailObject.department = user?.department ? user?.department : null;
    this.userDetailObject.status_id = user?.status_id ? user?.status_id : 1;
    this.userDetailObject.created_at = created? created:null;
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
    userDetial['status_id'] = users?.status_id? users?.status_id:users?.status?.id;
    userDetial['created_at'] = created? created:null;
   return userDetial;

  }

  editJsoObservations(){
    this.formObject.id = JsoObservationStore.jso_id;
    this.formObject.type = 'Edit';
    this.formObject.category = 'jsoObservation'
    this.formObject.values = JsoObservationStore?.jsoObservationsDetails; 
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
  }

  closeFormModal() {
    // this.getItem();
    // this._utilityService.detectChanges(this._cdr);
    if(this.formObject.category == 'jsoObservation'){
      this.getItem();
      $(this.formModal.nativeElement).modal('hide');
      this.formObject.id = null;
      this.formObject.type = null;
      this.formObject.category = null;
      this.formObject.values = null;
      this._utilityService.detectChanges(this._cdr);
    }
  }

  deleteJsoObservation(){
    this.deleteObject.id = JsoObservationStore.jso_id;
    // this.deleteObject.type = '';
    // this.deleteObject.category ='jsoObservation'
    // this.deleteObject.subtitle = "Are you sure you want to delete this JSO observation?"
    this.deleteObject.type = 'are_you_sure_delete';
    this.deleteObject.category = 'jsoObservation'
    this.deleteObject.subtitle = "jso_observation_delete_subtitile" 
    $(this.deletePopup.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  clearDeleteObject() {

    this.deleteObject.id = null;
    this.deleteObject.position = null;
    this.deleteObject.type = '';
    this.deleteObject.subtitle = '';
    this.deleteObject.category = null;
    this.deleteObject.index = null;
  }

  delete(status) {
    if (status && this.deleteObject.id) {
      this._jsoObservationservice.delete(this.deleteObject.id).subscribe(resp => {
        this.clearDeleteObject();
        this.router.navigateByUrl('/jso/jso-observations');
        this._utilityService.detectChanges(this._cdr);
      },
        (err: HttpErrorResponse) => {
          // console.log(err)
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

  setControlAccordion(index: number) {
    this.JsoObservationStore.setControlAccordion(index);
    this._utilityService.detectChanges(this._cdr);
  }

  changeZIndex(){
    if($(this.formModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
    }
    if($(this.unsafeActionFormModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.unsafeActionFormModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.unsafeActionFormModal.nativeElement,'overflow','auto');
    }
  }

  editUnsafeActions(id){
    this.formObject.id = id;
    this.formObject.type = 'Edit';
    this.formObject.category = 'unsafeAction'
    this.formObject.values = JsoObservationStore?.jsoObservationsDetails?.unsafe_actions; 
    this._utilityService.detectChanges(this._cdr);
    this.openUnsafeActionFormModal();
  }

  openUnsafeActionFormModal() {
    setTimeout(() => {
      $(this.unsafeActionFormModal.nativeElement).modal('show');
    }, 50);
  }

  closeUnsafeActionFormModal() {
    if(this.formObject.category == 'unsafeAction'){
      this.getItem();
      // this._utilityService.detectChanges(this._cdr);
      $(this.unsafeActionFormModal.nativeElement).modal('hide');
      this.formObject.id = null;
      this.formObject.type = null;
      this.formObject.category = null;
      this.formObject.values = null;
      this._utilityService.detectChanges(this._cdr);
    }
  }

  deleteUnsafeAction(id){
    this.deleteObject.id = id;
    this.deleteObject.type = '';
    this.deleteObject.category = 'unsafeAction';
    this.deleteObject.subtitle = "Are you sure you want to delete this JSO Unsafe Action?"
    $(this.deletePopup.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  deleteUnsafe(status) {
    if (status && this.deleteObject.id) {
      this._unsafeActionService.delete(this.deleteObject.id).subscribe(resp => {       
        this.clearDeleteObject();
        this.getItem();
      },
        (err: HttpErrorResponse) => {
          // console.log(err)
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

  closeStatus(index){
    this.closeObject.id = JsoObservationStore?.jsoObservationsDetails?.unsafe_actions[index]?.id;
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

  statusChange(index){
    this.deleteObject.index = index;
    this.deleteObject.id = JsoObservationStore?.jsoObservationsDetails?.unsafe_actions[index]?.id;
    this.deleteObject.type = 'Confirm';
    this.deleteObject.category ='statusChange'
    this.deleteObject.subtitle = "Are you sure you want to resolve this unsafe action?";
    $(this.deletePopup.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  unsafeActionStatusChange(status) {
    if (status && this.deleteObject.id) {
      let save;
      // if (JsoObservationStore?.jsoObservationsDetails?.unsafe_actions[this.deleteObject.index]?.unsafe_action_status?.type == 'new')
        save = this._unsafeActionService.resolveUnsafeAction(this.deleteObject.id);
      // else if (JsoObservationStore?.jsoObservationsDetails?.unsafe_actions[this.deleteObject.index]?.unsafe_action_status?.type == 'resolved')
      //   save = this._unsafeActionService.closeUnsafeAction(this.deleteObject.id,'');

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

  getTimezoneFormatted(time){
    return this._helperService.timeZoneFormatted(time);
  }

  ngOnDestroy(){
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    JsoObservationStore.jso_id = null;
    JsoObservationStore.unsetIndividualJsoObservations();
    this.jsoUnsafeActionCategorySubscriptionEvent.unsubscribe();
    this.jsoUnsafeActionSubCategorySubscriptionEvent.unsubscribe();
    this.jsoUnsafeActionObservedGroupSubscriptionEvent.unsubscribe();
    this.closeUnsafeActionEventSubscription.unsubscribe();
    this.jsoSubscriptionEvent.unsubscribe();
    this.deleteEventSubscription.unsubscribe();
  }

}
