import { Component, OnInit } from '@angular/core';
import { BreadCrumbMenuItemStore } from "src/app/stores/general/breadcrumb-menu.store";

@Component({
  selector: 'app-risk-management',
  templateUrl: './risk-management.component.html',
  styleUrls: ['./risk-management.component.scss']
})
export class RiskManagementComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
  }

}
