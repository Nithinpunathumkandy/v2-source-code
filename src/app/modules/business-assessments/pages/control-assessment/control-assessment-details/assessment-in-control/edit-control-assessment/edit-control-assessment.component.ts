import { Component, OnInit,ChangeDetectorRef,ViewChild,ElementRef } from '@angular/core';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { autorun, IReactionDisposer } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ControlAssessmentStore } from 'src/app/stores/business-assessments/control-assessment/control-assessment.store';
import { ControlAssessmentDetailsStore } from 'src/app/stores/business-assessments/control-assessment/control-assessment-details-store';
import { ControlAssessmentInnerDetailsService } from 'src/app/core/services/business-assessments/control-asessment/control-assessment-inner-details/control-assessment-inner-details.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AppStore } from 'src/app/stores/app.store';
import { number } from '@amcharts/amcharts4/core';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';

declare var $: any;
@Component({
  selector: 'app-edit-control-assessment',
  templateUrl: './edit-control-assessment.component.html',
  styleUrls: ['./edit-control-assessment.component.scss']
})
export class EditControlAssessmentComponent implements OnInit {
  @ViewChild('formModal') formModal: ElementRef;
  reactionDisposer: IReactionDisposer;
  ControlAssessmentStore=ControlAssessmentStore;
  ControlAssessmentDetailsStore=ControlAssessmentDetailsStore;
  BreadCrumbMenuItemStore=BreadCrumbMenuItemStore;
  allControl=[];
  actionPlanModalObject = {
    values: null,
    type: null,
    controlId:number
  };
  actionPlanSubscriptionEvent: any = null;
  assessmentId:number;
  AppStore=AppStore;
  childClauses=[];
  business_assessment_framework_option_ids:null;
  maturity_model_level_ids:null;
  control_assessment_document_version_content_ids:null;
  NoDataItemStore=NoDataItemStore;
  controlDetails:any;
  assessmentLoader=false;
  filterApplied=false;
  searchKeyword:string='';
  constructor(
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _route: ActivatedRoute,
    private _router: Router,
    private _eventEmitterService: EventEmitterService,
    private _documentFileService: DocumentFileService,
    private _controlAssessmentInnerDetailsService: ControlAssessmentInnerDetailsService,
  ) { }

  ngOnInit(): void {
    // BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    // if(!BreadCrumbMenuItemStore.refreshBreadCrumbMenu){
    //   BreadCrumbMenuItemStore.makeEmpty();
    //   BreadCrumbMenuItemStore.addBreadCrumbMenu({
    //     name:"assessments",
    //     path:`/business-assessments/control-assessments/`+ControlAssessmentStore?.docversionId
    //   });
    // }
    this._route.params.subscribe(params => {
      this.assessmentId = +params['assessmentId']; 
      this.getDetails(this.assessmentId);
      //this.getChildClausesList();
    })
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: '', submenuItem: { type: 'close',path: '/business-assessments/control-assessments/'+ControlAssessmentStore?.docversionId+'/assessments' } },
      ]

      this._helperService.checkSubMenuItemPermissions(1800, subMenuItems);
      NoDataItemStore.setNoDataItems({title: "cyber_no_controls_assigned",});
    })
    this.actionPlanSubscriptionEvent = this._eventEmitterService.controlAssessmentActionModalControl.subscribe(res => {
      this.closeFormModal();
    })
  }

  addNewActionPlan(item){
    this.actionPlanModalObject.type = 'Add';
    this.actionPlanModalObject.controlId=item.id;
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  updateFrame(event,item)
  {

    if(event)
    {
      this._controlAssessmentInnerDetailsService.updateAssessment(item.id,event,this.assessmentId).subscribe(res => {
        this.getDetails(this.assessmentId);
        this._utilityService.detectChanges(this._cdr);
      })
    }
    
  }
  getChildClausesList(event?)
  {
    this.business_assessment_framework_option_ids=null;
    this.maturity_model_level_ids = null
    if(this.assessmentId)
    {
      let params='?control_assessment_ids='+this.assessmentId;
      if(event)params=params+'&q='+event.term;
      this._controlAssessmentInnerDetailsService.getChildClauses(params).subscribe(res => {
        this.childClauses=res['data'];
        this._utilityService.detectChanges(this._cdr);
      })
    }
    
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
 
  }
  getCountOfClosedActionPlan(data)
  {
    let num=0;
    for(let i of data)
    {
      if(i.control_assessment_action_plan_status.type!='closed')
      {
        num++;
      }
    }
    return num;
  }

  closeFormModal() {
    //this.pageChange(1);
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('hide');
    }, 100);
    this.getDetails(this.assessmentId);
    this.actionPlanModalObject.type = null;
  }
  getDetails(id)
  { 
    //this.assessmentLoader=true;
    this._controlAssessmentInnerDetailsService.getItem(id).subscribe(res => {
      this.controlDetails=res.control_assessment_document_version_contents;
      this.applyFilter();
      this._utilityService.detectChanges(this._cdr);
    })
  }
  filter()
  {
    this.assessmentLoader=false;
    this.filterApplied=true;
    this.getDetails(this.assessmentId);
  }
  applyFilter()
  { 
    this.assessmentLoader=true;
    if(this.control_assessment_document_version_content_ids)
     {
        const data=ControlAssessmentDetailsStore?.indiviaulControlAssessment?.control_assessment_document_version_contents.find(e=>e.id==this.control_assessment_document_version_content_ids)
        if(data)
        {
          //console.log(data)
          this.controlDetails=[]
          this.controlDetails.push(data);
          if(this.business_assessment_framework_option_ids)
          {
            this.filterFramework()
          }
          if(this.maturity_model_level_ids)
          {
            this.checkMaturityLevel();
          }
        }
        else{
          this.controlDetails=[];
        }
     }
     else{
      this.controlDetails=ControlAssessmentDetailsStore?.indiviaulControlAssessment?.control_assessment_document_version_contents;
     }
  }
  resetFilter()
  {
    this.filterApplied=false;
    this.assessmentLoader=false;
    this.searchKeyword=null;
    this.business_assessment_framework_option_ids=null;
    this.control_assessment_document_version_content_ids=null;
    this.maturity_model_level_ids=null;
    this.getDetails(this.assessmentId);

  }
  filterFramework()
  {
    let controlsArray=this.controlDetails[0]?.control_assessment_document_version_content_controls;
    this.controlDetails[0]['control_assessment_document_version_content_controls']=[];
    for(let i of controlsArray)
    {
      if(i.business_assessment_framework_option_id==this.business_assessment_framework_option_ids)
      {
        this.controlDetails[0].control_assessment_document_version_content_controls.push(i);
      }
    }
    
  }
  checkMaturityLevel()
  {
    let controlsArray=this.controlDetails[0]?.control_assessment_document_version_content_controls;
    this.controlDetails[0]['control_assessment_document_version_content_controls']=[];
    for(let i of controlsArray)
    {
      if(i.maturity_model_level_id==this.maturity_model_level_ids)
      {
        this.controlDetails[0].control_assessment_document_version_content_controls.push(i);
      }
    }
    
  }
  
  getChildClause(item)
  { 
    let data=[]
   
      if(item.length)
      {
        for(let i of item)
        {
          //data.push(i);
          if(i.document_version_children_contents.length)
          {
            for(let j of i.document_version_children_contents)
            {
              data.push(j);
            }
          }
         
        }
      }

     return data;
  }
 
  getAllControlsMainClause(item)
  {
     this.allControl=[];
     this.allControl=item?.control_assessment_document_version_content_controls;
    return  this.allControl;
  }
  getInnerControl(data)
  {
    for (let k of data)
    {   
          if(k.control_assessment_document_version_content_controls.length)
          {
            for(let i of k.control_assessment_document_version_content_controls)
            {
              this.allControl.push(i);
            }
          }
          if(k?.document_version_children_contents?.length)
          {
            this.getInnerControl(k.document_version_children_contents);
          }
          
    }
    return this.allControl;
  }

  getSubClauseCountSpan(subClause,conrols)
  {
      return parseInt(conrols)/parseInt(subClause);
  }
  listActionPlan(item)
  {
    ControlAssessmentDetailsStore.setControlId(item.id);
    ControlAssessmentDetailsStore.setControlAssessmentId(this.assessmentId);
    this._router.navigateByUrl('/business-assessments/control-assessments/'+ControlAssessmentStore?.docversionId+'/action-plan');
  }
  searchClause()
  {
    if(this.searchKeyword)
    {
      
      //this.searchKeyword=this.searchKeyword.replace(/\s+/, "");
      //console.log(this.searchKeyword)
      
     // this.controlDetails=this.controlDetails.filter((obj) => obj.document_version_content['title'] == this.searchKeyword);
     if(this.searchKeyword.indexOf('.'))
     {
      let splitedItem:any;
      splitedItem=this.searchKeyword;
      splitedItem=splitedItem.split('.');
      console.log(splitedItem);
      this.controlDetails=this.controlDetails.filter((x) => x.document_version_content?.title.includes(splitedItem[1] || splitedItem[0].trim() ) || x.document_version_content?.clause_number.includes(splitedItem[0].trim() || splitedItem[1].trim()))
     }
     else
     {
      this.controlDetails=this.controlDetails.filter((x) => x.document_version_content?.title.includes(this.searchKeyword) || x.document_version_content?.clause_number.includes(this.searchKeyword))
     }
      
    }
    
  }
  doewnloadDocument()
  {
    this._documentFileService.downloadFile('document-version', ControlAssessmentStore?.docDetails.id, ControlAssessmentDetailsStore?.assessmentDocumentVersionId, null, ControlAssessmentStore?.docDetails.document_version_title, ControlAssessmentStore?.docDetails);
  }
  
  ngOnDestroy(): void {
    if (this.reactionDisposer) this.reactionDisposer();
    this.actionPlanSubscriptionEvent.unsubscribe();
    ControlAssessmentDetailsStore.unsetInnerControlAsessmentDetails();
  }

}
