import { Injectable } from '@angular/core';

import { JwtService } from 'src/app/core/auth/services/jwt.service';
import { OrganizationModulesService } from "src/app/core/services/settings/organization-modules/organization-modules.service";
import { UserAclService } from "src/app/core/services/human-capital/user/user-setting/user-acl/user-acl.service";
import { OrganizationSettingsService } from 'src/app/core/services/settings/organization_settings/organization-settings.service';
import { OrganizationLevelSettingsService } from "src/app/core/services/settings/organization-settings/organization-settings.service";
import { IdleTimeoutService } from "src/app/core/services/idle-timeout/idle-timeout.service";
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { LabelService } from "src/app/core/services/masters/general/label/label.service";
import { ThemeStructureSettingsService } from "src/app/core/services/settings/theme-settings/theme-structure-settings/theme-structure-settings.service";
import { AuditSettingsService } from '../settings/organization_settings/audit-settings/audit-settings.service';
import { AuditSettingStore } from 'src/app/stores/settings/audit-settings.store';

@Injectable({
  providedIn: 'root'
})
export class PermissionSettingsService {

  networkCallCount: number = 0;
  AuditSettingStore = AuditSettingStore;
  constructor(
    private _auditSettingsService:AuditSettingsService,
    private _jwtService: JwtService, private _organizationModuleService: OrganizationModulesService,
    private _userAclService: UserAclService, private _organizationSettingsService: OrganizationSettingsService,
    private _organizationLevelSettingsService: OrganizationLevelSettingsService, private _idleTimeoutService: IdleTimeoutService,
    private _labelService: LabelService, private _themeSettingsService: ThemeStructureSettingsService) { }

  getOrganizationModules(){
      this._jwtService.isLoggedIn().subscribe(res=>{
        if(res && this.networkCallCount == 0){
          this.networkCallCount++;
          setTimeout(() => {
            // this._organizationModuleService.getAllItems('?side_menu=true').subscribe();
            this._auditSettingsService.getItems().subscribe();
            // this._userAclService.getUserActivityPermissions().subscribe();
            // this._labelService.getInitialLabels('?settings=true').subscribe()
            this._organizationSettingsService.getOrganizationSettings(1).subscribe(res=>{
              if(AuthStore.user && AuthStore.user.settings && AuthStore.user.settings.is_autolock > 0){ // Check if User Enabled Auto Lock
                AppStore.idleTimeOut = AuthStore.user.settings.autolock_seconds;
                this._idleTimeoutService.initializeMonitoring(); // Activate Auto Lock
              }
              else if(res && res.is_autolock > 0){  // Check if Auto Lock Enabled in Organization
                AppStore.idleTimeOut = res.autolock_seconds;
                this._idleTimeoutService.initializeMonitoring(); // Activate Auto Lock
              }
              this.checkForTimeZone();
            });
            // this._organizationLevelSettingsService.getAllItems().subscribe();
            this._themeSettingsService.getThemeStructureDetails();
          }, 2000);
        }
        else if(!res) this.networkCallCount = 0;
      })
  }

  getLoginSettings(){
    
  }

  checkForTimeZone(){
    if(AuthStore.user.settings.timezone){ 
      let title = AuthStore.user.settings.timezone.title;
      let utc = AuthStore.user.settings.timezone.title.substring(4,10);
      let check = title.split(' - ');
      AppStore.appTimeZone = check[1];
      AppStore.appTimeZoneUTC = utc.replace(':','.');
      // AppStore.appTimeZone = AuthStore.user.settings.timezone.title;
    }
    else if(OrganizationGeneralSettingsStore.organizationSettings.timezone){ 
      let title = OrganizationGeneralSettingsStore.organizationSettings.timezone.title;
      let utc = OrganizationGeneralSettingsStore.organizationSettings.timezone.title.substring(4,10);
      let check = title.split(' - ');
      AppStore.appTimeZone = check[1];
      AppStore.appTimeZoneUTC = utc.replace(':','.');
      // AppStore.appTimeZone = OrganizationGeneralSettingsStore.organizationSettings.timezone.title;
    }
  }


}
