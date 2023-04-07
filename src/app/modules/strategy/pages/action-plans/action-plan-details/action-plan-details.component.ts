import { Component, OnInit } from '@angular/core';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ActionPlansStore } from 'src/app/stores/strategy-management/action-plans.store';

@Component({
  selector: 'app-action-plan-details',
  templateUrl: './action-plan-details.component.html',
  styleUrls: ['./action-plan-details.component.scss']
})
export class ActionPlanDetailsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

  }

  ngOnDestroy(){
    ActionPlansStore.induvalActionPlanLoaded = false;
    SubMenuItemStore.makeEmpty();
  }

}
