import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FindingMasterStore } from 'src/app/stores/external-audit/findings/findings-store';
import { FindingsService } from 'src/app/core/services/external-audit/findings/findings.service';
import { ActivatedRoute } from '@angular/router';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { RCAMasterStore } from 'src/app/stores/external-audit/root-cause-analysis/root-cause-analysis-store';
import { ImpactAnalysesMasterStore } from 'src/app/stores/external-audit/impact-analysis/impact-analysis-store';
import { CorrectiveActionMasterStore } from 'src/app/stores/external-audit/corrective-action/corrective-action-store';
import { AppStore } from 'src/app/stores/app.store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-audit-findings-details',
  templateUrl: './audit-findings-details.component.html',
  styleUrls: ['./audit-findings-details.component.scss']
})
export class AuditFindingsDetailsComponent implements OnInit {
  FindingMasterStore = FindingMasterStore;
  AppStore = AppStore;
  OrganizationModulesStore = OrganizationModulesStore;
  constructor(private _findingService:FindingsService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    // getting individual external audit findings details with id
    this.getAuditFindingDetails()


  }

  getAuditFindingDetails(){

    let id: number;
    this.route.params.subscribe(params => {
      id = +params['id']; // (+) converts string 'id' to a number
    });
    this._findingService.saveAuditFindingId(id);
    // this._findingService.getItem(id).subscribe(res=>{
    //   if(res){
    //     FindingMasterStore.ea_audit_id=FindingMasterStore?.individualExternalAuditFindingItemId.external_audit.id;
    //   }      
    //   this._utilityService.detectChanges(this._cdr);
    // });
  }

  ngOnDestroy(){
    FindingMasterStore.unsetIndividualExternalAuditFindingItem();
    RCAMasterStore.unsetRCA();
    ImpactAnalysesMasterStore.unsetImpactAnalyses();
    CorrectiveActionMasterStore.unsetAllCorrectiveActions();
    CorrectiveActionMasterStore.unsetSelectedItemDetails();
  }

}
