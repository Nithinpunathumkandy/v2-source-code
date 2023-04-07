import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { activeDirectorySetting, individualActiveDirectorySetting } from 'src/app/core/models/settings/active-directory-setting';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ActiveDirectorySettingStore } from 'src/app/stores/settings/active-directory-setting.store';

@Injectable({
  providedIn: 'root'
})
export class ActiveDirectorySettingService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService
    ) { }


  getItem():Observable<individualActiveDirectorySetting>{
    return this._http.get<individualActiveDirectorySetting>('/active-directory-setting').pipe(
      map((res:individualActiveDirectorySetting ) => {
        ActiveDirectorySettingStore.setIndividualActiveDirectorySetting(res);
        return res;
      })
    );
  }

  saveItem(item: activeDirectorySetting) {
		return this._http.post('/active-directory-setting', item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'active_directory_setting_created_successfully');
				// this.getItem().subscribe();
				return res;
			})
		);
	}

  updateItem(id:number,value){
    return this._http.put(`/active-directory-setting/${id}`,value).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'active_directory_setting_updated_successfully');
        return res;
      })
    );
  }
}
