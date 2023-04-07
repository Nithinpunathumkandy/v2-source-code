import { Component, OnInit } from '@angular/core';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';

@Component({
  selector: 'app-isms-risk-register',
  templateUrl: './isms-risk-register.component.html',
  styleUrls: ['./isms-risk-register.component.scss']
})
export class IsmsRiskRegisterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
  }

}
