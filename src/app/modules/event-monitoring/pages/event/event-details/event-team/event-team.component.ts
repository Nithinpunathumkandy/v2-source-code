import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef, Renderer2, OnDestroy } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { EventTeamService } from "src/app/core/services/event-monitoring/event-team/event-team.service";
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { UtilityService } from "src/app/shared/services/utility.service";
import { AuthStore } from 'src/app/stores/auth.store';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { EventTeamsStore } from "src/app/stores/event-monitoring/event-team-store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AppStore } from 'src/app/stores/app.store';
import { ExternalUsersStore } from 'src/app/stores/event-monitoring/events/event-external-user.store';

declare var $: any;

@Component({
  selector: 'app-event-team',
  templateUrl: './event-team.component.html',
  styleUrls: ['./event-team.component.scss']
})
export class EventTeamComponent implements OnInit,OnDestroy {

  @ViewChild('eventTeamPopUp', {static: true}) eventTeamPopUp: ElementRef;
  @ViewChild('eventSecondaryOwnersPopUp', {static: true}) eventSecondaryOwnersPopUp: ElementRef;
  @ViewChild('fullSecondaryOwner', {static: true}) fullSecondaryOwner: ElementRef;
  @ViewChild('newExternalUsers', {static: true}) newExternalUsers: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('eventMember') eventMember: ElementRef;
  
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  EventsStore = EventsStore;
  EventTeamsStore = EventTeamsStore;
  ExternalUsersStore = ExternalUsersStore;
  AppStore=AppStore;
  AuthStore=AuthStore;
  eventTeamObject = {
    type: null,
    values: null
  }
  secondaryOwnersObject = {
    type: null,
    values: null
  };
  secondaryOwnersDetailsObject = {
    type: null,
    values: null
  };
  externalUsersObject = {
    id : null,
    type : null,
    value : null
  }
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: '',
  };

  eventMemberObject = {
    id: null,
    type: null,
    value: null
  }

  noDataSource = "look_like_we_dont_have_any_external_users_data_to_display_here"
  
  popupControlEventSubscription:any = null;
  eventTeamModalSubscription: any = null;
  eventSecondaryModalSubscription: any = null;
  eventSecondaryDetailsModalSubscription: any = null;
  externalUsersSubscriptionEvent :any = null;
  eventMemberSubscriptionEvent : any = null;

  constructor(private _eventEmitterService: EventEmitterService, private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService, private _eventTeamsService: EventTeamService,
    private _utilityService: UtilityService,private _humanCapitalService:HumanCapitalService,
    private _imageService:ImageServiceService,private _renderer2: Renderer2,
    ) { }

  ngOnInit(): void {
    // NoDataItemStore.setNoDataItems({title:"No event budget has been added", subtitle: 'Click on the below button to add a new event budget',buttonText: 'New event budget'});
    this.reactionDisposer = autorun(() => {  
      // var subMenuItems = [
      //   {activityName: 'CREATE_PROJECT_MONITORING_BUDGET', submenuItem: {type: 'new_modal'}},
      //   {activityName:null, submenuItem: {type: 'close', path: '../'}}
      // ]
      if(!AuthStore.getActivityPermission(3200,'CREATE_PROJECT_MONITORING_BUDGET')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      // this._helperService.checkSubMenuItemPermissions(3700, subMenuItems);
      //this._helperService.checkSubMenuItemPermissions(3700, subMenuItems);
      NoDataItemStore.setNoDataItems({title:"em_event_team_data_title", subtitle: 'em_event_team_subtitle',buttonText: 'em_new_event_team'});

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.createEventTeam();
            break;
          case "edit_modal":
            this.editEventTeam();
              break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      } 

      if(NoDataItemStore.clikedNoDataItem){
        this.createEventTeam();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    });
    this.eventTeamModalSubscription = this._eventEmitterService.eventTeamModal.subscribe((res)=>{
      this.closeEventTeam();
    })
    this.eventSecondaryModalSubscription = this._eventEmitterService.eventSecondaryOwnerModal.subscribe((res)=>{
      this.closeSecondaryOwners();
    })
    this.eventSecondaryDetailsModalSubscription = this._eventEmitterService.eventSecondaryOwnerDetailModal.subscribe((res)=>{
      this.closeSecondaryOwnersDetails();
    })

    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    this.externalUsersSubscriptionEvent = this._eventEmitterService.eventexternalUsers.subscribe(item => {
      this.closeExternalUsers();
    })

    this.eventMemberSubscriptionEvent = this._eventEmitterService.eventMember.subscribe(item => {
      this.closeEventMember();
    })
   
    this.getTeam();
  }

  getTeam(){
    this._eventTeamsService.getAssistantManagers().subscribe(res=>{
      this.setSubMenu();
      this._utilityService.detectChanges(this._cdr);
    });
    this._eventTeamsService.getMembers().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
    this._eventTeamsService.getSecondaryOwners().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
    this._eventTeamsService.externalUserGetItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  setSubMenu(){
    let subMenuItems:any = []
    if(EventTeamsStore.assisstantManagers.event_assistant_managers.length > 0 && (EventsStore?.eventDetails?.event_status?.type=='draft' || EventsStore?.eventDetails?.event_status?.type=='send-back' )){
      subMenuItems = [{activityName: 'CREATE_PROJECT_MONITORING_BUDGET', submenuItem: {type: 'edit_modal'}}]
    }
    if(EventTeamsStore.assisstantManagers.event_assistant_managers.length==0 &&  (EventsStore?.eventDetails?.event_status?.type=='draft' || EventsStore?.eventDetails?.event_status?.type=='send-back')){
      subMenuItems = [{activityName: 'CREATE_PROJECT_MONITORING_BUDGET', submenuItem: {type: 'new_modal'}},
     ]
    }
    subMenuItems.push( {activityName:null, submenuItem: {type: 'close', path: '../'}})
    this._helperService.checkSubMenuItemPermissions(3700, subMenuItems);
    this._utilityService.detectChanges(this._cdr);
  }

  createEventTeam(){
    setTimeout(() => {
      this.eventTeamObject.type = 'Add';
      this.eventTeamObject.values = 
      {
        event_manager:EventsStore.eventDetails?.owner,
        members: EventTeamsStore.members.event_members, 
        assistant_managers: EventTeamsStore?.assisstantManagers?.event_assistant_managers};
      setTimeout(() => {
        $(this.eventTeamPopUp.nativeElement).modal('show');
      }, 100);
      this._renderer2.setStyle(this.eventTeamPopUp.nativeElement,'display','block');
      this._renderer2.setStyle(this.eventTeamPopUp.nativeElement,'overflow','auto');
      this._renderer2.setStyle(this.eventTeamPopUp.nativeElement,'z-index',99999);
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  editEventTeam(){
    setTimeout(() => {
      this.eventTeamObject.type = 'Edit';
      this.eventTeamObject.values = 
      {
        event_manager:EventsStore.eventDetails?.owner,
        members: EventTeamsStore.members.event_members, 
        assistant_managers: EventTeamsStore.assisstantManagers.event_assistant_managers};
     
      setTimeout(() => {
        $(this.eventTeamPopUp.nativeElement).modal('show');
      }, 100);
     this._renderer2.setStyle(this.eventTeamPopUp.nativeElement,'display','block');
     this._renderer2.setStyle(this.eventTeamPopUp.nativeElement,'overflow','auto');
     this._renderer2.setStyle(this.eventTeamPopUp.nativeElement,'z-index',99999);
      //$('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  createImageUrl(type, token) {
    return this._humanCapitalService.getThumbnailPreview(type, token)
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  closeEventTeam(){

    setTimeout(() => {
      this.eventTeamObject.type = null;
    this.eventTeamObject.values = null;
     $(this.eventTeamPopUp.nativeElement).modal('hide');
     this._renderer2.removeClass(this.eventTeamPopUp.nativeElement,'show');
     this._renderer2.setStyle(this.eventTeamPopUp.nativeElement,'display','none');
     //this.setSubMenu();
     this.getTeam();
     this._utilityService.detectChanges(this._cdr);
      
    }, 200);
   
  }

  getNoDataSource(type,message){
    let noDataSource = {
      noData: message, border: false, imageAlign: type
    }
    return noDataSource;
  }

  getPopupDetails(user,is_created_by:boolean = false){
    let userDetailObject: any = {};
    if(user){
      userDetailObject['first_name'] = user.first_name ? user.first_name : user.name ? user.name : '';
      userDetailObject['last_name'] = user.last_name;
      userDetailObject['designation'] = user.designation_title? user.designation_title: user.designation ? user.designation.title : null;
      userDetailObject['image_token'] = user.image_token ? user.image_token : user.image?.token ? user.image?.token : null;
      userDetailObject['email'] = user.email ? user.email: null;
      userDetailObject['mobile'] = user.mobile ? user.mobile: null;
      userDetailObject['id'] = user.id;
      userDetailObject['department'] = typeof(user.department) == 'string' ? user.department : user.designation ? user.designation.title : null;
      userDetailObject['status_id'] = user.status_id ? user.status_id : 1;
      if(is_created_by) userDetailObject['created_at'] = new Date();
      return userDetailObject;
    }
  }

 
    
  openSecondaryOwnerModal()
  {
    setTimeout(() => {
      this.secondaryOwnersObject.type = 'Add';
      this.secondaryOwnersObject.values = null;
      setTimeout(() => {
        $(this.eventSecondaryOwnersPopUp.nativeElement).modal('show');
      }, 100);
      this._renderer2.setStyle(this.eventSecondaryOwnersPopUp.nativeElement,'display','block');
      this._renderer2.setStyle(this.eventSecondaryOwnersPopUp.nativeElement,'overflow','auto');
      this._renderer2.setStyle(this.eventSecondaryOwnersPopUp.nativeElement,'z-index',99999);
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  closeSecondaryOwners(){
    setTimeout(() => {
      this.secondaryOwnersObject.type = null;
    this.secondaryOwnersObject.values = null;
     $(this.eventSecondaryOwnersPopUp.nativeElement).modal('hide');
     this._renderer2.removeClass(this.eventSecondaryOwnersPopUp.nativeElement,'show');
     this._renderer2.setStyle(this.eventSecondaryOwnersPopUp.nativeElement,'display','none');
     //this.setSubMenu();
     this._utilityService.detectChanges(this._cdr);
      
    }, 200);
   
  }

  editSecondaryOwner(){
    setTimeout(() => {
      this.secondaryOwnersObject.type = 'Edit';
      this.secondaryOwnersObject.values = {departments:EventTeamsStore?._eventSecondaryDepartentsDetails,owners:EventTeamsStore?._eventSecondaryOwners};
      setTimeout(() => {
        $(this.eventSecondaryOwnersPopUp.nativeElement).modal('show');
      }, 100);
      this._renderer2.setStyle(this.eventSecondaryOwnersPopUp.nativeElement,'display','block');
      this._renderer2.setStyle(this.eventSecondaryOwnersPopUp.nativeElement,'overflow','auto');
      this._renderer2.setStyle(this.eventSecondaryOwnersPopUp.nativeElement,'z-index',99999);
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  openFullSecondaryOwner(){
    setTimeout(() => {
      this.secondaryOwnersDetailsObject.type = 'open';
      this.secondaryOwnersDetailsObject.values = null;
      setTimeout(() => {
        $(this.fullSecondaryOwner.nativeElement).modal('show');
      }, 100);
      this._renderer2.setStyle(this.fullSecondaryOwner.nativeElement,'display','block');
      this._renderer2.setStyle(this.fullSecondaryOwner.nativeElement,'overflow','auto');
      this._renderer2.setStyle(this.fullSecondaryOwner.nativeElement,'z-index',99999);
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  closeSecondaryOwnersDetails()
  {
    setTimeout(() => {
      this.secondaryOwnersDetailsObject.type = null;
    this.secondaryOwnersDetailsObject.values = null;
     $(this.fullSecondaryOwner.nativeElement).modal('hide');
     this._renderer2.removeClass(this.fullSecondaryOwner.nativeElement,'show');
     this._renderer2.setStyle(this.fullSecondaryOwner.nativeElement,'display','none');
     //this.setSubMenu();
     this._utilityService.detectChanges(this._cdr);
      
    }, 200);
  }
  getArrayFormatedString(type, items) {
    return this._helperService.getArraySeperatedString(', ', type, items);
  }

  getExternalUsers(){
    this._eventTeamsService.externalUserGetItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  openExternalUsersModal(){
    setTimeout(() => {
      this.externalUsersObject.type = 'open';
      this.externalUsersObject.value= null;
      setTimeout(() => {
        $(this.newExternalUsers.nativeElement).modal('show');
      }, 100);
      this._renderer2.setStyle(this.newExternalUsers.nativeElement,'display','block');
      this._renderer2.setStyle(this.newExternalUsers.nativeElement,'overflow','auto');
      this._renderer2.setStyle(this.newExternalUsers.nativeElement,'z-index',99999);
      this._utilityService.detectChanges(this._cdr);
    }, 100);

  }

  editExternalUsers(id,item) {
        this.externalUsersObject.value = item;
        this.externalUsersObject.value.id = id;
        this.externalUsersObject.type = 'Edit';
          setTimeout(() => {
            $(this.newExternalUsers.nativeElement).modal('show');
          }, 100);
          this._renderer2.setStyle(this.newExternalUsers.nativeElement,'display','block');
          this._renderer2.setStyle(this.newExternalUsers.nativeElement,'overflow','auto');
          this._renderer2.setStyle(this.newExternalUsers.nativeElement,'z-index',99999);
          this._utilityService.detectChanges(this._cdr);
  }

  deleteExternalUsers(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'are_you_sure';
    this.popupObject.id = id;
    this.popupObject.title = 'are_you_sure';
    this.popupObject.subtitle = 'delete_external_user_subtitle';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

    // modal control event
    modalControl(status: boolean) {
      switch (this.popupObject.type) {
        case 'are_you_sure': this.deleteExternalUser(status)
          break;
          case '': this.deleteEventMemeber(status)
          break;
      }
  
    }
    deleteExternalUser(status: boolean) {
      if (status && this.popupObject.id) {
        this._eventTeamsService.deleteExternalUser(this.popupObject.id).subscribe(resp => {
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
          }, 500);
          this.getExternalUsers()
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

  closeExternalUsers(){
    setTimeout(() => {
      this.externalUsersObject.type = null;
    this.externalUsersObject.value = null;
     $(this.newExternalUsers.nativeElement).modal('hide');
     this._renderer2.removeClass(this.newExternalUsers.nativeElement,'show');
     this._renderer2.setStyle(this.newExternalUsers.nativeElement,'display','none');
     this._utilityService.detectChanges(this._cdr);
      
    }, 200);
   
  }

  editEventMember(item){
    this.eventMemberObject.id = item.pivot.id
    this.eventMemberObject.value = item;
    this.eventMemberObject.type = 'Edit';
      setTimeout(() => {
        $(this.eventMember.nativeElement).modal('show');
      }, 100);
      this._renderer2.setStyle(this.eventMember.nativeElement,'display','block');
      this._renderer2.setStyle(this.eventMember.nativeElement,'overflow','auto');
      this._renderer2.setStyle(this.eventMember.nativeElement,'z-index',99999);
      this._utilityService.detectChanges(this._cdr); 
  }

  closeEventMember(){
    setTimeout(() => {
      this.eventMemberObject.id = null;
      this.eventMemberObject.type = null;
      this.eventMemberObject.value = null;
     $(this.eventMember.nativeElement).modal('hide');
     this._renderer2.removeClass(this.eventMember.nativeElement,'show');
     this._renderer2.setStyle(this.eventMember.nativeElement,'display','none');
     this._utilityService.detectChanges(this._cdr);
      
    }, 200);
  }
  deleteEventMemebers(id){
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'are_you_sure';
    this.popupObject.subtitle = 'delete_event_member_subtitle';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
    
  }

  deleteEventMemeber(status: boolean) {
    if (status && this.popupObject.id) {
      this._eventTeamsService.deleteEventMember(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
          this._eventTeamsService.getMembers().subscribe(res=>{
          this._utilityService.detectChanges(this._cdr);
          });
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
  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  ngOnDestroy(): void {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.popupControlEventSubscription.unsubscribe();
    this.eventTeamModalSubscription.unsubscribe();
    this.eventSecondaryModalSubscription.unsubscribe();
    this.eventSecondaryDetailsModalSubscription.unsubscribe();
    EventTeamsStore?.unsetEventsTeamList();
    this.externalUsersSubscriptionEvent.unsubscribe();
  }

}
