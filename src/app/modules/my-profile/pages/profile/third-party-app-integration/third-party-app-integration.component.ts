import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IntegrationSettingService } from 'src/app/core/services/my-profile/settings/integration-settings/integration-setting.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { IntegrationSettingStore } from 'src/app/stores/my-profile/settings/integration-settings.store';

@Component({
  selector: 'app-third-party-app-integration',
  templateUrl: './third-party-app-integration.component.html',
  styleUrls: ['./third-party-app-integration.component.scss']
})
export class ThirdPartyAppIntegrationComponent implements OnInit,OnDestroy {

  IntegrationSettingStore = IntegrationSettingStore;
  AuthStore = AuthStore;
  sucessValue:any;
  selectedIndex:any;
  loading:Boolean=false;
  constructor(private _IntegrationService:IntegrationSettingService,
              private _utilityService:UtilityService,
              private _activatedRouter: ActivatedRoute,
              private _cdr:ChangeDetectorRef) { }

  ngOnInit(): void {
    this._IntegrationService.getIntegration().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
    this._activatedRouter.params.subscribe(params => {
      this.sucessValue = +params['success']; 
      this.openSucessMessage(this.sucessValue);
    });

  }

  openSucessMessage(message)
  {
    if(localStorage.getItem('outlookAuthUrl'))
    {
      this._utilityService.showSuccessMessage('success', message+'integrated_successfully');
      localStorage.removeItem('outlookAuthUrl');
      this._utilityService.detectChanges(this._cdr);
    }
    
  }

  authorize(status,id,index){
    this.selectedIndex=index
    this.loading=true;
    if(status==true)
      this._IntegrationService.unauthorize(id).subscribe(
        res=>{this._utilityService.detectChanges(this._cdr);}
      );
    else
    this._IntegrationService.authorize(id).subscribe(res=>{
      this.loading=false;
      if(res.authorize_url)
      { 
        localStorage.setItem('outlookAuthUrl',res.authorize_url);
        window.open(res.authorize_url, "_self");
      }
      this._utilityService.detectChanges(this._cdr);
    },(err: HttpErrorResponse) => {
      this.loading=false;
      this._utilityService.detectChanges(this._cdr);
    })
    
  }

  iconPreview(integration_id){
     return this._IntegrationService.getIcon(integration_id);
 
  }

  ngOnDestroy(): void {
    IntegrationSettingStore.unsetIntegration();
  }

}
