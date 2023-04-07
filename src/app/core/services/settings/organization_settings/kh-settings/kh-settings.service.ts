import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { KHSettings } from 'src/app/core/models/settings/kh-settings.model';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { KHSettingStore } from 'src/app/stores/settings/kh-settings.store';

@Injectable({
  providedIn: 'root'
})
export class KhSettingsService {

  constructor(private _http:HttpClient,
    private _utilityService:UtilityService) { }

  getItems():Observable<KHSettings>{
    return this._http.get<KHSettings>('/knowledge-hub-settings').pipe(
      map((res:KHSettings) => {
        let khSettings = JSON.parse(JSON.stringify(res));
        khSettings['is_document_workflow'] = typeof(res['is_document_workflow']) == "string" ? parseInt(res['is_document_workflow']) : res['is_document_workflow'];
        KHSettingStore.setKHSettings(khSettings)
        return res;
      })
    );
  }

  updateItem(value){
    return this._http.put('/knowledge-hub-settings',value).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', res['message']);
        return res;
      })
    );
  }
}
