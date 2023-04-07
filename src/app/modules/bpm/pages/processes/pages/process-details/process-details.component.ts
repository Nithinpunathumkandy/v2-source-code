import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ProcessStore } from '../../../../../../stores/bpm/process/processes.store'
import { ActivatedRoute } from '@angular/router';
import { ProcessService } from '../../../../../../core/services/bpm/process/process.service'
import { IReactionDisposer } from "mobx";
import { ActivityStore } from 'src/app/stores/bpm/process/activity.store';
import { AppStore } from 'src/app/stores/app.store';
import { NeedExpectationStore } from 'src/app/stores/bpm/process/need-exp.store';
import { ProcessRiskStore } from 'src/app/stores/bpm/process/process_risk.store';
import { OrganizationModulesStore } from "src/app/stores/settings/organization-modules.store";
import { AdvanceProcessStore } from 'src/app/stores/bpm/process/advance-process.store';
import { UtilityService } from "src/app/shared/services/utility.service";
import { BiaStore } from 'src/app/stores/bcm/bia/bia.store';

@Component({
  selector: 'app-process-details',
  templateUrl: './process-details.component.html',
  styleUrls: ['./process-details.component.scss']
})
export class ProcessDetailsComponent implements OnInit {

  ProcessStore = ProcessStore
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  ActivityStore = ActivityStore;
  AppStore = AppStore;
  NeedExpectationStore = NeedExpectationStore;
  ProcessRiskStore = ProcessRiskStore;
  OrganizationModulesStore =OrganizationModulesStore;
  constructor(
    private _processService: ProcessService,
    private route: ActivatedRoute, private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService
  ) { }

  ngOnInit(): void {
    AppStore.showDiscussion = false;
    
    let id: number;
    this.route.params.subscribe(params => {
      id = +params['id']; // (+) converts string 'id' to a number
      this.processDetails(id)
    });
  }

  processDetails(id) {
    ProcessStore.unsetProcessDetails();
    NeedExpectationStore.unsetNeedExpDetails();
    ActivityStore.unsetActivityDetails();
    ActivityStore.unsetActivity();
    ProcessRiskStore.unsetProcessRisks();
    this._processService.saveProcessId(id);
    this._processService.getItemById(id).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  checkForModules(groupId,subModuleId){
    return OrganizationModulesStore.checkOrganizationSubModulesPermission(groupId,subModuleId);
  }

  ngOnDestroy(){
    SubMenuItemStore.makeEmpty();
    ProcessStore.unsetProcessDetails();
    NeedExpectationStore.unsetNeedExpDetails();
    ActivityStore.unsetActivityDetails();
    ActivityStore.unsetActivity();
    ProcessRiskStore.unsetProcessRisks();
    AdvanceProcessStore.unsetProcessDiscovery();
    BiaStore.unsetImpactResult();
  }


}
