import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IReactionDisposer, autorun } from "mobx";
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { ProjectIssueService } from 'src/app/core/services/project-monitoring/project-issue/project-issue.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ProjectIssueStore } from 'src/app/stores/project-monitoring/project-issue-store';
import { ProjectMonitoringStore } from 'src/app/stores/project-monitoring/project-monitoring.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $:any

@Component({
  selector: 'app-project-issue-details',
  templateUrl: './project-issue-details.component.html'
})
export class ProjectIssueDetailsComponent implements OnInit {
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;

  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  ProjectIssueStore = ProjectIssueStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;
  ProjectMonitoringStore = ProjectMonitoringStore;


  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
  };

  documentArray = [];  
  modalEventSubscription:any;

  constructor(
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _activatedRouter: ActivatedRoute,
    private _helperService: HelperServiceService,
    private _projectIssueService: ProjectIssueService,
    private _imageService:ImageServiceService,
    private _sanitizer: DomSanitizer,
    private _documentFileService: DocumentFileService,
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
        {activityName: null, submenuItem: {type: 'close',path:'/project-monitoring/projects'}},
      ]
      this._helperService.checkSubMenuItemPermissions(600,subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    });
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
  }

}
