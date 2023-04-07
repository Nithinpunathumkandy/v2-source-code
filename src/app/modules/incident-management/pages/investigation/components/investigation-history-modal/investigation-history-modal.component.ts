import { ChangeDetectorRef, Component, OnInit, Renderer2 } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { IncidentCorrectiveActionService } from 'src/app/core/services/incident-management/incident-corrective-action/incident-corrective-action.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IncidentInvestigationStore } from 'src/app/stores/incident-management/investigation-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

@Component({
  selector: 'app-investigation-history-modal',
  templateUrl: './investigation-history-modal.component.html',
  styleUrls: ['./investigation-history-modal.component.scss']
})
export class InvestigationHistoryModalComponent implements OnInit {
  IncidentInvestigationStore = IncidentInvestigationStore
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
  historyEmptyList = "Looks like there are no updates recorded in this Investigation";

  constructor(private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, private _sanitizer: DomSanitizer,
    private _renderer2: Renderer2,
    private _humanCapitalService: HumanCapitalService,private _imageService: ImageServiceService,
    private _eventEmitterService: EventEmitterService,) { }

  ngOnInit(): void {
  }

  cancel(){
    
    this._eventEmitterService.dismissInvestigationHistoryModalControl();
   }
   createImageUrl(type, token) {
 
    if (type == 'user') {
      return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
    }

  }
   getDefaultImage(type) {
     return this._imageService.getDefaultImageUrl(type);
   }

  

}
