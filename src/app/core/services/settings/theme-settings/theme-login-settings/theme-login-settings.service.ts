import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ThemeLoginSettingStore } from 'src/app/stores/settings/theme/theme-login.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ThemeLogin } from 'src/app/core/models/settings/settings-theme-login';

@Injectable({
  providedIn: 'root'
})
export class ThemeLoginSettingsService {

  constructor(private _http:HttpClient,
              private _utilityService:UtilityService) { }

  setImageDetails(imageDetails,category,id?){
    ThemeLoginSettingStore.setImageDetails(imageDetails,category,id);
  }

  getItems(){
    return this._http.get('/app-login-settings').pipe(
      map((res ) => {
        ThemeLoginSettingStore.setThemeLoginDetails(res);
        return res;
      })
    );
  }

  getItemsById(id){
    return this._http.get('/app-login-settings/' +id).pipe(
      map((res ) => {
        ThemeLoginSettingStore.setThemeLoginDetailsById(res);
        return res;
      })
    );
  }

  updateThemeLogin(id,details){
    return this._http.put('/app-login-settings/'+id, details).pipe(
      map((res ) => {
        this._utilityService.showSuccessMessage('success','theme_login_updated');
        // ThemeLoginSettingStore.setThemeLoginDetails(res);
        return res;
      })
    );
  }

  getThumbnailPreview(type, token) {
    return environment.apiBasePath + '/settings/files/app-login-setting-image/thumbnail?token=' + token +'&type=' +type;
  }

  getLoginTheme(){
    return this._http.get('/settings/app-login-theme').pipe(
        map((res) => {
          ThemeLoginSettingStore.setThemeLoginDetailsById(res);
          return res;
        })
      );
}
chooseRevertLoginTheme(id,details) {
  return this._http.put('/app-login-settings/revert',id ,details).pipe(
    map(res => {
      this._utilityService.showSuccessMessage('success','theme_settings_reverted');
      // this._utilityService.showSuccessMessage('success', 'new_created');
      return res;
    })
  );
}
}
