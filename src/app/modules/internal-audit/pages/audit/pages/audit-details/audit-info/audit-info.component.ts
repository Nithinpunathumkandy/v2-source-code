import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { AuditService } from 'src/app/core/services/internal-audit/audit/audit.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { InternalAuditFileService } from 'src/app/core/services/masters/internal-audit/file-service/internal-audit-file.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuditStore } from 'src/app/stores/internal-audit/audit/audit-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-audit-info',
  templateUrl: './audit-info.component.html',
  styleUrls: ['./audit-info.component.scss']
})
export class AuditInfoComponent implements OnInit  , OnDestroy{
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;

  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  AuditStore = AuditStore;
  AppStore = AppStore;
  AuthStore = AuthStore;

  previewFocusSubscription:any;

  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
  };


  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  constructor(private _cdr: ChangeDetectorRef,
    private _sanitizer: DomSanitizer,
    private _renderer2: Renderer2,
    private _eventEmitterService: EventEmitterService,
    private _internalAuditFileService: InternalAuditFileService,
    private _imageService: ImageServiceService,
    private _router: Router,
    private _utilityService: UtilityService,
    private _auditService: AuditService,
    private _helperService: HelperServiceService,
    private _documentFileService: DocumentFileService,
    ) { }

  ngOnInit(): void {
    AppStore.showDiscussion = false;
    this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
         this.gotoEditPage();
            break;
          case "go_to_plan":
            this.gotoPlanDetails();
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
      if(!status && $(this.filePreviewModal.nativeElement).hasClass('show')){
        this._renderer2.setStyle(this.filePreviewModal.nativeElement,'z-index',999999);
        this._renderer2.setStyle(this.filePreviewModal.nativeElement,'overflow','auto');
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
      if(!status && $(this.filePreviewModal.nativeElement).hasClass('show')){
        this._renderer2.setStyle(this.filePreviewModal.nativeElement,'z-index',999999);
        this._renderer2.setStyle(this.filePreviewModal.nativeElement,'overflow','auto');
      }
    })

    this.previewFocusSubscription=this._eventEmitterService.previewFocus.subscribe(res=>{
      this.setPreviewFocus();
    })

    // setting submenu items
    SubMenuItemStore.setSubMenuItems([
      { type: 'go_to_plan' },
      { type: 'edit_modal' },      
      { type: 'close', path: '../' }
    ]);
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    this.getAudit();
  }
  getAudit(){
    this._auditService.getItem(AuditStore.audit_id).subscribe(res=>{

      this._utilityService.detectChanges(this._cdr);
    })
  }
  
  setPreviewFocus(){
    this._renderer2.setStyle(this.filePreviewModal.nativeElement,'z-index',999999);
    this._renderer2.setStyle(this.filePreviewModal.nativeElement,'overflow','auto');
  }

  assignUserValues(user){
    if(user){
    var userInfoObject={
      first_name:'',
      last_name:'',
      designation:'',
      image_token:'',
      mobile:null,
      email:'',
      id:null,
      department:'',
      status_id:null
    }

    userInfoObject.first_name = user?.first_name;
    userInfoObject.last_name = user?.last_name;
    userInfoObject.designation = user?.designation;
    userInfoObject.image_token = user?.image.token;
    userInfoObject.email = user?.email;
    userInfoObject.mobile = user?.mobile;
    userInfoObject.id = user?.id;
    userInfoObject.status_id = user?.status.id
    userInfoObject.department = null;
     return userInfoObject;
  }

  }

  getCreatedByPopupDetails(users, created?:string){
    let userDetial: any = {};
    userDetial['first_name'] = users?.first_name;
    userDetial['last_name'] = users?.last_name;
    userDetial['designation'] = users?.designation;
    userDetial['image_token'] = users?.image?.token;
    userDetial['email'] = users?.email;
    userDetial['mobile'] = users?.mobile;
    userDetial['id'] = users?.id;
    userDetial['department'] = users?.department;
    userDetial['status_id'] = users?.status_id? users?.status_id:users?.status?.id;
    userDetial['created_at'] = created? created:null;
   return userDetial;

  }

  gotoEditPage(){
    this._router.navigateByUrl('/internal-audit/audits/edit-planned-audit');
    this._utilityService.detectChanges(this._cdr);

  }

  gotoPlanDetails(){
    this._router.navigateByUrl('/internal-audit/audit-plans/'+AuditStore.auditDetails?.audit_plan?.id);
    this._utilityService.detectChanges(this._cdr);
  }

   // for downloading files
  //  downloadAuditDocument(type, audit, auditDocument) {

  //   event.stopPropagation();
  //   switch (type) {
  //     case "downloadAuditPlanDocument":
  //       this._internalAuditFileService.downloadFile(
  //         "audits",
  //         audit.id,
  //         auditDocument.id,
  //         null,
  //         auditDocument.name,
  //         auditDocument
  //       );
  //       break;

  //   }

  // }

  //  // preview modal open function
  // openPreviewModal(type, filePreview, auditDocument, audit) {
  //   switch (type) {
  //     case "viewDocument":
  //       this.previewObject.component = "audits";
  //       break;
  //     default:
  //       break;
  //   }

  //   let previewItem = null;
  //   if (filePreview) {
  //     previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
  //     this.previewObject.preview_url = previewItem;
  //     this.previewObject.file_details = auditDocument;
  //     if (type == "viewDocument") {
  //       this.previewObject.componentId = audit.id;
  //     } else {
  //       this.previewObject.componentId = audit.id;
  //     }

  //     this.previewObject.uploaded_user =
  //     audit.updated_by.length > 0 ? audit.updated_by : audit.created_by;
  //     this.previewObject.created_at = audit.created_at;
  //     $(this.filePreviewModal.nativeElement).modal("show");
  //     this._utilityService.detectChanges(this._cdr);
  //   }
  // }



  // *// Closes from preview
  //   closePreviewModal(event) {
  //   $(this.filePreviewModal.nativeElement).modal("hide");
  //   this.previewObject.preview_url = "";
  //   this.previewObject.uploaded_user = null;
  //   this.previewObject.created_at = "";
  //   this.previewObject.file_details = null;
  //   this.previewObject.componentId = null;
  // }

  // for file preview

//   viewAuditDocument(type, audit, auditDocument) {


//     switch (type) {
//       case "viewDocument":
//         this._internalAuditFileService
//           .getFilePreview("audits", audit.id, auditDocument.id)
//           .subscribe((res) => {
//             var resp: any = this._utilityService.getDownLoadLink(
//               res,
//               audit.name
//             );
//             this.openPreviewModal(type, resp, auditDocument, audit);
//           }),
//           (error) => {
//             if (error.status == 403) {
//               this._utilityService.showErrorMessage(
//                 "Error",
//                 "Permission Denied"
//               );
//             } else {
//               this._utilityService.showErrorMessage(
//                 "Error",
//                 "Unable to generate Preview"
//               );
//             }
//           };
//         break;
//     }
//   }


//   // Returns default image
//   getDefaultImage(type) {
//     return this._imageService.getDefaultImageUrl(type);
//   }

//   createPreviewUrl(type, token) {
//     return this._imageService.getThumbnailPreview(type, token)
//   }


//   // Returns image url according to type and token
//   createImageUrl(type, token) {
//     return this._internalAuditFileService.getThumbnailPreview(type, token);
//   }

//  // extension check function
//   checkExtension(ext, extType) {

//     return this._imageService.checkFileExtensions(ext, extType)
   
//   }


// Common File Upload Details Page Function Starts Here

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
    case "audits":
      this._internalAuditFileService.downloadFile(
        type,
        document.audit_id,
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
      break;
  }
}

viewDocument(type, documents, documentFile) {
  switch (type) {
    case "audits":
      this._internalAuditFileService
        .getFilePreview(type, documents.audit_id, documentFile.id)
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


// Returns default image
getDefaultImage(type) {
  return this._imageService.getDefaultImageUrl(type);
}

createPreviewUrl(type, token) {
  return this._imageService.getThumbnailPreview(type, token)
}


// Returns image url according to type and token
createImageUrl(type, token) {
  if(type=='audits')
  return this._internalAuditFileService.getThumbnailPreview(type, token);
  else
  return this._documentFileService.getThumbnailPreview(type, token);

}

// extension check function
checkExtension(ext, extType) {

  return this._imageService.checkFileExtensions(ext, extType)
 
}



createImagePreview(type, token) {
  return this._imageService.getThumbnailPreview(type, token)
}
// Common FIle Upload Details Page Function Ends Here




  getTimezoneFormatted(time){
    return this._helperService.timeZoneFormatted(time);
  }

  ngOnDestroy(){

    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    AuditStore.unsetIndividualAudit();
  }


}
