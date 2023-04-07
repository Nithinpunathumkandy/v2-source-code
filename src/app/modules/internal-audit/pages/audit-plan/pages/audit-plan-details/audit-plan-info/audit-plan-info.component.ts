import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { IReactionDisposer ,autorun } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { AuditPlanService } from 'src/app/core/services/internal-audit/audit-plan/audit-plan.service';
import { InternalAuditFileService } from 'src/app/core/services/masters/internal-audit/file-service/internal-audit-file.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuditPlanStore } from 'src/app/stores/internal-audit/audit-plan/audit-plan-store';
import { AuditProgramMasterStore } from 'src/app/stores/internal-audit/audit-program/audit-program-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import {AuditPlanCommentsStore} from 'src/app/stores/internal-audit/audit-plan/audit-plan-comment/audit-plan-comment-store';
import { AuditPlanCommentService } from 'src/app/core/services/internal-audit/audit-plan/audit-plan-comment/audit-plan-comment.service';
import { DiscussionBotStore } from "src/app/stores/general/discussion-bot.store";
import { DiscussionBotService } from 'src/app/core/services/general/discussion-bot/discussion-bot.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';



declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-audit-plan-info',
  templateUrl: './audit-plan-info.component.html',
  styleUrls: ['./audit-plan-info.component.scss']
})
export class AuditPlanInfoComponent implements OnInit , OnDestroy {
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  @ViewChild('scroll') scroll: any;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  //@ViewChild('loaderPopUp') loaderPopUp: ElementRef;

  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  AuditPlanStore = AuditPlanStore;
  AuditProgramMasterStore = AuditProgramMasterStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  AppStore = AppStore;
  AuditPlanCommentsStore = AuditPlanCommentsStore;
  AuthStore = AuthStore;
  popupObject = {
    category: '',
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  
  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
  };
  publishMessage: string = 'publishing';

  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  comments;
  comment_id:number = null;
  popupControlAuditableEventSubscription: any;
  previewFocusSubscription:any;

  showAcceptButton: boolean;
  constructor(private _cdr: ChangeDetectorRef,
    private _sanitizer: DomSanitizer,
    private _router: Router,
    private _eventEmitterService:EventEmitterService,
    private _renderer2: Renderer2,
    private _auditPlanCommentService: AuditPlanCommentService,
    private _internalAuditFileService: InternalAuditFileService,
    private _imageService: ImageServiceService,
    private _auditPlanService: AuditPlanService,
    private _utilityService: UtilityService,
    private _discussionBotService: DiscussionBotService,
    private _documentFileService: DocumentFileService,
    private _helperService: HelperServiceService) { }

  ngOnInit(): void {
    AppStore.showDiscussion = true;
    this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
           this.gotoEditPage();
            break;
            case "publish_plan":
              this.markPublish('draft');
               break;
               case "auditee_accept":
              this.markPublish('pending');
               break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })

    this.popupControlAuditableEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    this.previewFocusSubscription=this._eventEmitterService.previewFocus.subscribe(res=>{
      this.setPreviewFocus();
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
    // setting submenu items
    SubMenuItemStore.setSubMenuItems([
      // { type: 'edit_modal' },
      { type: 'close', path: '../' }
    ]);
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    this.getAuditPlan();
  }

  setPreviewFocus(){
    this._renderer2.setStyle(this.filePreviewModal.nativeElement,'z-index',999999);
    this._renderer2.setStyle(this.filePreviewModal.nativeElement,'overflow','auto');
  }

  modalControl(status: boolean) {
      switch (this.popupObject.category) {
        case 'draft': this.markPublished(status)
          break;
          case 'pending': this.acceptAuditPublish(status)
          break;
      default:
      break;
      }
  }

  // closeLoaderPopUp() {
  //   setTimeout(() => {
  //     $(this.loaderPopUp.nativeElement).modal('hide');
  //   }, 250);
  // }

  acceptAuditPublish(status){
    AuditPlanStore.individualLoaded=false;
    if(status){
      SubMenuItemStore.acceptClicked=true;
      this._auditPlanService.acceptAudit(AuditPlanStore.auditPlan_id).subscribe(res=>{
        SubMenuItemStore.acceptClicked=false;
        this.getAuditPlan();
        $(this.confirmationPopUp.nativeElement).modal('hide');
        this._utilityService.detectChanges(this._cdr);
      },(error)=>{
        SubMenuItemStore.acceptClicked = false;
        this._utilityService.detectChanges(this._cdr);
      })
    }else{
      setTimeout(() => {
        this.getAuditPlan();
        SubMenuItemStore.acceptClicked=false;
        $(this.confirmationPopUp.nativeElement).modal('hide');
      }, 250);
    }
  }

  markPublished(status){
    AuditPlanStore.individualLoaded=false;
    if(status){
        $(this.confirmationPopUp.nativeElement).modal('hide');
        SubMenuItemStore.publishClicked=true;  
        this._utilityService.detectChanges(this._cdr);    
        //$(this.loaderPopUp.nativeElement).modal('show');    
        this._auditPlanService.auditPublish(AuditPlanStore.auditPlan_id).subscribe(res=>{
        //this.closeLoaderPopUp();
        SubMenuItemStore.publishClicked=false;
        this.getAuditPlan();
        //$(this.confirmationPopUp.nativeElement).modal('hide');
        this._utilityService.detectChanges(this._cdr);
      },(error)=>{
        SubMenuItemStore.publishClicked = false;
        this._utilityService.detectChanges(this._cdr);
      })
    }else{
      setTimeout(() => {
        SubMenuItemStore.publishClicked=false;
        $(this.confirmationPopUp.nativeElement).modal('hide');
      }, 250);
    }
  }

  markPublish(type:string) {
    if(type=='draft'){
      this.popupObject.title = 'Publish?';
      this.popupObject.subtitle = 'Are you sure you want to submit the individual audit plan?';
      this.popupObject.category = type;
      this.popupObject.type = 'Confirm';
      this._utilityService.detectChanges(this._cdr);
      $(this.confirmationPopUp.nativeElement).modal('show');
    }
    else if(type=='pending'){
      this.popupObject.title = 'Publish?';
      this.popupObject.subtitle = 'Are you sure to accept the audit plan & schedules?';
      this.popupObject.category = type;
      this.popupObject.type = 'Confirm';
      this._utilityService.detectChanges(this._cdr);
      $(this.confirmationPopUp.nativeElement).modal('show');
    }
    
  }

  getAuditPlan(){
    this.comments = null;
    this.comment_id = null;
    
    this._auditPlanService.getItem(AuditPlanStore.auditPlan_id).subscribe(res=>{
      if(AuthStore?.user?.id==AuditPlanStore.auditPlanDetails?.auditee_leader?.id){
        this.showAcceptButton = true;
      }
      if(res){
        if(AuditPlanStore.auditPlanDetails.audit_plan_status.id == 1 && AuditPlanStore.auditPlanDetails.audit_plan_schedules!=0){
          // setting submenu items
          SubMenuItemStore.setSubMenuItems([
            { type: 'auditee_accept' },
            { type: 'edit_modal' },
            { type: 'close', path: '../' }
          ]);
        }
        // else if(AuditPlanStore.auditPlanDetails.audit_plan_status.id == 3 && this.showAcceptButton && AuditPlanStore.auditPlanDetails.audit_plan_schedules!=0){
        //   // setting submenu items
        //   SubMenuItemStore.setSubMenuItems([
        //     { type: 'auditee_accept' },
        //     { type: 'edit_modal' },
        //     { type: 'close', path: '../' }
        //   ]);
        // }
        else{
          SubMenuItemStore.setSubMenuItems([
            // { type: 'edit_modal' },
            { type: 'close', path: '../' }
          ]);
        }
      }
      let id = AuditPlanStore.auditPlan_id
      DiscussionBotStore.setDiscussionMessage([]);
      DiscussionBotStore.setbasePath('/audit-plans/');
      DiscussionBotStore.setDiscussionAPI(id+'/comments');
      this.downloadDiscussionThumbnial();
      this.getImagePrivew();
      this.showThumbnailImage();
      this.getDiscussions();
      this._utilityService.detectChanges(this._cdr);

    })
  }
  getDiscussions(){
    this._discussionBotService.getDiscussionMessage().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }
  downloadDiscussionThumbnial(){
    DiscussionBotStore.setThumbnailDownloadAPI(AuditPlanStore.auditPlan_id+'/comments/')
  }
  showThumbnailImage(){
    DiscussionBotStore.setShowThumbnailAPI(AuditPlanStore.auditPlan_id+'/comments/')
  } 
  getImagePrivew(){
   DiscussionBotStore.setDiscussionThumbnailAPI('/internal-audit/files/audit-plan-comment-document/thumbnail?token=')
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
    this.AuditProgramMasterStore.auditProgramId = null;
      this._router.navigateByUrl('/internal-audit/audit-plans/edit-audit-plan');
      this._utilityService.detectChanges(this._cdr);
  
  }

  gotoAuditProgram(){
    this._router.navigateByUrl('/internal-audit/audit-programs/'+AuditPlanStore.auditPlanDetails?.audit_program?.id);
  }


  // for downloading files
  downloadAuditPlanDocument(type, auditPlan, auditPlanDocument) {

    event.stopPropagation();
    switch (type) {
      case "downloadAuditPlanDocument":
        this._internalAuditFileService.downloadFile(
          "audit-plan",
          auditPlan.id,
          auditPlanDocument.id,
          null,
          auditPlanDocument.name,
          auditPlanDocument
        );
        break;

    }

  }

   // preview modal open function
  // openPreviewModal(type, filePreview, auditPlanDocument, auditPlan) {
  //   switch (type) {
  //     case "viewDocument":
  //       this.previewObject.component = "audit-plan";
  //       break;
  //     default:
  //       break;
  //   }

  //   let previewItem = null;
  //   if (filePreview) {
  //     previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
  //     this.previewObject.preview_url = previewItem;
  //     this.previewObject.file_details = auditPlanDocument;
  //     if (type == "viewDocument") {
  //       this.previewObject.componentId = auditPlan.id;
  //     } else {
  //       this.previewObject.componentId = auditPlan.id;
  //     }

  //     this.previewObject.uploaded_user =
  //     auditPlan.updated_by.length > 0 ? auditPlan.updated_by : auditPlan.created_by;
  //     this.previewObject.created_at = auditPlan.created_at;
  //     $(this.filePreviewModal.nativeElement).modal("show");
  //     this._utilityService.detectChanges(this._cdr);
  //   }
  // }
  //   closePreviewModal(event) {
  //   $(this.filePreviewModal.nativeElement).modal("hide");
  //   this.previewObject.preview_url = "";
  //   this.previewObject.uploaded_user = null;
  //   this.previewObject.created_at = "";
  //   this.previewObject.file_details = null;
  //   this.previewObject.componentId = null;
  // }

  // for file preview

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


  // viewAuditPlanDocument(type, auditPlan, auditPlanDocument) {


  //   switch (type) {
  //     case "viewDocument":
  //       this._internalAuditFileService
  //         .getFilePreview("audit-plan", auditPlan.id, auditPlanDocument.id)
  //         .subscribe((res) => {
  //           var resp: any = this._utilityService.getDownLoadLink(
  //             res,
  //             auditPlan.name
  //           );
  //           this.openPreviewModal(type, resp, auditPlanDocument, auditPlan);
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
  //   }
  // }

   // File Preview,Download Starts Here
   downloadDocumentFile(type, document, docs?) {
    event.stopPropagation();
    switch (type) {
      case "audit-document":
        this._internalAuditFileService.downloadFile(
          'audit-plan',
          document.audit_plan_id,
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
      case "audit-document":
        this._internalAuditFileService
          .getFilePreview('audit-plan', documents.audit_plan_id, documentFile.id)
          .subscribe((res) => {
            var resp: any = this._utilityService.getDownLoadLink(
              res,
              documents.title
            );
            this.openPreviewModal('audit-plan', resp, documentFile, documents);
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
    if(type=='audit-document')
    return this._internalAuditFileService.getThumbnailPreview('audit-plan', token);
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

  getTimezoneFormatted(time){
    return this._helperService.timeZoneFormatted(time);
  }

  ngOnDestroy(){

    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.previewFocusSubscription.unsubscribe()
    this.popupControlAuditableEventSubscription.unsubscribe();
    AppStore.showDiscussion = false;
    this.showAcceptButton = false;
    AuditPlanStore.individualLoaded = false;

  }

}
