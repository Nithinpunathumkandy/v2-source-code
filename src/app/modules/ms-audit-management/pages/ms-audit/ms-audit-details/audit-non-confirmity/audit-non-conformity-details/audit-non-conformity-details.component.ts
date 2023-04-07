
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { FileServiceService } from 'src/app/core/services/ms-audit-management/file-service/file-service.service';
import { AuditNonConfirmityService } from 'src/app/core/services/ms-audit-management/ms-audit/ms-audit-details/audit-non-confirmity/audit-non-confirmity.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuditNonConfirmityStore } from 'src/app/stores/ms-audit-management/audit-non-confirmity/audit-non-confirmity.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { MsAuditStore } from 'src/app/stores/ms-audit-management/ms-audits/ms-audit-store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';

declare var $: any;
@Component({
  selector: 'app-audit-non-conformity-details',
  templateUrl: './audit-non-conformity-details.component.html',
  styleUrls: ['./audit-non-conformity-details.component.scss']
})
export class AuditNonConformityDetailsComponent implements OnInit, OnDestroy {
  @ViewChild ('formModal') formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('filePreviewModal') filePreviewModal: ElementRef;//-document

  AppStore = AppStore;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  AuditNonConfirmityStore = AuditNonConfirmityStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  controlNonConiformitySubscriptionEvent: any;
  popupControlEventSubscription: any;

  MsNonConformityObject = {
    type:null,
    value: null,
  };

  popupObject = {
    type: '',
    id: null,
    position: null,
    title:'',
    subtitle:''
  };

  // -document
  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
  };
  
  
  constructor(  
    private _router:Router,
    private _renderer2: Renderer2,
    private _route: ActivatedRoute,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _auditNonConfirmityService : AuditNonConfirmityService,
    private _documentFileService: DocumentFileService,
    private _fileServiceService: FileServiceService,
    private _sanitizer: DomSanitizer,
    private _imageService:ImageServiceService,
  ) { }

  ngOnInit(): void {

    AuditNonConfirmityStore.brudcrubDisable=false;

    let id: number;
    this._route.params.subscribe(params => {
      id = +params['id']; 
      AuditNonConfirmityStore.setmsAuditNonConfirmityId(id);
      this.getDetails(id);
    })
    
    AppStore.showDiscussion = false;
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    if(!BreadCrumbMenuItemStore.refreshBreadCrumbMenu){
      
      BreadCrumbMenuItemStore.makeEmpty();
      BreadCrumbMenuItemStore.addBreadCrumbMenu({
        name:"ms_audit",
        path:`/ms-audit-management/ms-audits`
      });
    }

    NoDataItemStore.unsetNoDataItems();
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: null, buttonText: null});

    this.reactionDisposer = autorun(() => {
      
      this.subMenu();

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
              this.getEdit();
            break;
          case "delete":
            this.delete(AuditNonConfirmityStore.msAuditNonConfirmityId);
          break;
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    });

    // this.modalEventSubscription = this._eventEmitterService.commonModal.subscribe(res => {
    //   this.closeFormModal();
    // });
    this.controlNonConiformitySubscriptionEvent = this._eventEmitterService.msAuditNonConformity.subscribe(res => {
      this.closeFormModal();
      // this.pageChange(1)
   })
    
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    });
  }

  getDetails(id){
    this._auditNonConfirmityService.getIndividualCheckList(id).subscribe(res => {
      this.subMenu();
    this._utilityService.detectChanges(this._cdr);
    });
  }

  subMenu(){

    let subMenuItems= [];
    if(this.isAuditors()||this.isResponsibleUsers()||this.isAuditLeader()){
      subMenuItems = [
        { activityName: 'UPDATE_MS_AUDIT_PROGRAM', submenuItem: { type: 'edit_modal' } },
        { activityName: 'DELETE_MS_AUDIT_PROGRAM', submenuItem: { type: 'delete' } },
        { activityName: null, submenuItem: { type: 'close', path:AuditNonConfirmityStore.path} },
      ];
    }else{
      subMenuItems = [
        { activityName: null, submenuItem: { type: 'close', path:AuditNonConfirmityStore.path} },
      ];
    }
    
    this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
    
  }

  isAuditors(){
    if(MsAuditStore.individualMsAuditDetails?.auditors?.length>0){
      return MsAuditStore.individualMsAuditDetails?.auditors?.find(element=>element?.id==AuthStore.user?.id)
    }else{
      return false;
    }
  }

  isResponsibleUsers(){
    if(AuditNonConfirmityStore.individualMsAuditNonConfirmityDetails?.responsible_users?.length>0){
      return AuditNonConfirmityStore.individualMsAuditNonConfirmityDetails?.responsible_users?.find(element=>element?.id==AuthStore.user?.id)
    }else{
      return false;
    }
  }

  isAuditLeader(){
    return MsAuditStore.individualMsAuditDetails?.ms_audit_plan?.lead_auditor?.id==AuthStore.user?.id;
  }

// Edit
  getEdit() {
    if(AuditNonConfirmityStore.individualMsAuditNonConfirmityDetails?.id){
      
      this._auditNonConfirmityService.getIndividualCheckList(AuditNonConfirmityStore.individualMsAuditNonConfirmityDetails?.id).subscribe(res=>{
      this.MsNonConformityObject.type = 'Edit';
      this.MsNonConformityObject.value = res
      AuditNonConfirmityStore.editFlag=true;
      this._utilityService.detectChanges(this._cdr);
      this.openFormModal();
    }) 
    } 

  }
//**Edit

//delete
  delete(id){
    this.popupObject.id = id;
    this.popupObject.type = '';
    this.popupObject.title='Delete';
    this.popupObject.subtitle = 'it_will_remove_the_non_conformity_from_the_audit';

    $(this.confirmationPopUp.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  // modal control event
  modalControl(status: boolean) {

    switch (this.popupObject.type) {
      case '': this.deleteItem(status);
        break;
    }
  }

  // delete function call
  deleteItem(status: boolean) {
    
    if (status && this.popupObject.id) {

      this._auditNonConfirmityService.deleteNonConfirmity(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
          this._router.navigateByUrl(`/ms-audit-management/ms-audits/${MsAuditStore.msAuditId}/findings`);
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

  clearPopupObject() {
    this.popupObject.id = null;
  }

  //**delete


  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  closeFormModal() {
    this.getDetails(AuditNonConfirmityStore.msAuditNonConfirmityId);
    $(this.formModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
    this.MsNonConformityObject.type = null;
    this.MsNonConformityObject.value = null;
    AppStore.showDiscussion = false;
  }

  
  getEmployeePopupDetails(users, created?: string) { //user popup
    
    let userDetails: any = {};
      if(users){
        userDetails['first_name'] = users?.first_name?users?.first_name:users?.name;
        userDetails['last_name'] = users?.last_name;
        userDetails['image_token'] = users?.image?.token?users?.image.token:users?.image_token;
        userDetails['email'] = users?.email;
        userDetails['mobile'] = users?.mobile;
        userDetails['id'] = users?.id;
        // userDetails['department'] = users?.department?users.department : users?.department?.title ? users?.department?.title : null;
        userDetails['department'] = users?.department;
        userDetails['status_id'] = users?.status_id? users?.status_id:users?.status.id;
        userDetails['created_at'] =created? created:null;
        userDetails['designation'] = users?.designation?.title ? users?.designation?.title : users?.designation;
      }
    return userDetails;
  }

  
  // kh-module base document-document
  // viewDocument(type, documents, documentFile) {
  
  //   switch (type) {
  //     case "ms-non-confomity-document":
  //       this._fileServiceService
  //         .getFilePreview(type, documents.ms_audit_finding_id, documentFile.id)
  //         .subscribe((res) => {
  //           var resp: any = this._utilityService.getDownLoadLink(
  //             res,
  //             documents.title
  //           );
  //           this.openPreviewModal(type, resp, documentFile, documents);
  //         }),
  //         (error) => {
  //           if (error.status == 403) {
  //             this._utilityService.showErrorMessage(
  //               "Error",
  //               "Permission Denied"
  //             );
  //           } else {
  //             this._utilityService.showErrorMessage(
  //               "Error",
  //               "Unable to generate Preview"
  //             );
  //           }
  //         };
  //       break;
  
  //       case "document-version":
  //         this._documentFileService
  //           .getFilePreview(type, documents.document_id, documentFile.id)
  //           .subscribe((res) => {
  //             var resp: any = this._utilityService.getDownLoadLink(
  //               res,
  //               documents.title
  //             );
  //             this.openPreviewModal(type, resp, documentFile, documents);
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
  //   }
  // }

  // // kh-module base document- Returns image url according to type and token-document
  // createImageUrl(type, token) {
  //   if(type=='ms-non-confomity-document')
  //   return this._fileServiceService.getThumbnailPreview(type, token);
  //   else
  //   return this._documentFileService.getThumbnailPreview(type, token);

  // }

  // // kh-module base document-document
  // downloadDocumentFile(type, document, docs?) {
  //   event.stopPropagation();
  //   switch (type) {
  //     case "ms-non-confomity-document":
  //       this._fileServiceService.downloadFile(
  //         type,
  //         document.ms_audit_finding_id,
  //         document.id,
  //         null,
  //         document.title,
  //         document
  //       );
  //       break;
  //     case "document-version":
  //       this._documentFileService.downloadFile(
  //         type,
  //         document.document_id,
  //         docs.id,
  //         null,
  //         document.title,
  //         docs
  //       );
  //       break;
  //   }
  // }

  // kh-module base document-document
  // openPreviewModal(type, filePreview, documentFiles, document) {
  //   this.previewObject.component=type;
  
  //   let previewItem = null;
  //   if (filePreview) {
  //     previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
  //     this.previewObject.preview_url = previewItem;
  //     this.previewObject.file_details = documentFiles;
  //     this.previewObject.componentId = document.ms_audit_finding_id;
      
  //     this.previewObject.uploaded_user = AuditNonConfirmityStore.individualMsAuditNonConfirmityDetails?.created_by;
  //     document.updated_by ? document.updated_by : document.created_by;
  //     this.previewObject.created_at = document.created_at;
  //     $(this.filePreviewModal.nativeElement).modal("show");
  //     this._utilityService.detectChanges(this._cdr);
  //   }
  // }

  // // Closes from preview-document
  // closePreviewModal(event) {
  // $(this.filePreviewModal.nativeElement).modal("hide");
  // this.previewObject.preview_url = "";
  // this.previewObject.uploaded_user = null;
  // this.previewObject.created_at = "";
  // this.previewObject.file_details = null;
  // this.previewObject.componentId = null;
  // }

  // extension check function-document
  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType)
  }  
  
  getNoDataSource(type){
    let noDataSource = {
      noData:"no_data_found", border: false, imageAlign: type
    }
    return noDataSource;
  }

  getTimezoneFormatted(time){

    return this._helperService.timeZoneFormatted(time);

  }

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    BreadCrumbMenuItemStore.refreshBreadCrumbMenu = false;
    SubMenuItemStore.makeEmpty();
    this.controlNonConiformitySubscriptionEvent.unsubscribe();
    this.popupControlEventSubscription.unsubscribe();
    AuditNonConfirmityStore.unsetIndividualMsAuditNonConfirmityDetails();

    AuditNonConfirmityStore.brudcrubDisable=true;
  }
}
