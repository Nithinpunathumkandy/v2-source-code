import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IntegrationSettingService } from 'src/app/core/services/my-profile/settings/integration-settings/integration-setting.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { IntegrationSettingStore } from 'src/app/stores/my-profile/settings/integration-settings.store';

@Component({
  selector: 'app-integration-profile-settings',
  templateUrl: './integration-profile-settings.component.html',
  styleUrls: ['./integration-profile-settings.component.scss']
})
export class IntegrationProfileSettingsComponent implements OnInit {

  IntegrationSettingStore = IntegrationSettingStore;
  AuthStore = AuthStore;
  constructor(private _IntegrationService:IntegrationSettingService,
              private _utilityService:UtilityService,
              private _cdr:ChangeDetectorRef) { }

  ngOnInit(): void {
    this._IntegrationService.getIntegration().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
  }

  authorize(status,id){
    if(status==true)
      this._IntegrationService.unauthorize(id).subscribe(
        res=>{this._utilityService.detectChanges(this._cdr);}
      );
    else
    this._IntegrationService.authorize(id).subscribe(res=>{this._utilityService.detectChanges(this._cdr);});
    
  }

  iconPreview(integration_id){
     return this._IntegrationService.getIcon(integration_id);
 
  }

}
