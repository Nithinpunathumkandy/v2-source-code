import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { ToastrService } from 'ngx-toastr';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { ProjectChangeRequestService } from 'src/app/core/services/project-monitoring/project-change-request/project-change-request.service';
import { ProjectIssueService } from 'src/app/core/services/project-monitoring/project-issue/project-issue.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ProjectChangeRequestStore } from 'src/app/stores/project-monitoring/project-change-request-store';
import { ProjectIssueStore } from 'src/app/stores/project-monitoring/project-issue-store';
import { ProjectMonitoringStore } from 'src/app/stores/project-monitoring/project-monitoring.store';
declare var $: any;

@Component({
  selector: 'app-change-request-list',
  templateUrl: './change-request-list.component.html',
  styleUrls: ['./change-request-list.component.scss']
})
export class ChangeRequestListComponent implements OnInit,OnDestroy {
  @ViewChild('addChangeReq', {static: true}) addChangeReq: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;


  reactionDisposer: IReactionDisposer;
  ProjectChangeRequestStore = ProjectChangeRequestStore;
  ProjectMonitoringStore = ProjectMonitoringStore;
  AppStore = AppStore
  AuthStore = AuthStore
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
  subMenuItems: ({ activityName: string; submenuItem: { type: string; path?: undefined; }; } | { activityName: any; submenuItem: { type: string; path: string; }; })[];
  constructor(private _router: Router,
    private _renderer2: Renderer2,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService : HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _imageService:ImageServiceService,
    private _chnageRequestService: ProjectChangeRequestService,
    private _toastr: ToastrService,) { }

  ngOnInit(): void {
    if(ProjectMonitoringStore.individualDetails?.project_monitoring_status?.type =='closed')
      {
        NoDataItemStore.setNoDataItems({title:"common_nodata_title"});
      }
    else
    {
      NoDataItemStore.setNoDataItems({title:"common_nodata_title", subtitle: 'common_nodata_subtitle',buttonText: 'New Change Request'});
    }
    this.reactionDisposer = autorun(() => {    
     var subMenuItems = [];
     if(ProjectMonitoringStore.individualDetails?.project_monitoring_status?.type =='closed')
     {
      subMenuItems.push({activityName: null, submenuItem: { type: 'close', path: '../' }})
     }
     else {
      subMenuItems.push({activityName: 'PROJECT_MONITOR_CHANGE_REQUEST_LIST', submenuItem: {type: 'search'}}),
      subMenuItems.push({activityName:null, submenuItem: {type: 'refresh'}}),
      subMenuItems.push({activityName: 'CREATE_PROJECT_MONITOR_CHANGE_REQUEST', submenuItem: {type: 'new_modal'}})
      subMenuItems.push({activityName: null, submenuItem: { type: 'close', path: '../' }})
     }
      if(!AuthStore.getActivityPermission(3200,'CREATE_PROJECT_MONITOR_CHANGE_REQUEST')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(3200, subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.addChangeRequest()
            break;
          case "search":
            ProjectChangeRequestStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1); 
             break;
             case 'refresh':
              ProjectChangeRequestStore.loaded = false
              this.pageChange(1); 
              break
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
      this.closeChangeRequestModal();
      this.pageChange(1)
    })
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    this.pageChange(1)
  }

  gotoChangeRequestDetails(items){
    this._router.navigateByUrl(`/project-monitoring/projects/${ProjectMonitoringStore.selectedProjectId}/project-change-request/${items.id}`);

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
    let subMenu = []
    if (newPage) ProjectChangeRequestStore.setCurrentPage(newPage);
    this._chnageRequestService.getItems(false).subscribe(res=>{
      // if(res["data"].length > 0){
      // if(res["data"].slice(-1)[0].type == 'approved'){
      //   subMenu = [
      //     {activityName: 'PROJECT_MONITOR_CHANGE_REQUEST_LIST', submenuItem: {type: 'search'}},
      //     {activityName:null, submenuItem: {type: 'refresh'}},
      //     {activityName: 'CREATE_PROJECT_MONITOR_CHANGE_REQUEST', submenuItem: {type: 'new_modal'}},
      //     {activityName: null, submenuItem: { type: 'close', path: '../' } },
      //   ]
      // }else {
      //   subMenu = [
      //     {activityName: 'PROJECT_MONITOR_CHANGE_REQUEST_LIST', submenuItem: {type: 'search'}},
      //     {activityName:null, submenuItem: {type: 'refresh'}},
      //     {activityName: null, submenuItem: { type: 'close', path: '../' } },
      //   ]
      // }
      // }else{
      //   subMenu = [
      //     {activityName: 'PROJECT_MONITOR_CHANGE_REQUEST_LIST', submenuItem: {type: 'search'}},
      //     {activityName:null, submenuItem: {type: 'refresh'}},
      //     {activityName: 'CREATE_PROJECT_MONITOR_CHANGE_REQUEST', submenuItem: {type: 'new_modal'}},
      //     {activityName: null, submenuItem: { type: 'close', path: '../' } },
      //   ]
      // }
      // this._helperService.checkSubMenuItemPermissions(3200, subMenu);
      this._utilityService.detectChanges(this._cdr);
    })
  }

  addChangeRequest(){
    if(ProjectChangeRequestStore.allItems.length > 0){
      if( ProjectChangeRequestStore.allItems[0].type == 'approved'){
        this.openNewRequestModal()
      }else {
        this._toastr.warning('warning', 'Please approve all change requests');
      }
    }else {
      this.openNewRequestModal()
    }
  
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
    this._utilityService.detectChanges(this._cdr);

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
    delete(id: number) {
      event.stopPropagation();
      this.popupObject.type = 'are_you_sure';
      this.popupObject.id = id;
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

  editChangeRequest(id){
    event.stopPropagation();
   this._chnageRequestService.getIndividualItem(id).subscribe(res=>{
     this.changeRequestObject.value = res
     this.changeRequestObject.type = 'Edit'
     this.changeRequestModal()
     this._utilityService.detectChanges(this._cdr);
   })
  }

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.changeReqSubscriptionEvent.unsubscribe();
    this.popupControlEventSubscription.unsubscribe();
  }
}
