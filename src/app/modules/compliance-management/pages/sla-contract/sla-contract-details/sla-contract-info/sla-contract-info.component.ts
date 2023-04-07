import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { SlaContractWorkflowService } from 'src/app/core/services/compliance-management/sla-contract-workflow/sla-contract-workflow.service';
import { SlaContractService } from 'src/app/core/services/compliance-management/sla-contract/sla-contract.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { SlaContractWorkflowStore } from 'src/app/stores/compliance-management/compliance-workflow/sla-contract-workflow.store';
import { SLAContractStore } from 'src/app/stores/compliance-management/sla-contract/sla-contract-store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
declare var $: any

@Component({
  selector: 'app-sla-contract-info',
  templateUrl: './sla-contract-info.component.html',
  styleUrls: ['./sla-contract-info.component.scss']
})
export class SlaContractInfoComponent implements OnInit {
  @ViewChild('filePreviewModal') filePreviewModal: ElementRef;
  @ViewChild('formModal', { static: false }) formModal: ElementRef;
  @ViewChild('renewModal', { static: false }) renewModal: ElementRef;
  @ViewChild('historyModal', { static: false }) historyModal: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('commentModal') commentModal: ElementRef;
  @ViewChild('workflowModal') workflowModal: ElementRef;
  @ViewChild('workflowHistory') workflowHistory: ElementRef;

  AppStore = AppStore;
  AuthStore = AuthStore;
  SLAContractStore = SLAContractStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  SlaContractWorkflowStore = SlaContractWorkflowStore
  reactionDisposer: IReactionDisposer;
  deleteEventSubscription:any;
  documentRenewEventSubscription:any;
  PreviewSubscriptionEvent : any;
  slaContractSubscriptionEvent : any;
  controlSlaCategorySubscriptionEvent:any;
  workflowModalOpened: boolean=false;
  workflowHistoryOpened=false
  id:number;
  documentID = null;
  deleteObject = {
    id: null,
    position: null,
    type: '',
    subtitle:'',
    category:'',
    title: ''
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
    created_at: null
  };
  
  formObject = {
    id: null,
    type : null,
    values : null
  };

  userDetailObject = {
    id: null,
    first_name: '',
    last_name: '',
    designation: '',
    image_token: '',
    mobile: null,
    email: '',
    department: '',
    status_id: null,
    created_at:null
  }
  SlaContractCommentSuvscription: any;
  SlaContractWorkflowSubscription: any;
  SlaContractWorkflowHistorySubscription: any;
  constructor(private _slaContractService:SlaContractService,
    private _helperService:HelperServiceService,
    private _cdr:ChangeDetectorRef,
    private _router:Router,
    private _route: ActivatedRoute,
    private _utilityService:UtilityService,
    private _sanitizer: DomSanitizer,
    private _imageService :ImageServiceService,
    private _eventEmitterService:EventEmitterService,
    private _renderer2: Renderer2,
    private _slaContractWorkflowService: SlaContractWorkflowService,
    private _humanCapitalService:HumanCapitalService) { 
      
    }

  ngOnInit(): void {
    // AppStore.showDiscussion = false;
    // this._route.params.subscribe(params => {
    //   SLAContractStore.sla_contract_id = params.id;
    //   // let id = params.id;
    //   SLAContractStore.sla_contract_id = SLAContractStore.sla_contract_id
    //   // this.getWorkflowDetails()
    //   this.getItem(SLAContractStore.sla_contract_id)
    // });
    this.reactionDisposer = autorun(() => {   
      if(SLAContractStore.sla_contract_id) {
        this.getItem(SLAContractStore.sla_contract_id)
      } 
      // this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            setTimeout(() => {
              this.editSLAContract();
            }, 1000);
            break;
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
              this.revertRisk();
              break
          case "history": this.openHistoryPopup();
              break;
          case "workflow": this.openWorkflowPopup();
              break;
          case "delete":
              this.deleteSLAContract();
              break;
          default:
              break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
      // if(this.deleteObject.category == 'delete')
      // this.delete(item);
      // else
      // this.endContract(item);
    });
    this.documentRenewEventSubscription = this._eventEmitterService.slaDocumentRenewModel.subscribe(item => {
      this.closeRenewModal();
      this.changeZIndex();
    });
    this.PreviewSubscriptionEvent = this._eventEmitterService.slaDocumentPreviewModal.subscribe(res => {
      this.closePreviewModal();
      this.changeZIndex();
    })
    this.slaContractSubscriptionEvent = this._eventEmitterService.slaCOntractModal.subscribe(res => {
      this.closeFormModal();
      // this.changeZIndex();
    });
    this.controlSlaCategorySubscriptionEvent = this._eventEmitterService.slaCategory.subscribe(res => {
      this.changeZIndex();
    })

    this.SlaContractCommentSuvscription = this._eventEmitterService.SlaContractWorkflowCommentModal.subscribe(element=>{
      this.closeCommentForm();

    })

    this.SlaContractWorkflowSubscription = this._eventEmitterService.SlaContractWorkflow.subscribe(element=>{
      this.closeWorkflowPopup();

    })
    this.SlaContractWorkflowHistorySubscription = this._eventEmitterService.SlaContractHistory.subscribe(element=>{
      this.closeHistoryPopup();

    })

    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    // this.getItem(SLAContractStore.sla_contract_id);

  }

  getWorkflowDetails(){
    this._slaContractWorkflowService.getItems(SLAContractStore.sla_contract_id).subscribe(res => {
      this.setSubMenu(SLAContractStore?.slaContractDetails);
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getItem(id) {
    this._slaContractService.getItem(id).subscribe(res => {
      this.getWorkflowDetails();
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100)
    });
  }
  
  setSubMenu(res){
    if(res.next_review_user_level==1&&res.submitted_by==null){
      var subMenuItems = [
        {activityName:null, submenuItem: {type: 'workflow'}},
        {activityName:null, submenuItem: {type: 'history'}},
        {activityName:null,submenuItem:{type:'submit'}},
        { activityName: 'UPDATE_SERVICE_LEVEL_AGREEMENT_AND_CONTRACT', submenuItem: { type: 'edit_modal' } },
        { activityName: 'DELETE_SERVICE_LEVEL_AGREEMENT_AND_CONTRACT', submenuItem: { type: 'delete' } },
        {activityName: null, submenuItem: {type: 'close', path: "/compliance-management/sla-and-contracts"}}, 
      ]
      
      this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
    }else if(res.submitted_by!=null && res.next_review_user_level && this.isUser()){
      if (res?.next_review_user_level == SlaContractWorkflowStore?.workflowDetails[SlaContractWorkflowStore?.workflowDetails?.length - 1]?.level){
        var subMenuItems = [
          {activityName:null, submenuItem: {type: 'workflow'}},
          {activityName:null, submenuItem: {type: 'history'}},
          {activityName:null,submenuItem:{type:'approve'}},
          {activityName:null,submenuItem:{type:'revert'}},
          { activityName: 'UPDATE_SERVICE_LEVEL_AGREEMENT_AND_CONTRACT', submenuItem: { type: 'edit_modal' } },
          { activityName: 'DELETE_SERVICE_LEVEL_AGREEMENT_AND_CONTRACT', submenuItem: { type: 'delete' } },
          {activityName: null, submenuItem: {type: 'close', path: "/compliance-management/sla-and-contracts"}}, 
        ]
        // let status = SLAContractStore?.slaContractDetails?.versions[0]?.sla_status?.type;
        // if(status == 'End Contract' || status == 'Archive'){
        //   subMenuItems.splice(0, 1);
        // }
        this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
        this._utilityService.detectChanges(this._cdr);
      }else if (res.next_review_user_level != SlaContractWorkflowStore?.workflowDetails[SlaContractWorkflowStore?.workflowDetails?.length - 1]?.level){
        var subMenuItems = [
          {activityName:null, submenuItem: {type: 'workflow'}},
          {activityName:null, submenuItem: {type: 'history'}},
          {activityName:null,submenuItem:{type:'review_submit'}},
          {activityName:null,submenuItem:{type:'revert'}},
          { activityName: 'UPDATE_SERVICE_LEVEL_AGREEMENT_AND_CONTRACT', submenuItem: { type: 'edit_modal' } },
          { activityName: 'DELETE_SERVICE_LEVEL_AGREEMENT_AND_CONTRACT', submenuItem: { type: 'delete' } },
          {activityName: null, submenuItem: {type: 'close', path: "/compliance-management/sla-and-contracts"}}, 
        ]
        // let status = SLAContractStore?.slaContractDetails?.versions[0]?.sla_status?.type;
        // if(status == 'End Contract' || status == 'Archive'){
        //   subMenuItems.splice(0, 1);
        // }
        this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
        this._utilityService.detectChanges(this._cdr);
      }
    }else{
      var subMenuItems = [
        {activityName:null, submenuItem: {type: 'workflow'}},
        {activityName:null, submenuItem: {type: 'history'}},
        { activityName: 'UPDATE_SERVICE_LEVEL_AGREEMENT_AND_CONTRACT', submenuItem: { type: 'edit_modal' } },
        { activityName: 'DELETE_SERVICE_LEVEL_AGREEMENT_AND_CONTRACT', submenuItem: { type: 'delete' } },
        {activityName: null, submenuItem: {type: 'close', path: "/compliance-management/sla-and-contracts"}}, 
      ]
      // let status = SLAContractStore?.slaContractDetails?.versions[0]?.sla_status?.type;
      // if(status == 'End Contract' || status == 'Archive'){
      //   subMenuItems.splice(0, 1);
      // }
      this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
    }
    let status = SLAContractStore?.slaContractDetails?.versions[0]?.sla_status?.type;
    if(status == 'End Contract' || status == 'Archive'){
      SubMenuItemStore.removeSubMenu('edit_modal');
    }
  }

  isUser() {
    if(SLAContractStore?.slaDetails_loaded){
      for (let i of SLAContractStore?.slaContractDetails.workflow_items) {
        if (i.level == SLAContractStore?.slaContractDetails?.next_review_user_level) {
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

  // submitForReview(){
  //   this._slaContractWorkflowService.submitInvestigation(SLAContractStore.sla_contract_id).subscribe(res=>{
  //     SubMenuItemStore.submitClicked = false;
  //     this.getItem(SLAContractStore.sla_contract_id)
  //     this._utilityService.detectChanges(this._cdr);
  //   })
  //  }

   openHistoryPopup() {
    SlaContractWorkflowStore.setCurrentPage(1);
    this._slaContractWorkflowService.getHistory(SLAContractStore.sla_contract_id).subscribe(res => {
      this.workflowHistoryOpened = true;
      this._utilityService.detectChanges(this._cdr);
      $(this.workflowHistory.nativeElement).modal('show');
    });
  }

  openWorkflowPopup() {
    this._slaContractWorkflowService.getItems(SLAContractStore.sla_contract_id).subscribe(res => {
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
      SlaContractWorkflowStore.type = 'submit';
    }
    else
      SlaContractWorkflowStore.type = 'approve';
      SlaContractWorkflowStore.commentForm = true;
    $(this.commentModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
  }
  
  closeCommentForm() {
    this.getItem(SLAContractStore.sla_contract_id)
    SlaContractWorkflowStore.type = '';
    SlaContractWorkflowStore.commentForm = false;
    $(this.commentModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'none');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
  
    this._utilityService.detectChanges(this._cdr)
  }
  
  revertRisk() {
    SlaContractWorkflowStore.type = 'revert';
    SlaContractWorkflowStore.commentForm = true;
    $(this.commentModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
  }

  getCreatedByPopupDetails(users, created?:string){
    let userDetial: any = {};
    if(users){
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

  }

  createImageUrl(file,token) {
    return this._slaContractService.getThumbnailPreview(file, token);
  }

  downloadCertificate(document){
    this._slaContractService.downloadFile('sla-download-document', SLAContractStore?.slaContractDetails?.id, document.id, document.title, '', document);
  }

  viewCertificate(document) {
    this._slaContractService.getFilePreview('sla-contract-document', SLAContractStore?.slaContractDetails?.id, document.id).subscribe(res => {
      var resp: any = this._utilityService.getDownLoadLink(res, document.title);
      this.openPreviewModal(resp, document);
    }), (error => {
      if (error.status == 403) {
        this._utilityService.showErrorMessage('Error', 'permission_denied');
      }
      else {
        this._utilityService.showErrorMessage('Error', 'unable_to_generate_preview');
      }
    });
  }

  getPopupDetails(user) {
    if(user){
      this.userDetailObject.first_name = user?.first_name ? user?.first_name : null;
      this.userDetailObject.last_name = user?.last_name ? user?.last_name : null;
      this.userDetailObject.designation = user?.designation ? user?.designation : null;
      this.userDetailObject.image_token = user?.image?.token ? user?.image?.token : null;
      this.userDetailObject.email = user?.email ? user?.email : null;
      this.userDetailObject.mobile = user?.mobile ? user?.mobile : null;
      this.userDetailObject.id = user?.id ? user?.id : null;
      this.userDetailObject.department = user?.department ? user?.department : null;
      this.userDetailObject.status_id = user?.status?.id ? user?.status?.id : 1;
      return this.userDetailObject;
    }
  }
  
  openPreviewModal(filePreview, itemDetails) {
    let uploaded_user = null;
    let previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
    this.previewObject.component = 'sla-download-document';
    this.previewObject.file_details = itemDetails;
    this.previewObject.file_name = itemDetails.title;
    this.previewObject.id = SLAContractStore?.slaContractDetails?.id;
    this.previewObject.file_type = itemDetails.ext;
    this.previewObject.preview_url = previewItem;
    this.previewObject.size = itemDetails.size;
    this.previewObject.uploaded_user = uploaded_user;
    this.previewObject.created_at = itemDetails.created_at;
    $(this.filePreviewModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  closePreviewModal() {
    $(this.filePreviewModal.nativeElement).modal('hide');
    this.previewObject.file_name = null;
    this.previewObject.file_type = '';
    this.previewObject.preview_url = '';
  }

  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }

  deleteSLAContract(){
    this.deleteObject.id = SLAContractStore.sla_contract_id;
    this.deleteObject.type = '';
    this.deleteObject.category = 'delete';
    this.deleteObject.subtitle = "delete_sla_contract"
    $(this.deletePopup.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  clearDeleteObject() {
    this.deleteObject.id = null;
    this.deleteObject.position = null;
  }

  modalControl(status: boolean) {
    switch (this.deleteObject.type) {
      case "":
        this.delete(status);
        break;
      case 'Confirm':
        this.submitReview(status);
        break;
      case 'are_you_sure_confirm':
        this.endContract(status);
        break;

    }
  }

  submitForReview() {
    event.stopPropagation();
    this.deleteObject.type = "Confirm";
    this.deleteObject.id = SLAContractStore.sla_contract_id;
    this.deleteObject.subtitle = "submit_compliance_review";
    $(this.deletePopup.nativeElement).modal("show");
    this._utilityService.detectChanges(this._cdr);
  }

  submitReview(status) {
    if (status && this.deleteObject.id) {
      this._slaContractWorkflowService.submitInvestigation(this.deleteObject.id).subscribe(
        (resp) => {
          SubMenuItemStore.submitClicked = false;
          this._utilityService.detectChanges(this._cdr);
          this.getItem(SLAContractStore.sla_contract_id);
          this.clearDeleteObject();
        },
      ),(error)=>{
        SubMenuItemStore.submitClicked = false;
        this._utilityService.detectChanges(this._cdr);
      };
    } else {
      SubMenuItemStore.submitClicked = false;
      // $(this.deletePopup.nativeElement).modal('hide');
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('hide');
    }, 150);
  }

  delete(status: boolean) {
    if (status && this.deleteObject.id) {
      this._slaContractService.delete(this.deleteObject.id).subscribe(resp => {
        this.clearDeleteObject();
        this._router.navigateByUrl('/compliance-management/sla-and-contracts');
        this._utilityService.detectChanges(this._cdr);
      },
        (err: HttpErrorResponse) => {
          // this._utilityService.showErrorMessage('Error :', err.error.message ? err.error.message : 'something_went_wrong_try_again' );
        });
    }
    else {
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('hide');
    }, 250);
  }

  renewDocument(){
    this.documentID = SLAContractStore?.slaContractDetails?.id;
    setTimeout(() => {
      $(this.renewModal.nativeElement).modal('show');
    }, 50);
    this._utilityService.detectChanges(this._cdr);
  }

  closeRenewModal() {
    this.documentID = null;
    $(this.renewModal.nativeElement).modal('hide');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
    this.getItem(SLAContractStore.sla_contract_id);
  }

  goToHistory(){
    this.documentID = SLAContractStore?.slaContractDetails?.id;
    this._slaContractService.getHistory(this.documentID).subscribe(() => {setTimeout(() => this._utilityService.detectChanges(this._cdr), 100)});
    setTimeout(() => {
      $(this.historyModal.nativeElement).modal('show');
    }, 50);
    this._utilityService.detectChanges(this._cdr);
  }

  closeHistoryModal() {
    this.documentID = null;
    $(this.historyModal.nativeElement).modal('hide');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }

  changeZIndex(){
    if($(this.historyModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.historyModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.historyModal.nativeElement,'overflow','auto');
    }
    if($(this.formModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
    }
    if($(this.renewModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.renewModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.renewModal.nativeElement,'overflow','auto');
    }
  }

  editSLAContract(){
    SLAContractStore.sla_contract_id = null;
    this.formObject.id = SLAContractStore.sla_contract_id;
    this.formObject.type = 'Edit';
    this.formObject.values = SLAContractStore?.slaContractDetails; 
    this.formObject.values.issue_date = SLAContractStore?.slaContractDetails?.versions[0]?.issue_date;
    this.formObject.values.expiry_date = SLAContractStore?.slaContractDetails?.versions[0]?.expiry_date;
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
  }

  closeFormModal() {
    this.formObject.type = null;
    this.formObject.values = null;
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('hide');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 100)
  }

  getStatusColorKey(){
    var label_color = SLAContractStore?.slaContractDetails?.versions[0].sla_status.label.split('-');
    // var label = '#';
    // for (var i = 0; i < 6; i++){
    //     label += label_color[Math.floor(Math.random() * 16)];
    // }
    return 'draft-tag-'+label_color[0];
  }

  checkDocumentPresent(){
    let documentsPresent = false;
    for(let i of SLAContractStore?.slaContractDetails?.versions){
      if(i.token){
        documentsPresent = true;
        break;
      }
    }
    return documentsPresent;
  }

  endContractDocument(){
    this.deleteObject.id = SLAContractStore.sla_contract_id;
    this.deleteObject.type = 'are_you_sure_confirm';
    this.deleteObject.subtitle = "end_sla_contract_popup"
    $(this.deletePopup.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  endContract(status){
    if (status && this.deleteObject.id) {
      this._slaContractService.endContract(this.deleteObject.id).subscribe(resp => {
        this.clearDeleteObject();
        this.getItem(SLAContractStore.sla_contract_id);
        this._utilityService.detectChanges(this._cdr);
      },
        (err: HttpErrorResponse) => {
          // this._utilityService.showErrorMessage('Error :', err.error.message ? err.error.message : 'something_went_wrong_try_again' );
        });
    }
    else {
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('hide');
    }, 250);
  }

  getTimezoneFormatted(time){
    return this._helperService.timeZoneFormatted(time);
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

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.deleteEventSubscription.unsubscribe();
    this.documentRenewEventSubscription.unsubscribe();
    this.PreviewSubscriptionEvent.unsubscribe();
    this.slaContractSubscriptionEvent.unsubscribe();
    this.controlSlaCategorySubscriptionEvent.unsubscribe();
    this.SlaContractCommentSuvscription.unsubscribe()
    this.SlaContractWorkflowSubscription.unsubscribe()
    this.SlaContractWorkflowHistorySubscription.unsubscribe()
  }

}
