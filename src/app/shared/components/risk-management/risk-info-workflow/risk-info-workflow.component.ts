import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { RiskInfoWorkflowStore } from 'src/app/stores/risk-management/risks/risk-info-workflow.store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { RisksStore } from 'src/app/stores/risk-management/risks/risks.store';
import { RiskInfoWorkflowService } from 'src/app/core/services/risk-management/risks/risk-info-workflow/risk-info-workflow.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { RisksService } from 'src/app/core/services/risk-management/risks/risks.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AppStore } from 'src/app/stores/app.store';
declare var $: any;
@Component({
  selector: 'app-risk-info-workflow',
  templateUrl: './risk-info-workflow.component.html',
  styleUrls: ['./risk-info-workflow.component.scss']
})
export class RiskInfoWorkflowComponent implements OnInit {
  // @ViewChild('commentModal') commentModal: ElementRef;
RiskInfoWorkflowStore = RiskInfoWorkflowStore;
RisksStore = RisksStore;
AuthStore = AuthStore;
workflowCommentEventSubscription:any;
OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
AppStore = AppStore;
WorkflowEmptyMessage = "empty_workflow_title"
  constructor(private _eventEmitterService:EventEmitterService,
    private _humanCapitalService:HumanCapitalService,
    private _imageService:ImageServiceService,
    private _riskInfoWorkflowService:RiskInfoWorkflowService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _risksService:RisksService,
    private _renderer2:Renderer2,
    private _helperService:HelperServiceService) { }

  ngOnInit(): void {
    // this.workflowCommentEventSubscription = this._eventEmitterService.RiskWorkflowCommentModal.subscribe(item => {
    //   this.closeCommentForm();
    // })
  }

  createImageUrl(type, token) {
    return this._humanCapitalService.getThumbnailPreview(type,token);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  isUser(){
    for(let i of RiskInfoWorkflowStore?.workflowDetails){
      if(i.level==RisksStore.individualRiskDetails.next_review_user_level){
       var pos=i.risk_workflow_item_users.findIndex(e=>e.id==AuthStore.user.id)
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
      
      if (workflow.level == RisksStore.individualRiskDetails?.next_review_user_level)
      className = className+' '+'pending active'
    else
      className = className+' '+'pending'
    }
    else {
      
    
    switch (workflow.workflow_status?.id) {

      case 5:
        
        if (workflow.level == RisksStore.individualRiskDetails?.next_review_user_level)
          className = className+' '+'approved active'
        else
          className = className+' '+'approved '
        
        break;
      
      case 4:
        
          if (workflow.level == RisksStore.individualRiskDetails?.next_review_user_level)
          className = className+' '+'rejected active'
        else
          className = className+' '+'rejected '
        
        break;
      
      case 1: 
        
          if (workflow.level == RisksStore.individualRiskDetails?.next_review_user_level)
          className = className+' '+'pending active'
        else
          className = className+' '+'pending'
        
        break;
       
        case 3: 
        
        if (workflow.level == RisksStore.individualRiskDetails?.next_review_user_level)
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
  //   this._riskInfoWorkflowService.reviewRisk(RisksStore.riskId).subscribe(res=>{
  //       this._risksService.getItem(RisksStore.riskId).subscribe(()=>this._utilityService.detectChanges(this._cdr))
  //       AppStore.disableLoading();
  //       this._utilityService.detectChanges(this._cdr);
  //     })
  // }
  
  getButtonText(text) {
   
    return this._helperService.translateToUserLanguage(text);


  }

  // approveRisk(type?){
  //   if(type){
  //     RiskInfoWorkflowStore.type='submit';
  //   }
  //   else
  //   RiskInfoWorkflowStore.type='approve';
  //   RiskInfoWorkflowStore.commentForm = true;
  //   $(this.commentModal.nativeElement).modal('show');
  //   this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
  //     this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
  //     this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
  //   // this._riskInfoWorkflowService.approveRisk(RisksStore.riskId,{}).subscribe(res=>{
  //   //   this._risksService.getItem(RisksStore.riskId).subscribe(()=>this._utilityService.detectChanges(this._cdr))
     
  //   //   this._utilityService.detectChanges(this._cdr);
  //   // })
  // }

  // closeCommentForm(){
  //   RiskInfoWorkflowStore.type = '';
  //   RiskInfoWorkflowStore.commentForm=false;
  //   $(this.commentModal.nativeElement).modal('hide');
  //   this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 9);
  //   this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'none');
  //   this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'none');
  //   this._utilityService.detectChanges(this._cdr)
  // }

  // revertRisk(){
  //   RiskInfoWorkflowStore.type='revert';
  //   RiskInfoWorkflowStore.commentForm = true;
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
    this._eventEmitterService.dismissRiskInfoWorkflowModal();
  }

}
