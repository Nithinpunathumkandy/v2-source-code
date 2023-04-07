import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectSettingsModules, projectSettingsModulesStatus, projectSettingsModulesTypes } from 'src/app/core/models/project-management/project-details/project-settings/project-settings';
import { ProjectSettingsModulesStore } from 'src/app/stores/project-management/project-details/project-settings/project-settings-modules/project-settings-modules.store';
import { ProjectsStore } from 'src/app/stores/project-management/projects/projects.store';

@Injectable({
  providedIn: 'root'
})
export class ProjectSettingsModulesService {
  projectStore = ProjectsStore;
  projectSettingsModulesStore = ProjectSettingsModulesStore;

  constructor(private _http:HttpClient) { }

  getProjectSettingsModules():Observable<ProjectSettingsModules[]>{
    return this._http.get<ProjectSettingsModules[]>(`/projects/${ProjectsStore?.selectedProjectID}/modules`).pipe(
      map((res:ProjectSettingsModules[]) => {
        ProjectSettingsModulesStore.setProjectSettingsModules(res);
        ProjectSettingsModulesStore.modulesLoaded = true;
        return res;
      })
    );
  }

  toggleSettingsModule(module: projectSettingsModulesTypes, status: projectSettingsModulesStatus){
    return this._http.put(`/projects/${ProjectsStore?.selectedProjectID}/modules/${module}/${status}`, {}).pipe(
      map((res:any) => {
        this.getProjectSettingsModules().subscribe();
        return res;
      })
    );
  }
}
