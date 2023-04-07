import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { OrganizationLevels } from '../../models/settings/organization-settings';

@Injectable({
  providedIn: 'root'
})
export class OrganizationLevelGuard implements Resolve<any> {
  constructor(private _http: HttpClient) { }

  resolve(): Observable<any> {
    return this._http.get<OrganizationLevels>('/organization-levels').pipe(
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


}