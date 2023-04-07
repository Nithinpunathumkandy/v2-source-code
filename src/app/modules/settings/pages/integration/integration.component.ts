import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UtilityService } from "src/app/shared/services/utility.service";
import {IntegrationService} from "src/app/core/services/settings/integration/integration.service"
import { IntegrationStore } from 'src/app/stores/settings/integration-strore';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-integration',
  templateUrl: './integration.component.html',
  styleUrls: ['./integration.component.scss']
})
export class IntegrationComponent implements OnInit {
  IntegrationStore=IntegrationStore;
  constructor(
    private _utilityService: UtilityService,
    private _integrationService: IntegrationService,
    private _cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getIntegrationList();
  }

  getIntegrationList()
  {
    this._integrationService.getAllItems().subscribe((res: any) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  changeStatus(id,status_id,type)
  {
    if(status_id==1)
    {
        this.deactivateIntegration(id,type)
    }
    else
    {
      this.activateIntegration(id,type)
    }
  }
  deactivateIntegration(id,type)
  {
    this._integrationService.deactivate(id,type).subscribe((res: any) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  activateIntegration(id,type)
  {
    this._integrationService.activate(id,type).subscribe((res: any) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getItemsImage(id)
  {
    return environment?.apiBasePath+'/settings/integration/'+id+'/icon';
  }

}
