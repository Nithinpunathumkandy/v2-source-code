import { Component, OnInit, Input, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { AppStore } from 'src/app/stores/app.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
declare var $: any;

@Component({
  selector: 'app-modal-user-popup-box',
  templateUrl: './modal-user-popup-box.component.html',
  styleUrls: ['./modal-user-popup-box.component.scss']
})
export class ModalUserPopupBoxComponent implements OnInit {
  @Input('source') popupSource: any;
  @Input('showName') showName: boolean = true;
  @Input('showDepartment') showDepartment: boolean = false;
  @Input('activateButtons') activateButtons: boolean = true;
  @Input('present') present: boolean = false;
  @Input('classIssue') classIssue: boolean = false;
  @ViewChild('popupModal') popupModal: ElementRef;
  @ViewChild('dialog') dialog: ElementRef;

  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AppStore = AppStore;
  constructor(private _router: Router,
    private _humanCapitalService: HumanCapitalService,
    private _imageService: ImageServiceService,
    private _renderer2: Renderer2, private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService) { }

  ngOnInit(): void {

  }


  gotoUser() {
    // this._renderer2.setStyle(this.popupModal.nativeElement, 'z-index', '0');
    $('.modal-backdrop').remove();
    // console.log(id);
    // UsersStore.user_id = id;
    // this._router.navigateByUrl('/human-capital/users/'+this.popupSource.id);
  }

  createImageUrl(type, token) {
    return this._humanCapitalService.getThumbnailPreview(type, token)
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  getTimezoneFormatted(time) {
    return this._helperService.timeZoneFormatted(time);
  }

  addZoomClass() {
    this._renderer2.addClass(this.dialog.nativeElement, 'a-zoom');
  }

  sendEmail() {
    window.location.href = 'mailto:' + this.popupSource.email
  }

  closeModal() {
    this._eventEmitterService.dismissUserPopupModal();
    // $(this.popupModal.nativeElement).modal('hide');
  }

  ngOnDestroy() {
    this.popupSource = null
  }


}
