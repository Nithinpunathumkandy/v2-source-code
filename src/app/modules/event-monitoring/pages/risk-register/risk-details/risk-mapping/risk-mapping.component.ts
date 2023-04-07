import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';
import { RiskRegisterService } from 'src/app/core/services/event-monitoring/risk-register/risk-register.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { RiskRegisterStore } from 'src/app/stores/event-monitoring/risk-register/risk-register-store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { IssueListStore } from 'src/app/stores/organization/context/issue-list.store';
declare var $: any;
@Component({
  selector: 'app-risk-mapping',
  templateUrl: './risk-mapping.component.html',
  styleUrls: ['./risk-mapping.component.scss']
})
export class RiskMappingComponent implements OnInit {
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('issueFormModal') issueFormModal: ElementRef;
  RiskRegisterStore = RiskRegisterStore
  IssueListStore = IssueListStore
  AppStore = AppStore
  AuthStore = AuthStore
  issueSelectSubscription: Subscription
  deleteEventSubscription: Subscription
  reactionDisposer: IReactionDisposer
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  deleteObject = {
    id: null,
    title: '',
    type: '',
    subtitle: ''
  };
  modalObject = {
    component: 'event_risk',
  }
  issues = [];
  issueItem = [];
  constructor(
    private _helperService: HelperServiceService,
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _riskRegisterService: RiskRegisterService,
  ) { }

  ngOnInit(): void {

    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    this.issueSelectSubscription = this._eventEmitterService.issueSelect.subscribe(item => {
      console.log("ghj");
      
      this.closeIssues();
      // this.selectIssues()
      
    })
    this.reactionDisposer = autorun(() => {
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_risk_issues'});

    if(NoDataItemStore.clikedNoDataItem){
      this.selectIssues();
      NoDataItemStore.unSetClickedNoDataItem();
    }
    
  })

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      console.log(item,"oooooooo");
      
      this.delete(item);
    });

    this.selectIssues()
    
  }

  closeIssues() {
    if (IssueListStore?.saveSelected) {
      console.log("fgh");
      
      let saveData = {
        organization_issue_ids: this.getIds(IssueListStore?.selectedIssuesList)
      }
      this._riskRegisterService.saveIssueMapping(saveData).subscribe(res => {
        this.getRiskDetails()
        IssueListStore.issue_select_form_modal = false;
        $(this.issueFormModal.nativeElement).modal('hide');
        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      // this.getRiskMapping();
      console.log("fghelse");
      IssueListStore.issue_select_form_modal = false;
      // this.getComplianceMappingDetails(ComplianceRegisterStore.complianceRegisterId)
      $(this.issueFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }
    // this.selectIssues()
    this._renderer2.setStyle(this.issueFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
  }

  getRiskDetails(){
    this._riskRegisterService.getItem(RiskRegisterStore.RiskRegisterId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }
  getIds(data) {
    let idArray = [];
    for (let i of data) {
      idArray.push(i.id)
    }
    return idArray;
  }


  getArrayProcessed(department) {
    if (typeof department === 'object') {
      return this._helperService.getArrayProcessed(department, 'title').toString();
    }
    else {
      return department;
    }
  }

  deleteIssueMapping(id) {//delete
    this.deleteObject.id = id;
    this.deleteObject.title = 'issue';
    this.deleteObject.type = 'Delete';
    this.deleteObject.subtitle = "delete_compliance_issue"
    console.log(this.deleteObject);
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
    }, 250);
  }

  getRiskMapping() {
		this._riskRegisterService.getItems().subscribe(res => {
			this.setValues(res);
			this._utilityService.detectChanges(this._cdr);

		})
	}

  setValues(Riskmapping) {  
      let issueItem = Riskmapping.organization_issues;
    for (let i of issueItem) {
      i['issue_categories'] = this.getArrayFormatedString('title', i.organization_issue_categories);
      i['departments'] = this.getArrayFormatedString('title', i.organization_issue_departments);
      i['issue_domains'] = this.getArrayFormatedString('title', i.organization_issue_domains);
      i['issue_types_list'] = [];
      for (let j of i.organization_issue_types) {
        i['issue_types_list'].push(j.title);
      }
      this.issues.push(i);
    }
    this._utilityService.detectChanges(this._cdr);
    // }

  }

  selectIssues() {
    IssueListStore.saveSelected = false;
    IssueListStore.selectedIssuesList = RiskRegisterStore.individualRiskRegisterDetails?.organization_issues;
    IssueListStore.issue_select_form_modal = true;
    $(this.issueFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.issueFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }


delete(status) {
  console.log(status);
  let deleteId = [];
  

  let deleteData;
  if (status && this.deleteObject.id) {
    console.log(status);
    deleteId.push(this.deleteObject.id);
    let data = null;										
        data = {
          is_deleted: true,
          organization_issue_ids: deleteId
        }
        deleteData = this._riskRegisterService.deleteIssue(data)
        this._riskRegisterService.deleteIssue(data).subscribe(res => {
          console.log(res);
          this.getRiskDetails()
        })
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
  }
  getArrayFormatedString(type, items) {
  return this._helperService.getArraySeperatedString(',', type, items);
  }

  ngOnDestroy() {

    this.issueSelectSubscription.unsubscribe();
    this.deleteEventSubscription.unsubscribe();
   
  }
}

