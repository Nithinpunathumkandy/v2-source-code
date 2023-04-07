import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";
import { UtilityService } from 'src/app/shared/services/utility.service';

import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { StakeholderType } from 'src/app/core/models/masters/organization/stakeholder-type';
import { Stakeholder } from 'src/app/core/models/organization/stakeholder/stakeholder';

import { StakeholderAnalysisService } from "src/app/core/services/organization/context/stakeholder-analysis-service/stakeholder-analysis.service";
import { StakeholderAnalysisStore } from "src/app/stores/organization/context/stakeholder-analysis.store";
import { IssueListStore } from "src/app/stores/organization/context/issue-list.store";
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';

@Component({
  selector: 'app-stakeholder-analysis',
  templateUrl: './stakeholder-analysis.component.html',
  styleUrls: ['./stakeholder-analysis.component.scss']
})
export class StakeholderAnalysisComponent implements OnInit,OnDestroy {

  StakeholderAnalysisStore = StakeholderAnalysisStore;
  SubMenuItemStore = SubMenuItemStore;
  IssueListStore = IssueListStore;
  NoDataItemStore = NoDataItemStore;
  AuthStore = AuthStore;
  
  stakeholderType: StakeholderType;
  stakeholder: Stakeholder;
  emptyMessage = "no_issues_found";
  constructor(private _utilityService: UtilityService, private _cdr: ChangeDetectorRef,
    private _stakeholderAnalysisService: StakeholderAnalysisService,private _router: Router) { }

  ngOnInit() {

    RightSidebarLayoutStore.showFilter = false;

    SubMenuItemStore.setNoUserTab(true);
    NoDataItemStore.setNoDataItems({ title: "", subtitle: 'no_stakeholder_analysis_found' });
    this.getStakeholderDetails(); // Get Stakeholder Details
  }

  // Get Stakeholder Details
  getStakeholderDetails(){
    this._stakeholderAnalysisService.getStakeholderDetails().subscribe(res=>{
      // console.log(res);
      if(res.length > 0){
        this.stakeholderType = res[0];
        this.stakeholder = res[0].stakeholders[0];
        this.getStakeholderIssues();
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  // getStakeholderTypes(){
  //   this._stakeholdertypeService.getAllItems().subscribe(res=>{
  //     this.stakeholderType = res[0];
  //     this._utilityService.detectChanges(this._cdr);
  //     this.getStakeholders();
  //   });
  // }

  // getStakeholders(){
  //   this._stakeholderService.getItems(false,'&stakeholder_type_ids='+this.stakeholderType.id)
  //   .subscribe(res=>{
  //     this.stakeholder = res.data[0];
  //     this.getStakeholderIssues();
  //     this._utilityService.detectChanges(this._cdr);
  //   })
  // }

  /**
   * Set Stakeholder Type
   * @param stakeholderType Stakeholder Type 
   */
  selectStakeHolderType(stakeholderType){
    this.stakeholderType = stakeholderType;
    if(stakeholderType.stakeholders.length > 0){
      this.stakeholder = stakeholderType.stakeholders[0];
      this.getStakeholderIssues();
    }
  }

  /**
   * Set Stakeholder
   * @param stakeholder Stakeholder
   */
  selectStakeholder(stakeholder){
    this.stakeholder = stakeholder;
    this.getStakeholderIssues();
  }

  // Get Stakeholder Issues
  getStakeholderIssues(){
    StakeholderAnalysisStore.unsetNeedsExpectations();
    this._stakeholderAnalysisService.getNeedsExpectations(this.stakeholder.id).subscribe(res=>{
      // console.log(StakeholderAnalysisStore.getNeedsExpectations);
      this._utilityService.detectChanges(this._cdr);
    });
  }

  ngOnDestroy(){
    StakeholderAnalysisStore.unsetDetails();
    NoDataItemStore.unsetNoDataItems();
  }

  /**
   * Goto Issue Details
   * @param issueId Issue Id
   */
  gotoIssueDetails(issueId){
    IssueListStore.unsetIssueDetails();
    IssueListStore.setSelectedIssueId(issueId);
    this._router.navigateByUrl('/organization/issue-details/'+IssueListStore.selectedId)
  }

}
