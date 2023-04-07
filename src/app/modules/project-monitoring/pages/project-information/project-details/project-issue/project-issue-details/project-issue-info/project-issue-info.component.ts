import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { IReactionDisposer, autorun } from "mobx";
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { ProjectIssueService } from 'src/app/core/services/project-monitoring/project-issue/project-issue.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ProjectIssueStore } from 'src/app/stores/project-monitoring/project-issue-store';
import { ProjectMonitoringStore } from 'src/app/stores/project-monitoring/project-monitoring.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $:any

@Component({
  selector: 'app-project-issue-info',
  templateUrl: './project-issue-info.component.html',
  styleUrls: ['./project-issue-info.component.scss']
})
export class ProjectIssueInfoComponent implements OnInit {

  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  @ViewChild('addIssue', {static: true}) addIssue: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;



  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  ProjectIssueStore = ProjectIssueStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;

  projectIssueObject = {
    id : null,
    type : null,
    value : null
  }
  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
  };

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  documentArray = [];  
  modalEventSubscription:any;
  issueSubscriptionEvent: any;
  popupControlEventSubscription: any;

  constructor(
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _activatedRouter: ActivatedRoute,
    private _helperService: HelperServiceService,
    private _projectIssueService: ProjectIssueService,
    private _imageService:ImageServiceService,
    private _sanitizer: DomSanitizer,
    private _documentFileService: DocumentFileService,
    private _fileUploadPopupService: FileUploadPopupService,
    private _renderer2: Renderer2,
    private _eventEmitterService: EventEmitterService,
    private _route: Router,
  ) { }

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof ProjectIssueDetailsComponent
   */
  ngOnInit(): void {
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    let id: number;
    this._activatedRouter.params.subscribe(params => {
      id = +params['id']; 
      ProjectIssueStore.IssueId = id;
     this.getProjectIssueDetails(id);
     
    });

    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        { activityName:null, submenuItem: { type: 'edit_modal' ,title : ''} },
        {activityName: null, submenuItem: {type: 'delete',title:''}},
        {activityName: null, submenuItem: {type: 'close',path:'/project-monitoring/projects'}},
      ]
      this._helperService.checkSubMenuItemPermissions(600,subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal": 
           this.editDocument(ProjectIssueStore.IssueId);
            break;
            case "delete":
              //  this.delete()
              break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    });

    this.issueSubscriptionEvent = this._eventEmitterService.projectDocumentModal.subscribe(item => {
      this.closeDocumentModal()
    })
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
  }

  getProjectIssueDetails(id){
    this._projectIssueService.getItem(ProjectMonitoringStore.selectedProjectId,id).subscribe(res=>{
      let project = {
        'project_id': res.project?.id,
        'id': res?.id,
        'title': res.document_title,
        'document_id': res.document_id,
        'size': res.size,
        'thumbnail_url': res.thumbnail_url,
        'token': res.token,
        'document_title': res.document_title,
        'ext': res.ext,
        'kh_document': res.kh_document,
      }
      this.documentArray.push(project)
      this._utilityService.detectChanges(this._cdr);
    })
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

    clearCommonFilePopupDocuments(){
      fileUploadPopupStore.clearFilesToDisplay();
      fileUploadPopupStore.clearKHFiles();
      fileUploadPopupStore.clearSystemFiles();
      fileUploadPopupStore.clearUpdateFiles();
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
        this._route.navigateByUrl('/project-monitoring/projects'+ProjectMonitoringStore.selectedProjectId+'/issues-list');
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

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  openPreviewModal(type, filePreview, documentFiles, document) {
    this.previewObject.component=type
   

    let previewItem = null;
    if (filePreview) {
      previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
      this.previewObject.preview_url = previewItem;
      this.previewObject.file_details = documentFiles;
      this.previewObject.componentId = document.id;
      this.previewObject.uploaded_user =
      document.updated_by ? document.updated_by : document.created_by;
      this.previewObject.created_at = document.created_at;
      $(this.filePreviewModal.nativeElement).modal("show");
      this._utilityService.detectChanges(this._cdr);
    }
  }

  *// Closes from preview
    closePreviewModal(event) {
    $(this.filePreviewModal.nativeElement).modal("hide");
    this.previewObject.preview_url = "";
    this.previewObject.uploaded_user = null;
    this.previewObject.created_at = "";
    this.previewObject.file_details = null;
    this.previewObject.componentId = null;
  }

  downloadDocumentFile(type, document, docs?) {
    event.stopPropagation();
    switch (type) {
      case "project-monitoring-issue":
        this._projectIssueService.downloadFile(
          type,
          document.project_id,
          document.id,
          null,
          document.title,
          document
        );
        break;
        case "document-version":
          this._documentFileService.downloadFile(
            type,
            document.document_id,
            docs.id,
            null,
            document.title,
            docs
          );
    }
  }

    viewDocument(type, documents, documentFile) {
      switch (type) {
          case "project-monitoring-issue":
          this._projectIssueService
            .getFilePreview(type, documents.project_id, documentFile.id)
            .subscribe((res) => {
              var resp: any = this._utilityService.getDownLoadLink(
                res,
                documents.title
              );
              this.openPreviewModal(type, resp, documentFile, documents);
            }),
            (error) => {
              if (error.status == 403) {
                this._utilityService.showErrorMessage(
                  "Error",
                  "Permission Denied"
                );
              } else {
                this._utilityService.showErrorMessage(
                  "Error",
                  "Unable to generate Preview"
                );
              }
            };
          break;
  
          case "document-version":
            this._documentFileService
              .getFilePreview(type, documents.document_id, documentFile.id)
              .subscribe((res) => {
                var resp: any = this._utilityService.getDownLoadLink(
                  res,
                  documents.title
                );
                this.openPreviewModal(type, resp, documentFile, documents);
              }),
              (error) => {
                if (error.status == 403) {
                  this._utilityService.showErrorMessage(
                    "Error",
                    "Permission Denied"
                  );
                } else {
                  this._utilityService.showErrorMessage(
                    "Error",
                    "Unable to generate Preview"
                  );
                }
              };
            break;
      }
    }

    checkExtension(ext, extType) {
      var res = this._imageService.checkFileExtensions(ext, extType);
      return res;
    }

    createImageUrl(type?, token?, h?, w?) {
      if (type == 'document-version') {
        return this._documentFileService.getThumbnailPreview(type, token)
      }
      else
      return this._projectIssueService.getThumbnailPreview(type, token);
    }

   /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof ProjectIssueDetailsComponent
   */
  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    ProjectIssueStore?.unsetIndivitualProjectIssue();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.issueSubscriptionEvent.unsubscribe();
    this.popupControlEventSubscription.unsubscribe();
  }

}
