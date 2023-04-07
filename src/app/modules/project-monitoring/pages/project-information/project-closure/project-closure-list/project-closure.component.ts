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
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { Subscription } from 'rxjs';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';

declare var $: any;

@Component({
  selector: 'app-project-closure',
  templateUrl: './project-closure.component.html'
})
export class ProjectClosureListComponent implements OnInit, OnDestroy {

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
  
  filterSubscription: Subscription = null;

  ProjectClosureObject = {
    id : null,
    type : null,
    value : null
  }


  popupObject = {
    type: '',
    title: '',
    id: null,
    projectId: null,
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
    private _router: Router,
    private _rightSidebarFilterService: RightSidebarFilterService,
  ) { }

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof ProjectClosureComponent
   */
  ngOnInit(): void {

    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.ProjectClosureStore.loaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.pageChange(1);
    })
    
    SubMenuItemStore.setNoUserTab(true);
    AppStore.showDiscussion = false;
    this.reactionDisposer = autorun(() => {  
      NoDataItemStore.setNoDataItems({title:"common_nodata_title", subtitle: 'common_nodata_subtitle',buttonText: 'pm_new_project_closure'});
      var subMenuItems = [
        {activityName: 'PROJECT_MONITOR_CLOSURE_LIST', submenuItem: {type: 'search'}},
        {activityName:null, submenuItem: {type: 'refresh'}},
        {activityName: 'CREATE_PROJECT_MONITOR_CLOSURE', submenuItem: {type: 'new_modal'}},
        {activityName: null, submenuItem: { type: 'close', path: '../' } },
      ]
      if(!AuthStore.getActivityPermission(3200,'CREATE_PROJECT_MONITOR_CLOSURE')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(3200, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.openNewClosureModal();
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
        this.openNewClosureModal();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    });
    this.projectClosureSubscriptionEvent = this._eventEmitterService.projectClosureModal.subscribe(item => {
      this.closeClosureModal()
      this.pageChange(1); 
    })
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
      this.pageChange(1)
    })

    RightSidebarLayoutStore.filterPageTag = 'project_closure';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
      'project_ids',
      'project_monitor_closure_status_ids'
    ]);

    this.pageChange(1)
  }

  pageChange(newPage:number = null){
    if (newPage) ProjectClosureStore.setCurrentPage(newPage);
    this._projectClosureService.getAllItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  openNewClosureModal(){
    this.ProjectClosureObject.type = 'Add';
    this.ProjectClosureObject.value = null; // for clearing the value
    ProjectClosureStatusMasterStore.lessonLearnedList = [];
    this.openNewClosure()

  }

  openNewClosure(){
    this._renderer2.addClass(this.addProjectClosure.nativeElement,'show');
    this._renderer2.setStyle(this.addProjectClosure.nativeElement,'display','block');
    this._renderer2.setStyle(this.addProjectClosure.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.addProjectClosure.nativeElement,'z-index',99999);
  }

  closeClosureModal(){
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

  editProjectClosure(items){
    event.stopPropagation();
    ProjectClosureStatusMasterStore.lessonLearnedList = [];
    this._projectClosureService.getItem(items.project_id,items.id).subscribe(res=>{
      if(res){
        this.ProjectClosureObject.value = res;
        this.ProjectClosureObject.type = 'Edit';
        this._utilityService.detectChanges(this._cdr);
        this.openNewClosure()
      }
    })
    }


  // for delete
  delete(items) {
    event.stopPropagation();
    this.popupObject.type = 'are_you_sure';
    this.popupObject.id = items.id;
    this.popupObject.projectId = items.project_id
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
        case 'are_you_sure': this.deleteDocument(status)
          break;
      }
  
    }

  // delete function call
  deleteDocument(status: boolean) {
    if (status && this.popupObject.id) {
      this._projectClosureService.delete(this.popupObject.projectId,this.popupObject.id).subscribe(resp => {
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


  gotoDetailsPage(item){
    ProjectMonitoringStore.setSelectedProjectId(item.project_id)
    this._router.navigateByUrl(`/project-monitoring/projects/${ProjectMonitoringStore.selectedProjectId}/project-closure/${item?.id}`);
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
      this._rightSidebarFilterService.resetFilter();
      this.filterSubscription.unsubscribe();
      RightSidebarLayoutStore.showFilter = false;
      RightSidebarLayoutStore.resetFilter();
    }  


}
