import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';

@Component({
  selector: 'app-mock-drill',
  templateUrl: './mock-drill.component.html',
  styleUrls: ['./mock-drill.component.scss']
})
export class MockDrillComponent implements OnInit {

  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  constructor(private _utilityService: UtilityService, private _cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    this._utilityService.detectChanges(this._cdr);
  }

}
