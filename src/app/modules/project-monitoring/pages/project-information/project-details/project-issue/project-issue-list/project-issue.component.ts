import { Component, OnInit, ElementRef, ViewChild, Renderer2, ChangeDetectorRef } from '@angular/core';
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

declare var $: any;

@Component({
  selector: 'app-project-issue',
  templateUrl: './project-issue.component.html'
})
export class ProjectIssueComponent implements OnInit {
  @ViewChild('addIssue', {static: true}) addIssue: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  ProjectIssueStore = ProjectIssueStore;
  ProjectMonitoringStore = ProjectMonitoringStore
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
    subtitle: ''
  };

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
    SubMenuItemStore.setNoUserTab(true);
    AppStore.showDiscussion = false;
    if(ProjectMonitoringStore.individualDetails?.project_monitoring_status?.type =='closed')  
    {
      NoDataItemStore.setNoDataItems({title:"common_nodata_title"});
    }
    else
    {
      NoDataItemStore.setNoDataItems({title:"common_nodata_title", subtitle: 'common_nodata_subtitle',buttonText: 'pm_new_project_issue'});
    }
      this.reactionDisposer = autorun(() => {
      var subMenuItems = [];
      if(ProjectMonitoringStore.individualDetails?.project_monitoring_status?.type =='closed')
      {
        subMenuItems.push({activityName: null, submenuItem: { type: 'close', path: '../' }})
      }
      else {
      subMenuItems.push({activityName: 'PROJECT_MONITORING_ISSUE_LIST', submenuItem: {type: 'search'}}),
      subMenuItems.push({activityName:null, submenuItem: {type: 'refresh'}}),
      subMenuItems.push({activityName: 'CREATE_PROJECT_MONITORING_ISSUE', submenuItem: {type: 'new_modal'}})
      subMenuItems.push({activityName: null, submenuItem: { type: 'close', path: '../' }})
      }
      if(!AuthStore.getActivityPermission(3200,'CREATE_PROJECT_MONITORING_ISSUE')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(3200, subMenuItems);
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
    })
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
      this.pageChange(1)
    })
    this.pageChange(1)
  }

  pageChange(newPage:number = null){
    if (newPage) ProjectIssueStore.setCurrentPage(newPage);
    this._projectIssueService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  sortTitle(type: string) {
    this._projectIssueService.sortProjectIssueList(type, SubMenuItemStore.searchText);
    this.pageChange()
  }

  openNewDocumentModal(){
    this.projectIssueObject.type = 'Add';
    this.projectIssueObject.value = null; // for clearing the value
    this.openDocuments()

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

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  gotoDetailsPage(id){
    this._router.navigateByUrl(`/project-monitoring/projects/${ProjectMonitoringStore.selectedProjectId}/issue/${id}`);
  }

  editDocument(id){
    event.stopPropagation();
    const documentArray = [];
    this._projectIssueService.getItem(ProjectMonitoringStore.selectedProjectId,id).subscribe(res=>{
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
  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'are_you_sure';
    this.popupObject.id = id;
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
        case 'are_you_sure': this.deleteIssue(status)
          break;
      }
  
    }

  // delete function call
  deleteIssue(status: boolean) {
    if (status && this.popupObject.id) {
      this._projectIssueService.delete(ProjectMonitoringStore.selectedProjectId,this.popupObject.id).subscribe(resp => {
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
  
    }  


}
