import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LanguageSettingsStore } from 'src/app/stores/settings/language-settings.store';
import { LanguageSettings } from 'src/app/core/models/settings/language-settings';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";



@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor(private _http: HttpClient, private _utilityService: UtilityService, private _helperService: HelperServiceService) { }
  getAllItems(status:boolean = false,additionalParams?:string): Observable<LanguageSettings[]> {
    let params = '';
    if(status) params = '&status=all';
    return this.getItems('?is_all=true'+params).pipe(
      map((res: LanguageSettings[]) => {
        LanguageSettingsStore.setLanguageSettings(res);
        return res;
      })
    );
  }
  getItems(params?: string): Observable<LanguageSettings[]> {
    return this._http.get<LanguageSettings[]>('/languages' + (params ? params : ''));
  }

  activateLanguage(id, item: LanguageSettings): Observable<any> {
    return this._http.put('/languages/' + id + '/activate', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','activate_success');
        this.getAllItems(true).subscribe();
        return res;
      })
    );
  }

  deactivateLanguage(id, item: LanguageSettings): Observable<any> {
    return this._http.put('/languages/' + id + '/deactivate', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','deactivate_success');
        this.getAllItems(true).subscribe();
        return res;
      })
    );
  }

  setPrimary(id, item: LanguageSettings): Observable<any> {
    return this._http.put('/languages/' + id + '/primary', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','primary_language_selected');
        this.getAllItems(true).subscribe();
        return res;
      })
    );
  }

  setUserPrimaryLanguage(id:number): Observable<any>{
    return this._http.put('/users/me/language/'+id+'/primary',null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','primary_language_selected');
        // console.log(res);
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/languages/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('language_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/languages/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('languages')+".xlsx");
      }
    )
  }

}
