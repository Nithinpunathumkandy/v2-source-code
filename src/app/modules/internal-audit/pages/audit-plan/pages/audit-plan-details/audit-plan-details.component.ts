import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuditPlanService } from 'src/app/core/services/internal-audit/audit-plan/audit-plan.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuditPlanStore } from 'src/app/stores/internal-audit/audit-plan/audit-plan-store';

@Component({
  selector: 'app-audit-plan-details',
  templateUrl: './audit-plan-details.component.html',
  styleUrls: ['./audit-plan-details.component.scss']
})
export class AuditPlanDetailsComponent implements OnInit {

  AppStore = AppStore;
  AuditPlanStore = AuditPlanStore;
  constructor( private route: ActivatedRoute,
    private _utilityService: UtilityService,
    private _auditPlanService: AuditPlanService,
    private _cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    // calling individual audit program details by its id
    let id: number;
    this.route.params.subscribe(params => {
    id = +params['id']; // (+) converts string 'id' to a number
    this.getAuditPlan(id);
    })
  }


  getAuditPlan(id){
      this._auditPlanService.getItem(id).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
      this._auditPlanService.saveAuditPlanId(id);

  }
}
