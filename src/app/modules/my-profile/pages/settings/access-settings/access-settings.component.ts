import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AccessProfilesettingsService } from 'src/app/core/services/my-profile/settings/access-settings/access-profilesettings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AccessSettingStore } from 'src/app/stores/my-profile/settings/access-settings.store';

@Component({
  selector: 'app-access-settings',
  templateUrl: './access-settings.component.html',
  styleUrls: ['./access-settings.component.scss']
})
export class AccessSettingsComponent implements OnInit {

  active = '';
  AccessSettingStore = AccessSettingStore;
  constructor(private _accessService:AccessProfilesettingsService,
              private _utilityService: UtilityService,
              private _cdr: ChangeDetectorRef,) { }

  ngOnInit(): void {
    this.getMSTypes();
    this.getOrganizationStructure();
    this.getItems('branches', true);
  }

  getMSTypes(){
    this._accessService.getItems('ms-types').subscribe();
    this._utilityService.detectChanges(this._cdr);
  }

  getOrganizationStructure(){
    this._accessService.getItems('organization-structures').subscribe();
    this._utilityService.detectChanges(this._cdr);
  }

  getItems(type, initial: boolean = false) {
    if (this.active == type) {
      this.active = null;
    }
    else {
      this.active = type;
      this._accessService.getItems(type).subscribe(res => {
        //setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
        this.getChecked(type);
        //}, 100);
      });
    }
  }

  getChecked(type) {
    let disabled = false;
    let details = [];
    if (type == 'branches') {
      details = AccessSettingStore.accessBranchDetails;
    }
    else if (type == 'organization-structures') {
      details = AccessSettingStore.accessOrganizationDetails;
    }
    for (let i of details) {
      if (i.is_enabled) {

      }
      else {
        disabled = true;
      }
    }
    if (disabled)
      return false;
    else
      return true;
  }
}
