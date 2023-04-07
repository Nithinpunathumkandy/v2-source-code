import { Component, OnInit, ElementRef, ViewChild, Renderer2, ChangeDetectorRef } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ProjectDetailsDocumentsService } from 'src/app/core/services/project-management/project-details/project-documents/project-details-documents.service';
import { ProjectDocumentStore } from 'src/app/stores/project-management/project-details/project-documents/project-document-store';
import { ProjectsStore } from 'src/app/stores/project-management/projects/projects.store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';

declare var $: any;

@Component({
  selector: 'app-project-documents',
  templateUrl: './project-documents.component.html',
  styleUrls: ['./project-documents.component.scss']
})

export class ProjectDocumentsComponent implements OnInit {
  @ViewChild('addDocument', {static: true}) addDocument: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;

  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  ProjectDocumentStore = ProjectDocumentStore;
  AuthStore = AuthStore;
  documentArray = [];

  projectDocumentObject = {
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
    frequency: null,
    componentId: null,
  };

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  popupControlEventSubscription: any;
  documentSubscriptionEvent: any = null;
  AppStore = AppStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  constructor(
    private _renderer2: Renderer2,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService : HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _imageService:ImageServiceService,
    private _projectDocumentService: ProjectDetailsDocumentsService,
    private _fileUploadPopupService: FileUploadPopupService,
    private _sanitizer: DomSanitizer,
    private _documentFileService: DocumentFileService,
  ) { }

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof ProjectDocumentComponent
   */
  ngOnInit(): void {
    SubMenuItemStore.setNoUserTab(true);
    AppStore.showDiscussion = false;
    this.reactionDisposer = autorun(() => {  
      NoDataItemStore.setNoDataItems({title:"common_nodata_title", subtitle: 'common_nodata_subtitle',buttonText: 'pm_new_project_document'});
      var subMenuItems = [
        {activityName: 'TASK_LIST', submenuItem: {type: 'search'}},
        {activityName:null, submenuItem: {type: 'refresh'}},
        {activityName: 'CREATE_TASK', submenuItem: {type: 'new_modal'}},
        {activityName: null, submenuItem: { type: 'close', path: '../' } },
      ]
      if(!AuthStore.getActivityPermission(3200,'CREATE_PROJECT_MONITORING_DOCUMENT')){
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
             ProjectDocumentStore.searchText = SubMenuItemStore.searchText;
             this.pageChange(1); 
             break;
             case 'refresh':
              ProjectDocumentStore.loaded = false
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
    this.documentSubscriptionEvent = this._eventEmitterService.projectDocumentModal.subscribe(item => {
      this.closeDocumentModal()
      this.pageChange(1); 
    })
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
      this.pageChange(1)
    })
    this.pageChange(1)
  }

  pageChange(newPage:number = null){
    if (newPage) ProjectDocumentStore.setCurrentPage(newPage);
    this._projectDocumentService.getItems().subscribe(res=>{
      this.documentArray = [];
      for (const item of ProjectDocumentStore.allItems) {
        let project = {
          'project_id': item.project_id,
          'id': item?.id,
          'document_id': item.document_id,
          'size': item.size,
          'thumbnail_url': item.thumbnail_url,
          'token': item.token,
          'document_title': item.document_title,
          'ext': item.ext,
          'title': item.document_title,
          'kh_document': item.kh_document,
        }     
        this.documentArray.push(project);
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  openNewDocumentModal(){
    this.projectDocumentObject.type = 'Add';
    this.projectDocumentObject.value = null; // for clearing the value
    this.openDocuments()

  }

  openDocuments(){
    this._renderer2.addClass(this.addDocument.nativeElement,'show');
    this._renderer2.setStyle(this.addDocument.nativeElement,'display','block');
    this._renderer2.setStyle(this.addDocument.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.addDocument.nativeElement,'z-index',99999);
  }

  closeDocumentModal(){
 
    setTimeout(() => {
      // $(this.newProject.nativeElement).modal('hide');
      this.projectDocumentObject.type = null;
      this.projectDocumentObject.value = null;
      this._renderer2.removeClass(this.addDocument.nativeElement,'show');
      this._renderer2.setStyle(this.addDocument.nativeElement,'display','none');
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

  editDocument(id){
    event.stopPropagation();
    this._projectDocumentService.getItem(ProjectsStore.selectedProjectId,id).subscribe(res=>{
      if(res){
        let documentArray = [];
        let project = {
          'project_id': res.project_id,
          'id': res?.id,
          'document_id': res.document_id,
          'size': res.size,
          'thumbnail_url': res.thumbnail_url,
          'token': res.token,
          'document_title': res.document_title,
          'ext': res.ext,
          'title': res.document_title,
          'kh_document': res.kh_document,
        }
         documentArray.push(project);
          setTimeout(() => {
              this.setDocuments(documentArray)   
          }, 200);
        this.projectDocumentObject.value = res;
        this.projectDocumentObject.type = 'Edit';
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
            var purl = this._projectDocumentService.getThumbnailPreview('project-documents',element.token);
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
    this.popupObject.title = 'delete_project_document?';
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
      this._projectDocumentService.delete(ProjectsStore.selectedProjectId,this.popupObject.id).subscribe(resp => {
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

  createImageUrl(type?,token?, h?, w?) {
    if (type == 'document-version') {
      return this._documentFileService.getThumbnailPreview(type, token)
    }
    else
    return this._projectDocumentService.getThumbnailPreview(type, token);
  }

  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }

  
  openPreviewModal(type, filePreview, documentFiles, document, frequencyId) {
    this.previewObject.component=type
    

    let previewItem = null;
    if (filePreview) {
      previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
      this.previewObject.preview_url = previewItem;
      this.previewObject.file_details = documentFiles;
      this.previewObject.componentId = document.id;
      this.previewObject.frequency = frequencyId
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

  viewDocument(type, documents, documentFile) {
    switch (type) {
        case "project-documents":
        this._projectDocumentService
          .getFilePreview(type, documents.project_id, documentFile.id)
          .subscribe((res) => {
            var resp: any = this._utilityService.getDownLoadLink(
              res,
              documents.title
            );
            this.openPreviewModal(type, resp, documentFile, documents, documents.project_id);
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
              this.openPreviewModal(type, resp, documentFile, documents,documents.project_id );
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


   /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof ProjectDocumentComponent
   */    
  ngOnDestroy(){
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      this.documentSubscriptionEvent.unsubscribe();
      this.popupControlEventSubscription.unsubscribe();
  
    }  


}
