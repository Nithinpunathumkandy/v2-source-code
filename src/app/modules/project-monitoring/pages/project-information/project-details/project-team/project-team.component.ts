import { Component, OnInit, ElementRef, ViewChild, Renderer2, ChangeDetectorRef } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ProjectTeamService } from 'src/app/core/services/project-monitoring/project-team/project-team.service';
import { ProjectMonitoringStore } from 'src/app/stores/project-monitoring/project-monitoring.store';
import { ProjectTeamStore } from 'src/app/stores/project-monitoring/project-team-store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { ExternalUsersService } from 'src/app/core/services/project-monitoring/project-team/external-users.service';
import { ExternalUsersStore } from 'src/app/stores/project-monitoring/external-users-store';

declare var $: any;

@Component({
  selector: 'app-project-team',
  templateUrl: './project-team.component.html'
})
export class ProjectTeamComponent implements OnInit {
  @ViewChild('projectTeam', {static: true}) projectTeam: ElementRef;
  @ViewChild('newExternalUsers', {static: true}) newExternalUsers: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  ProjectTeamStore = ProjectTeamStore;
  ExternalUsersStore = ExternalUsersStore;
  ProjectMonitoringStore = ProjectMonitoringStore
  AuthStore = AuthStore;
  AppStore = AppStore;

  noDataSource = "look_like_we_dont_have_any_external_users_data_to_display_here"

  // emptyMessage="look_like_we_dont_have_any_external_users_data_to_display_here";
  projectTeamObject = {
    id : null,
    type : null,
    value : null
  }

  externalUsersObject = {
    id : null,
    type : null,
    value : null
  }
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  popupControlEventSubscription: any;
  projectTeamSubscriptionEvent: any = null;
  externalUsersSubscriptionEvent: any = null;
  constructor(
    private _renderer2: Renderer2,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService : HelperServiceService,
    private _projectTeamService : ProjectTeamService,
    private _eventEmitterService: EventEmitterService,
    private _imageService:ImageServiceService,
    private _externalUsersService: ExternalUsersService
  ) { }

  /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof ProjectTeamComponent
   */     
  ngOnInit(): void {
    SubMenuItemStore.setNoUserTab(true);
    AppStore.showDiscussion = false;
    this.reactionDisposer = autorun(() => {  
      NoDataItemStore.setNoDataItems({title:"common_nodata_title", subtitle: 'common_nodata_subtitle',buttonText: 'new_project_team'});

      if(!AuthStore.getActivityPermission(3200,'CREATE_PROJECT_EXTRNAL_USER')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      // this._helperService.checkSubMenuItemPermissions(3200, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.openProjectTeamModal();
            break;
          case "edit_modal":
            this.openEditProjectTeamModal();
            break;
          default:
						break;
				}
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      } 
      if(NoDataItemStore.clikedNoDataItem){
        this.openProjectTeamModal();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    });
    this.projectTeamSubscriptionEvent = this._eventEmitterService.projectTeamModal.subscribe(item => {
      this.closeProjectTeam();
      this.getProjectManagers();
      this.getProjectAssistantManagers();
      this.getProjectMembers();
    })

    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    
    this.externalUsersSubscriptionEvent = this._eventEmitterService.externalUsers.subscribe(item => {
      this.closeExternalUsers();
      this.getExternalUsers();
    })
    setTimeout(() => {
      this.getAll();
      this._utilityService.detectChanges(this._cdr);
    }, 500);
  }

  getSubMenus() {
      if (ProjectTeamStore?.projectManagers?.project_manager == null && (ProjectMonitoringStore.individualDetails?.project_monitoring_status?.type =='draft' || ProjectMonitoringStore.individualDetails?.project_monitoring_status?.type =='send-back')) {
      var subMenuItems = [
        {activityName: 'CREATE_PROJECT_EXTRNAL_USER', submenuItem: {type: 'new_modal'}},
        {activityName: null, submenuItem: { type: 'close', path: '../' } },
      ]
      this._helperService.checkSubMenuItemPermissions(3200, subMenuItems);
      this._utilityService.detectChanges(this._cdr);
    }
      else if(ProjectMonitoringStore.individualDetails?.project_monitoring_status?.type =='draft' || ProjectMonitoringStore.individualDetails?.project_monitoring_status?.type =='send-back') {
      var subMenuItems = [
        {activityName: 'CREATE_PROJECT_EXTRNAL_USER', submenuItem: {type: 'edit_modal'}},
        {activityName: null, submenuItem: { type: 'close', path: '../' } },
      ]
      this._helperService.checkSubMenuItemPermissions(3200, subMenuItems);
      this._utilityService.detectChanges(this._cdr);
    }else {
      var subMenuItems = [
        {activityName: 'CREATE_PROJECT_EXTRNAL_USER', submenuItem: {type: ''}},
        {activityName: null, submenuItem: { type: 'close', path: '../' } },
      ]
      this._helperService.checkSubMenuItemPermissions(3200, subMenuItems);
    }
    this._utilityService.detectChanges(this._cdr);
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

  getAll() {
    this.getProjectManagers();
    this.getProjectAssistantManagers();
    this.getProjectMembers();
    this.getExternalUsers();
    this._utilityService.detectChanges(this._cdr);
  }

  getProjectManagers(){
    this._projectTeamService.getProjectManagers(ProjectMonitoringStore.selectedProjectId).subscribe(res=>{
      this.getSubMenus();
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getProjectAssistantManagers(){
    this._projectTeamService.getProjectAssistantManagers(ProjectMonitoringStore.selectedProjectId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getProjectMembers(){
    this._projectTeamService.getProjectMembers(ProjectMonitoringStore.selectedProjectId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getExternalUsers(){
    this._externalUsersService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  openProjectTeamModal(){
    this.projectTeamObject.type = 'Add';
    this.projectTeamObject.value = null; // for clearing the value
    this.openProjectTeam()
  }

  openEditProjectTeamModal(){
    this.projectTeamObject.type = 'Edit';
    this.projectTeamObject.value = null; // for clearing the value
    this.openProjectTeam()
  }

  openProjectTeam(){
    this._renderer2.addClass(this.projectTeam.nativeElement,'show');
    this._renderer2.setStyle(this.projectTeam.nativeElement,'display','block');
    this._renderer2.setStyle(this.projectTeam.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.projectTeam.nativeElement,'z-index',99999);
  }

  closeProjectTeam(){
    setTimeout(() => {
      this.projectTeamObject.type = null;
      this.projectTeamObject.value = null;
      this._renderer2.removeClass(this.projectTeam.nativeElement,'show');
      this._renderer2.setStyle(this.projectTeam.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }

  openExternalUsersModal(){
    this.externalUsersObject.type = 'Add';
    this.externalUsersObject.value = null; // for clearing the value
    this.openExternalUsers()

  }

  openExternalUsers(){
    this._renderer2.addClass(this.newExternalUsers.nativeElement,'show');
    this._renderer2.setStyle(this.newExternalUsers.nativeElement,'display','block');
    this._renderer2.setStyle(this.newExternalUsers.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.newExternalUsers.nativeElement,'z-index',99999);
  }

  closeExternalUsers(){
    setTimeout(() => {
      this.externalUsersObject.type = null;
      this.externalUsersObject.value = null;
      this._renderer2.removeClass(this.newExternalUsers.nativeElement,'show');
      this._renderer2.setStyle(this.newExternalUsers.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }


    //passing token to get preview
    createImagePreview(type, token) {
      return this._imageService.getThumbnailPreview(type, token)
    }
  
    //returns default image
    getDefaultImage(type) {
      return this._imageService.getDefaultImageUrl(type);
    }  

    editExternalUsers(id) {
      event.stopPropagation();
      this._externalUsersService.getItem(ProjectMonitoringStore.selectedProjectId,id).subscribe(res=>{
        if(res){
          this.externalUsersObject.value = res;
          this.externalUsersObject.type = 'Edit';
          this._utilityService.detectChanges(this._cdr);
          this.openExternalUsers()
        }
      })
    }

    
  // for delete
  deleteExternalUsers(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'are_you_sure';
    this.popupObject.id = id;
    this.popupObject.title = 'are_you_sure';
    this.popupObject.subtitle = 'delete_external_user_subtitle';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  // for popup object clearing
  clearPopupObject() {
      this.popupObject.id = null;
  }

  // modal control event
  modalControl(status: boolean) {
      switch (this.popupObject.type) {
        case 'are_you_sure': this.deleteExternalUser(status)
          break;
      }
  
    }

  // delete function call
  deleteExternalUser(status: boolean) {
    if (status && this.popupObject.id) {
      this._externalUsersService.deleteExternalUser(ProjectMonitoringStore.selectedProjectId,this.popupObject.id).subscribe(resp => {
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


  // getNoDataSource(type){
  //   let noDataSource = {
  //     noData: this.emptyMessage, border: false, imageAlign: type
  //   }
  //   return noDataSource;
  // }
  
   /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof ProjectTeamComponent
   */      
  ngOnDestroy(){
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      this.projectTeamSubscriptionEvent.unsubscribe();
      this.popupControlEventSubscription.unsubscribe();
      this.externalUsersSubscriptionEvent.unsubscribe();
    }  


}
