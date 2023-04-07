import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppStore } from 'src/app/stores/app.store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { ComplianceRegisterService } from 'src/app/core/services/compliance-management/compliance-register/compliance-register.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ComplianceRegisterStore } from 'src/app/stores/compliance-management/compliance-register/compliance-register-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { autorun, IReactionDisposer } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { DomSanitizer } from '@angular/platform-browser';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ComplianceRegisterWorkflowService } from 'src/app/core/services/compliance-management/compliance-register-workflow.service';
import { ComplianceRegisterWorkflowStore } from 'src/app/stores/compliance-management/compliance-workflow/compliance-register-workflow.store';
import { ComplianceAreaMasterStore } from 'src/app/stores/masters/compliance-management/compliance-area-store';
import { DiscussionBotStore } from 'src/app/stores/general/discussion-bot.store';
import { DiscussionBotService } from 'src/app/core/services/general/discussion-bot/discussion-bot.service';
import { OrganizationSettingsService } from 'src/app/core/services/settings/organization_settings/organization-settings.service';
declare var $: any;
@Component({
  selector: 'app-compliance-register-details',
  templateUrl: './compliance-register-details.component.html',
  styleUrls: ['./compliance-register-details.component.scss']
})
export class ComplianceRegisterDetailsComponent implements OnInit ,OnDestroy {
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('statusFormModal', { static: true }) statusFormModal: ElementRef;
  @ViewChild('statusHistoryFormModal', { static: true }) statusHistoryFormModal: ElementRef;
  @ViewChild('addRegFormModal', { static: true }) addRegFormModal: ElementRef;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  @ViewChild('commentModal') commentModal: ElementRef;
  @ViewChild('workflowModal') workflowModal: ElementRef;
  @ViewChild('workflowHistory') workflowHistory: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  reactionDisposer: IReactionDisposer;
  AppStore = AppStore;
  AuthStore = AuthStore;
  SubMenuItemStore = SubMenuItemStore;
  ComplianceRegisterStore = ComplianceRegisterStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  ComplianceRegisterWorkflowStore = ComplianceRegisterWorkflowStore;

  userDetailObject = {
    id: null,
    first_name: '',
    last_name: '',
    designation: '',
    image_token: '',
    mobile: null,
    email: '',
    department: '',
    status_id: null
  }
  complianceStatusObject = {
    type:null,
    values: null,
    id: null
  }
  complianceStatusHistoryObject = {
    type:null,
    values: null,
    document_id: null
  }
  complianceRegisterObject = {
    type:null,
    values: null,
  }
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  previewObject = {
    id:null,
    file_details: null,
    component: '',
    preview_url: null,
    file_name: '',
    file_type: '',
    size: '',
    uploaded_user: null,
    created_at: null,
    status: null,
    complianceStatus: null
  };
  
  workflowModalOpened: boolean=false;
  workflowHistoryOpened=false
  modalEventSubscription:any;
  modalComplianceRegisterEventSubscription:any;
  PreviewSubscriptionEvent:any;
  networkFailureSubscription: any;
  idleTimeoutSubscription: any;
  ComplianceRegisterCommentSuvscription: any;
  ComplianceRegisterWorkflowSubscription: any;
  ComplianceRegisterWorkflowHistorySubscription: any;
  popupControlEventSubscription: any;
  
  constructor(private _activatedRouter:ActivatedRoute,
              private _imageService:ImageServiceService,
              private _complianceRegisterService:ComplianceRegisterService,
              private _cdr:ChangeDetectorRef,
              private _utilityService:UtilityService,
              private _helperService:HelperServiceService,
              private _renderer2:Renderer2,
              private _router:Router,
              private _eventEmitterService:EventEmitterService,
              private _complianceRegisterWorkflowService:ComplianceRegisterWorkflowService,
              private _sanitizer: DomSanitizer,
              private _discussionBotService: DiscussionBotService,
              private _organizationSettingsService: OrganizationSettingsService
              ) { }

  ngOnInit(): void {
    AppStore.showDiscussion = true;
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    // let id: number;
    // this._activatedRouter.params.subscribe(params => {
    //   id = +params['id']; 
    //   ComplianceRegisterStore.complianceRegisterId = id;
       this.getComplianceRegister(ComplianceRegisterStore.complianceRegisterId);
    // //  this.getWorkflowDetails()
    // });

    this.reactionDisposer = autorun(() => {

      
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            this.complianceRegisterObject.values = null;
            this.editComplianceRegister(ComplianceRegisterStore.complianceRegisterId)
            break;
            case 'delete':
              this.delete(ComplianceRegisterStore.complianceRegisterId);
              break
          case 'submit':
            SubMenuItemStore.submitClicked = true;
            this.submitForReview();
            break
          case 'approve':
            this.approveRisk();
            break
          case 'review_submit':
              this.approveRisk(true);
              break
          case 'revert':
              // SubMenuItemStore.submitClicked = true;
              this.revertRisk();
              break
            case "history": this.openHistoryPopup();
              break;
            case "workflow": this.openWorkflowPopup();
              break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      // setting submenu items
  
    })
    this.modalEventSubscription = this._eventEmitterService.addComplianceStatus.subscribe(res => {
      this.closeFormModal();
    });
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    this.modalComplianceRegisterEventSubscription = this._eventEmitterService.addComplianceRegister.subscribe(res => {
      this.closeRegisterFormModal();
    });
    this.PreviewSubscriptionEvent = this._eventEmitterService.slaDocumentPreviewModal.subscribe(res => {
      this.closePreviewModal()
      this.changeZIndex();
    })
    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
      if(!status){
        this.changeZIndex();
      }
    })
    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
      if(!status){
        this.changeZIndex();
      }
    })

    this.ComplianceRegisterCommentSuvscription = this._eventEmitterService.ComplianceRegisterWorkflowCommentModal.subscribe(element=>{
      this.closeCommentForm();

    })

    this.ComplianceRegisterWorkflowSubscription = this._eventEmitterService.ComplianceRegisterWorkflow.subscribe(element=>{
      this.closeWorkflowPopup();

    })
    this.ComplianceRegisterWorkflowHistorySubscription = this._eventEmitterService.ComplianceRegisterHistory.subscribe(element=>{
      this.closeHistoryPopup();

    })

    // this.getComplianceRegister(id);
    DiscussionBotStore.setDiscussionMessage([]);
    DiscussionBotStore.setbasePath('/compliance-registers/');
    DiscussionBotStore.setDiscussionAPI(ComplianceRegisterStore.complianceRegisterId+'/comments');
    this.downloadDiscussionThumbnial();
    this.getImagePrivew();
    this.showThumbnailImage();
    this.getDiscussions();
    this.getOrganizationSettings()
  }

  getDiscussions(){
    this._discussionBotService.getDiscussionMessage().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  downloadDiscussionThumbnial(){
    DiscussionBotStore.setThumbnailDownloadAPI(ComplianceRegisterStore.complianceRegisterId+'/comments/')
  }

  showThumbnailImage(){
    DiscussionBotStore.setShowThumbnailAPI(ComplianceRegisterStore.complianceRegisterId+'/comments/')
  }

  getImagePrivew(){
   DiscussionBotStore.setDiscussionThumbnailAPI('/compliance-management/files/compliance-register-comment-document/thumbnail?token=')
  }

  changeZIndex(){
    if($(this.filePreviewModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.filePreviewModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.filePreviewModal.nativeElement,'overflow','auto');
    }
    if($(this.statusHistoryFormModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.statusHistoryFormModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.statusHistoryFormModal.nativeElement,'overflow','auto');
    }
  }

  getStatusColorKey(){
    var label_color = ComplianceRegisterStore.ComplianceRegisterDetailsList.document_compliance_status_updates[0].compliance_status.label.split('-');

    return 'draft-tag draft-tag-'+label_color[0]+' label-tag-style-tag label-left-arow-tag d-inline-block status-tag-new-one';
  }

  getStatusColorKey1(){
    var label_color = ComplianceRegisterStore.ComplianceRegisterDetailsList.document_compliance_status_updates[0].compliance_status.label.split('-');

    return 'mb-3 dot-div-new dot-'+label_color[0]+' font-normal';
  }

   submitAccepted(status){
    if(status){
      this._complianceRegisterWorkflowService.submitInvestigation(ComplianceRegisterStore.complianceRegisterId).subscribe(res=>{
        SubMenuItemStore.submitClicked = false;
        this.getComplianceRegister(ComplianceRegisterStore.complianceRegisterId)
        this._utilityService.detectChanges(this._cdr);
      },(error)=>{
        SubMenuItemStore.submitClicked = false;
        this._utilityService.detectChanges(this._cdr);
      })
    }
    else{
      SubMenuItemStore.submitClicked = false;
      this._utilityService.detectChanges(this._cdr);
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
   }

   submitForReview(){
    this.popupObject.type = 'Confirm';
    this.popupObject.title = 'submit';
    this.popupObject.subtitle = 'submit_compliance';
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
    }, 100);
    this._utilityService.detectChanges(this._cdr);

  }

  modalControl(status: boolean) {
    
    switch (this.popupObject.type) {
      case 'Confirm': this.submitAccepted(status)
        break;
      case 'are_you_sure': this.deleteComplianceRegister(status)
        break;
    }
    
  }

   openHistoryPopup() {
    ComplianceRegisterWorkflowStore.setCurrentPage(1);
    this._complianceRegisterWorkflowService.getHistory(ComplianceRegisterStore.complianceRegisterId).subscribe(res => {
      this.workflowHistoryOpened = true;
      this._utilityService.detectChanges(this._cdr);
      $(this.workflowHistory.nativeElement).modal('show');
    });
  }

  openWorkflowPopup() {
    this._complianceRegisterWorkflowService.getItems(ComplianceRegisterStore.complianceRegisterId).subscribe(res => {
      this.workflowModalOpened = true;
      this._utilityService.detectChanges(this._cdr);
      $(this.workflowModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.workflowModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.workflowModal.nativeElement, 'overflow', 'auto');
    })
  }

  closeHistoryPopup() {
    this.workflowHistoryOpened = false;
    $(this.workflowHistory.nativeElement).modal('hide');
  }
  
  closeWorkflowPopup() {
    this.workflowModalOpened = false;
    $(this.workflowModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.workflowModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.workflowModal.nativeElement, 'overflow', 'none');
    $('.modal-backdrop').remove();
  }
  
   approveRisk(type?) {
    if (type) {
      ComplianceRegisterWorkflowStore.type = 'submit';
    }
    else
      ComplianceRegisterWorkflowStore.type = 'approve';
      ComplianceRegisterWorkflowStore.commentForm = true;
    $(this.commentModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
  }
  
  closeCommentForm() {
    this.getComplianceRegister(ComplianceRegisterStore.complianceRegisterId)
    ComplianceRegisterWorkflowStore.type = '';
    ComplianceRegisterWorkflowStore.commentForm = false;
    $(this.commentModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'none');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
  
    this._utilityService.detectChanges(this._cdr)
  }
  
  revertRisk() {
    ComplianceRegisterWorkflowStore.type = 'revert';
    ComplianceRegisterWorkflowStore.commentForm = true;
    $(this.commentModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
  }

   //edit start
   editComplianceRegister(id) {
    event.stopPropagation();

    this._complianceRegisterService.getEditItem(id).subscribe(res => {
      this.ComplianceRegisterStore.clearDocumentDetails();
      let ActionDetails = res;
      if(res){
        this.complianceRegisterObject.values = {
          title: ActionDetails.title,
          id: ActionDetails.id,
          compliance_area_ids: ActionDetails.compliance_areas,
          compliance_section_ids: ActionDetails.compliance_sections,
          compliance_document_type_ids: ActionDetails.compliance_document_types,
          compliance_frequency_id: ActionDetails.compliance_frequency,
          comment: ActionDetails.comment,
          compliance_source: ActionDetails.compliance_source,
          responsible_user_ids: ActionDetails.compliance_responsible_users,
          description: ActionDetails.description,
          organizations: ActionDetails.organizations,
          divisions: ActionDetails.divisions,
          departments: ActionDetails.departments,
          sections: ActionDetails.sections,
          sub_sections: ActionDetails.sub_sections,
          issue_date: ActionDetails.versions[0].issue_date,
          expiry_date: ActionDetails.versions[0].expiry_date,
          branches: ActionDetails.branches,
          review_user: ActionDetails.review_user,
          sa1: ActionDetails.sa1,
          sa2: ActionDetails.sa2
        }
        if(ActionDetails.versions.length > 0){
          for(let brochures of ActionDetails.versions){
            if(brochures.token){
              let brochurePreviewUrl = this._complianceRegisterService.getThumbnailPreview('organization-brochure',brochures.token);
              let brochureDetails = {
                  name: brochures.title, 
                  ext: brochures.ext,
                  size: brochures.size,
                  url: brochures.url,
                  thumbnail_url: brochures.url,
                  token: brochures.token,
                  preview_url: brochurePreviewUrl,
                  id: brochures.id
              };
              this._complianceRegisterService.setDocumentDetails(brochureDetails,brochurePreviewUrl);
            }
          }
        }
        this.complianceRegisterObject.type = 'Edit';
        this._utilityService.detectChanges(this._cdr);
        this.openRegisterFormModal();
      }
      
    })
  }

  // for opening details edit modal
  openRegisterFormModal() {
    setTimeout(() => {
      $(this.addRegFormModal.nativeElement).modal('show');
    }, 250);
  }
      // for opening modal
      openFormModal() {
        setTimeout(() => {
          $(this.statusFormModal.nativeElement).modal('show');
        }, 100);
      }
  // for close modal
  closeFormModal() {
    $(this.statusFormModal.nativeElement).modal('hide');
    this.complianceStatusObject.type = null;
    // this.complianceStatusObject.values = null;
    // this.complianceRegisterHistory();
    this._complianceRegisterService.getComplianceStatusHistory().subscribe();
    this.getComplianceRegister(ComplianceRegisterStore.complianceRegisterId);
  } 

  // for close register modal
  closeRegisterFormModal() {
    $(this.addRegFormModal.nativeElement).modal('hide');
    this.complianceStatusObject.type = null;
    this.complianceStatusObject.values = null;
    this.getComplianceRegister(ComplianceRegisterStore.complianceRegisterId);
  } 

  
  // pageChange(newPage: number = null) {
  //   if (newPage) ComplianceRegisterStore.setCurrentPage(newPage);
  //   this._complianceRegisterService.getItems().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  // }

  complianceRegisterHistory() {
    this._complianceRegisterService.getComplianceStatusHistory().subscribe();
    this.complianceStatusHistoryObject.type = 'History';
    this.complianceStatusHistoryObject.document_id = ComplianceRegisterStore.complianceRegisterId;
    $(this.statusHistoryFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.statusHistoryFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  
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
    userInfoObject.designation = user?.designation ? user.designation : null;
    userInfoObject.image_token = user?.image ? user.image.token : user.image_token;
    userInfoObject.email = user?.email ? user?.email : null;
    userInfoObject.mobile = user?.mobile ? user?.mobile : null;
    userInfoObject.id = user?.id;
    userInfoObject.status_id = user?.status ? user.status.id: null;
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
  
  getArrayFormatedString(type,items,languageSupport?){
    let item=[];
    if(languageSupport){
      for(let i of items){
        for(let j of i.language){
          item.push(j.pivot);
        }
      }
      items = item;
    }
    return this._helperService.getArraySeperatedString(',',type,items);
  }

  getWorkflowDetails(){
    this._complianceRegisterWorkflowService.getItems(ComplianceRegisterStore.complianceRegisterId).subscribe(res => {
      this.setSubMenuItems(ComplianceRegisterStore.ComplianceRegisterDetailsList);
      this._utilityService.detectChanges(this._cdr);
    })
  }

  //showing data with id
  getComplianceRegister(id){
    this._complianceRegisterService.getComplianceRegisterDetails(id).subscribe((res)=>{
      this.getWorkflowDetails();
      this._utilityService.detectChanges(this._cdr)
    });
  }

  setSubMenuItems(res){
    if(res.next_review_user_level==1&&res.submitted_by==null){
      var subMenuItems = [
        {activityName:null, submenuItem: {type: 'workflow'}},
        {activityName:null, submenuItem: {type: 'history'}},
        {activityName:null,submenuItem:{type:'submit'}},
        {activityName: 'UPDATE_COMPLIANCE_REGISTER', submenuItem: {type: 'edit_modal'}},
        {activityName: 'DELETE_COMPLIANCE_REGISTER', submenuItem: {type: 'delete'}},
        {activityName:null, submenuItem: {type: 'close', path: '../'}}
      ]
      this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
    }else if(res.submitted_by!=null && res.next_review_user_level && this.isUser()){
      if (res?.next_review_user_level == ComplianceRegisterWorkflowStore?.workflowDetails[ComplianceRegisterWorkflowStore?.workflowDetails?.length - 1]?.level){
        var subMenuItems = [
          {activityName:null, submenuItem: {type: 'workflow'}},
          {activityName:null, submenuItem: {type: 'history'}},
          {activityName:null,submenuItem:{type:'approve'}},
          {activityName:null,submenuItem:{type:'revert'}},
          {activityName: 'UPDATE_COMPLIANCE_REGISTER', submenuItem: {type: 'edit_modal'}},
          {activityName: 'DELETE_COMPLIANCE_REGISTER', submenuItem: {type: 'delete'}},
          {activityName:null, submenuItem: {type: 'close', path: '../'}}
        ]
        this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
        this._utilityService.detectChanges(this._cdr);
      }
      else if (res.next_review_user_level != ComplianceRegisterWorkflowStore?.workflowDetails[ComplianceRegisterWorkflowStore?.workflowDetails?.length - 1]?.level){
        var subMenuItems = [
          {activityName:null, submenuItem: {type: 'workflow'}},
          {activityName:null, submenuItem: {type: 'history'}},
          {activityName:null,submenuItem:{type:'review_submit'}},
          {activityName:null,submenuItem:{type:'revert'}},
          {activityName: 'UPDATE_COMPLIANCE_REGISTER', submenuItem: {type: 'edit_modal'}},
          {activityName: 'DELETE_COMPLIANCE_REGISTER', submenuItem: {type: 'delete'}},
          {activityName:null, submenuItem: {type: 'close', path: '../'}}
        ]
        this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
        this._utilityService.detectChanges(this._cdr);
      }
    }else{
      var subMenuItems = [
        {activityName:null, submenuItem: {type: 'workflow'}},
        {activityName:null, submenuItem: {type: 'history'}},
        {activityName: 'UPDATE_COMPLIANCE_REGISTER', submenuItem: {type: 'edit_modal'}},
        {activityName: 'DELETE_COMPLIANCE_REGISTER', submenuItem: {type: 'delete'}},
        {activityName:null, submenuItem: {type: 'close', path: '../'}}
      ]
      this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
    }
  }

  isUser() {
    if(ComplianceRegisterStore?.complianceRegisterDetailListLoaded){
      for (let i of ComplianceRegisterStore?.ComplianceRegisterDetailsList.workflow_items) {
        if (i.level == ComplianceRegisterStore?.ComplianceRegisterDetailsList?.next_review_user_level) {
          var pos = i.users?.findIndex(e => e.id == AuthStore.user.id)
            if (pos != -1){
              return true;
            }
            else{
              return false
            }
        }
      }
    }
    else{
      return false;
    }
    
  }

  // //attachment downloads
  // downloadAllAttachments(id){
  //   this._complianceRegisterService.downloadFile('compliance-document', id, null,null,ComplianceRegisterStore.ComplianceRegisterDetailsList.id+'-attachments');
  // }
  viewStatusDocument(type, complianceStatus, complianceStatusDocument?) {
    switch (type) {
      case "compliance-status-document":
        this._complianceRegisterService
          .getFilePreview("compliance-status-document", complianceStatus.id, complianceStatus.document_id , complianceStatusDocument.id)
          .subscribe((res) => {
            var resp: any = this._utilityService.getDownLoadLink(
              res,
              complianceStatus.title
            );
            this.openPreviewModal(resp, complianceStatusDocument, complianceStatus);
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
        case "compliance-register-document":
        this._complianceRegisterService
          .getFilePreview("compliance-register-document", complianceStatus.document_id,'',complianceStatus.id)
          .subscribe((res) => {
            var resp: any = this._utilityService.getDownLoadLink(
              res,
              complianceStatus.title
            );
            this.openPreviewModal(resp,complianceStatus);
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

  openPreviewModal(filePreview,document,status?) {
    let uploaded_user = null;
    let previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
    this.previewObject.component = status!=null ? 'compliance-status-document' : 'compliance-register-document';
    this.previewObject.file_details = document;
    this.previewObject.complianceStatus = status
    this.previewObject.file_name = document.title;
    this.previewObject.id = document.id;
    this.previewObject.file_type = document.ext;
    this.previewObject.preview_url = previewItem;
    this.previewObject.size = document.size;
    this.previewObject.uploaded_user = uploaded_user;
    this.previewObject.created_at = document.created_at;
    $(this.filePreviewModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }


  closePreviewModal() {
    $(this.filePreviewModal.nativeElement).modal('hide');
    this.previewObject.component = '';
    this.previewObject.status = null;
    this.previewObject.file_name = null;
    this.previewObject.file_type = '';
    this.previewObject.preview_url = '';
    this.previewObject.file_details = null;
  }


 // Returns image url according to type and token
 createImageUrl(type, token) {
  return this._complianceRegisterService.getStatusThumbnailPreview(token);
}

createRegisterImageUrl(type, token) {
  return this._complianceRegisterService.getThumbnailPreview(type,token);
}
 
  // for downloading files
  downloadComplianceStatusDocument(type, status, document) {
    event.stopPropagation();
    switch (type) {
      case "compliance-status-document":
        this._complianceRegisterService.downloadFile(
          "compliance-status-document",
          status.id,
          status.document_id,
          document.id,
          document.title,
          document
        );
        break;
        case "compliance-register-document":
        this._complianceRegisterService.downloadFile(
          "compliance-register-document",
          status.document_id,
          status.id,
          status.id,
          status.title,
          status
        );
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
 

  // extension check function
  checkExtension(ext, extType) {

    return this._imageService.checkFileExtensions(ext, extType)

  }

  addComplianceRegister() {
    ComplianceRegisterStore.clearDocumentDetails();
    this.complianceStatusObject.type = 'Add';
    $(this.statusFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.statusFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  
  }

  checkDocumentPresent(){
    let documentsPresent = false;
    for(let i of ComplianceRegisterStore.ComplianceRegisterDetailsList?.versions){
      if(i.token){
        documentsPresent = true;
        break;
      }
    }
    return documentsPresent;
  }

  getTimezoneFormatted(time){
    return this._helperService.timeZoneFormatted(time);
  }

    
  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
  }

    // delete function call
    deleteComplianceRegister(status: boolean) {
      if (status && this.popupObject.id) {
        this._complianceRegisterService.delete(this.popupObject.id).subscribe(resp => {
          this._router.navigateByUrl('/compliance-management/compliance-registers');
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
          }, 500);
          this.clearPopupObject();
          // this.pageChange(1);
        });
      }
      else {
        this.clearPopupObject();
      }
      setTimeout(() => {
        $(this.confirmationPopUp.nativeElement).modal('hide');
      }, 250);
      // this.pageChange();
    }


  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'are_you_sure';
    this.popupObject.id = id;
    this.popupObject.title = 'are_you_sure';
    this.popupObject.subtitle = 'compliance_reg_delete_subtitle';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');

  }
  getOrganizationSettings(){
    this._organizationSettingsService.getOrganizationSettings().subscribe(res =>{
      })
      //this.enableDisable();
      this._utilityService.detectChanges(this._cdr);
  
  }
  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    //BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.modalEventSubscription.unsubscribe();
    this.modalComplianceRegisterEventSubscription.unsubscribe(); 
    ComplianceRegisterStore.clearDocumentDetails();
    ComplianceRegisterStore.unsetComplianceRegisterDetails()
    this.networkFailureSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.ComplianceRegisterCommentSuvscription.unsubscribe();
    this.ComplianceRegisterWorkflowSubscription.unsubscribe();
    this.ComplianceRegisterWorkflowHistorySubscription.unsubscribe();
    this.popupControlEventSubscription.unsubscribe()
    // AppStore.showDiscussion = false;

  }
}
