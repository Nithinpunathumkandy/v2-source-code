import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { ProjectChangeRequestService } from 'src/app/core/services/project-monitoring/project-change-request/project-change-request.service';
import { ProjectIssueService } from 'src/app/core/services/project-monitoring/project-issue/project-issue.service';
import { ProjectMonitoringService } from 'src/app/core/services/project-monitoring/project-monitoring/project-monitoring.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ProjectChangeRequestStore } from 'src/app/stores/project-monitoring/project-change-request-store';
import { ProjectIssueStore } from 'src/app/stores/project-monitoring/project-issue-store';
import { ProjectMonitoringStore } from 'src/app/stores/project-monitoring/project-monitoring.store';
declare var $: any;

@Component({
  selector: 'app-project-change-request-list',
  templateUrl: './project-change-request-list.component.html',
  styleUrls: ['./project-change-request-list.component.scss']
})
export class ProjectChangeRequestListComponent implements OnInit,OnDestroy {
  @ViewChild('addChangeReq', {static: true}) addChangeReq: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  reactionDisposer: IReactionDisposer;
  ProjectChangeRequestStore = ProjectChangeRequestStore;
  AppStore = AppStore
  changeRequestObject = {
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
  changeReqSubscriptionEvent: any;
  popupControlEventSubscription: any;
  filterSubscription: any;
  constructor(private _router: Router,
    private _renderer2: Renderer2,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService : HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _imageService:ImageServiceService,
    private _chnageRequestService: ProjectChangeRequestService,
    private _rightSidebarFilterService: RightSidebarFilterService,
    private _projectService : ProjectMonitoringService,
    ) { }

  ngOnInit(): void {
    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.ProjectChangeRequestStore.loaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.pageChange(1);
    })
    this.reactionDisposer = autorun(() => {  
      NoDataItemStore.setNoDataItems({title:"common_nodata_title", subtitle: 'common_nodata_subtitle',buttonText: 'New Change Request'});
      
      var subMenuItems = [
        {activityName: 'PROJECT_MONITORING_ISSUE_LIST', submenuItem: {type: 'search'}},
        {activityName:null, submenuItem: {type: 'refresh'}},
        // {activityName: 'CREATE_PROJECT_MONITORING_ISSUE', submenuItem: {type: 'new_modal'}},
        // {activityName: null, submenuItem: { type: 'close', path: '../' } },
      ]
      if(!AuthStore.getActivityPermission(3200,'CREATE_PROJECT_MONITORING_ISSUE')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(3200, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.openNewRequestModal();
            break;
          case "search":
            ProjectChangeRequestStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1); 
             break;
             case 'refresh':
              ProjectChangeRequestStore.loaded = false
              this.pageChange(1); 
              break
              case "export_to_excel":
                this._chnageRequestService.exportToExcel();
                break;
          default:
						break;
				}
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      } 
      if(NoDataItemStore.clikedNoDataItem){
        this.openNewRequestModal();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    });

    this.changeReqSubscriptionEvent = this._eventEmitterService.projectChangeRequestItemsModal.subscribe(item => {
      this.closeChangeRequestModal()
    })
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    RightSidebarLayoutStore.filterPageTag = 'project_change_request';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
      'project_ids',
      'project_change_request_status_ids'
    ]);
    this.pageChange(1)
  }

  gotoChangeRequestDetails(items){
    this._router.navigateByUrl(`/project-monitoring/projects/${items.project_id}/project-change-request/${items.id}`);
  }

   //passing token to get preview
   createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  //returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

pageChange(newPage:number = null){
  if (newPage) ProjectChangeRequestStore.setCurrentPage(newPage);
  this._chnageRequestService.getAllItems(false).subscribe(res=>{
    this._utilityService.detectChanges(this._cdr);
  })
}

openNewRequestModal(){
  this.changeRequestObject.type = "Add";
  this.changeRequestObject.value = null;
  this.changeRequestModal()
}

changeRequestModal(){
  setTimeout(() => {
    $(this.addChangeReq.nativeElement).modal('show');
  }, 100);
  // this._renderer2.addClass(this.addChangeReq.nativeElement,'show');
  this._renderer2.setStyle(this.addChangeReq.nativeElement,'display','block');
  this._renderer2.setStyle(this.addChangeReq.nativeElement,'overflow','auto');
  this._renderer2.setStyle(this.addChangeReq.nativeElement,'z-index',99999);
}

closeChangeRequestModal(){
  setTimeout(() => {
    // $(this.newProject.nativeElement).modal('hide');
    this.changeRequestObject.type = null;
    this.changeRequestObject.value = null;
    this._renderer2.removeClass(this.addChangeReq.nativeElement,'show');
    this._renderer2.setStyle(this.addChangeReq.nativeElement,'display','none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }, 200);
}

  // for delete
  delete(items) {
    ProjectMonitoringStore.setSelectedProjectId(items.project_id)
    event.stopPropagation();
    this.popupObject.type = 'are_you_sure';
    this.popupObject.id = items.id;
    this.popupObject.title = 'are_you_sure';
    this.popupObject.subtitle = 'It will remove the project change request from the project';
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
  case 'are_you_sure': this.deleteProject(status)
    break;
}

}

// delete function call
deleteProject(status: boolean) {
  if (status && this.popupObject.id) {
    this._chnageRequestService.deleteChangeRequestItem(this.popupObject.id).subscribe(resp => {
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

editChangeRequest(items){
  event.stopPropagation();
  this.getIndividualProfileInformation(items.project_id)
  ProjectMonitoringStore.setSelectedProjectId(items.project_id)
 this._chnageRequestService.getIndividualItem(items.id).subscribe(res=>{
   this.changeRequestObject.value = res
   this.changeRequestObject.type = 'Edit'
   this.changeRequestModal()
   this._utilityService.detectChanges(this._cdr);
 })
}

getIndividualProfileInformation(id){
  this._projectService.getItem(id).subscribe(res=>{
    this._utilityService.detectChanges(this._cdr);
  })
}

ngOnDestroy(){
  if (this.reactionDisposer) this.reactionDisposer();
  SubMenuItemStore.makeEmpty();
  this.changeReqSubscriptionEvent.unsubscribe();
  this.popupControlEventSubscription.unsubscribe();
  this.filterSubscription.unsubscribe();
}

}
