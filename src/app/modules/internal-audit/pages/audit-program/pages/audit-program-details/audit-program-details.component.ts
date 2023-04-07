
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuditProgramService } from 'src/app/core/services/internal-audit/audit-program/audit-program.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuditFindingsStore } from 'src/app/stores/internal-audit/audit-findings/audit-findings-store';
import { AuditPlanStore } from 'src/app/stores/internal-audit/audit-plan/audit-plan-store';
import { AuditProgramMasterStore } from 'src/app/stores/internal-audit/audit-program/audit-program-store';
import { AuditStore } from 'src/app/stores/internal-audit/audit/audit-store';
import { AuditorsStore } from 'src/app/stores/internal-audit/auditors/auditors-store';
@Component({
  selector: 'app-audit-program-details',
  templateUrl: './audit-program-details.component.html',
  styleUrls: ['./audit-program-details.component.scss']
})
export class AuditProgramDetailsComponent implements OnInit {

  AppStore = AppStore;
  AuditProgramMasterStore = AuditProgramMasterStore;
  constructor( private _auditProgranService: AuditProgramService,
    private route: ActivatedRoute,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef) {}

  ngOnInit(){
 // calling individual audit program details by its id
  let id: number;
  this.route.params.subscribe(params => {
    id = +params['id']; // (+) converts string 'id' to a number
    this.getAuditProgram(id);
  });
  }

  getAuditProgram(id){
    this._auditProgranService.getItem(id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
    this._auditProgranService.saveAuditProgramId(id);
    
  }

  ngOnDestroy(){
    AuditProgramMasterStore.unsetIndividualAuditProgram();
    AuditorsStore.unsetAuditors();
    AuditPlanStore.unsetAuditPlan();
    AuditStore.unsetAuditForAuditProgram();
    AuditFindingsStore.unsetAllFindingsFromProgram();
  }

}