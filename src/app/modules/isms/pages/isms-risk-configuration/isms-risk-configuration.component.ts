import { Component, OnInit } from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';

@Component({
  selector: 'app-isms-risk-configuration',
  templateUrl: './isms-risk-configuration.component.html',
  styleUrls: ['./isms-risk-configuration.component.scss']
})
export class IsmsRiskConfigurationComponent implements OnInit {
  AppStore = AppStore;
  OrganizationModulesStore = OrganizationModulesStore;
  constructor() { }

  ngOnInit(): void {
    AppStore.showDiscussion = false;
  }

}
