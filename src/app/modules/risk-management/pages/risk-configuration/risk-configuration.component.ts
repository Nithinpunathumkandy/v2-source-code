import { Component, OnInit } from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';

@Component({
  selector: 'app-risk-configuration',
  templateUrl: './risk-configuration.component.html',
  styleUrls: ['./risk-configuration.component.scss']
})
export class RiskConfigurationComponent implements OnInit {
  AppStore = AppStore;
  OrganizationModulesStore = OrganizationModulesStore;
  constructor() { }

  ngOnInit(): void {
    AppStore.showDiscussion = false;
  }

}
