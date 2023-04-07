import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { ProjectMonitoringService } from 'src/app/core/services/project-monitoring/project-monitoring/project-monitoring.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ProjectDashboardStore } from 'src/app/stores/project-monitoring/project-dashboard-store';
import { ProjectMonitoringStore } from 'src/app/stores/project-monitoring/project-monitoring.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;

@Component({
  selector: 'app-project-monitoring-list',
  templateUrl: './project-monitoring-list.component.html',
  styleUrls: ['./project-monitoring-list.component.scss']
})
export class ProjectMonitoringListComponent implements OnInit {
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('newProject', {static: true}) newProject: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;


  reactionDisposer: IReactionDisposer;
  ProjectMonitoringStore = ProjectMonitoringStore;
  SubMenuItemStore = SubMenuItemStore
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
  
  AuthStore = AuthStore
  AppStore = AppStore
  
  newProjectObject = {
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
  projectInformationEventSubscription: any;
  filterSubscription: Subscription = null;
  popupControlEventSubscription: any;
  constructor(private _renderer2: Renderer2, private _router: Router,private _rightSidebarFilterService: RightSidebarFilterService,
    private _helperService: HelperServiceService, private _cdr: ChangeDetectorRef,  private _imageService:ImageServiceService,
    private _utilityService: UtilityService, private _eventEmitterService: EventEmitterService,private _projectService : ProjectMonitoringService) { }

  ngOnInit(): void {

    SubMenuItemStore.setNoUserTab(true);
    RightSidebarLayoutStore.showFilter = true
    // SubMenuItemStore.userGridSystem = true
    // SubMenuItemStore.userGridSystem = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.ProjectMonitoringStore.loaded = false;
      this.pageChange();
    })
    AppStore.showDiscussion = false;
    NoDataItemStore.setNoDataItems({title:"pm_nodata_title", subtitle: 'pm_nodata_subtitle',buttonText: 'pm_new_project'});
    this.reactionDisposer = autorun(() => {    
      
      var subMenuItems = [
        {activityName: null, submenuItem: {type: 'search'}},
        {activityName:null, submenuItem: {type: 'refresh'}},
        {activityName:  "CREATE_PROJECT_CHARTER", submenuItem: {type: 'new_modal'}},
        {activityName: "GENERATE_PROJECT_CHARTER_TEMPLATE", submenuItem: {type: 'template'}},
        {activityName: "EXPORT_PROJECT_CHARTER", submenuItem: {type: 'export_to_excel'}},
        {activityName: "IMPORT_PROJECT_CHARTER", submenuItem: {type: 'import'}},

        {activityName: null, submenuItem: {type: 'user_grid_system'}},
        // {activityName: 'EXPORT_STRATEGY_PROFILE', submenuItem: {type: 'list_view'}},
      ]
      if(!AuthStore.getActivityPermission(3700,'CREATE_PROJECT_CHARTER')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(3200, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.openNewProjectModal();
            break;
          case "template":
            this._projectService.generateTemplate();
            break;
          case "export_to_excel":
            this._projectService.exportToExcel();
            break;
            // case "import":
            //   this._projectService.importToExcel();
            //   break;
          case "search":
            ProjectMonitoringStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1); 
            break;
            case 'refresh':
              ProjectMonitoringStore.loaded = false
              this.pageChange(1); 
              break
            case "user_grid_system":
              if(SubMenuItemStore.userGridSystem){
                // this.gridView = true
              }
              break;
              case "import":
              ImportItemStore.setTitle('import_project_charter');
              ImportItemStore.setImportFlag(true);
              break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      } 
      if(NoDataItemStore.clikedNoDataItem){
        this.openNewProjectModal();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      if(ImportItemStore.importClicked){
        ImportItemStore.importClicked = false;
        this._projectService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
          ImportItemStore.unsetFileDetails();
          ImportItemStore.setImportFlag(false);
          $('.modal-backdrop').remove();
          this._utilityService.detectChanges(this._cdr);
        },(error)=>{
          if(error.status == 422){
            ImportItemStore.processFormErrors(error.error.errors);
          }
          else if(error.status == 500 || error.status == 403){
            ImportItemStore.unsetFileDetails();
            ImportItemStore.setImportFlag(false);
            $('.modal-backdrop').remove();
          }
          this._utilityService.detectChanges(this._cdr);
        })
      }
    });

    this.projectInformationEventSubscription = this._eventEmitterService.projectInformationAddModalControl.subscribe(item => {
      this.closeNewProject()
      this.pageChange(1)


    })
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);

    RightSidebarLayoutStore.filterPageTag = 'project_monitor';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
    'organization_ids',
    'division_ids',
    'department_ids',
    'section_ids',
    'sub_section_ids',
    'location_ids',
    'project_manager_ids',
    'project_contract_type_ids',
    'project_priority_ids',
    'project_monitoring_status_ids',
    'parent_id',
    'project_type_ids',
    'customer_ids',
    'project_category_ids',
    'is_monitor',
    'is_pinned'


    ]);
    this.pageChange(1)
  }

  gotoDetails(id){
  this._router.navigateByUrl('/project-monitoring/projects/'+id)
  }


  pageChange(newPage:number = null){
    if (newPage) ProjectMonitoringStore.setCurrentPage(newPage);
    var additionalParams=''
      if (ProjectDashboardStore.dashboardParameter) {
        additionalParams = ProjectDashboardStore.dashboardParameter
      }
      this._projectService.getItems(false,additionalParams ? additionalParams : '').subscribe(() => 
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  openNewProjectModal(){
    this.newProjectObject.type = 'Add';
    this.openNewProject()

  }

  openNewProject(){
    setTimeout(() => {
      $(this.newProject.nativeElement).modal('show');
    }, 100);
    // this._renderer2.addClass(this.newProject.nativeElement,'show');
    this._renderer2.setStyle(this.newProject.nativeElement,'display','block');
    this._renderer2.setStyle(this.newProject.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.newProject.nativeElement,'z-index',99999);
  }

  closeNewProject(){
 
    setTimeout(() => {
      // $(this.newProject.nativeElement).modal('hide');
      this.newProjectObject.type = null;
      this.newProjectObject.value = null;
      $(this.newProject.nativeElement).modal('hide');
      this._renderer2.removeClass(this.newProject.nativeElement,'show');
      this._renderer2.setStyle(this.newProject.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }

  sortTitle(type: string) {
    this._projectService.sortProjects(type, SubMenuItemStore.searchText);
    this.pageChange()
  }

    //passing token to get preview
    createImagePreview(type, token) {
      return this._imageService.getThumbnailPreview(type, token)
    }
  
    //returns default image
    getDefaultImage(type) {
      return this._imageService.getDefaultImageUrl(type);
    }

         // for delete
         delete(id: number) {
          event.stopPropagation();
          this.popupObject.type = 'are_you_sure';
          this.popupObject.id = id;
          this.popupObject.title = 'are_you_sure';
          this.popupObject.subtitle = 'delete_projects_subtitle';
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
          this._projectService.delete(this.popupObject.id).subscribe(resp => {
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

      editProjectInformation(id){
        event.stopPropagation();
        this._projectService.getItem(id).subscribe(res=>{
          this.newProjectObject.type = 'Edit';
          this.newProjectObject.value = res;
          this.openNewProject()
          this._utilityService.detectChanges(this._cdr);
        })
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

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.projectInformationEventSubscription.unsubscribe();
    this.popupControlEventSubscription.unsubscribe();
    // SubMenuItemStore.userGridSystem = false

  }

}


