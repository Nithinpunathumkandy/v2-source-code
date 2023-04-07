import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { UserIntegrationService } from 'src/app/core/services/human-capital/user/user-setting/user-integration/user-integration.service';
import {UserIntegrationStore} from 'src/app/stores/human-capital/users/user-setting/user-integration.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthStore } from 'src/app/stores/auth.store';
@Component({
  selector: 'app-integration',
  templateUrl: './integration.component.html',
  styleUrls: ['./integration.component.scss']
})
export class IntegrationComponent implements OnInit {
  UserIntegrationStore=UserIntegrationStore;
  AuthStore = AuthStore;
  constructor(private _userIntegrationService:UserIntegrationService,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService) { }

  ngOnInit() {
    this._userIntegrationService.getIntegration().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
 
   

  }

  authorize(status,id){
    if(status==true)
      this._userIntegrationService.unauthorize(id).subscribe(
        res=>{this._utilityService.detectChanges(this._cdr);}
      );
    else
    this._userIntegrationService.authorize(id).subscribe(res=>{this._utilityService.detectChanges(this._cdr);});
    
  }

  iconPreview(integration_id){
     return this._userIntegrationService.getIcon(integration_id);
 
  }

}
