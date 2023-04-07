import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IReactionDisposer } from 'mobx';
import { KpiService } from 'src/app/core/services/strategy-management/kpi/kpi.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { StrategyReviewService } from 'src/app/core/services/strategy-management/review/strategy-review.service';
import { StrategyService } from 'src/app/core/services/strategy-management/strategy/strategy.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { KpiStore } from 'src/app/stores/strategy-management/kpi.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { KpiWorkflowStore } from 'src/app/stores/strategy-management/kpi-workflow.store';
import { KpiWorkflowService } from 'src/app/core/services/strategy-management/kpi-workflow/kpi-workflow.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ObjectiveWorkflowStore } from 'src/app/stores/strategy-management/objective-workflow.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { AppStore } from 'src/app/stores/app.store';
import { StrategyStore } from 'src/app/stores/strategy-management/strategy.store';
import { StrategyManagementSettingStore } from 'src/app/stores/settings/strategy-management-settings.store';
declare var $: any;


@Component({
  selector: 'app-kpi-frequency-list',
  templateUrl: './kpi-frequency-list.component.html',
  styleUrls: ['./kpi-frequency-list.component.scss']
})


export class KpiFrequencyListComponent implements OnInit {
  @ViewChild('kpiMesure') kpiMesure: ElementRef;
  @ViewChild('otherDocumentes', {static: true}) otherDocumentes: ElementRef;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('commentModal') commentModal: ElementRef;
  @ViewChild('workflowHistory') workflowHistory: ElementRef;

  reactionDisposer: IReactionDisposer;
  kpiMesureModalModalEventSubscription: any;
  otherDocumentsModalEventSubscription: any;
  popupControlEventSubscription: any;
  objectiveReviewCommentSubscription: any;
  kpiReviewCommentSubscription: any;
  workflowHistoryOpened: boolean = false;
  workflowModalOpened: boolean = false;
  kpiWorkFlowHistorySubsscription: any;
  KpiStore = KpiStore
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AppStore = AppStore
  AuthStore = AuthStore
  StrategyStore = StrategyStore;
  KpiWorkflowStore = KpiWorkflowStore
  StrategyManagementSettingStore = StrategyManagementSettingStore;
  
  kpiMesureObject = {
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

  kpiMesureData ={
    type: null,
    value: null,
    id:null
  }

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

  constructor(private _startegySercive : StrategyService,private _router: ActivatedRoute,private _renderer2: Renderer2,private _kpiService : KpiService,private _documentFileService: DocumentFileService,
    private _cdr: ChangeDetectorRef, private _utilityService: UtilityService,private _eventEmitterService: EventEmitterService,private _reviewService : StrategyReviewService,
    private _sanitizer: DomSanitizer,private _kpiWorkflowService : KpiWorkflowService) { }

  ngOnInit(): void {
    SubMenuItemStore.setSubMenuItems([
      // { type: "edit_modal" },
      {type: "close", path: "../strategy-scoring"}
    ]);
    this.kpiMesureModalModalEventSubscription = this._eventEmitterService.kpiMesureModal.subscribe(item=>{
      this.closekpiMesure();
      this.getInduvalKpi(KpiStore.selectedKpiId);
      this.getReviewFreequency(KpiStore.selectedKpiId)
    })

    this.kpiWorkFlowHistorySubsscription = this._eventEmitterService.strategyKpiWorkflowHistoryModal.subscribe(item => {
      this.closeHistoryPopup()
    })

    this.kpiReviewCommentSubscription = this._eventEmitterService.kpiReviewCommentModal.subscribe(item => {
      this.closeCommentForm()
      this.getInduvalKpi(KpiStore.selectedKpiId);
      this.getReviewFreequency(KpiStore.selectedKpiId)

    })
    this.otherDocumentsModalEventSubscription = this._eventEmitterService.otherDocuments.subscribe(item=>{
      this.closeOpenDocumentModal();
    })
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
  }

   // Returns image url according to type and token
   createImageUrl(type, token) {
    return this._reviewService.getThumbnailPreview(type, token);
  }

  reviewDocuments(files){
    let item = files.slice(0,3)
  return item
 }

 getInduvalKpi(id){
  this._kpiService.induvalKpi(id).subscribe(res=>{
    this._utilityService.detectChanges(this._cdr);

  })
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

openKpiMesureModal(f){
   this._kpiService.getIndivalReview(f.kpi_id,f.id).subscribe(res=>{
    this.kpiMesureObject.value = res;
    this.kpiMesureObject.type =  f.actual_value ? 'Edit' : 'Add';
    this.openKpiMesureModalPopup()
    this._utilityService.detectChanges(this._cdr)
   })


}

openKpiMesureModalPopup(){
  // $(this.noteModal.nativeElement).modal('show');
  this._renderer2.addClass(this.kpiMesure.nativeElement,'show');
  this._renderer2.setStyle(this.kpiMesure.nativeElement,'display','block');
  this._renderer2.setStyle(this.kpiMesure.nativeElement,'z-index',99999);
  this._renderer2.setStyle(this.kpiMesure.nativeElement,'overflow','auto');
}

closekpiMesure(){
  this.kpiMesureObject.type = null;
  
  // $(this.kpiMesure.nativeElement).modal('hide');
  this._renderer2.removeClass(this.kpiMesure.nativeElement,'show');
  this._renderer2.setStyle(this.kpiMesure.nativeElement,'display','none');
  $('.modal-backdrop').remove();
  this._utilityService.detectChanges(this._cdr);
}

getReviewFreequency(id,newPage:number = null){
  this._kpiService.getKpiReviews(id).subscribe(res=>{
    this._utilityService.detectChanges(this._cdr)
  })
}


    // for file preview

    viewKpiDocument( type, docuDetails ,frequencyId,documentFile) {
      switch (type) {
        case "kpi-document":
      this._reviewService.getFilePreview(docuDetails,frequencyId).subscribe(res=>{
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

    isUser() {
      if(KpiStore.induvalKpi && KpiStore.induvalKpi.review_users){
        // for (let i of KpiStore.induvalKpi.review_users) {
        //   if (i.level == ProjectChangeRequestStore?.individualChangeRequestItem?.next_review_user_level) {
            var pos = KpiStore.induvalKpi.review_users?.findIndex(e => e.id == AuthStore.user.id)
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
      if(KpiStore.induvalKpi && KpiStore.induvalKpi?.responsible_users){
        // for (let i of KpiStore.induvalKpi.responsible_users) {
        //   if (i.level == ProjectChangeRequestStore?.individualChangeRequestItem?.next_review_user_level) {
            var pos = KpiStore.induvalKpi.responsible_users?.findIndex(e => e.id == AuthStore.user.id)
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


    submitKpiForReview(id){
      KpiWorkflowStore.selectedId = id
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
          this._kpiWorkflowService.submitProject(KpiWorkflowStore.selectedId).subscribe(res=>{
            // SubMenuItemStore.submitClicked = false;
            AppStore.disableLoading();
                  this.getReviewFreequency(KpiStore.selectedKpiId)
            this._utilityService.detectChanges(this._cdr);
          },
          (error)=>{
            SubMenuItemStore.submitClicked = false;
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

        KpiWorkflowStore.type = type;
        KpiWorkflowStore.selectedId = id
        KpiWorkflowStore.commentForm = true;
        
      $(this.commentModal.nativeElement).modal('show');
      AppStore.enableLoading();
      this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
      this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
    }
    
    closeCommentForm() {
      // this.setSubMenuItems();
      KpiWorkflowStore.type = '';
      KpiWorkflowStore.commentForm = false;
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
      this._kpiWorkflowService.getHistory(ObjectiveWorkflowStore.selectedId).subscribe(res => {
        this.workflowHistoryOpened = true;
        $(this.workflowHistory.nativeElement).modal('show');
        this._renderer2.setStyle(this.workflowHistory.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.workflowHistory.nativeElement, 'overflow', 'auto');
      this._renderer2.setStyle(this.workflowHistory.nativeElement, 'display', 'block')
        this._utilityService.detectChanges(this._cdr);
      });

    }
    
    closeHistoryPopup() {
      this.workflowHistoryOpened = false;
      this._renderer2.setStyle(this.workflowHistory.nativeElement, 'z-index', 9999);
      this._renderer2.setStyle(this.workflowHistory.nativeElement, 'overflow', 'none');
      this._renderer2.setStyle(this.workflowHistory.nativeElement, 'display', 'none');
      $('.modal-backdrop').remove();
    }

    openWorkflowPopup(item) {
      this._kpiWorkflowService.getWorkFlow(item.id).subscribe(res => {
        this.workflowModalOpened = true;
        this._utilityService.detectChanges(this._cdr);
        // $(this.workflowModal.nativeElement).modal('show');
        // this._renderer2.setStyle(this.workflowModal.nativeElement, 'z-index', 99999);
        // this._renderer2.setStyle(this.workflowModal.nativeElement, 'overflow', 'auto');
      })
    }
  
    closeWorkflowPopup() {
      this.workflowModalOpened = false;
      // $(this.workflowModal.nativeElement).modal('hide');
      // this._renderer2.setStyle(this.workflowModal.nativeElement, 'z-index', 9);
      // this._renderer2.setStyle(this.workflowModal.nativeElement, 'overflow', 'none');
      // $('.modal-backdrop').remove();
    }

    ngOnDestroy(){
      this.otherDocumentsModalEventSubscription.unsubscribe();
      this.kpiMesureModalModalEventSubscription.unsubscribe()
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      this.kpiReviewCommentSubscription.unsubscribe()
      this.popupControlEventSubscription.unsubscribe()
      this.kpiWorkFlowHistorySubsscription.unsubscribe()
    }

}
