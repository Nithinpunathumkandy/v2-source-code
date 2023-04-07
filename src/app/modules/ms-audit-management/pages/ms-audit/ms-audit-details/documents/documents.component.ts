import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { FileServiceService } from 'src/app/core/services/ms-audit-management/file-service/file-service.service';
import { DocumentService } from 'src/app/core/services/ms-audit-management/ms-audit/ms-audit-details/document/document.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { MsAuditDocStore } from 'src/app/stores/ms-audit-management/ms-audits/ms-audit-details/ms-document-store';
import { MsAuditStore } from 'src/app/stores/ms-audit-management/ms-audits/ms-audit-store';

declare var $:any;
@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {
  @ViewChild ('docFormModal') docFormModal : ElementRef;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  @ViewChild ('confirmationPopUp') confirmationPopUp :ElementRef;

  reactionDisposer: IReactionDisposer;

  AppStore = AppStore;
  AuthStore = AuthStore;
  MsAuditDocStore = MsAuditDocStore;

  modalEventSubscription: any;
  PreviewSubscriptionEvent: any;
  popupControlEventSubscription: any;

  DocObject = {
    type: '',
    values: ''
  }

  popupObject ={
    type: '',
    title: '',
    id: null,
    subtitle: ''
  }

  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
    type: ''
  };

  constructor(
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _msDocService: DocumentService,
    private _renderer2: Renderer2,
    private _imageService:ImageServiceService,
    private _sanitizer: DomSanitizer,
    private _fileService: FileServiceService,
    private _eventEmitterService: EventEmitterService,
    private _documentFileService: DocumentFileService,
  ) { }

  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {

      this.setSubMenu();
      
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {  
          case "new_modal":
              this.addDoc();
            break;        	  
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if(NoDataItemStore.clikedNoDataItem){
        this.addDoc();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      // BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    })

    this.modalEventSubscription = this._eventEmitterService.addMsAuditDoc.subscribe(res => {
      this.closeFormModal();
    });

    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    });

    this.PreviewSubscriptionEvent = this._eventEmitterService.customerCorrectiveACtionPreviewModal.subscribe(res => {
      this.closePreviewModal();
      this.changeZIndex();
    })

    this.getDocuments(); 
  }

  setSubMenu(){
    let subMenuItems;

    // if(this.isAuditors()||this.isAuditLeader()){
      subMenuItems = [
        {activityName: 'CREATE_MS_AUDIT_DOCUMENT', submenuItem: {type: 'new_modal'}},
        { activityName: null, submenuItem: { type: 'close', path: '/ms-audit-management/ms-audits' } }
      ]
      NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_document'});
    // }else{
    //   subMenuItems = [
    //     { activityName: null, submenuItem: { type: 'close', path: '/ms-audit-management/ms-audits' } }
    //   ]
    //   NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: null, buttonText: null});
    // }
    
    this._helperService.checkSubMenuItemPermissions(100,subMenuItems);

  }

  isAuditors(){
    if(MsAuditStore.individualMsAuditDetails?.auditors?.length>0){
      return MsAuditStore.individualMsAuditDetails?.auditors?.find(element=>element?.id==AuthStore.user?.id)
    }else{
      return false;
    }
  }

  isAuditLeader(){
    return MsAuditStore.individualMsAuditDetails?.ms_audit_plan?.lead_auditor?.id==AuthStore.user?.id;
  }

  changeZIndex() {
    if ($(this.filePreviewModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'overflow', 'auto');
    }
  }

   // modal control event
   modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteItem(status);
        break;
    }
  }

  // for delete
  deleteDoc(id: number) {
    event.stopPropagation();

    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete';
    this.popupObject.subtitle = 'common_delete_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  // delete function call
  deleteItem(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._msDocService.delete(MsAuditStore.selectedMsAuditId,this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
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

  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
  }

  getDocuments(){
    this._msDocService.getItems().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  addDoc(){

    this.DocObject.type = 'Add';
    this.DocObject.values=null;
    // MsAuditStore.editFlag=false;
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }


  openFormModal() {
    setTimeout(() => {
      $(this.docFormModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.docFormModal.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.docFormModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.docFormModal.nativeElement, 'overflow', 'auto');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  closeFormModal() {
   
    this.DocObject.type = null;
    // this.pageChange(1);
    $(this.docFormModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.docFormModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.docFormModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.docFormModal.nativeElement, 'overflow', 'none');
		$('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
    this.DocObject.type = null;
  }

  createImageUrl(type, token) {
    if (type == 'document-version') {
      return this._documentFileService.getThumbnailPreview(type, token)
    }
    else
      return this._fileService.getThumbnailPreview(type, token);
  }


  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

   // extension check function
   checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType)
  }

  // File Preview,Download Starts Here
  downloadDocumentFile(type, document, docs?) {
    event.stopPropagation();
    switch (type) {
      case "ms-audit-doc":
        this._fileService.downloadFile(
          type,
          document.ms_audit_id,
          null,
          document.id,
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
        break;
    }
  }

  viewMsDocDocument(type, msAudit, msAuditDocument?) {
    switch (type) {
      case "ms-audit-doc":
        this._fileService
          .getFilePreview(type, msAudit.ms_audit_id, null, msAuditDocument.id)
          .subscribe((res) => {
            var resp: any = this._utilityService.getDownLoadLink(
              res,
              msAudit.title
            );
            this.openPreviewModal(type, resp, msAuditDocument, msAudit);
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
          .getFilePreview(type, msAudit.document_id, msAuditDocument.id)
          .subscribe((res) => {
            var resp: any = this._utilityService.getDownLoadLink(
              res,
              msAudit.title
            );
            this.openPreviewModal(type, resp, msAuditDocument, msAudit);
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

  openPreviewModal(type, filePreview, documentFiles, document) {
    this.previewObject.type = type
    this.previewObject.component = 'audits'
    let previewItem = null;
    if (filePreview) {
      previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
      this.previewObject.preview_url = previewItem;
      this.previewObject.file_details = documentFiles;
      this.previewObject.componentId = document.id;

      this.previewObject.uploaded_user = document;
        //document.updated_by ? document.updated_by : document.created_by;
      this.previewObject.created_at = document.created_at;
      $(this.filePreviewModal.nativeElement).modal("show");
      this._utilityService.detectChanges(this._cdr);
    }
  }

  goToLink(list){
    if(list)
    window.open(list.external_link)
  }

  closePreviewModal() {
    $(this.filePreviewModal.nativeElement).modal('hide');
    this.previewObject.uploaded_user = null;
    this.previewObject.created_at = "";
    this.previewObject.file_details = null;
    this.previewObject.componentId = null;
    this.previewObject.preview_url = '';
    this.previewObject.component = '';
  }


  ngOnDestroy(){
    this.popupControlEventSubscription.unsubscribe();
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.modalEventSubscription.unsubscribe();
    this.PreviewSubscriptionEvent.unsubscribe();
    MsAuditDocStore.unSetMsAuditDoc();
    MsAuditDocStore.resetData();

  }
}
