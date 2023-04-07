import { Component, OnInit, ElementRef, ViewChild, Renderer2, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ProjectMonitoringStore } from 'src/app/stores/project-monitoring/project-monitoring.store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { ProjectClosureStore } from 'src/app/stores/project-monitoring/project-closure';
import { ProjectClosureService } from 'src/app/core/services/project-monitoring/project-closure/project-closure.service';
import { Router } from '@angular/router';
import { ProjectClosureStatusMasterStore } from 'src/app/stores/masters/project-monitoring/project-closure-status-store';
import { ToastrService } from 'ngx-toastr';
import { ProjectMilestoneStore } from 'src/app/stores/project-monitoring/project-milestone-store';
import { ProjectChangeRequestService } from 'src/app/core/services/project-monitoring/project-change-request/project-change-request.service';

declare var $: any;

@Component({
  selector: 'app-project-closure',
  templateUrl: './project-closure.component.html'
})
export class ProjectClosureComponent implements OnInit, OnDestroy {

  @ViewChild('addProjectClosure', {static: true}) addProjectClosure: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;

  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  ProjectClosureStore = ProjectClosureStore;
  AppStore = AppStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AuthStore = AuthStore;
  documentArray = [];

  ProjectClosureObject = {
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
  projectClosureSubscriptionEvent: any = null;

  constructor(
    private _renderer2: Renderer2,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService : HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _imageService:ImageServiceService,
    private _projectClosureService: ProjectClosureService,
    private _router: Router,private _toastr: ToastrService,
    private _chnageRequestService: ProjectChangeRequestService,
  ) { }

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof ProjectClosureComponent
   */
  ngOnInit(): void {
    SubMenuItemStore.setNoUserTab(true);
    AppStore.showDiscussion = false;
    NoDataItemStore.setNoDataItems({title:"common_nodata_title", subtitle: 'common_nodata_subtitle',buttonText: 'pm_new_project_closure'});
    this.reactionDisposer = autorun(() => {  

    //  var subMenu = [
    //     {activityName: 'PROJECT_MONITOR_CLOSURE_LIST', submenuItem: {type: 'search'}},
    //     {activityName:null, submenuItem: {type: 'refresh'}},
    //     {activityName: 'CREATE_PROJECT_MONITOR_CLOSURE', submenuItem: {type: 'new_modal'}},
    //     {activityName: null, submenuItem: { type: 'close', path: '../' } },
    //   ]
  
      if(!AuthStore.getActivityPermission(3200,'CREATE_PROJECT_MONITOR_CLOSURE')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      // this._helperService.checkSubMenuItemPermissions(3200, subMenu);

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.addClosure();
            break;
          case "search":
            ProjectClosureStore.searchText = SubMenuItemStore.searchText;
             this.pageChange(1); 
             break;
             case 'refresh':
              ProjectClosureStore.loaded = false
              this.pageChange(1); 
              break
          default:
						break;
				}
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      } 
      if(NoDataItemStore.clikedNoDataItem){
        this.addClosure();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    });
    this.projectClosureSubscriptionEvent = this._eventEmitterService.projectClosureModal.subscribe(item => {
      this.closeProjectClosureModal()
      this.pageChange(1); 
    })
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
      this.pageChange(1)
    })
    this.pageChange(1)
  }

  pageChange(newPage:number = null){
    let subMenu = []
    if (newPage) ProjectClosureStore.setCurrentPage(newPage);
    this._projectClosureService.getItems().subscribe(res=>{
      // if(){
        if(res["data"].length == 0){
          subMenu = [
            {activityName: 'PROJECT_MONITOR_CLOSURE_LIST', submenuItem: {type: 'search'}},
            {activityName:null, submenuItem: {type: 'refresh'}},
            {activityName: 'CREATE_PROJECT_MONITOR_CLOSURE', submenuItem: {type: 'new_modal'}},
            {activityName: null, submenuItem: { type: 'close', path: '../' } },
          ]
        }else {
          subMenu = [
            {activityName: 'PROJECT_MONITOR_CLOSURE_LIST', submenuItem: {type: 'search'}},
            {activityName:null, submenuItem: {type: 'refresh'}},
            {activityName: null, submenuItem: { type: 'close', path: '../' } },
          ]
        }
        this._helperService.checkSubMenuItemPermissions(3200, subMenu);
      this._utilityService.detectChanges(this._cdr);
    })
  }

  // addNewProjectClosure(){
  //   this._chnageRequestService.getItems(false).subscribe(res=>{
  //     if(res['data'].length > 0){
  //       for(let data of res['data'] ){
  //         if(data.type != 'approved' && ProjectClosureStore.allItems[0].type == 'approved'){
  //          this._toastr.warning('warning', 'Plase approve all change closure and ');
  //         }else {
 
  //         }
  //       }
  //     }})
  //   if(ProjectClosureStore.allItems[0].type == 'approved'){
  //     this.openNewProjectClosureModal()
  //   }else {
  //     this._toastr.warning('warning', 'Plase approve all change closure');
  //   }
  // }

  addClosure(){
    this._chnageRequestService.getItems(false).subscribe(res=>{
      if(!this.milestoneValidation() ){
        this._toastr.warning('warning', 'Milestone progress is not 100%');
      }else if(res['data'].length > 0){
        for(let data of res['data'] ){
          if(data.type != 'approved'){
           this._toastr.warning('warning', 'Plase approve all change requests');
          }else {
            this.openNewProjectClosureModal()
            this._utilityService.detectChanges(this._cdr);

          }
        }
      }
      else{
        this.openNewProjectClosureModal()
        this._utilityService.detectChanges(this._cdr);

      }
    })
   
  }

  openNewProjectClosureModal(){
    this.ProjectClosureObject.type = 'Add';
    this.ProjectClosureObject.value = null; // for clearing the value
    ProjectClosureStatusMasterStore.lessonLearnedList = [];
    this.openProjectClosure()

  }

  openProjectClosure(){
    this._renderer2.addClass(this.addProjectClosure.nativeElement,'show');
    this._renderer2.setStyle(this.addProjectClosure.nativeElement,'display','block');
    this._renderer2.setStyle(this.addProjectClosure.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.addProjectClosure.nativeElement,'z-index',99999);
  }

  milestoneValidation(){
    let valid = true
    if(ProjectMilestoneStore.milesstones.length > 0){
      for(let data of ProjectMilestoneStore.milesstones){
        if(data.completion != '100.00'){
          valid = false
          break
        }
      }
    }else{
      valid = false
    }
    return valid;
  }

  closeProjectClosureModal(){
    setTimeout(() => {
      // $(this.newProject.nativeElement).modal('hide');
      this.ProjectClosureObject.type = null;
      this.ProjectClosureObject.value = null;
      this._renderer2.removeClass(this.addProjectClosure.nativeElement,'show');
      this._renderer2.setStyle(this.addProjectClosure.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  editProjectClosure(id){
    event.stopPropagation();
    ProjectClosureStatusMasterStore.lessonLearnedList = [];
    this._projectClosureService.getItem(ProjectMonitoringStore.selectedProjectId,id).subscribe(res=>{
      if(res){
        this.ProjectClosureObject.value = res;
        this.ProjectClosureObject.type = 'Edit';
        this._utilityService.detectChanges(this._cdr);
        this.openProjectClosure()
      }
    })
    }


  // for delete
  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'are_you_sure';
    this.popupObject.id = id;
    this.popupObject.title = 'delete_project_closure?';
    this.popupObject.subtitle = 'common_delete_subtitle';
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
        case 'are_you_sure': this.deleteClosure(status)
          break;
      }
  
    }

  // delete function call
  deleteClosure(status: boolean) {
    if (status && this.popupObject.id) {
      this._projectClosureService.delete(ProjectMonitoringStore.selectedProjectId,this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.pageChange(1)
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


  gotoDetailsPage(id){
    this._router.navigateByUrl(`/project-monitoring/projects/${ProjectMonitoringStore.selectedProjectId}/project-closure/${id}`);
  }



   /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof ProjectClosureComponent
   */    
  ngOnDestroy(){
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      this.projectClosureSubscriptionEvent.unsubscribe();
      this.popupControlEventSubscription.unsubscribe();
    }  


}
