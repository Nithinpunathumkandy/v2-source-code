import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

@Component({
  selector: 'app-auditor-user-box',
  templateUrl: './auditor-user-box.component.html',
  styleUrls: ['./auditor-user-box.component.scss']
})
export class AuditorUserBoxComponent implements OnInit {

  @Input('source') popupSource: any;
  @Input('showName') showName:boolean = true;
  @Input('activateButtons') activateButtons: boolean = true
  @ViewChild('popupModal') popupModal: ElementRef;
  @ViewChild('dialog') dialog: ElementRef;

  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  constructor(private _humanCapitalService:HumanCapitalService,
    private _imageService:ImageServiceService,
    private _renderer2:Renderer2, private _helperService: HelperServiceService) { }

  ngOnInit(): void {
  }
  gotoUser(){
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

  getTimezoneFormatted(time){
    return this._helperService.timeZoneFormatted(time);
  }

  addZoomClass(){
    this._renderer2.addClass(this.dialog.nativeElement,'a-zoom');
  }
  ngOnDestroy(){
    this.popupSource=null
  }

}
