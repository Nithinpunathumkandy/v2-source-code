import { Injectable } from '@angular/core';
import { ThemeFooterSettingsStore } from 'src/app/stores/settings/theme/theme-footer.store';

@Injectable({
  providedIn: 'root'
})
export class ThemeFooterSettingsService {

  constructor() { }

  setImageDetails(imageDetails,url,type){
    ThemeFooterSettingsStore.setFileDetails(imageDetails,url,type);
  }

}
