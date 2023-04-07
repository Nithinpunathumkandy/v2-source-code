import { Component, OnInit } from '@angular/core';
import { AuthStore } from "src/app/stores/auth.store";
import { OrganizationModulesStore } from "src/app/stores/settings/organization-modules.store";

@Component({
  selector: 'app-profile-main',
  templateUrl: './profile-main.component.html',
  styleUrls: ['./profile-main.component.scss']
})
export class ProfileMainComponent implements OnInit {

  AuthStore = AuthStore;
  OrganizationModulesStore = OrganizationModulesStore;
  constructor() { }

  ngOnInit(): void {
  }

  checkSettingsEnable(item)
  {
      //console.log(item);
  }

}
