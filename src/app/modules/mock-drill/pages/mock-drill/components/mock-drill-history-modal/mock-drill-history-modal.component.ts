import { Component, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { MockDrillStore } from 'src/app/stores/mock-drill/mock-drill/mock-drill-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { AppStore } from 'src/app/stores/app.store';
@Component({
  selector: 'app-mock-drill-history-modal',
  templateUrl: './mock-drill-history-modal.component.html',
  styleUrls: ['./mock-drill-history-modal.component.scss']
})
export class MockDrillHistoryModalComponent implements OnInit {
  MockDrillStore = MockDrillStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AppStore = AppStore;
  constructor(private _helperService: HelperServiceService, private _eventEmitterService: EventEmitterService,
    private _imageService: ImageServiceService,) { }

  ngOnInit(): void {
  }
  cancel() {
    this._eventEmitterService.dismissMockDrillHistoryModalControl();
  }
  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }
  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }
  getTimezoneFormatted(time) {
    return this._helperService.timeZoneFormatted(time);
  }
}
