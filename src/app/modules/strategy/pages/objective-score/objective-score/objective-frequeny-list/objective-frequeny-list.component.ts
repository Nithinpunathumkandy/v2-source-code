import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { ObjectiveWorkflowService } from 'src/app/core/services/strategy-management/objective-workflow-service/objective-workflow.service';
import { ObjectiveScoreService } from 'src/app/core/services/strategy-management/objective/objective-score.service';
import { StrategyReviewService } from 'src/app/core/services/strategy-management/review/strategy-review.service';
import { StrategyService } from 'src/app/core/services/strategy-management/strategy/strategy.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { StrategyManagementSettingStore } from 'src/app/stores/settings/strategy-management-settings.store';
import { ObjectiveScoreStore } from 'src/app/stores/strategy-management/objective-score.store';
import { ObjectiveWorkflowStore } from 'src/app/stores/strategy-management/objective-workflow.store';
import { StrategyStore } from 'src/app/stores/strategy-management/strategy.store';
declare var $: any;


@Component({
  selector: 'app-objective-frequeny-list',
  templateUrl: './objective-frequeny-list.component.html',
  styleUrls: ['./objective-frequeny-list.component.scss']
})
export class ObjectiveFrequenyListComponent implements OnInit {
  @ViewChild('objectiveScore') objectiveScore: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('commentModal') commentModal: ElementRef;
  @ViewChild('workflowHistory') workflowHistory: ElementRef;
  @ViewChild('otherDocumentes', {static: true}) otherDocumentes: ElementRef;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;


  
  StrategyStore = StrategyStore
  ObjectiveScoreStore = ObjectiveScoreStore;
  AppStore = AppStore;
  AuthStore = AuthStore
  StrategyManagementSettingStore = StrategyManagementSettingStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  reactionDisposer: IReactionDisposer;
  objectiveMesureObject = {
    type: null,
    value: null,
    id:null
  }
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  otherDocumentesObject = {
    id:null,
    type: null,
    value: null
  }

  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
    frequency : null
  };
  objectiveReviewCommentSubscription: any;
  workflowHistoryOpened: boolean = false;
  objectChangeRequstWorkFlowHistorySubsscription: any;
  objectiveMesureModalModalEventSubscription: any;
  popupControlEventSubscription: any;
  otherDocumentsModalEventSubscription: any;

  constructor(private _objectiveService : ObjectiveScoreService,private _router: ActivatedRoute,private _reviewService : StrategyReviewService,
    private _utilityService: UtilityService,private _cdr: ChangeDetectorRef,private _sanitizer: DomSanitizer,
    private _profileServicce : StrategyService,private _renderer2: Renderer2,private _documentFileService: DocumentFileService,
    private _eventEmitterService: EventEmitterService,private _objectiveReviewWorkflowService : ObjectiveWorkflowService,) { }

  ngOnInit(): void {
    SubMenuItemStore.setSubMenuItems([
      // { type: "edit_modal" },
      {type: "close", path: "../strategy-scoring"}
    ]);
    this.pageChange(1)
    this.objectiveMesureModalModalEventSubscription = this._eventEmitterService.objectiveScore.subscribe(item=>{
      this.closeObjectiveMesure();
      this.pageChange(1)
      
    })
    this.objectiveReviewCommentSubscription = this._eventEmitterService.objectiveReviewCommentModal.subscribe(item => {
      this.closeCommentForm()
      this.pageChange(1)

    })
    this.objectChangeRequstWorkFlowHistorySubsscription = this._eventEmitterService.objectiveWorkflowHistoryModal.subscribe(item => {
      this.closeHistoryPopup()
    })
    this.otherDocumentsModalEventSubscription = this._eventEmitterService.otherDocuments.subscribe(item=>{
      this.closeOpenDocumentModal();
    })
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
  }

  pageChange(page:number){
    this._profileServicce.getObjectiveTargetBreakdown().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
    }

    isUser() {
      if(ObjectiveScoreStore.induvalObjective && ObjectiveScoreStore.induvalObjective.review_users.length > 0){
        // for (let i of ObjectiveScoreStore.induvalObjective.review_users) {
        //   if (i.level == ProjectChangeRequestStore?.individualChangeRequestItem?.next_review_user_level) {
            var pos = ObjectiveScoreStore.induvalObjective.review_users?.findIndex(e => e.id == AuthStore.user.id)
              if (pos != -1){
                return true;
              }
              else{
                return false
              }
          // }
        // }
      }
      else{
        return false;
      }
      
    }
    
    responsibleUser() {
      if(ObjectiveScoreStore.induvalObjective && ObjectiveScoreStore.induvalObjective.responsible_users.length > 0){
        // for (let i of ObjectiveScoreStore.induvalObjective.responsible_users) {
        //   if (i.level == ProjectChangeRequestStore?.individualChangeRequestItem?.next_review_user_level) {
            var pos = ObjectiveScoreStore.induvalObjective.responsible_users?.findIndex(e => e.id == AuthStore.user.id)
              if (pos != -1){
                return true;
              }
              else{
                return false
              }
          // }
        // }
      }
      else{
        return false;
      }
    }
     
    
    openObjectiveMesureModal(freequency){
      this._profileServicce.getObjectiveInduvalReview(freequency.id).subscribe(res=>{
        this.objectiveMesureObject.value = res;
        this.objectiveMesureObject.type =  freequency.actual_value ? 'Edit' : 'Add';
        this.openObjectiveMesureModalPopup()
        this._utilityService.detectChanges(this._cdr)
       })
    }
    
    openObjectiveMesureModalPopup(){
      // $(this.noteModal.nativeElement).modal('show');
      this._renderer2.addClass(this.objectiveScore.nativeElement,'show');
      this._renderer2.setStyle(this.objectiveScore.nativeElement,'display','block');
      this._renderer2.setStyle(this.objectiveScore.nativeElement,'z-index',99999);
      this._renderer2.setStyle(this.objectiveScore.nativeElement,'overflow','auto');
    }
    
    closeObjectiveMesure(){
      this.objectiveMesureObject.type = null;
      
      // $(this.kpiMesure.nativeElement).modal('hide');
      this._renderer2.removeClass(this.objectiveScore.nativeElement,'show');
      this._renderer2.setStyle(this.objectiveScore.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }
    
    submitProjectForReview(id){
      ObjectiveWorkflowStore.selectedId = id
      this.popupObject.type = 'Confirm';
      this.popupObject.title = 'submit';
      this.popupObject.subtitle = 'Are you sure you want to submit this review?';
      AppStore.enableLoading();
      setTimeout(() => {
        $(this.confirmationPopUp.nativeElement).modal('show');
      }, 100);
      this._utilityService.detectChanges(this._cdr);
    
    }
    
      // modal control event
      modalControl(status: boolean) {
        switch (this.popupObject.title) { 
            case 'submit': this.submitAccepted(status)
            break;
             
        }
      }
    
      submitAccepted(status){
        if(status){
          this._objectiveReviewWorkflowService.submitProject(ObjectiveWorkflowStore.selectedId).subscribe(res=>{
            // SubMenuItemStore.submitClicked = false;
            // this.getInduvalObjective(ObjectiveScoreStore.selectedobjectiveId);
            AppStore.disableLoading();
            this.pageChange(1)
            this._utilityService.detectChanges(this._cdr);
          },
          (error)=>{
            // SubMenuItemStore.submitClicked = false;
          })
          
        }else{
          AppStore.disableLoading();
          SubMenuItemStore.submitClicked = false;
        }
        setTimeout(() => {
          AppStore.disableLoading();
          $(this.confirmationPopUp.nativeElement).modal('hide');
        }, 250);
       }
    
       approveWorkflow(type,id) {
     
          ObjectiveScoreStore.type = type;
          ObjectiveWorkflowStore.selectedId = id
          ObjectiveScoreStore.commentForm = true;
          AppStore.enableLoading();
        $(this.commentModal.nativeElement).modal('show');
        this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
        this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
        this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
      }
      
      closeCommentForm() {
        // this.setSubMenuItems();
        ObjectiveScoreStore.type = '';
        ObjectiveScoreStore.commentForm = false;
        $(this.commentModal.nativeElement).modal('hide');
        AppStore.disableLoading();
        this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 9);
        this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'none');
        this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'none');
        $('.modal-backdrop').remove();
      
        this._utilityService.detectChanges(this._cdr)
      }
    
      openHistoryPopup(freequency) {
        ObjectiveWorkflowStore.selectedId = freequency.id
        ObjectiveWorkflowStore.setCurrentPage(1);
        this._objectiveReviewWorkflowService.getHistory(ObjectiveWorkflowStore.selectedId).subscribe(res => {
          this.workflowHistoryOpened = true;
          this._utilityService.detectChanges(this._cdr);
          $(this.workflowHistory.nativeElement).modal('show');
        });
      }
      
      closeHistoryPopup() {
        this.workflowHistoryOpened = false;
        $(this.workflowHistory.nativeElement).modal('hide');
      }

       // Returns image url according to type and token
    createImageUrl(type, token) {
      return this._reviewService.getThumbnailPreview(type, token);
    }

    reviewDocuments(files){
      let item = files.slice(0,3)
    return item
   }

   viewObjectiveDocument( type, docuDetails ,frequencyId,documentFile) {
    switch (type) {
      case "objective-document":
    this._reviewService.getObjectiveFilePreview(docuDetails,frequencyId).subscribe(res=>{
      var resp: any = this._utilityService.getDownLoadLink(
        res,
        docuDetails.name
      );
      this.openPreviewModal(type, resp, documentFile, docuDetails, frequencyId );
    }),
    (error) => {
      if (error.status == 403) {
        this._utilityService.showErrorMessage(
          "Error",
          "permission_denied"
        );
      } else {
        this._utilityService.showErrorMessage(
          "Error",
          "unable_generate_preview"
        );
      }
    };
    break;
    case "document-version":
      this._documentFileService
        .getFilePreview(type, docuDetails.document_id, documentFile.id)
        .subscribe((res) => {
          var resp: any = this._utilityService.getDownLoadLink(
            res,
            docuDetails.title
          );
          this.openPreviewModal(type, resp, documentFile, docuDetails,frequencyId);
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

  getToken(doc){
    let token = null
    if(doc.kh_document){
      doc.kh_document.versions.map(data=>{
        if(data.is_latest){
          token = data
        }
      })
    }
    return token
  }

  openPreviewModal(type,filePreview, documentFiles, document , frequencyId) {
    this.previewObject.component=type
    let previewItem = null;
    if (filePreview) {
      previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
      this.previewObject.preview_url = previewItem;
      this.previewObject.file_details = documentFiles;
      this.previewObject.componentId = document.id;
      this.previewObject.frequency = frequencyId

      
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

   openOtherDocumentsModal(users,id){
    event.stopPropagation();
    this.otherDocumentesObject.type = 'Add';
    this.otherDocumentesObject.id = id
    this.otherDocumentesObject.value = users
    this.openOtherDocuments()
  }
  openOtherDocuments(){
    // $(this.milestoneModal.nativeElement).modal('show');
    this._renderer2.addClass(this.otherDocumentes.nativeElement,'show');
    this._renderer2.setStyle(this.otherDocumentes.nativeElement,'display','block');
    this._renderer2.setStyle(this.otherDocumentes.nativeElement,'z-index',99999);
  }
  
  closeOpenDocumentModal(){
    setTimeout(() => {
      // $(this.otherDocumentes.nativeElement).modal('hide');
      this.otherDocumentesObject.type = null;
      this.otherDocumentesObject.value = null;
      this._renderer2.removeClass(this.otherDocumentes.nativeElement,'show');
      this._renderer2.setStyle(this.otherDocumentes.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }

    ngOnDestroy(){
      this.objectiveMesureModalModalEventSubscription.unsubscribe();
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      this.popupControlEventSubscription.unsubscribe();
      this.objectiveReviewCommentSubscription.unsubscribe()
      this.objectChangeRequstWorkFlowHistorySubsscription.unsubscribe()
      this.otherDocumentsModalEventSubscription.unsubscribe();
    }

}
