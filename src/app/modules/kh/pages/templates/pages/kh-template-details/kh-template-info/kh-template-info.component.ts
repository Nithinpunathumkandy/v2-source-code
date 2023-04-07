import { Component, OnInit } from '@angular/core';
import { KHSettingStore } from 'src/app/stores/settings/kh-settings.store';
import { KhSettingsService } from 'src/app/core/services/settings/organization_settings/kh-settings/kh-settings.service';

@Component({
  selector: 'app-kh-template-info',
  templateUrl: './kh-template-info.component.html',
  styleUrls: ['./kh-template-info.component.scss']
})
export class KhTemplateInfoComponent implements OnInit {

  KHSettingStore = KHSettingStore

  constructor(
    private _KhSettingsService: KhSettingsService,
  ) { }

  ngOnInit(): void {
    this.checkDocumentTypePermission()
  }

  checkDocumentTypePermission() {
    this._KhSettingsService.getItems().subscribe(res => {
    })
  }

}
