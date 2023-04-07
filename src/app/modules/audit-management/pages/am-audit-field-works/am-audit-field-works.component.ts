import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
  selector: 'app-am-audit-field-works',
  templateUrl: './am-audit-field-works.component.html',
  styleUrls: ['./am-audit-field-works.component.scss']
})
export class AmAuditFieldWorksComponent implements OnInit {

  constructor(private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef) { }

  ngOnInit(): void {
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    this._utilityService.detectChanges(this._cdr);
  }

}
