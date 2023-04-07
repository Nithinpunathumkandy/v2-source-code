import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ThemeStructureSettingStore } from 'src/app/stores/settings/theme/theme-structure.store';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeStructureSettingsService {

  constructor(private _http:HttpClient,
    private _utilityService:UtilityService) { }

  setImageDetails(imageDetails,category,id?){
    ThemeStructureSettingStore.setImageDetails(imageDetails,category,id);
  }

  getItems(){
    return this._http.get('/app-theme-settings').pipe(
      map((res ) => {
        ThemeStructureSettingStore.setStructureDetails(res);
        return res;
      })
    );
  }

  getItemsById(id){
    return this._http.get('/app-theme-settings/' +id).pipe(
      map((res ) => {
        ThemeStructureSettingStore.setStructureDetailsById(res);
        return res;
      })
    );
  }

  getThemeStructureDetails(){

    this.getItems().subscribe(res=>{
      // document.querySelector("body").style.cssText = res['data'][0]['style'];
      this.getItemsById(res['data'][0].id).subscribe(resp=>{
        this.processStructureImages(resp['app_theme_setting_images']);
      })
    })
  }

  processStructureImages(appThemeImages){
    for(let i of appThemeImages){
      if(i['type'] != '500' || i['type'] != '404' || i['type'] != '403')
        ThemeStructureSettingStore.setThemeStructureObject(i['type'].replace('-','_'),this.getThumbnailPreview(i['type'],i['token']));
      else{
        if(i['type'] != '500') ThemeStructureSettingStore.setThemeStructureObject('error',this.getThumbnailPreview(i['type'],i['token']));
        else if(i['type'] != '404') ThemeStructureSettingStore.setThemeStructureObject('not_found',this.getThumbnailPreview(i['type'],i['token']));
        else ThemeStructureSettingStore.setThemeStructureObject('permission',this.getThumbnailPreview(i['type'],i['token']));
      }
    }
  }

  getThumbnailPreview(type, token) {
    return environment.apiBasePath + '/settings/files/app-theme-setting-image/thumbnail?token=' + token +'&type=' +type;
  }

  updateThemeLogin(id,details){
    return this._http.put('/app-theme-settings/'+id, details).pipe(
      map((res ) => {
        this._utilityService.showSuccessMessage('success','theme_structure_updated');
        return res;
      })
    );
  }

  revertStructureSettings(id){
    return this._http.put('/app-theme-settings/revert',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','theme_settings_reverted');
        return res;
      })
    );
  }

}
