import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { IncidentFileService } from 'src/app/core/services/incident-management/incident-file-service/incident-file.service';
import { IncidentInfoWorkflowService } from 'src/app/core/services/incident-management/incident-info-workflow/incident-info-workflow.service';
import { IncidentWorkflowService } from 'src/app/core/services/incident-management/incident-workflow/incident-workflow.service';
import { IncidentService } from 'src/app/core/services/incident-management/incident/incident.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IncidentInfoWorkflowStore } from 'src/app/stores/incident-management/incident-workflow/incident-info-workflow.store';
import { IncidentStore } from 'src/app/stores/incident-management/incident/incident-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
declare var $: any;


@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  reactionDisposer: IReactionDisposer
 @ViewChild('othersPopup') othersPopup: ElementRef;
 @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
 @ViewChild('confirmationPopUps') confirmationPopUps: ElementRef;
 @ViewChild("personInvolvedDetails") personInvolvedDetails: ElementRef;
 @ViewChild("personInvolvedOtherDetails") personInvolvedOtherDetails: ElementRef;
 @ViewChild("personWitnessInvolvedDetails") personWitnessInvolvedDetails: ElementRef;
 @ViewChild("personWitnessInvolvedOtherDetails") personWitnessInvolvedOtherDetails: ElementRef;
 @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
 @ViewChild('commentModal') commentModal: ElementRef;
 @ViewChild('workflowModal') workflowModal: ElementRef;
 @ViewChild('workflowHistory') workflowHistory: ElementRef;
 @ViewChild('loaderPopUp') loaderPopUp: ElementRef;

  SubMenuItemStore = SubMenuItemStore;
  IncidentStore = IncidentStore;
  AppStore = AppStore;
  AuthStore = AuthStore
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  IncidentInfoWorkflowStore = IncidentInfoWorkflowStore
  otherUsers: any;
  otherUserSubscription: any;
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
  involvedPersonObject = {
    type : null
  };
  involvedWitnessPersonObject = {
    type : null
  };
  involvedOtherPersonObject = {
    type : null
  };
  involvedWitnessOtherPersonObject = {
    type : null
  };
  deleteObject = {
    id: null,
    title: '',
    type: '',
    subtitle:''
  };
  popupControlEventSubscription: any;

  page = 'incident'
  submitMessage: string = 'submitting';
  addInvolvedPersonOtherSubscription: any;
  addWitnessPersonOtherSubscription: any;
  InvolvedWitnessPersonSubscription: any;
  InvolvedPersonSubscription: any;
  deleteEventSubscription: any;
  networkFailureSubscription: any;
	idleTimeoutSubscription: any;
  workflowModalOpened: boolean=false;
  workflowHistoryOpened=false
  IncidentInfoCommentSuvscription: any;
  IncidentInfoWorkflowSubscription: any;
  IncidentWorkflowHistorySubscription: any;



  constructor( private _activatedRouter: ActivatedRoute,private  _cdr: ChangeDetectorRef, 
              private _utilityService: UtilityService,private _route: Router,private _sanitizer: DomSanitizer,
              private _incidentService : IncidentService,    private _incidentFileService : IncidentFileService,
              private _imageService: ImageServiceService,private _eventEmitterService: EventEmitterService,
              private _helperService: HelperServiceService,private _renderer2: Renderer2,
              private _incidentWorkflowService:IncidentInfoWorkflowService,
			  private _documentFileService: DocumentFileService
              
              ) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
      if(IncidentStore.IncidentItemDetails && IncidentStore.individualLoaded && IncidentInfoWorkflowStore.workflowDetails){
        this.setSubMenu(IncidentStore.individualIncidentItem);
      }

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            this.editIncidentItem()
            break;
            case "delete":
              this.delete()
              break;
            case 'submit':
            this.submitForReview();
            SubMenuItemStore.submitClicked = true;
            break
            case 'approve':
          this.approveRisk();
          break
          case 'history':
          this.openHistoryPopup();
          break
          case 'workflow':
          this.openWorkflowPopup();
          break
        case 'review_submit':
          this.approveRisk(true);
          break
          case 'revert':
            // SubMenuItemStore.submitClicked = true;
            this.revertRisk();
            break
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      // setting submenu items
  
    })

    this.otherUserSubscription = this._eventEmitterService.otherUsersModalControl.subscribe(element=>{
      this.closeassignOtherUsers();
    })
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    this.addInvolvedPersonOtherSubscription = this._eventEmitterService.personInvolvedAddDetailModalControl.subscribe(element => {
      this.closeInvolvedPersonOtherDetails();
    })

    this.addWitnessPersonOtherSubscription = this._eventEmitterService.witnessAddDetailsModalControl.subscribe(element=>{
      this.closeInvolvedWitnessPersonOtherDetails()
    })

    this.InvolvedWitnessPersonSubscription = this._eventEmitterService.InvolvedWitnessAddDetailsModalControl.subscribe(element=>{
      this.closeInvolvedWitnessPersonDetails()
    })

    this.InvolvedPersonSubscription = this._eventEmitterService.InvolvedPersonAddDetailModalControl.subscribe(element=>{
      this.closeInvolvedPersonDetails();

    })
    this.IncidentInfoCommentSuvscription = this._eventEmitterService.IncidentInfoWorkflowCommentModal.subscribe(element=>{
      this.closeCommentForm();

    })

    this.IncidentInfoWorkflowSubscription = this._eventEmitterService.IncidentInfoWorkflow.subscribe(element=>{
      this.closeWorkflowPopup();

    })
    this.IncidentWorkflowHistorySubscription = this._eventEmitterService.IncidentInfoHistory.subscribe(element=>{
      this.closeHistoryPopup();

    })
    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.deletes(item);
    });
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
     this.getIncidentDetails(IncidentStore.selectedId);
    //  this.getWorkflowDetails();
  }

  getWorkflowDetails(){
    this._incidentWorkflowService.getItems(IncidentStore.selectedId).subscribe(res => {
      // this.setSubMenu(IncidentStore.individualIncidentItem);
      this._utilityService.detectChanges(this._cdr);
    })
  }



  submitAccepted(status){
    if(status){
      this._incidentWorkflowService.submitInvestigation(IncidentStore.selectedId).subscribe(res=>{
        SubMenuItemStore.submitClicked = false;
        this.getIncidentDetails(IncidentStore.selectedId)
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
      $(this.confirmationPopUps.nativeElement).modal('hide');
    }, 250);
   }

   submitForReview(){
    this.popupObject.type = 'are_you_sure_confirm';
    this.popupObject.title = 'submit';
    this.popupObject.subtitle = 'submit_incident';
    setTimeout(() => {
      $(this.confirmationPopUps.nativeElement).modal('show');
    }, 100);
    this._utilityService.detectChanges(this._cdr);

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

  openHistoryPopup() {
    IncidentInfoWorkflowStore.setCurrentPage(1);
    this._incidentWorkflowService.getHistory(IncidentStore.selectedId).subscribe(res => {
      this.workflowHistoryOpened = true;
      this._utilityService.detectChanges(this._cdr);
      $(this.workflowHistory.nativeElement).modal('show');
    });
  }

  openWorkflowPopup() {
    this._incidentWorkflowService.getItems(IncidentStore.selectedId).subscribe(res => {
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
      IncidentInfoWorkflowStore.type = 'submit';
    }
    else
      IncidentInfoWorkflowStore.type = 'approve';
      IncidentInfoWorkflowStore.commentForm = true;
    $(this.commentModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
    // this._riskInfoWorkflowService.approveRisk(RisksStore.riskId,{}).subscribe(res=>{
    //   this._risksService.getItem(RisksStore.riskId).subscribe(()=>this._utilityService.detectChanges(this._cdr))
  
    //   this._utilityService.detectChanges(this._cdr);
    // })
  }
  
  closeCommentForm() {
    this.getIncidentDetails(IncidentStore.selectedId)
    IncidentInfoWorkflowStore.type = '';
    IncidentInfoWorkflowStore.commentForm = false;
    $(this.commentModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'none');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
  
    this._utilityService.detectChanges(this._cdr)
  }
  
  revertRisk() {
    IncidentInfoWorkflowStore.type = 'revert';
    IncidentInfoWorkflowStore.commentForm = true;
    $(this.commentModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
  }

  getIncidentDetails(id){
    this._incidentService.getItem(id).subscribe(res=>{
      var evidenceDetails = res;
      if(evidenceDetails.documents.length > 0){
        for(let evidence of evidenceDetails.documents){
          let evidencePreviewUrl = this._incidentFileService.getThumbnailPreview('incident-item',evidence.token);
          let brochureDetails = {
              name: evidence.title, 
              title : evidence.title,
              ext: evidence.ext,
              size: evidence.size,
              url: evidence.url,
              thumbnail_url: evidence.url,
              token: evidence.token,
              preview: evidencePreviewUrl,
              id: evidence.id,
          };
          this._incidentService.setDocumentDetails(brochureDetails,evidencePreviewUrl);
        }
        // this.checkForFileUploadsScrollbar();
      }
      this.getWorkflowDetails();
      this._utilityService.detectChanges(this._cdr);
    })
  }

  setSubMenu(res){
    if(res.next_review_user_level==1&&res.submitted_by==null){
      let subMenuItems = [
        // {activityName:'LIST_INCIDENT_WORKFLOW_HISTORY', submenuItem: {type: 'history'}},
        {activityName:'SUBMIT_INCIDENT',submenuItem:{type:'submit'}},
        {activityName:'INCIDENT_WORKFLOW_LIST_ACTIVITY_LOGS', submenuItem: {type: 'workflow'}},
        {activityName:'LIST_INCIDENT_WORKFLOW_HISTORY', submenuItem: {type: 'history'}},
        {activityName: 'UPDATE_INCIDENT', submenuItem: {type: 'edit_modal'}},
        {activityName: 'DELETE_INCIDENT', submenuItem: {type: 'delete'}},
        {activityName:null, submenuItem: {type: 'close', path: '../incidents'}}
      ]
      this._helperService.checkSubMenuItemPermissions(3800, subMenuItems);
    }else if(res.submitted_by!=null && res.next_review_user_level && this.isUser()){
      if (res?.next_review_user_level == IncidentInfoWorkflowStore?.workflowDetails[IncidentInfoWorkflowStore?.workflowDetails?.length - 1]?.level){
        let subMenuItems = [
          {activityName:'INCIDENT_WORKFLOW_LIST_ACTIVITY_LOGS', submenuItem: {type: 'workflow'}},
          {activityName:'LIST_INCIDENT_WORKFLOW_HISTORY', submenuItem: {type: 'history'}},
          {activityName:'APPROVE_INCIDENT',submenuItem:{type:'approve'}},
          {activityName:'REVERT_INCIDENT',submenuItem:{type:'revert'}},
          {activityName: 'UPDATE_INCIDENT', submenuItem: {type: 'edit_modal'}},
          {activityName: 'DELETE_INCIDENT', submenuItem: {type: 'delete'}},
          {activityName:null, submenuItem: {type: 'close', path: '../incidents'}}
        ]
        this._helperService.checkSubMenuItemPermissions(3800, subMenuItems);
        this._utilityService.detectChanges(this._cdr);
      }
      else if (res.next_review_user_level != IncidentInfoWorkflowStore?.workflowDetails[IncidentInfoWorkflowStore?.workflowDetails?.length - 1]?.level){
        let subMenuItems = [
          {activityName:'INCIDENT_WORKFLOW_LIST_ACTIVITY_LOGS', submenuItem: {type: 'workflow'}},
          {activityName:'LIST_INCIDENT_WORKFLOW_HISTORY', submenuItem: {type: 'history'}},
          {activityName:'SUBMIT_INCIDENT', submenuItem: {type: 'review_submit'}},
          {activityName:'REVERT_INCIDENT',submenuItem:{type:'revert'}},
          {activityName: 'UPDATE_INCIDENT', submenuItem: {type: 'edit_modal'}},
          {activityName: 'DELETE_INCIDENT', submenuItem: {type: 'delete'}},
          {activityName:null, submenuItem: {type: 'close', path: '../incidents'}}
        ]
        this._helperService.checkSubMenuItemPermissions(3800, subMenuItems);
        this._utilityService.detectChanges(this._cdr);
      }
    }else{
      let subMenuItems = [
        {activityName:'INCIDENT_WORKFLOW_LIST_ACTIVITY_LOGS', submenuItem: {type: 'workflow'}},
        {activityName:'LIST_INCIDENT_WORKFLOW_HISTORY', submenuItem: {type: 'history'}},
        {activityName:null, submenuItem: {type: 'close', path: '../incidents'}}
      ]
      this._helperService.checkSubMenuItemPermissions(3800, subMenuItems);
    }
  }

  isUser() {
    if(IncidentStore?.individualLoaded){
      for (let i of IncidentStore?.IncidentItemDetails.workflow_items) {
        if (i.level == IncidentStore?.IncidentItemDetails?.next_review_user_level) {
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

  changeZIndex(){
		if($(this.personInvolvedDetails.nativeElement).hasClass('show')){
		  this._renderer2.setStyle(this.personInvolvedDetails.nativeElement,'z-index',999999);
		  this._renderer2.setStyle(this.personInvolvedDetails.nativeElement,'overflow','auto');
		}
		if($(this.personInvolvedOtherDetails.nativeElement).hasClass('show')){
		  this._renderer2.setStyle(this.personInvolvedOtherDetails.nativeElement,'z-index',999999);
		  this._renderer2.setStyle(this.personInvolvedOtherDetails.nativeElement,'overflow','auto');
		}
    if($(this.personWitnessInvolvedDetails.nativeElement).hasClass('show')){
		  this._renderer2.setStyle(this.personWitnessInvolvedDetails.nativeElement,'z-index',999999);
		  this._renderer2.setStyle(this.personWitnessInvolvedDetails.nativeElement,'overflow','auto');
		}
    if($(this.personWitnessInvolvedOtherDetails.nativeElement).hasClass('show')){
		  this._renderer2.setStyle(this.personWitnessInvolvedOtherDetails.nativeElement,'z-index',999999);
		  this._renderer2.setStyle(this.personWitnessInvolvedOtherDetails.nativeElement,'overflow','auto');
		}
	  }

  editIncidentItem(){
    event.stopPropagation();
    this._incidentService.getItem(IncidentStore.selectedId).subscribe(res=>{
      this._route.navigateByUrl('/incident-management/edit-incident');
      this._utilityService.detectChanges(this._cdr)
    });

  }

    // modal control event
    modalControl(status: boolean) {
      switch (this.popupObject.type) {
        case '': this.deleteIncident(status)
          break;
        case 'are_you_sure_confirm': this.submitAccepted(status)
          break;
      }
  
    }

    closeLoaderPopUp() {
      setTimeout(() => {
        $(this.loaderPopUp.nativeElement).modal('hide');
      }, 250);
    }

       // for delete
       delete() {
        event.stopPropagation();
        this.popupObject.type = '';
        this.popupObject.id = IncidentStore.selectedId;
        this.popupObject.title = 'delete';
        this.popupObject.subtitle = 'delete_incident';
        this._utilityService.detectChanges(this._cdr);
        $(this.confirmationPopUps.nativeElement).modal('show');
    
      }

       // delete function call
  deleteIncident(status: boolean) {
    if (status && this.popupObject.id) {
      this._incidentService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this._route.navigateByUrl('/incident-management/incidents');
        this._utilityService.detectChanges(this._cdr)
        this.clearPopupObject();
      });
    }
    else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUps.nativeElement).modal('hide');
    }, 250);

  }

    // for popup object clearing
    clearPopupObject() {
      this.popupObject.id = null;
      this.popupObject.title = '';
      this.popupObject.subtitle = '';
      this.popupObject.type = '';
  
    }

  assignUserValues(user) {
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

    userInfoObject.first_name = user?.first_name?user?.first_name:user?.user?.first_name;
    userInfoObject.last_name = user?.last_name?user?.last_name:user?.user?.last_name;
    userInfoObject.designation = user?.designation_title ? user?.designation_title: user?.designation ? user?.designation: user?.user?.designation ? user?.user?.designation?.title: null;
    userInfoObject.image_token = user?.image_token ? user?.image_token : user?.image ? user?.image?.token : user?.user ? user?.user?.image_token:null;
    userInfoObject.email = user?.email;
    userInfoObject.mobile = user?.mobile;
    userInfoObject.id = user?.id;
    userInfoObject.status_id = user?.status_id
    userInfoObject.department = user?.department? user?.department: user?.user?.department?.title ? user?.user?.department?.title: null;
     return userInfoObject;
  }
  }

    // Returns default image
    getDefaultImage(type) {
      return this._imageService.getDefaultImageUrl(type);
    }
  
    createPreviewUrl(type, token) {
      return this._incidentFileService.getThumbnailPreview(type, token)
    }
  
  
    // Returns image url according to type and token
    createImageUrl(type, token) {

		if (type == 'document-version')
      return this._documentFileService.getThumbnailPreview(type, token);
    else
      return this._incidentFileService.getThumbnailPreview(type, token);
    }

    
  // extension check function
  checkExtension(ext, extType) {

    return this._imageService.checkFileExtensions(ext, extType)
   
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

      case 'incident-item':
        this._incidentFileService.getFilePreview('incident-item', documents.incident_id, documentFile).subscribe(res => {
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

  involvedOthers(){
    let item = IncidentStore.IncidentItemDetails?.involved_other_users.slice(0,2)
    return item
   }
 
   othersWitness(){
     let item = IncidentStore.IncidentItemDetails?.witness_other_users.slice(0,2)
     return item
    }

    openOtherInvolvedPerson(){
      this.assignOtherUsers(IncidentStore.IncidentItemDetails?.involved_other_users);
     }
   
     openOthersWitnessModel(){
       this.assignOtherUsers(IncidentStore.IncidentItemDetails?.witness_other_users);
   
     }
   
     closeassignOtherUsers(){
      //  $(this.othersPopup.nativeElement).modal('show');
     }
   
     assignOtherUsers(users){
      IncidentStore.setOthersItems(users)
       this._utilityService.detectChanges(this._cdr);
      //  setTimeout(() => {
      //   $(this.othersPopup.nativeElement).modal('show');  
         
      //  }, 500);
     }

       // for downloading files

  downloadDocumentFile(type, document, docs?) {
    event.stopPropagation();
    switch (type) {
      case "incident-item":
        this._incidentFileService.downloadFile(
          type,
          document.incident_id,
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

//    // for file preview

//    viewIncidentDocument( incidentDocument) {
//     this._incidentFileService.getFilePreview(incidentDocument).subscribe(res=>{
//       var resp: any = this._utilityService.getDownLoadLink(
//         res,
//         incidentDocument.name
//       );
//       this.openPreviewModal(resp, incidentDocument);
//     }),
//     (error) => {
//       if (error.status == 403) {
//         this._utilityService.showErrorMessage(
//           "Error",
//           "permission_denied"
//         );
//       } else {
//         this._utilityService.showErrorMessage(
//           "Error",
//           "unable_generate_preview"
//         );
//       }
//     };
//   }

  // kh-module base document
  openPreviewModal(type, filePreview, documentFiles, document) {
    this.previewObject.component=type;
  
    let previewItem = null;
    if (filePreview) {
      previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
      this.previewObject.preview_url = previewItem;
      this.previewObject.file_details = documentFiles;
      this.previewObject.componentId = documentFiles.incident_id;
      
      this.previewObject.uploaded_user = IncidentStore.IncidentItemDetails.created_by;
      document.updated_by ? document.updated_by : document.created_by;
      this.previewObject.created_at = document.created_at;
      $(this.filePreviewModal.nativeElement).modal("show");
      this._utilityService.detectChanges(this._cdr);
    }
  }

  closePreviewModal(event) {
    $(this.filePreviewModal.nativeElement).modal("hide");
    this.previewObject.preview_url = "";
    this.previewObject.uploaded_user = null;
    this.previewObject.created_at = "";
    this.previewObject.file_details = null;
    this.previewObject.componentId = null;
  }

  setEvidence(){
    
  }

  addInvolvedPersonDetails(){
    this.involvedPersonObject.type ='Add';
      setTimeout(() => {
        $('.modal-backdrop').add();
        document.body.classList.add('modal-open')
        this._renderer2.setStyle(this.personInvolvedDetails.nativeElement, 'display', 'block');
        // this._renderer2.setStyle(this.controlDetails.nativeElement, 'z-index', 999999);
        this._renderer2.removeAttribute(this.personInvolvedDetails.nativeElement, 'aria-hidden');
        this._renderer2.addClass(this.personInvolvedDetails.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 250);
  }
  closeInvolvedPersonDetails() {
    this.involvedPersonObject.type = null
    $(this.personInvolvedDetails.nativeElement).modal('hide');
    this.getIncidentDetails(IncidentStore.selectedId)
  
    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr);
    },250);
  }
  addInvolvedWitnessPersonDetails(){
    this.involvedWitnessPersonObject.type ='Add';
    $('.modal-backdrop').add();
    document.body.classList.add('modal-open')
     
  
      setTimeout(() => {
        this._renderer2.setStyle(this.personWitnessInvolvedDetails.nativeElement, 'display', 'block');
        // this._renderer2.setStyle(this.controlDetails.nativeElement, 'z-index', 999999);
        this._renderer2.removeAttribute(this.personWitnessInvolvedDetails.nativeElement, 'aria-hidden');
        this._renderer2.addClass(this.personWitnessInvolvedDetails.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 100);
  }
  closeInvolvedWitnessPersonDetails() {
    this.involvedWitnessPersonObject.type = null
    $(this.personWitnessInvolvedDetails.nativeElement).modal('hide');
    this.getIncidentDetails(IncidentStore.selectedId)
  
    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr);
    },250);
  }
  
  addInvolvedPersonOtherDetails(){
    this.involvedOtherPersonObject.type ='Add';
    $('.modal-backdrop').add();
    document.body.classList.add('modal-open')
     
  
      setTimeout(() => {
        this._renderer2.setStyle(this.personInvolvedOtherDetails.nativeElement, 'display', 'block');
        // this._renderer2.setStyle(this.controlDetails.nativeElement, 'z-index', 999999);
        this._renderer2.removeAttribute(this.personInvolvedOtherDetails.nativeElement, 'aria-hidden');
        this._renderer2.addClass(this.personInvolvedOtherDetails.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 100);
  }
  closeInvolvedPersonOtherDetails() {
    this.involvedOtherPersonObject.type = null
    $(this.personInvolvedOtherDetails.nativeElement).modal('hide');
    this.getIncidentDetails(IncidentStore.selectedId)
  
    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr);
    },250);
  }
  
  addInvolvedWitnessPersonOtherDetails(){
    this.involvedWitnessOtherPersonObject.type ='Add';
    $('.modal-backdrop').add();
    document.body.classList.add('modal-open')
     
  
      setTimeout(() => {
        this._renderer2.setStyle(this.personWitnessInvolvedOtherDetails.nativeElement, 'display', 'block');
        // this._renderer2.setStyle(this.controlDetails.nativeElement, 'z-index', 999999);
        this._renderer2.removeAttribute(this.personWitnessInvolvedOtherDetails.nativeElement, 'aria-hidden');
        this._renderer2.addClass(this.personWitnessInvolvedOtherDetails.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 100);
  }
  closeInvolvedWitnessPersonOtherDetails() {
    this.involvedWitnessOtherPersonObject.type = null
    $(this.personWitnessInvolvedOtherDetails.nativeElement).modal('hide');
    this.getIncidentDetails(IncidentStore.selectedId)
  
    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr);
    },250);
  }


  deleteInvolvedPerson(data){
    this.deleteObject.id = data.id;
    this.deleteObject.title = 'involvedPerson';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = "delete_person"
   setTimeout(() => {
    $(this.confirmationPopUp.nativeElement).modal('show');

   }, 250);
   
    
  }
  deleteInvolvedWitnessPerson(data){
    this.deleteObject.id = data.id;
    this.deleteObject.title = 'involvedWitnessPerson';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = "delete_person"
   setTimeout(() => {
    $(this.confirmationPopUp.nativeElement).modal('show');

   }, 250);
  }
  deleteInvolvedWitnessOtherPerson(data){
    this.deleteObject.id = data.id;
    this.deleteObject.title = 'involvedWitnessOtherPerson';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = "delete_person"
   setTimeout(() => {
    $(this.confirmationPopUp.nativeElement).modal('show');

   }, 250);
  }

  deleteInvolvedOtherPerson(data){
    this.deleteObject.id = data.id;
    this.deleteObject.title = 'involvedOtherPerson';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = "delete_person"
   setTimeout(() => {
    $(this.confirmationPopUp.nativeElement).modal('show');

   }, 250);
  }

  deletes(status) {//delete
    let deleteId = [];
    let deleteData;

    if (status && this.deleteObject.id) {
      deleteId.push(this.deleteObject.id);

      switch(this.deleteObject.title){
          case 'involvedPerson':
            let data5 = {
              is_deleted:true,
              customer_ids:deleteId
            };
            deleteData = this._incidentService.deleteIncidentInvolvedUser(this.deleteObject.id);
          break;
          case 'involvedWitnessPerson':
            let data6 = {
              is_deleted:true,
              customer_ids:deleteId
            };
            deleteData = this._incidentService.deleteIncidentInvolvedWitnessUser(this.deleteObject.id);
          break;
          case 'involvedWitnessOtherPerson':
            let data7 = {
              is_deleted:true,
              customer_ids:deleteId
            };
            deleteData = this._incidentService.deleteIncidentInvolvedWitnessOtherUser(this.deleteObject.id);
          break;
          case 'involvedOtherPerson':
            let data8 = {
              is_deleted:true,
              customer_ids:deleteId
            };
            deleteData = this._incidentService.deleteIncidentInvolvedOtherUser(this.deleteObject.id);
          break;

          case 'involvedOtherPerson':
            let data9 = {
              is_deleted:true,
              customer_ids:deleteId
            };
            deleteData = this._incidentService.deleteIncidentInvolvedOtherUser(this.deleteObject.id);
          break;
      }

      deleteData.subscribe(resp => {
        this.getIncidentDetails(IncidentStore.selectedId)
          this._utilityService.detectChanges(this._cdr);
        this.clearDeleteObject();
      });
    }
    else {
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
  
  }

  clearDeleteObject() {//delete
    this.deleteObject.id = null;
    this.deleteObject.title ='',
    this.deleteObject.type= '',
    this.deleteObject.subtitle=''
  }

  getTimezoneFormatted(time){
    return this._helperService.timeZoneFormatted(time);
  }

     ngOnDestroy(){
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      // SubMenuItemStore.makeEmpty();
      this.otherUserSubscription.unsubscribe();
      this.popupControlEventSubscription.unsubscribe();
      this.addInvolvedPersonOtherSubscription.unsubscribe();
      this.addWitnessPersonOtherSubscription.unsubscribe();
      this.InvolvedWitnessPersonSubscription.unsubscribe();
      this.InvolvedPersonSubscription.unsubscribe();
      this.deleteEventSubscription.unsubscribe();
      this.networkFailureSubscription.unsubscribe();
    	this.idleTimeoutSubscription.unsubscribe();
      this.IncidentWorkflowHistorySubscription.unsubscribe();
    }

}
