import { Component, OnInit, OnDestroy,ChangeDetectorRef,ElementRef,ViewChild,Renderer2 } from '@angular/core';
import { IReactionDisposer,autorun,toJS } from 'mobx';
import {  Router } from '@angular/router';
import { CyberIncidentService } from 'src/app/core/services/cyber-incident/cyber-incident.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { CyberIncidentStore } from 'src/app/stores/cyber-incident/cyber-incident-store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthStore } from 'src/app/stores/auth.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
declare var $: any;
@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit,OnDestroy {
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('formModal') formModal: ElementRef;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  @ViewChild('workflowHistory') workflowHistory: ElementRef;
  @ViewChild('workflowModal') workflowModal: ElementRef;
  @ViewChild('commentModal') commentModal: ElementRef;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore=SubMenuItemStore;
  CyberIncidentStore=CyberIncidentStore;
  AuthStore = AuthStore;
  OrganizationGeneralSettingsStore=OrganizationGeneralSettingsStore;
  BreadCrumbMenuItemStore=BreadCrumbMenuItemStore;
  fileUploadPopupStore=fileUploadPopupStore;
  workflowHistoryOpened:boolean=false;
  workflowModalOpened:boolean=false;
  commentForm:boolean=false;
  AppStore=AppStore;
  deleteObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    file_name:null,
    file_type:'',
    created_at: "",
    component: "",
    componentId: null,
  };
  incidentObject = {
    values: null,
    type: null
  };
  addIncidentSubscription: any = null;
  deletePopupScubscription: any;
  incidentWorkflowHistorySubscription:any;
  incidentWorkflowCommentSubscription:any;
  approveCommentSubscription:any;
  previewSubscriptionEvent:any;
  emptyMessage="No documents added";
  constructor(private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _router:Router,
    private _sanitizer: DomSanitizer,
    private _cyberIncidentService:CyberIncidentService,
    private _imageService: ImageServiceService,
    private _documentFileService: DocumentFileService,
    private _eventEmitterService: EventEmitterService,) { }

  ngOnInit(): void {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    if(!BreadCrumbMenuItemStore.refreshBreadCrumbMenu){
      BreadCrumbMenuItemStore.makeEmpty();
      BreadCrumbMenuItemStore.addBreadCrumbMenu({
        name:"incident",
        path:`/cyber-incident/cyber-incidents`
      });
    }
    this.reactionDisposer = autorun(() => {
      
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            this.createIncident();
            break;
          case "delete":
            this.deleteIncident(CyberIncidentStore?.incidentId);
            break;
          case "history": 
          this.openHistoryPopup();
              break;
          case "workflow": 
          this.openWorkflowPopup();
              break;
          case 'submit':
            this.submitProjectForReview();
            SubMenuItemStore.submitClicked = true;
              break
          case 'approve':
            this.approveWorkflow();
            break
          case 'review_submit':
                this.approveWorkflow(true);
              break
          case 'revert':
                this.revertWorkflow();
              break;
          case 'reject':
            this.rejectWorkflow();
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })
    this.addIncidentSubscription = this._eventEmitterService.addCyberIncidentModal.subscribe(res => {
      this.closeFormModal();
    })
    this.deletePopupScubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    this.incidentWorkflowHistorySubscription = this._eventEmitterService.cyberIncidentWorkflowHistory.subscribe(element=>{
      this.closeHistoryPopup();
    })
    this.incidentWorkflowCommentSubscription = this._eventEmitterService.cyberIncidentWorkflow.subscribe(element=>{
      this.closeWorkflowPopup();
    })
    this.previewSubscriptionEvent = this._eventEmitterService.cyberIncidentFilePreview.subscribe(res => {
      this.closePreviewModal();
    })
    this.approveCommentSubscription = this._eventEmitterService.cyberIncidentCommentModal.subscribe(res => {
      this.closeCommentForm();
      this.getDetails();
        
    })
    this.getDetails();
  }
  getDetails()
  {
    this._cyberIncidentService.getItem(CyberIncidentStore?.incidentId).subscribe(res => {
      this.getWorkflow();
      this._utilityService.detectChanges(this._cdr);
    })
  }
  setSubMenu()
  {
    if(CyberIncidentStore.cyberIncidentDetails?.next_review_user_level==1&&CyberIncidentStore.cyberIncidentDetails?.submitted_by==null && 
      CyberIncidentStore.cyberIncidentDetails?.cyber_incident_status?.type!='closed' 
      && (AuthStore.isRoleChecking('super-admin')||  CyberIncidentStore?.cyberIncidentDetails?.created_by?.id==AuthStore.user.id)){
      var subMenuItems =[]
       subMenuItems = [
        {activityName:'', submenuItem: {type: 'workflow',title : ''}},
        {activityName:'', submenuItem: {type: 'history',title : ''}},
        {activityName:'',submenuItem:  {type:'submit',title : ''}}
        
      ]
      if(CyberIncidentStore.cyberIncidentDetails?.cyber_incident_status?.type=='new' || CyberIncidentStore.cyberIncidentDetails?.cyber_incident_status?.type=='send-back')
      {
        subMenuItems.push({ activityName:'', submenuItem: { type: 'edit_modal',title : '' } })
      }
      subMenuItems.push( {activityName: null, submenuItem: {type: 'close', path: "../",title : ''}})
      this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);  
      this._utilityService.detectChanges(this._cdr);
    }   else if(CyberIncidentStore.cyberIncidentDetails?.submitted_by!=null && CyberIncidentStore.cyberIncidentDetails?.next_review_user_level && this.isUser()){
      if (CyberIncidentStore.cyberIncidentDetails?.next_review_user_level == CyberIncidentStore?.workflowDetails[CyberIncidentStore?.workflowDetails?.length - 1]?.level){
        var subMenuItems =[]
         subMenuItems = [
          {activityName:'', submenuItem: {type: 'workflow',title : ''}},
          {activityName:'', submenuItem: {type: 'history',title : ''}},
          {activityName:'',submenuItem:{type:'approve',title : ''}},
          {activityName:'',submenuItem:{type:'revert',title:'Send Back'}},
          {activityName:'',submenuItem:{type:'reject',title:''}},

          {activityName:null, submenuItem: {type: 'close', path: '../',title : ''}}
        ]
        this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
        this._utilityService.detectChanges(this._cdr);
      }
      else if (CyberIncidentStore.cyberIncidentDetails?.next_review_user_level != CyberIncidentStore?.workflowDetails[CyberIncidentStore?.workflowDetails?.length - 1]?.level){
        var subMenuItems=[];
         subMenuItems  = [
          {activityName:'', submenuItem: {type: 'workflow',title : ''}},
          {activityName:'', submenuItem: {type: 'history',title : ''}},
          {activityName:'',submenuItem:{type:'approve',title : ''}},
          {activityName:'',submenuItem:{type:'revert',title:'Send Back'}},
          {activityName:'',submenuItem:{type:'reject',title:''}},
          {activityName:null, submenuItem: {type: 'close', path: '../',title : ''}}
        ]
        this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
        this._utilityService.detectChanges(this._cdr);
      } 
      
    }else if (CyberIncidentStore.cyberIncidentDetails?.next_review_user_level == null && CyberIncidentStore.cyberIncidentDetails?.submitted_by!=null){
      var subMenuItems=[];
       subMenuItems  = [
        {activityName:'', submenuItem: {type: 'workflow',title : ''}},
        {activityName:'', submenuItem: {type: 'history',title : ''}},
        {activityName:null, submenuItem: {type: 'close', path: '../',title : ''}}
      ]
      this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
      this._utilityService.detectChanges(this._cdr);
    }
    
    else{
      var subMenuItems=[];
         subMenuItems = [
          {activityName:'', submenuItem: {type: 'workflow',title : ''}},
          {activityName:'', submenuItem: {type: 'history',title : ''}},
          // {activityName: '', submenuItem: {type: 'edit_modal',title : ''}},
        ]
        if(CyberIncidentStore.cyberIncidentDetails?.cyber_incident_status?.type=='new' || CyberIncidentStore.cyberIncidentDetails?.cyber_incident_status?.type=='send-back')
        {
          subMenuItems.push({ activityName:'', submenuItem: { type: 'edit_modal',title : '' } })
        }
        subMenuItems.push( {activityName: null, submenuItem: {type: 'close', path: "../",title : ''}})
        this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
      }
  }

  isUser() {
    if(CyberIncidentStore?.individualLoaded){
      for (let i of CyberIncidentStore?.cyberIncidentDetails.work_flow_items) {
        if (i.level == CyberIncidentStore?.cyberIncidentDetails?.next_review_user_level) {
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
  openHistoryPopup()
  {
    CyberIncidentStore.setCurrentWorkflowHistoryPage(1);
    this._cyberIncidentService.getHistory(CyberIncidentStore?.incidentId).subscribe(res => {
      this.workflowHistoryOpened = true;
      this._utilityService.detectChanges(this._cdr);
      $(this.workflowHistory.nativeElement).modal('show');
    });
  }
  closeHistoryPopup() {
    this.workflowHistoryOpened = false;
    $(this.workflowHistory.nativeElement).modal('hide');
  }
  openWorkflowPopup()
  {
    this._cyberIncidentService.getWorkflowItems(CyberIncidentStore?.incidentId).subscribe(res => {
      this.workflowModalOpened = true;
      this._utilityService.detectChanges(this._cdr);
      $(this.workflowModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.workflowModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.workflowModal.nativeElement, 'overflow', 'auto');
    })
  }
  closeWorkflowPopup() {
    this.workflowModalOpened = false;
    $(this.workflowModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.workflowModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.workflowModal.nativeElement, 'overflow', 'none');
    $('.modal-backdrop').remove();
  }
  getUsrDetails(users, created?: string) { //user popup
    
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
  closeFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);

    }, 100);
    this._renderer2.removeClass(this.formModal.nativeElement, 'show');
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '9999');
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'none');
    this.incidentObject.type = null;
  }

  createIncident() {
    this.incidentObject.type = 'Edit';
    this.incidentObject.values = toJS(CyberIncidentStore?.cyberIncidentDetails); // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();

  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
    this._renderer2.addClass(this.formModal.nativeElement, 'show');
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '99999');
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto')
  }
  deleteIncident(id)
  {
    
    this.deleteObject.id = id;
    this.deleteObject.title = 'Delete';
    this.deleteObject.type = 'Delete';
    this.deleteObject.subtitle = 'delete_cyber_incident';
    $(this.deletePopup.nativeElement).modal('show');
  }
  modalControl(status: boolean) {

    switch (this.deleteObject.title) {
      case 'Delete': this.deleteItem(status);
        break;
      case 'submit': this.submitAccepted(status)
        break;
      
    }
  }
  deleteItem(status) {
    let type;
    if (status && this.deleteObject.id) {
      switch (this.deleteObject.type) {
        case '': type = this._cyberIncidentService.delete(this.deleteObject.id);
          break;
      }
      type.subscribe(resp => {
        this.closeConfirmationPopUp();
        this._router.navigateByUrl('/cyber-incident/cyber-incidents');
        // setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
        this.clearDeleteObject();
      }, (error => {
        this.closeConfirmationPopUp();
        setTimeout(() => {
          if (error.status == 405) {
            // this.deactivate(this.deleteObject.id);
            this._utilityService.detectChanges(this._cdr);
          }
        }, 100);

      }));
    }
    else {
      this.closeConfirmationPopUp();
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('hide');
    }, 250);

  }

  submitAccepted(status){
    if(status){
      this._cyberIncidentService.submitIncident(CyberIncidentStore.incidentId).subscribe(res=>{
        SubMenuItemStore.submitClicked = false;
        this.getDetails()
        this._utilityService.detectChanges(this._cdr);
        this.closeConfirmationPopUp();
        this.clearDeleteObject();
      },
      (error)=>{
        SubMenuItemStore.submitClicked = false;
        this.closeConfirmationPopUp();
        this.clearDeleteObject();
      })
      
    }else{
      SubMenuItemStore.submitClicked = false;
      this.closeConfirmationPopUp();
        this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('hide');
    }, 250);
   }
  closeConfirmationPopUp() {
    // setTimeout(() => {
    $(this.deletePopup.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
    // }, 250);
  }
  clearDeleteObject() {
    this.deleteObject.id = null;
    this.deleteObject.title = '';
    this.deleteObject.type = null;
    this.deleteObject.subtitle = '';
  }
  getNoDataSource(type){
    let noDataSource = {
      noData: this.emptyMessage, border: false, imageAlign: type
    }
    return noDataSource;
  }
  createImageUrl(type, token) {
    if (type == 'document-version')
      return this._documentFileService.getThumbnailPreview(type, token);
    else
      return this._cyberIncidentService.getThumbnailPreview(type, token);
  }

  viewBrochureItem(type, documents, documentFile) {

    switch (type) {
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
  
      case 'cyber_incident':
        this._cyberIncidentService.getPreview('cyber_incident', documents.cyber_incident_id, documentFile).subscribe(res => {
          var resp: any = this._utilityService.getDownLoadLink(res, documents.title);
          this.openPreviewModal(type, resp, documents, documentFile);
        }), (error => {
          if (error.status == 403) {
            this._utilityService.showErrorMessage('error', 'permission_denied');
          }
          else {
            this.openPreviewModal(type, null, documents, documentFile);
          }
        });
        break;
  
      default:
        break;
    }
  
  
  }
  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType)
  }
  downloadDocumentFile(type, document, docs?) {
    event.stopPropagation();
    switch (type) {
      case "cyber_incident":
        this._cyberIncidentService.downloadFile(
          document.cyber_incident_id,
          type,
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
  
    openPreviewModal(type, filePreview, documentFiles, document) {
      this.previewObject.component=type;
  
      let previewItem = null;
      if (filePreview) {
        previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
        this.previewObject.preview_url = previewItem;
        this.previewObject.file_details = documentFiles;
        this.previewObject.componentId = documentFiles.incident_id;
        
        this.previewObject.uploaded_user = CyberIncidentStore.cyberIncidentDetails.created_by;
        this.previewObject.created_at = document.created_at;
        $(this.filePreviewModal.nativeElement).modal("show");
        this._utilityService.detectChanges(this._cdr);
      }
    }
    getArrayFormatedString(type,items){
      
      return this._helperService.getArraySeperatedString(',',type,items);
    }
    closePreviewModal($event?) {
      $(this.filePreviewModal.nativeElement).modal('hide');
      this.previewObject.file_name = null;
      this.previewObject.file_type = '';
      this.previewObject.preview_url = '';
    }
    getWorkflow() {
      this._cyberIncidentService.getWorkflowItems(CyberIncidentStore?.incidentId).subscribe(res=>{
        this.setSubMenu()
        this._utilityService.detectChanges(this._cdr);
      })
    }
    approveWorkflow(type?) {
      if (type) {
        CyberIncidentStore.type = 'submit';
      }
      else
      CyberIncidentStore.type = 'approve';
      this.commentForm = true;
      $(this.commentModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
      this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
      this._utilityService.detectChanges(this._cdr);
    }
    
    closeCommentForm() {
      CyberIncidentStore.type = '';
      this.commentForm = false;
      $(this.commentModal.nativeElement).modal('hide');
      this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 9);
      this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'none');
      this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'none');
      $('.modal-backdrop').remove();
    
      this._utilityService.detectChanges(this._cdr)
    }
    revertWorkflow() {
      CyberIncidentStore.type = 'revert';
      this.commentForm = true;
      $(this.commentModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
      this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
      this._utilityService.detectChanges(this._cdr);
    }
    
    
    rejectWorkflow() {
      CyberIncidentStore.type = 'reject';
      this.commentForm = true;
      $(this.commentModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
      this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
      this._utilityService.detectChanges(this._cdr);
    }
    submitProjectForReview(){
      this.deleteObject.type = 'Confirm';
      this.deleteObject.title = 'submit';
      this.deleteObject.subtitle = 'Are you sure want to submit';
      setTimeout(() => {
        $(this.deletePopup.nativeElement).modal('show');
      }, 100);
      this._utilityService.detectChanges(this._cdr);
  
    }
    removeDot(data){
      return data.split('-')[0];
    }
  ngOnDestroy(): void {
    //CyberIncidentStore.unsetSelectedItemDetails();
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.deletePopupScubscription.unsubscribe();
    this.addIncidentSubscription.unsubscribe();
    this.previewSubscriptionEvent.unsubscribe();
    this.incidentWorkflowHistorySubscription.unsubscribe();
    this.incidentWorkflowCommentSubscription.unsubscribe();
    this.approveCommentSubscription.unsubscribe();
  }

}
