import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ControlsService } from 'src/app/core/services/bpm/controls/controls.service';
import { ProcessService } from 'src/app/core/services/bpm/process/process.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ControlStore } from 'src/app/stores/bpm/controls/controls.store';

@Component({
  selector: 'app-contrl-details-modal',
  templateUrl: './contrl-details-modal.component.html',
  styleUrls: ['./contrl-details-modal.component.scss']
})
export class ContrlDetailsModalComponent implements OnInit {

  ControlStore = ControlStore;
  AppStore = AppStore;
  AuthStore = AuthStore;

  constructor(private _processService: ProcessService,
    private _controLService: ControlsService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService) { }

  ngOnInit(): void {
    AppStore.showDiscussion = false;

  }

  createPreviewUrl(token) {
    return this._processService.getThumbnailPreview(token);
  }

  closeDetailsModal() {
    this._eventEmitterService.dismissModal();
    // Emitting Event To set the Style in Parent Component(MODAL)
    this._eventEmitterService.setModalStyle();
  }


}
