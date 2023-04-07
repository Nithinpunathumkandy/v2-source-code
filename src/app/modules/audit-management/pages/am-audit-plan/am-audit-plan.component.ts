import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AmAuditPlansStore } from 'src/app/stores/audit-management/am-audit-plan/am-audit-plan.store';
@Component({
  selector: 'app-am-audit-plan',
  templateUrl: './am-audit-plan.component.html',
  styleUrls: ['./am-audit-plan.component.scss']
})
export class AmAuditPlanComponent implements OnInit {

  constructor(private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef) { }

  ngOnInit(): void {
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    this._utilityService.detectChanges(this._cdr);
  }
  ngOnDestroy(){
    AmAuditPlansStore.unsetAuditPlanId();
  }

}
