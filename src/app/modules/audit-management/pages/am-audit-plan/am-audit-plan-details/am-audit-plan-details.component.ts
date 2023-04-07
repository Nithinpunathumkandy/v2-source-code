import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { AmAuditPlanService } from 'src/app/core/services/audit-management/am-audit-plan/am-audit-plan.service';
import { ActivatedRoute } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AmAuditPlansStore } from 'src/app/stores/audit-management/am-audit-plan/am-audit-plan.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { AppStore } from 'src/app/stores/app.store';

@Component({
  selector: 'app-am-audit-plan-details',
  templateUrl: './am-audit-plan-details.component.html',
  styleUrls: ['./am-audit-plan-details.component.scss']
})
export class AmAuditPlanDetailsComponent implements OnInit {
  AmAuditPlansStore = AmAuditPlansStore;
  AppStore = AppStore;
  OrganizationModulesStore = OrganizationModulesStore;

  

  constructor(private _route:ActivatedRoute,
    private _auditPlansService:AmAuditPlanService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef) { }

  ngOnInit(): void {

    this.getDetails();
  }

  getDetails(){
        
    let id: number;
    this._route.params.subscribe(params => {
      id = +params['id']; // (+) converts string 'id' to a number
      this._auditPlansService.saveAuditPlanId(id);
      this._auditPlansService.getItem(id).subscribe(res => {
        this._utilityService.detectChanges(this._cdr)
      })
    })
  }
  

}
