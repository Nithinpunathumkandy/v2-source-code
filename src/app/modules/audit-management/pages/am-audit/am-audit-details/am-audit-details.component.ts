import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { AmAuditPlanService } from 'src/app/core/services/audit-management/am-audit-plan/am-audit-plan.service';
import { ActivatedRoute } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AmAuditPlansStore } from 'src/app/stores/audit-management/am-audit-plan/am-audit-plan.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { AppStore } from 'src/app/stores/app.store';
import { AmAnnualAuditPlanService } from 'src/app/core/services/audit-management/am-audit-plan/am-annual-auditable-item/am-annual-audit-plan.service';
import { AmAuditService } from 'src/app/core/services/audit-management/am-audit/am-audit.service';
import { AmAuditsStore } from 'src/app/stores/audit-management/am-audit/am-audit.store';

@Component({
  selector: 'app-am-audit-details',
  templateUrl: './am-audit-details.component.html',
  styleUrls: ['./am-audit-details.component.scss']
})
export class AmAuditDetailsComponent implements OnInit {
  AmAuditsStore = AmAuditsStore;
  AppStore = AppStore;
  OrganizationModulesStore = OrganizationModulesStore;

  constructor(private _route:ActivatedRoute,
    private _auditsService:AmAuditService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef) { }

  ngOnInit(): void {

    this.getDetails();
  }

  getDetails(){
        
    let id: number;
    this._route.params.subscribe(params => {
      id = +params['id']; // (+) converts string 'id' to a number
      this._auditsService.saveAuditId(id);
      this._auditsService.getItem(id).subscribe(res => {
        this._utilityService.detectChanges(this._cdr)
      })
    })
  }
  
  
}
