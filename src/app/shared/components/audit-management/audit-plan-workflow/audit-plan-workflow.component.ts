import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
// import { AmAuditPlanWorkflowStore } from 'src/app/stores/risk-management/risks/risk-info-workflow.store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
// import { AmAuditPlansStore } from 'src/app/stores/risk-management/risks/risks.store';
// import { RiskInfoWorkflowService } from 'src/app/core/services/risk-management/risks/risk-info-workflow/risk-info-workflow.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { AuthStore } from 'src/app/stores/auth.store';
// import { RisksService } from 'src/app/core/services/risk-management/risks/risks.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AppStore } from 'src/app/stores/app.store';
import { AmAuditPlansStore } from 'src/app/stores/audit-management/am-audit-plan/am-audit-plan.store';
import { AmAuditPlanWorkflowStore } from 'src/app/stores/audit-management/am-audit-plan/am-audit-plan-workflow.store';
import { AmAuditPlanWorkflowService } from 'src/app/core/services/audit-management/am-audit-plan/am-audit-plan-workflow/am-audit-plan-workflow.service';
declare var $: any;

@Component({
  selector: 'app-audit-plan-workflow',
  templateUrl: './audit-plan-workflow.component.html',
  styleUrls: ['./audit-plan-workflow.component.scss']
})
export class AuditPlanWorkflowComponent implements OnInit {

   // @ViewChild('commentModal') commentModal: ElementRef;
AmAuditPlanWorkflowStore = AmAuditPlanWorkflowStore;
AmAuditPlansStore = AmAuditPlansStore;
AuthStore = AuthStore;
workflowCommentEventSubscription:any;
OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
AppStore = AppStore;
WorkflowEmptyMessage = "empty_workflow_title"
  constructor(private _eventEmitterService:EventEmitterService,
    private _humanCapitalService:HumanCapitalService,
    private _imageService:ImageServiceService,
    private _helperService:HelperServiceService) { }

  ngOnInit(): void {

  }

  createImageUrl(type, token) {
    return this._humanCapitalService.getThumbnailPreview(type,token);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  isUser(){
    for(let i of AmAuditPlanWorkflowStore?.workflowDetails){
      if(i.level==AmAuditPlansStore.individualAuditPlanDetails.next_review_user_level){
       var pos=i.audit_plan_workflow_item_users.findIndex(e=>e.id==AuthStore.user?.id)
       if(pos!=-1)
         return true;
       else
        return false
      }
    }
  }
   checkStatus(workflow) {
    var className = 'work-flow-review-approval work-flow-approval work-flow-audit-new box-shadow-none'
    // *Checking and setting class name based on document status type.

    if (!workflow.workflow_status) {
      
      if (workflow.level == AmAuditPlansStore.individualAuditPlanDetails?.next_review_user_level)
      className = className+' '+'pending active'
    else
      className = className+' '+'pending'
    }
    else {
      
    
    switch (workflow.workflow_status?.id) {

      case 5:
        
        if (workflow.level == AmAuditPlansStore.individualAuditPlanDetails?.next_review_user_level)
          className = className+' '+'approved active'
        else
          className = className+' '+'approved '
        
        break;
      
      case 4:
        
          if (workflow.level == AmAuditPlansStore.individualAuditPlanDetails?.next_review_user_level)
          className = className+' '+'rejected active'
        else
          className = className+' '+'rejected '
        
        break;
      
      case 1: 
        
          if (workflow.level == AmAuditPlansStore.individualAuditPlanDetails?.next_review_user_level)
          className = className+' '+'pending active'
        else
          className = className+' '+'pending'
        
        break;
       
        case 3: 
        
        if (workflow.level == AmAuditPlansStore.individualAuditPlanDetails?.next_review_user_level)
        className = className+' '+'reverted active'
      else
        className = className+' '+'reverted'
      
        break;
      
      default:
        break;
      }
    }

    // this.checkAllignment(workflow)

    return className

    

  }

  // reviewRisk(){
  //   AppStore.enableLoading();
  //   this._riskInfoWorkflowService.reviewRisk(AmAuditPlansStore.riskId).subscribe(res=>{
  //       this._risksService.getItem(AmAuditPlansStore.riskId).subscribe(()=>this._utilityService.detectChanges(this._cdr))
  //       AppStore.disableLoading();
  //       this._utilityService.detectChanges(this._cdr);
  //     })
  // }
  
  getButtonText(text) {
   
    return this._helperService.translateToUserLanguage(text);


  }

  // approveRisk(type?){
  //   if(type){
  //     AmAuditPlanWorkflowStore.type='submit';
  //   }
  //   else
  //   AmAuditPlanWorkflowStore.type='approve';
  //   AmAuditPlanWorkflowStore.commentForm = true;
  //   $(this.commentModal.nativeElement).modal('show');
  //   this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
  //     this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
  //     this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
  //   // this._riskInfoWorkflowService.approveRisk(AmAuditPlansStore.riskId,{}).subscribe(res=>{
  //   //   this._risksService.getItem(AmAuditPlansStore.riskId).subscribe(()=>this._utilityService.detectChanges(this._cdr))
     
  //   //   this._utilityService.detectChanges(this._cdr);
  //   // })
  // }

  // closeCommentForm(){
  //   AmAuditPlanWorkflowStore.type = '';
  //   AmAuditPlanWorkflowStore.commentForm=false;
  //   $(this.commentModal.nativeElement).modal('hide');
  //   this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 9);
  //   this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'none');
  //   this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'none');
  //   this._utilityService.detectChanges(this._cdr)
  // }

  // revertRisk(){
  //   AmAuditPlanWorkflowStore.type='revert';
  //   AmAuditPlanWorkflowStore.commentForm = true;
  //   $(this.commentModal.nativeElement).modal('show');
  //   this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
  //   this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
  //   this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
  // }

  getCreatedByPopupDetails(users) {
    let userDetails: any = {};

      userDetails['first_name'] = users?.first_name;
      userDetails['last_name'] = users?.last_name;
      userDetails['designation'] = users?.designation;
      userDetails['image_token'] = users?.image?.token;
      userDetails['email'] = users?.email;
      userDetails['mobile'] = users?.mobile;
      userDetails['id'] = users?.id;
      userDetails['department'] = users?.department;
      userDetails['status_id'] = users?.status?.id;
      userDetails['created_at'] = null;
    return userDetails;

  }



  closeWorkflowModal(){
    this._eventEmitterService.dismissAuditPlanWorkflowModal();
  }

}
