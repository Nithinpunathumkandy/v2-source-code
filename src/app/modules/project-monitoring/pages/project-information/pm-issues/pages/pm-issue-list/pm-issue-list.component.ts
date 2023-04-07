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
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { ProjectIssueService } from 'src/app/core/services/project-monitoring/project-issue/project-issue.service';
import { ProjectIssueStore } from 'src/app/stores/project-monitoring/project-issue-store';
import { Router } from '@angular/router';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { Subscription } from 'rxjs';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { ProjectDashboardStore } from 'src/app/stores/project-monitoring/project-dashboard-store';

declare var $: any;

@Component({
  selector: 'app-pm-issue-list',
  templateUrl: './pm-issue-list.component.html',
  styleUrls: ['./pm-issue-list.component.scss']
})
export class PmIssueListComponent implements OnInit, OnDestroy {
  @ViewChild('addIssue', {static: true}) addIssue: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;

  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  ProjectIssueStore = ProjectIssueStore;
  AuthStore = AuthStore;

  projectIssueObject = {
    id : null,
    type : null,
    value : null
  }
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: '',
    projectId :null
  };
  filterSubscription: Subscription = null;
  popupControlEventSubscription: any;
  issueSubscriptionEvent: any = null;
  AppStore = AppStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  constructor(
    private _renderer2: Renderer2,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService : HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _imageService:ImageServiceService,
    private _projectIssueService: ProjectIssueService,
    private _fileUploadPopupService: FileUploadPopupService,
    private _rightSidebarFilterService: RightSidebarFilterService,
    private _router: Router,
  ) { }

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof ProjectIssueComponent
   */
  ngOnInit(): void {

    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.ProjectIssueStore.loaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.pageChange(1);
    })
    
    SubMenuItemStore.setNoUserTab(true);
    AppStore.showDiscussion = false;
    this.reactionDisposer = autorun(() => {  
      NoDataItemStore.setNoDataItems({title:"common_nodata_title", subtitle: 'common_nodata_subtitle',buttonText: 'new_project_isuue'});
      
      var subMenuItems = [
        {activityName: 'PROJECT_MONITORING_ISSUE_LIST', submenuItem: {type: 'search'}},
        {activityName:null, submenuItem: {type: 'refresh'}},
        {activityName: 'CREATE_PROJECT_MONITORING_ISSUE', submenuItem: {type: 'new_modal'}},
        {activityName: null, submenuItem: { type: 'close', path: '../' } },
      ]
      if(!AuthStore.getActivityPermission(3700,'CREATE_PROJECT_MONITORING_ISSUE')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(3700, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.openNewDocumentModal();
            break;
          case "search":
            ProjectIssueStore.searchText = SubMenuItemStore.searchText;
             this.pageChange(1); 
             break;
             case 'refresh':
              ProjectIssueStore.loaded = false
              this.pageChange(1); 
              break
              case "export_to_excel":
                this._projectIssueService.exportToExcel();
                break;
          default:
						break;
				}
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      } 
      if(NoDataItemStore.clikedNoDataItem){
        this.openNewDocumentModal();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    });
    this.issueSubscriptionEvent = this._eventEmitterService.projectDocumentModal.subscribe(item => {
      this.closeDocumentModal()
      this.pageChange(1)
    })
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
      this.pageChange(1)
    })

    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);

    RightSidebarLayoutStore.filterPageTag = 'project_issue_list';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
      'project_ids',
      'project_issue_status_ids',
      'project_milestone_ids',
      'project_issue_ids'
    ]);

    this.pageChange(1)
  }

  pageChange(newPage:number = null){
    if (newPage) ProjectIssueStore.setCurrentPage(newPage);
    var additionalParams=''
      if (ProjectDashboardStore.dashboardParameter) {
        additionalParams = ProjectDashboardStore.dashboardParameter
      }
      this._projectIssueService.getAllItems(false,additionalParams ? additionalParams : '').subscribe(() => 
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  openNewDocumentModal(){
    this.projectIssueObject.type = 'Add';
    this.projectIssueObject.value = null; // for clearing the value
    this.openDocuments()

  }

  sortTitle(type: string) {
    this._projectIssueService.sortProjectIssueList(type, SubMenuItemStore.searchText);
    this.pageChange()
  }

  openDocuments(){
    this._renderer2.addClass(this.addIssue.nativeElement,'show');
    this._renderer2.setStyle(this.addIssue.nativeElement,'display','block');
    this._renderer2.setStyle(this.addIssue.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.addIssue.nativeElement,'z-index',99999);
  }

  closeDocumentModal(){
 
    setTimeout(() => {
      // $(this.newProject.nativeElement).modal('hide');
      this.projectIssueObject.type = null;
      this.projectIssueObject.value = null;
      this._renderer2.removeClass(this.addIssue.nativeElement,'show');
      this._renderer2.setStyle(this.addIssue.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
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

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  gotoDetailsPage(item){
    ProjectMonitoringStore.setSelectedProjectId(item.project_id)
    this._router.navigateByUrl(`/project-monitoring/projects/${item.project_id}/issue/${item.id}`);
  }

  editDocument(items){
    event.stopPropagation();
    const documentArray = [];
    this._projectIssueService.getItem(items.project_id,items.id).subscribe(res=>{
      if(res){
        let project = {
          'document_id': res.document_id,
          'size': res.size,
          'thumbnail_url': res.thumbnail_url,
          'token': res.token,
          'document_title': res.document_title,
          'ext': res.ext,
          'kh_document': res.kh_document,
        }
         documentArray.push(project);
         console.log(documentArray);
          setTimeout(() => {
              this.setDocuments(documentArray)   
          }, 200);
        this.projectIssueObject.value = res;
        this.projectIssueObject.type = 'Edit';
        this._utilityService.detectChanges(this._cdr);
        this.openDocuments()
      }
    })
    }

    setDocuments(documents) { 
      this.clearCommonFilePopupDocuments();
      let khDocuments = [];
      documents.forEach(element => {
        if (element.document_id) {
          element.kh_document?.versions.forEach(innerElement => {
            if (innerElement.is_latest) {
              khDocuments.push({
                ...innerElement,
                title:element?.kh_document.title,
                'is_kh_document': true
              })
              fileUploadPopupStore.setUpdateFileArray({
                'updateId': element.id,
                ...innerElement,
              })
            }
  
          });
        }
        else {
          if (element && element.token) {
            var purl = this._projectIssueService.getThumbnailPreview('project-monitoring-issue',element.token);
            var lDetails = {
              name: element.title,
              ext: element.ext,
              size: element.size,
              url: element.url,
              token: element.token,
              thumbnail_url: element.thumbnail_url,
              preview: purl,
              id: element.id,
              'is_kh_document': false,
            }
          }
          this._fileUploadPopupService.setSystemFile(lDetails, purl)
  
        }
  
      });
      fileUploadPopupStore.setKHFile(khDocuments)
      let submitedDocuments = [...fileUploadPopupStore.getKHFiles, ...fileUploadPopupStore.getSystemFile]
      
      fileUploadPopupStore.setFilestoDisplay(submitedDocuments);
      // this.enableScrollbar();
    }

  clearCommonFilePopupDocuments(){
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
  }


  // for delete
  delete(items) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = items.id;
    this.popupObject.projectId = items.project_id
    this.popupObject.title = 'delete_project_issue?';
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
        case '': this.deleteIssue(status)
          break;
      }
  
    }

  // delete function call
  deleteIssue(status: boolean) {
    if (status && this.popupObject.id) {
      this._projectIssueService.delete(this.popupObject.projectId,this.popupObject.id).subscribe(resp => {
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

  createImageUrl(type, token?, h?, w?) {
    return this._projectIssueService.getThumbnailPreview(type, token, h, w);
  }

  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }


   /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof ProjectIssueComponent
   */    
  ngOnDestroy(){
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      this.issueSubscriptionEvent.unsubscribe();
      this.popupControlEventSubscription.unsubscribe();
      this._rightSidebarFilterService.resetFilter();
      this.filterSubscription.unsubscribe();
      RightSidebarLayoutStore.showFilter = false;
      RightSidebarLayoutStore.resetFilter();
    }  

}
