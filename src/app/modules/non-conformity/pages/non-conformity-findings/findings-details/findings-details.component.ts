import { ChangeDetectorRef, Component, OnInit,OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FindingsService } from 'src/app/core/services/non-conformity/findings/findings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { FindingsStore } from 'src/app/stores/non-conformity/findings/findings-store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { FindingCorrectiveActionStore } from 'src/app/stores/non-conformity/findings/finding-corrective-action-store';

@Component({
  selector: 'app-findings-details',
  templateUrl: './findings-details.component.html',
  styleUrls: ['./findings-details.component.scss']
})
export class FindingsDetailsComponent implements OnInit,OnDestroy {


  FindingsStore = FindingsStore;
  AppStore = AppStore;
  OrganizationModulesStore = OrganizationModulesStore;
  FindingCorrectiveActionStore = FindingCorrectiveActionStore;

  constructor(
    private _findingsService: FindingsService,
    private _cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private _utilityService: UtilityService,
  ) { }

  ngOnInit(): void {
    // getting details
    let id: number;
    this.route.params.subscribe(params => {
      id = +params['id']; // (+) converts string 'id' to a number
      this._findingsService.saveFindingsId(id);
      this.getfindingservice(id);
    });
 AppStore.showDiscussion=false;
  }
  getfindingservice(id) {
    this._findingsService.getItem(id).subscribe(res => {
      FindingsStore.setFindingsId(res['id']);
      this._utilityService.detectChanges(this._cdr);
    });
    
  }

  // getAuditFindingsDetails(){}

  ngOnDestroy() {
    FindingsStore.unsetIndividualFindingsItem();
    FindingCorrectiveActionStore.unsetFindingCorrectiveAction();
    //  RCAStore.unsetRCA();
    //  ImpactAnalysesStore.unsetAllImpactAnalyses();
    //  CorrectiveActionsStore.unsetCorrectiveActions();
  }

}
