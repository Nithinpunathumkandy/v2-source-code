import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
@Component({
  selector: 'app-am-audit-corrective-actions',
  templateUrl: './am-audit-corrective-actions.component.html',
  styleUrls: ['./am-audit-corrective-actions.component.scss']
})
export class AmAuditCorrectiveActionsComponent implements OnInit {

  constructor(private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef) { }

  ngOnInit(): void {
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    this._utilityService.detectChanges(this._cdr);
  }

}
