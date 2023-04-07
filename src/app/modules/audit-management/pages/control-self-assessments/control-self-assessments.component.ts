import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
@Component({
  selector: 'app-control-self-assessments',
  templateUrl: './control-self-assessments.component.html',
  styleUrls: ['./control-self-assessments.component.scss']
})
export class ControlSelfAssessmentsComponent implements OnInit {

  constructor(private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef) { }

  ngOnInit(): void {
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    this._utilityService.detectChanges(this._cdr);
  }


}
