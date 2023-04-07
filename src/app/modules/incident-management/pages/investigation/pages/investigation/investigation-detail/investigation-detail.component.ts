import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { IncidentFileService } from 'src/app/core/services/incident-management/incident-file-service/incident-file.service';
import { IncidentInvestigationWorkflowService } from 'src/app/core/services/incident-management/incident-investogation-workflow/incident-investigation-workflow.service';
import { IncidentService } from 'src/app/core/services/incident-management/incident/incident.service';
import { InvestigationService } from 'src/app/core/services/incident-management/investigation/investigation.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IncidentInvestigationWorkflowStore } from 'src/app/stores/incident-management/incident-workflow/incident-investigation-workflow.store';
import { IncidentStore } from 'src/app/stores/incident-management/incident/incident-store';
import { IncidentInvestigationStore } from 'src/app/stores/incident-management/investigation-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
declare var $: any;
@Component({
  selector: 'app-investigation-detail',
  templateUrl: './investigation-detail.component.html',
  styleUrls: ['./investigation-detail.component.scss']
})
export class InvestigationDetailComponent implements OnInit {
  @ViewChild("addInvestigation") addInvestigation: ElementRef;
  @ViewChild("updateProgress") updateProgress: ElementRef;
  @ViewChild("history") history: ElementRef;
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('othersPopup') othersPopup: ElementRef;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  @ViewChild("addInvestigationPoints") addInvestigationPoints: ElementRef;
  @ViewChild("addInvestigationRecommendations") addInvestigationRecommendations: ElementRef;
  @ViewChild("addInvestigationObservations") addInvestigationObservations: ElementRef;
  @ViewChild("addInvestigationReference") addInvestigationReference: ElementRef;
  @ViewChild("personInvolvedDetails") personInvolvedDetails: ElementRef;
  @ViewChild("personInvolvedOtherDetails") personInvolvedOtherDetails: ElementRef;
  @ViewChild("personWitnessInvolvedDetails") personWitnessInvolvedDetails: ElementRef;
  @ViewChild("personWitnessInvolvedOtherDetails") personWitnessInvolvedOtherDetails: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('commentModal') commentModal: ElementRef;
  @ViewChild('workflowModal') workflowModal: ElementRef;
  @ViewChild('workflowHistory') workflowHistory: ElementRef;

  reactionDisposer: IReactionDisposer;
  AuthStore = AuthStore;
  addInvestigationSubscription: any;
  IncidentInvestigationStore = IncidentInvestigationStore
  AppStore = AppStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  IncidentInvestigationWorkflowStore = IncidentInvestigationWorkflowStore;
  otherUsers: any;
  addInves: any;
  addSignif: any;
  addrecommendation: any;
  reference: any;
  addOrEdit = "add"
  otherUserSubscription: any;
  networkFailureSubscription: any;
	idleTimeoutSubscription: any;
  IncidentStore = IncidentStore;
  incidentId: any;
  controlObject = {
    type : null
  };
  deleteObject = {
    id: null,
    title: '',
    type: '',
    subtitle:''
  };

  pointsObject = {
    type : null
  };
  referencesObject = {
    type : null
  };
  recomendationsObject = {
    type : null
  };
  ObservationsObject = {
    type : null
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
  updatedModelObject = {
    type : null
  }
  historyModelObject = {
    type : null
  }
  involvedWitnessOtherPersonObject = {
    type : null
  };
  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "investigation-item",
    componentId: null,
  };
  page = 'investigation'
  addInvolvedPersonOtherSubscription: any;
  addWitnessPersonOtherSubscription: any;
  InvolvedWitnessPersonSubscription: any;
  InvolvedPersonSubscription: any;
  deleteEventSubscription: any;
  editPage = 'investigationDetails'
  updateProgressSubscription: any;
  closeHistorySubscription: any;
  workflowCommentEventSubscription: any;
  workflowModalOpened: boolean=false;
  workflowHistoryOpened=false
  workflowHistorySubscription: any;
  constructor(
    private _renderer2: Renderer2,private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,private _eventEmitterService: EventEmitterService,
    private _investigationService : InvestigationService,private _incidentFileService : IncidentFileService,
    private _imageService: ImageServiceService,private _incidentService : IncidentService,
    private _sanitizer: DomSanitizer,private _activatedRouter: ActivatedRoute,
    private _helperService: HelperServiceService,
    private _investigationWorkflowService:IncidentInvestigationWorkflowService,
    private _route: Router,
  ) { }

  ngOnInit(): void {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    let id: number;
    this._activatedRouter.params.subscribe(params => {
      id = +params['id']; 
      IncidentInvestigationStore.setSelectedInvestigationId(id);
      this.getInvestigationDetails(id)
      this.historyPageChange(1);
    })

    this.reactionDisposer = autorun(() => {

      // if(AuthStore.userPermissionsLoaded && IncidentInvestigationStore.individualLoaded && IncidentInvestigationStore.investigationItemDetails && IncidentInvestigationWorkflowStore.workflowDetails){
      //   this.setSubMenu(IncidentInvestigationStore.investigationItemDetails);
      // }
     
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            this.editInvestigation()
            break;
          case 'submit':
            // SubMenuItemStore.submitClicked = true;
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
          case 'history':
              this.openHistoryPopup();
              break;
          case 'workflow':
              this.openWorkflowPopup();
              break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

    });
    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);
            
    this.addInves = this._eventEmitterService.investigationDesDetailsModalControl.subscribe(element=>{
      if(!element){
        this.closeAddInvestigationpoint();
      }
    })

    this.addSignif = this._eventEmitterService.significantDesDetailsModalControl.subscribe(element=>{
      if(!element){
        this.closeAddInvestigationObservation();
      }
    
    })
    this.addrecommendation = this._eventEmitterService.recommendationsDesDetailsModalControl.subscribe(element=>{
      if(!element){
        this.closeAddInvestigationRecommendation();
      }
    })
    this.reference = this._eventEmitterService.referenceDesDetailsModalControl.subscribe(element=>{
      if(!element){
        this.closeAddInvestigationRefrence();
      }
    })

    this.otherUserSubscription = this._eventEmitterService.otherUsersModalControl.subscribe(element=>{
      this.closeassignOtherUsers();
    })
    
    this.updateProgressSubscription = this._eventEmitterService.InvestigationProgressModal.subscribe(element=>{
      this.closeUpdateModal();
    })

    this.closeHistorySubscription = this._eventEmitterService.closeInvestigationHistoryModal.subscribe(element=>{
      this.closehistoryModal();
    })

    this.addInvestigationSubscription = this._eventEmitterService.AddInvestigationModalControl.subscribe(element=>{
      this.closeAddInvestigationModal()
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

    this.InvolvedPersonSubscription = this._eventEmitterService.InvolvedPersonAddDetailModalControl.subscribe(element=>{
      this.closeInvolvedPersonDetails();

    })
    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.delete(item);
    });
    this.workflowCommentEventSubscription = this._eventEmitterService.IncidentInvestigationWorkflowCommentModal.subscribe(item => {
      this.closeCommentForm();
    })

    this.workflowHistorySubscription = this._eventEmitterService.InvestigationInfoHistory.subscribe(item => {
      this.closeHistoryPopup();
    })
  }

  gotoIncident() {
    this._route.navigateByUrl(`/incident-management/${this.incidentId}/info`);
  }

  scrollEvent = (event: any): void => {
    if(event.target.documentElement){
      const number = event.target.documentElement.scrollTop;
      if(number > 50){
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','45px');
        this._renderer2.addClass(this.navBar.nativeElement,'affix');
        // this.plainDev.style.height = '45px';
      }
      else{
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
        this._renderer2.removeClass(this.navBar.nativeElement,'affix');
        // this.plainDev.nativeElement.style.height = 'auto';
      }
    }
  }

  ngAfterViewInit(): void{
    
   }

 editInvestigation(){
   this.addOrEdit = "edit"
   IncidentInvestigationStore.individualLoaded = false;
   IncidentInvestigationStore.involvedUserDetails.push(IncidentInvestigationStore.investigationItemDetails.investigation_involved_users)
   IncidentInvestigationStore.setWitnessUserDetails(IncidentInvestigationStore.investigationItemDetails.investigation_witness_users)
   IncidentStore.setOtherInvolvedUserDetails(IncidentInvestigationStore.investigationItemDetails.involved_other_users)
   IncidentStore.setOtherWitnessUserDetails(IncidentInvestigationStore.investigationItemDetails.involved_other_users.witness_other_users)
  
    this.openPerformPopup()
    this._utilityService.detectChanges(this._cdr);


 }

 openHistoryPopup() {
  IncidentInvestigationWorkflowStore.setCurrentPage(1);
  this._investigationWorkflowService.getHistory(IncidentInvestigationStore.selectedId).subscribe(res => {
    this.workflowHistoryOpened = true;
    this._utilityService.detectChanges(this._cdr);
    $(this.workflowHistory.nativeElement).modal('show');
  });



}

closeHistoryPopup() {
  this.workflowHistoryOpened = false;
  $(this.workflowHistory.nativeElement).modal('hide');
}

 openWorkflowPopup() {
  this._investigationWorkflowService.getItems(IncidentInvestigationStore.selectedId).subscribe(res => {
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

 approveRisk(type?) {
  if (type) {
    IncidentInvestigationWorkflowStore.type = 'submit';
  }
  else
    IncidentInvestigationWorkflowStore.type = 'approve';
    IncidentInvestigationWorkflowStore.commentForm = true;
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
  this.getInvestigationDetails(IncidentInvestigationStore.selectedId)
  IncidentInvestigationWorkflowStore.type = '';
  IncidentInvestigationWorkflowStore.commentForm = false;
  $(this.commentModal.nativeElement).modal('hide');
  this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 9);
  this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'none');
  this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'none');
  $('.modal-backdrop').remove();

  this._utilityService.detectChanges(this._cdr)
}

revertRisk() {
  IncidentInvestigationWorkflowStore.type = 'revert';
  IncidentInvestigationWorkflowStore.commentForm = true;
  $(this.commentModal.nativeElement).modal('show');
  this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
  this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
  this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
}

getWorkflowDetails(){
  this._investigationWorkflowService.getItems(IncidentInvestigationStore.selectedId).subscribe(res => {
    this.setSubMenu(IncidentInvestigationStore.investigationItemDetails);
    this._utilityService.detectChanges(this._cdr);
  })
}

 submitAccepted(status){
    if(status){
      this._investigationWorkflowService.submitInvestigation(IncidentInvestigationStore.selectedId).subscribe(res=>{
        SubMenuItemStore.submitClicked = false;
        this.getInvestigationDetails(IncidentInvestigationStore.selectedId)
        this._utilityService.detectChanges(this._cdr);
      })
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
   }

   submitForReview(){
    this.deleteObject.type = 'Confirm';
    this.deleteObject.title = 'submit';
    this.deleteObject.subtitle = 'submit_investigation';
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
    }, 100);
    this._utilityService.detectChanges(this._cdr);

  }

 getIncidentDetails(id){
   IncidentInvestigationStore.unsetInvestigationUsers()
   IncidentStore.unsetInvestigationUsers()
   IncidentStore.clearDocumentDetails()
   IncidentInvestigationStore.clearDocumentDetails()
   this._utilityService.detectChanges(this._cdr);
   this._incidentService.getItem(id).subscribe(res=>{
     IncidentInvestigationStore.unsetInvestigationDetails() 
      var evidenceDetails = res;
      if(evidenceDetails.documents.length > 0){
        for(let evidence of evidenceDetails.documents){
          let evidencePreviewUrl = this._incidentFileService.getThumbnailPreview('incident-item',evidence.token);
          let evidenceDetail = {
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
          this._incidentService.setDocumentDetails(evidenceDetail,evidencePreviewUrl);
        }
        // this.checkForFileUploadsScrollbar();
      }
      if(res['investigation'].length !=0){
       this.getInvestigationDetails(res['investigation'][0].id)
      }
     this._utilityService.detectChanges(this._cdr);
   })
 }

 changeZIndex(){
  if($(this.addInvestigation.nativeElement).hasClass('show')){
    this._renderer2.setStyle(this.addInvestigation.nativeElement,'z-index',99999);
    this._renderer2.setStyle(this.addInvestigation.nativeElement,'overflow','scroll');
  }
  if($(this.othersPopup.nativeElement).hasClass('show')){
    this._renderer2.setStyle(this.othersPopup.nativeElement,'z-index',99999);
    this._renderer2.setStyle(this.othersPopup.nativeElement,'overflow','scroll');
  }
  if($(this.filePreviewModal.nativeElement).hasClass('show')){
    this._renderer2.setStyle(this.filePreviewModal.nativeElement,'z-index',99999);
    this._renderer2.setStyle(this.filePreviewModal.nativeElement,'overflow','scroll');
  }
  if($(this.addInvestigationPoints.nativeElement).hasClass('show')){
    this._renderer2.setStyle(this.addInvestigationPoints.nativeElement,'z-index',99999);
    this._renderer2.setStyle(this.addInvestigationPoints.nativeElement,'overflow','scroll');
  }
  if($(this.addInvestigationRecommendations.nativeElement).hasClass('show')){
    this._renderer2.setStyle(this.addInvestigationRecommendations.nativeElement,'z-index',99999);
    this._renderer2.setStyle(this.addInvestigationRecommendations.nativeElement,'overflow','scroll');
  }
  if($(this.addInvestigationObservations.nativeElement).hasClass('show')){
    this._renderer2.setStyle(this.addInvestigationObservations.nativeElement,'z-index',99999);
    this._renderer2.setStyle(this.addInvestigationObservations.nativeElement,'overflow','scroll');
  }
  if($(this.addInvestigationReference.nativeElement).hasClass('show')){
    this._renderer2.setStyle(this.addInvestigationReference.nativeElement,'z-index',99999);
    this._renderer2.setStyle(this.addInvestigationReference.nativeElement,'overflow','scroll');
  }
  if($(this.personInvolvedDetails.nativeElement).hasClass('show')){
    this._renderer2.setStyle(this.personInvolvedDetails.nativeElement,'z-index',99999);
    this._renderer2.setStyle(this.personInvolvedDetails.nativeElement,'overflow','scroll');
  }
  if($(this.personInvolvedOtherDetails.nativeElement).hasClass('show')){
    this._renderer2.setStyle(this.personInvolvedOtherDetails.nativeElement,'z-index',99999);
    this._renderer2.setStyle(this.personInvolvedOtherDetails.nativeElement,'overflow','scroll');
  }
  if($(this.personWitnessInvolvedDetails.nativeElement).hasClass('show')){
    this._renderer2.setStyle(this.personWitnessInvolvedDetails.nativeElement,'z-index',99999);
    this._renderer2.setStyle(this.personWitnessInvolvedDetails.nativeElement,'overflow','scroll');
  }
  if($(this.personWitnessInvolvedOtherDetails.nativeElement).hasClass('show')){
    this._renderer2.setStyle(this.personWitnessInvolvedOtherDetails.nativeElement,'z-index',99999);
    this._renderer2.setStyle(this.personWitnessInvolvedOtherDetails.nativeElement,'overflow','scroll');
  }
  if($(this.updateProgress.nativeElement).hasClass('show')){
    this._renderer2.setStyle(this.updateProgress.nativeElement,'z-index',99999);
    this._renderer2.setStyle(this.updateProgress.nativeElement,'overflow','scroll');
  }
  if($(this.history.nativeElement).hasClass('show')){
    this._renderer2.setStyle(this.history.nativeElement,'z-index',99999);
    this._renderer2.setStyle(this.history.nativeElement,'overflow','scroll');
  }
}
 
 downloadInvestigationDocument(type, document) {

   event.stopPropagation();
   switch (type) {
     case "downloadIncidentDocument":
       this._incidentFileService.downloadFile(
        "investigation-item",
        IncidentInvestigationStore.selectedId,
        document.id,
        null,
        document.title ? document.title : document.name,
        document
       );
       break;

   }

 }

 // for file preview

 viewIncidentDocument(document) {
   this._incidentFileService.getInvestigationFilePreview(document.id).subscribe (res=>{
     var resp: any = this._utilityService.getDownLoadLink(
       res,
       document.name ? document.name : document.title
     );
     this.openPreviewModal(resp, document);
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
 }

 openPreviewModal(filePreview,document) {
   let previewItem = null;
   if (filePreview) {
     previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
     this.previewObject.preview_url = previewItem;
     this.previewObject.file_details = document;
     this.previewObject.component == 'investigation-item'
     this.previewObject.componentId = IncidentInvestigationStore.selectedId;
     $(this.filePreviewModal.nativeElement).modal("show");
     this._utilityService.detectChanges(this._cdr);
   }

 }

 // Closes from preview
 closePreviewModal(event) {
   $(this.filePreviewModal.nativeElement).modal("hide");
   this.previewObject.preview_url = "";
   this.previewObject.uploaded_user = null;
   this.previewObject.created_at = "";
   this.previewObject.file_details = null;
   this.previewObject.componentId = null;
 }

 openPerformPopup() {
   IncidentInvestigationStore.unsetInvestigationUsers()
   IncidentStore.otherInvolvedUserDetails = [];
   IncidentStore.otherWitnessUserDetails = [];
   IncidentInvestigationStore.unsetDocumentDetails();
   IncidentStore.unsetPoints();
   this._incidentService.mapingFun();
   
    
 
     // NoDataItemStore.setNoDataItems({ title: "Looks like we don't have controls to display here" });
     this.controlObject.type = "Add"
     setTimeout(() => {
       this._renderer2.setStyle(this.addInvestigation.nativeElement, 'z-index', 99999);
       this._renderer2.setStyle(this.addInvestigation.nativeElement, 'overflow', 'auto');
       $(this.addInvestigation.nativeElement).modal('show');
       this._utilityService.detectChanges(this._cdr);
     }, 250);
 
     
  
 }

 closeAddInvestigationModal() {
   this.controlObject.type = null
   $(this.addInvestigation.nativeElement).modal('hide');


   setTimeout(() => {
     this._utilityService.detectChanges(this._cdr);
   },250);

this.getInvestigationDetails(IncidentInvestigationStore.selectedId)

 }

 getInvestigationDetails(id){
   IncidentInvestigationStore.clearDocumentDetails()
   this._investigationService.getItem(id).subscribe(res=>{
     var evidenceDetails = res;
     if(evidenceDetails.documents.length > 0){
       for(let evidence of evidenceDetails.documents){
         let evidencePreviewUrl = this._incidentFileService.getThumbnailPreview('investigation-item',evidence.token);
         let evidenceDetail = {
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
         this._investigationService.setDocumentDetails(evidenceDetail,evidencePreviewUrl);
       }
     }
     this.getWorkflowDetails();
     this.incidentId = res.incident.id;
     this.getIncidentInvestigotor(res.incident.id)
     this._utilityService.detectChanges(this._cdr);
   })
 }

 setSubMenu(res){
  if(res.incident_investigation_status.type == 'closed'){
    let subMenuItems = [
      {activityName:'LIST_INCIDENT_INVESTIGATION_WORKFLOW_HISTORY', submenuItem: {type: 'history'}},
      {activityName:'INCIDENT_INVESTIGATION_WORKFLOW_LIST_ACTIVITY_LOGS', submenuItem: {type: 'workflow'}},
      {activityName:null, submenuItem: {type: 'close', path: '../'}}
    ]
    this._helperService.checkSubMenuItemPermissions(3800, subMenuItems);
    this._utilityService.detectChanges(this._cdr);
  }
  else if(res.next_review_user_level==1&&res.submitted_by==null){
    let subMenuItems = [
      {activityName:'LIST_INCIDENT_INVESTIGATION_WORKFLOW_HISTORY', submenuItem: {type: 'history'}},
      {activityName:'INCIDENT_INVESTIGATION_WORKFLOW_LIST_ACTIVITY_LOGS', submenuItem: {type: 'workflow'}},
      {activityName:'SUBMIT_INCIDENT_INVESTIGATION',submenuItem:{type:'submit'}},
      {activityName: IncidentInvestigationStore.individualInvestigationItem == null ? 'CREATE_INCIDENT_INVESTIGATION' : 'UPDATE_INCIDENT_INVESTIGATION', submenuItem: {type: IncidentInvestigationStore.individualInvestigationItem == null ? 'new_modal' : 'edit_modal'}},
      {activityName:null, submenuItem: {type: 'close', path: '../'}}
    ]
    this._helperService.checkSubMenuItemPermissions(3800, subMenuItems);
  }else if(res.submitted_by!=null && res.next_review_user_level && this.isUser()){
    if (res?.next_review_user_level == IncidentInvestigationWorkflowStore?.workflowDetails[IncidentInvestigationWorkflowStore?.workflowDetails?.length - 1]?.level){
      let subMenuItems = [
        {activityName:'APPROVE_INCIDENT_INVESTIGATION',submenuItem:{type:'approve'}},
        {activityName:'REVERT_INCIDENT_INVESTIGATION',submenuItem:{type:'revert'}},
        {activityName: IncidentInvestigationStore.individualInvestigationItem == null ? 'CREATE_INCIDENT_INVESTIGATION' : 'UPDATE_INCIDENT_INVESTIGATION', submenuItem: {type: IncidentInvestigationStore.individualInvestigationItem == null ? 'new_modal' : 'edit_modal'}},
        {activityName:'LIST_INCIDENT_INVESTIGATION_WORKFLOW_HISTORY', submenuItem: {type: 'history'}},
        {activityName:'INCIDENT_INVESTIGATION_WORKFLOW_LIST_ACTIVITY_LOGS', submenuItem: {type: 'workflow'}},
        {activityName:null, submenuItem: {type: 'close', path: '../'}}
      ]
      this._helperService.checkSubMenuItemPermissions(3800, subMenuItems);
      this._utilityService.detectChanges(this._cdr);
    }
    else if (res.next_review_user_level != IncidentInvestigationWorkflowStore?.workflowDetails[IncidentInvestigationWorkflowStore?.workflowDetails?.length - 1]?.level){
      let subMenuItems = [
        {activityName:'SUBMIT_INCIDENT_INVESTIGATION', submenuItem: {type: 'review_submit'}},
        {activityName:'REVERT_INCIDENT_INVESTIGATION',submenuItem:{type:'revert'}},
        {activityName: IncidentInvestigationStore.individualInvestigationItem == null ? 'CREATE_INCIDENT_INVESTIGATION' : 'UPDATE_INCIDENT_INVESTIGATION', submenuItem: {type: IncidentInvestigationStore.individualInvestigationItem == null ? 'new_modal' : 'edit_modal'}},
        {activityName:'LIST_INCIDENT_INVESTIGATION_WORKFLOW_HISTORY', submenuItem: {type: 'history'}},
        {activityName:'INCIDENT_INVESTIGATION_WORKFLOW_LIST_ACTIVITY_LOGS', submenuItem: {type: 'workflow'}},
        {activityName:null, submenuItem: {type: 'close', path: '../'}}
      ]
      this._helperService.checkSubMenuItemPermissions(3800, subMenuItems);
      this._utilityService.detectChanges(this._cdr);
    }
  }else{
    let subMenuItems = [
      {activityName: IncidentInvestigationStore.individualInvestigationItem == null ? 'CREATE_INCIDENT_INVESTIGATION' : 'UPDATE_INCIDENT_INVESTIGATION', submenuItem: {type: IncidentInvestigationStore.individualInvestigationItem == null ? 'new_modal' : 'edit_modal'}},
      {activityName:'LIST_INCIDENT_INVESTIGATION_WORKFLOW_HISTORY', submenuItem: {type: 'history'}},
      {activityName:'INCIDENT_INVESTIGATION_WORKFLOW_LIST_ACTIVITY_LOGS', submenuItem: {type: 'workflow'}},
      {activityName:null, submenuItem: {type: 'close', path: '../'}}
    ]
    this._helperService.checkSubMenuItemPermissions(3800, subMenuItems);
  }

 }

 isUser() {
  if(IncidentInvestigationStore?.individualLoaded){
    for (let i of IncidentInvestigationStore?.investigationItemDetails.workflow_items) {
      if (i.level == IncidentInvestigationStore?.investigationItemDetails?.next_review_user_level) {
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

 // Returns default image
 getDefaultImage(type) {
   return this._imageService.getDefaultImageUrl(type);
 }

 createPreviewUrl(type, token) {
   return this._incidentFileService.getThumbnailPreview(type, token)
 }


 // Returns image url according to type and token
 createImageUrl(type, token) {
   return this._incidentFileService.getThumbnailPreview(type, token);
 }

 getIncidentInvestigotor(id){
  this._incidentService.getInvestigation(id).subscribe(res=>{
    this._utilityService.detectChanges(this._cdr);
  })
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

  // extension check function
  checkExtension(ext, extType) {

   return this._imageService.checkFileExtensions(ext, extType)
  
 }

 involvedOthers(){
   let item = IncidentInvestigationStore.investigationItemDetails.involved_other_users.slice(0,2)
   return item
  }

  othersWitness(){
    let item = IncidentInvestigationStore.investigationItemDetails.witness_other_users.slice(0,2)
    return item
   }

   openOtherInvolvedPerson(){
     this.assignOtherUsers(IncidentInvestigationStore.investigationItemDetails.involved_other_users);
    }
  
    openOthersWitnessModel(){
      this.assignOtherUsers(IncidentInvestigationStore.investigationItemDetails.witness_other_users);
  
    }
  
    closeassignOtherUsers(){
     //  $(this.othersPopup.nativeElement).modal('show');
    }
  
    assignOtherUsers(users){
     IncidentStore.setOthersItems(users)
     this._utilityService.detectChanges(this._cdr);
     //  $(this.othersPopup.nativeElement).modal('show');
    }

    addInvestigationPoint(){
      this.pointsObject.type ='Add';
      this._utilityService.detectChanges(this._cdr)
      // $('.modal-backdrop').add();
      // document.body.classList.add('modal-open')
       
    
        setTimeout(() => {
          $(this.addInvestigationPoints.nativeElement).modal('show');
          // this._renderer2.setStyle(this.addInvestigationPoints.nativeElement, 'display', 'block');
          // // this._renderer2.setStyle(this.controlDetails.nativeElement, 'z-index', 999999);
          // this._renderer2.removeAttribute(this.addInvestigationPoints.nativeElement, 'aria-hidden');
          // this._renderer2.addClass(this.addInvestigationPoints.nativeElement, 'show')
          // this._utilityService.detectChanges(this._cdr)
        }, 250);
    }
  
    closeAddInvestigationpoint() {
      this.pointsObject.type = null
      $(this.addInvestigationPoints.nativeElement).modal('hide');
      this.getInvestigationDetails(IncidentInvestigationStore.selectedId)
  
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      },250);
  }
  
  
  addInvestigationRecommendation(){
    this.recomendationsObject.type ='Add';
    this._utilityService.detectChanges(this._cdr)
      setTimeout(() => {
        $(this.addInvestigationRecommendations.nativeElement).modal('show');
        // $('.modal-backdrop').add();
        // document.body.classList.add('modal-open')
        // this._renderer2.setStyle(this.addInvestigationRecommendations.nativeElement, 'display', 'block');
        // // this._renderer2.setStyle(this.addInvestigationRecommendations.nativeElement, 'z-index', 999999);
        // this._renderer2.removeAttribute(this.addInvestigationRecommendations.nativeElement, 'aria-hidden');
        // this._renderer2.addClass(this.addInvestigationRecommendations.nativeElement, 'show')
        // this._utilityService.detectChanges(this._cdr)
      }, 250);
  }
  closeAddInvestigationRecommendation() {
    this.recomendationsObject.type = null
    $(this.addInvestigationRecommendations.nativeElement).modal('hide');
    this.getInvestigationDetails(IncidentInvestigationStore.selectedId)
  
    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr);
    },250);
  }
  
  addInvestigationRefrence(){
    this.referencesObject.type ='Add';
    this._utilityService.detectChanges(this._cdr)
    // $('.modal-backdrop').add();
    // document.body.classList.add('modal-open')
     
  
      setTimeout(() => {
        $(this.addInvestigationReference.nativeElement).modal('show');
        // this._renderer2.setStyle(this.addInvestigationReference.nativeElement, 'display', 'block');
        // // this._renderer2.setStyle(this.controlDetails.nativeElement, 'z-index', 999999);
        // this._renderer2.removeAttribute(this.addInvestigationReference.nativeElement, 'aria-hidden');
        // this._renderer2.addClass(this.addInvestigationReference.nativeElement, 'show')
        // this._utilityService.detectChanges(this._cdr)
      }, 100);
  }
  closeAddInvestigationRefrence() {
    this.referencesObject.type = null
    $(this.addInvestigationReference.nativeElement).modal('hide');
    this.getInvestigationDetails(IncidentInvestigationStore.selectedId)
  
    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr);
    },250);
  }
  
  addInvestigationObservation(){
    this.ObservationsObject.type ='Add';
    this._utilityService.detectChanges(this._cdr);
    // $('.modal-backdrop').add();
    // document.body.classList.add('modal-open')
     
  
      setTimeout(() => {
        $(this.addInvestigationObservations.nativeElement).modal('show');
        // this._renderer2.setStyle(this.addInvestigationObservations.nativeElement, 'display', 'block');
        // // this._renderer2.setStyle(this.controlDetails.nativeElement, 'z-index', 999999);
        // this._renderer2.removeAttribute(this.addInvestigationObservations.nativeElement, 'aria-hidden');
        // this._renderer2.addClass(this.addInvestigationObservations.nativeElement, 'show')
        // this._utilityService.detectChanges(this._cdr)
      }, 100);
  }
  closeAddInvestigationObservation() {
    this.ObservationsObject.type = null
    $(this.addInvestigationObservations.nativeElement).modal('hide');
    this.getInvestigationDetails(IncidentInvestigationStore.selectedId)
  
    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr);
    },250);
  }
  
  addInvolvedPersonDetails(){
    this.involvedPersonObject.type ='Add';
    this._utilityService.detectChanges(this._cdr)
      setTimeout(() => {
        $(this.personInvolvedDetails.nativeElement).modal('show');
        // $('.modal-backdrop').add();
        // document.body.classList.add('modal-open')
        // this._renderer2.setStyle(this.personInvolvedDetails.nativeElement, 'display', 'block');
        // // this._renderer2.setStyle(this.controlDetails.nativeElement, 'z-index', 999999);
        // this._renderer2.removeAttribute(this.personInvolvedDetails.nativeElement, 'aria-hidden');
        // this._renderer2.addClass(this.personInvolvedDetails.nativeElement, 'show')
        // this._utilityService.detectChanges(this._cdr)
      }, 250);
  }
  closeInvolvedPersonDetails() {
    this.involvedPersonObject.type = null
    $(this.personInvolvedDetails.nativeElement).modal('hide');
    this.getInvestigationDetails(IncidentInvestigationStore.selectedId)
  
    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr);
    },250);
  }
  addInvolvedWitnessPersonDetails(){
    this.involvedWitnessPersonObject.type ='Add';
    // $('.modal-backdrop').add();
    // document.body.classList.add('modal-open')
    this._utilityService.detectChanges(this._cdr)
  
      setTimeout(() => {
        $(this.personWitnessInvolvedDetails.nativeElement).modal('show');
        // this._renderer2.setStyle(this.personWitnessInvolvedDetails.nativeElement, 'display', 'block');
        // // this._renderer2.setStyle(this.controlDetails.nativeElement, 'z-index', 999999);
        // this._renderer2.removeAttribute(this.personWitnessInvolvedDetails.nativeElement, 'aria-hidden');
        // this._renderer2.addClass(this.personWitnessInvolvedDetails.nativeElement, 'show')
        // this._utilityService.detectChanges(this._cdr)
      }, 100);
  }
  closeInvolvedWitnessPersonDetails() {
    this.involvedWitnessPersonObject.type = null
    $(this.personWitnessInvolvedDetails.nativeElement).modal('hide');
    this.getInvestigationDetails(IncidentInvestigationStore.selectedId)
  
    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr);
    },250);
  }
  
  addInvolvedPersonOtherDetails(){
    this.involvedOtherPersonObject.type ='Add';
    this._utilityService.detectChanges(this._cdr)
    // $('.modal-backdrop').add();
    // document.body.classList.add('modal-open')
     
  
      setTimeout(() => {
        $(this.personInvolvedOtherDetails.nativeElement).modal('show');
        // this._renderer2.setStyle(this.personInvolvedOtherDetails.nativeElement, 'display', 'block');
        // // this._renderer2.setStyle(this.controlDetails.nativeElement, 'z-index', 999999);
        // this._renderer2.removeAttribute(this.personInvolvedOtherDetails.nativeElement, 'aria-hidden');
        // this._renderer2.addClass(this.personInvolvedOtherDetails.nativeElement, 'show')
        // this._utilityService.detectChanges(this._cdr)
      }, 100);
  }
  closeInvolvedPersonOtherDetails() {
    this.involvedOtherPersonObject.type = null
    $(this.personInvolvedOtherDetails.nativeElement).modal('hide');
    this.getInvestigationDetails(IncidentInvestigationStore.selectedId)
  
    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr);
    },250);
  }
  
  addInvolvedWitnessPersonOtherDetails(){
    this.involvedWitnessOtherPersonObject.type ='Add';
    this._utilityService.detectChanges(this._cdr)
    // $('.modal-backdrop').add();
    // document.body.classList.add('modal-open')
     
  
      setTimeout(() => {
        $(this.personWitnessInvolvedOtherDetails.nativeElement).modal('show');
        // this._renderer2.setStyle(this.personWitnessInvolvedOtherDetails.nativeElement, 'display', 'block');
        // // this._renderer2.setStyle(this.controlDetails.nativeElement, 'z-index', 999999);
        // this._renderer2.removeAttribute(this.personWitnessInvolvedOtherDetails.nativeElement, 'aria-hidden');
        // this._renderer2.addClass(this.personWitnessInvolvedOtherDetails.nativeElement, 'show')
        // this._utilityService.detectChanges(this._cdr)
      }, 100);
  }
  closeInvolvedWitnessPersonOtherDetails() {
    this.involvedWitnessOtherPersonObject.type = null
    $(this.personWitnessInvolvedOtherDetails.nativeElement).modal('hide');
    this.getInvestigationDetails(IncidentInvestigationStore.selectedId)
  
    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr);
    },250);
  }

  deleteInvestigations(data){
    this.deleteObject.id = data.id;
    this.deleteObject.title = 'Point';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = "Are you sure you want to delete this point?"
   setTimeout(() => {
    $(this.confirmationPopUp.nativeElement).modal('show');

   }, 250);
  }
  deleteReference(data){
    this.deleteObject.id = data.id;
    this.deleteObject.title = 'References';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = "Are you sure you want to delete this Reference?"
   setTimeout(() => {
    $(this.confirmationPopUp.nativeElement).modal('show');

   }, 250);
  }

  deleteRecommendations(data){
    this.deleteObject.id = data.id;
    this.deleteObject.title = 'Recommendation';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = "Are you sure you want to delete this Recommendation?"
   setTimeout(() => {
    $(this.confirmationPopUp.nativeElement).modal('show');

   }, 250);
    
  }

  deleteObservations(data){
    this.deleteObject.id = data.id;
    this.deleteObject.title = 'Observations';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = "Are you sure you want to delete this Observation?"
   setTimeout(() => {
    $(this.confirmationPopUp.nativeElement).modal('show');

   }, 250);
    
  }

  deleteInvolvedPerson(data){
    this.deleteObject.id = data.id;
    this.deleteObject.title = 'involvedPerson';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = "Are you sure you want to delete this Person?"
   setTimeout(() => {
    $(this.confirmationPopUp.nativeElement).modal('show');

   }, 250);
   
    
  }
  deleteInvolvedWitnessPerson(data){
    this.deleteObject.id = data.id;
    this.deleteObject.title = 'involvedWitnessPerson';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = "Are you sure you want to delete this Person?"
   setTimeout(() => {
    $(this.confirmationPopUp.nativeElement).modal('show');

   }, 250);
  }
  deleteInvolvedWitnessOtherPerson(data){
    this.deleteObject.id = data.id;
    this.deleteObject.title = 'involvedWitnessOtherPerson';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = "Are you sure you want to delete this Person?"
   setTimeout(() => {
    $(this.confirmationPopUp.nativeElement).modal('show');

   }, 250);
  }

  deleteInvolvedOtherPerson(data){
    this.deleteObject.id = data.id;
    this.deleteObject.title = 'involvedOtherPerson';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = "Are you sure you want to delete this Person?"
   setTimeout(() => {
    $(this.confirmationPopUp.nativeElement).modal('show');

   }, 250);
  }

  closeInvestigation() {
    event.stopPropagation();
    this.deleteObject.type = '';
    this.deleteObject.id = IncidentInvestigationStore.selectedId;
    this.deleteObject.title = 'closeinvestigation';
    this.deleteObject.subtitle = 'Close Investigation?';
    this._utilityService.detectChanges(this._cdr);
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
  
     }, 250);

  }


  delete(status) {//delete
    let deleteId = [];
    let deleteData;

    if(this.deleteObject.type!='Confirm'){
      if (status && this.deleteObject.id) {
        deleteId.push(this.deleteObject.id);
  
        switch(this.deleteObject.title){
          case 'Point':
                let data1 = {
                  is_deleted:true,
                  id:deleteId
                };
                deleteData = this._investigationService.deleteInvestigationInvestigationPoint(this.deleteObject.id);
            break;
          case 'References':
                let data2 = {
                  is_deleted:true,
                  organization_issue_ids:deleteId
                };
                deleteData = this._investigationService.deleteInvestigationReferences(this.deleteObject.id);
            break;
          case 'Recommendation':
              let data3 = {
                is_deleted:true,
                project_ids:deleteId
              };
              deleteData = this._investigationService.deleteInvestigationRecomendation(this.deleteObject.id);
            break;
            case 'Observations':
              let data4 = {
                is_deleted:true,
                customer_ids:deleteId
              };
              deleteData = this._investigationService.deleteInvestigationObservations(this.deleteObject.id);
            break;
            case 'involvedPerson':
              let data5 = {
                is_deleted:true,
                customer_ids:deleteId
              };
              deleteData = this._investigationService.deleteInvestigationInvolvedUser(this.deleteObject.id);
            break;
            case 'involvedWitnessPerson':
              let data6 = {
                is_deleted:true,
                customer_ids:deleteId
              };
              deleteData = this._investigationService.deleteInvestigationInvolvedWitnessUser(this.deleteObject.id);
            break;
            case 'involvedWitnessOtherPerson':
              let data7 = {
                is_deleted:true,
                customer_ids:deleteId
              };
              deleteData = this._investigationService.deleteInvestigationInvolvedWitnessOtherUser(this.deleteObject.id);
            break;
            case 'involvedOtherPerson':
              let data8 = {
                is_deleted:true,
                customer_ids:deleteId
              };
              deleteData = this._investigationService.deleteInvestigationInvolvedOtherUser(this.deleteObject.id);
            break;
  
            case 'closeinvestigation':
              deleteData = this._investigationService.closeInvestigation(IncidentInvestigationStore.selectedId);
            break;
        }
  
        deleteData.subscribe(resp => {
          this.getInvestigationDetails(IncidentInvestigationStore.selectedId)
            this._utilityService.detectChanges(this._cdr);
          this.clearDeleteObject();
        });
      }
      else {
        this.clearDeleteObject();
      }
    }else{
      this.submitAccepted(status)
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

  openUpdateModal(){
    this.updatedModelObject.type ='Add';
    $('.modal-backdrop').add();
    document.body.classList.add('modal-open')
     
  
      setTimeout(() => {
        this._renderer2.setStyle(this.updateProgress.nativeElement, 'display', 'block');
        // this._renderer2.setStyle(this.controlDetails.nativeElement, 'z-index', 999999);
        this._renderer2.removeAttribute(this.updateProgress.nativeElement, 'aria-hidden');
        this._renderer2.addClass(this.updateProgress.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 100);
  }
  closeUpdateModal() {
    this.updatedModelObject.type = null
    $(this.updateProgress.nativeElement).modal('hide');
    this.getInvestigationDetails(IncidentInvestigationStore.selectedId)
    this.historyPageChange(1);

    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr);
    },250);
  }

  historyPageChange(newPage: number = null) {
    if (newPage) IncidentInvestigationStore.setHistoryCurrentPage(newPage);
    this._investigationService.getUpdateData(IncidentInvestigationStore.selectedId).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);

    })
  }


  openHistoryModal(){
    this.historyModelObject.type ='Add';
    $('.modal-backdrop').add();
    document.body.classList.add('modal-open')
     
  
      setTimeout(() => {
        this._renderer2.setStyle(this.history.nativeElement, 'display', 'block');
        // this._renderer2.setStyle(this.controlDetails.nativeElement, 'z-index', 999999);
        this._renderer2.removeAttribute(this.history.nativeElement, 'aria-hidden');
        this._renderer2.addClass(this.history.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 100);
  }
  closehistoryModal() {
    this.historyModelObject.type = null
    $(this.history.nativeElement).modal('hide');
    this.getInvestigationDetails(IncidentInvestigationStore.selectedId)
    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr);
    },250);
  }

  getTimezoneFormatted(time){
    return this._helperService.timeZoneFormatted(time);
  }

    ngOnDestroy(){
     if (this.reactionDisposer) this.reactionDisposer();
     SubMenuItemStore.submitClicked = false;
     SubMenuItemStore.makeEmpty();
     this.addInves.unsubscribe();
     this.addSignif.unsubscribe();
     this.addrecommendation.unsubscribe();
     this.reference.unsubscribe();
     this.addInvestigationSubscription.unsubscribe();
     this.otherUserSubscription.unsubscribe();
     this.addInvolvedPersonOtherSubscription.unsubscribe();
     this.addWitnessPersonOtherSubscription.unsubscribe();
     this.InvolvedWitnessPersonSubscription.unsubscribe();
     this.InvolvedPersonSubscription.unsubscribe();
     this.deleteEventSubscription.unsubscribe();
     this.updateProgressSubscription.unsubscribe();
     this.closeHistorySubscription.unsubscribe();
     this.networkFailureSubscription.unsubscribe();
     this.idleTimeoutSubscription.unsubscribe();
     this.workflowCommentEventSubscription.unsubscribe();
     BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
     IncidentInvestigationWorkflowStore.unsetWorkflowDetails();
     IncidentInvestigationStore.unsetInvestigationDetails();
   }

}
