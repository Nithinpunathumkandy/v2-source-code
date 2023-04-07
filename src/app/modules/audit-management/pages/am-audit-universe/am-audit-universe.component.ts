import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
@Component({
  selector: 'app-am-audit-universe',
  templateUrl: './am-audit-universe.component.html',
  styleUrls: ['./am-audit-universe.component.scss']
})
export class AmAuditUniverseComponent implements OnInit {
  AppStore = AppStore;
  constructor(private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef) { }

  ngOnInit(): void {
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this._utilityService.detectChanges(this._cdr);
  }

}
