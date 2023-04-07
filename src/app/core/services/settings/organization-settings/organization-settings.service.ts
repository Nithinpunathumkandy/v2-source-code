import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { OrganizationLevels } from 'src/app/core/models/settings/organization-settings';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';


@Injectable({
  providedIn: 'root'
})
export class OrganizationLevelSettingsService {
  

  constructor(private _http: HttpClient,private _utilityService: UtilityService) { }

  getAllItems(): Observable<OrganizationLevels> {
    return this.getItems().pipe(
      map((res: OrganizationLevels) => {
        let levelSettings = JSON.parse(JSON.stringify(res));
        levelSettings['is_branch'] = typeof(res.is_branch) == 'string' ? parseInt(res.is_branch) : res.is_branch;
        levelSettings['is_department'] = typeof(res.is_department) == 'string' ? parseInt(res.is_department) : res.is_department;
        levelSettings['is_section'] = typeof(res.is_section) == 'string' ? parseInt(res.is_section) : res.is_section;
        levelSettings['is_sub_section'] = typeof(res.is_sub_section) == 'string' ? parseInt(res.is_sub_section) : res.is_sub_section;
        levelSettings['is_subsidiary'] = typeof(res.is_subsidiary) == 'string' ? parseInt(res.is_subsidiary) : res.is_subsidiary;
        levelSettings['is_division'] = typeof(res.is_division) == 'string' ? parseInt(res.is_division) : res.is_division;
        OrganizationLevelSettingsStore.setOrganizationLevelSettings(levelSettings);
        return res;
      })
    );
  }

  getItems(params?: string): Observable<OrganizationLevels> {
    return this._http.get<OrganizationLevels>('/organization-levels');
  }

  activateSettings(settings): Observable<any>{
    return this._http.put('/organization-levels/activate?type='+ settings,'').pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','organization_level_activated');
        this.getAllItems().subscribe();
        return res;
      })
    );
  }

  deactivateSettings(settings): Observable<any>{
    return this._http.put('/organization-levels/deactivate?type='+settings,'').pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','organization_level_deactivated');
        this.getAllItems().subscribe();
        return res;
      })
    );
  }

}
