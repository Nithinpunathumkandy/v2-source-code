import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { projectSettingsModulesTypes } from 'src/app/core/models/project-management/project-details/project-settings/project-settings';
import { ProjectSettingsModulesService } from 'src/app/core/services/project-management/project-details/project-settings/modules-settings/project-settings-modules.service';
import { ProjectSettingsModulesStore } from 'src/app/stores/project-management/project-details/project-settings/project-settings-modules/project-settings-modules.store';

@Injectable({
  providedIn: 'root'
})
export class ProjectManagementPermissionGuard implements CanActivate {
  constructor(private _router: Router, private _projectManagementModuleService: ProjectSettingsModulesService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (ProjectSettingsModulesStore.modulesLoaded) {
      return this.resolveGuard(route)
    } else {
      this._projectManagementModuleService.getProjectSettingsModules().subscribe(
        (res) => {
          return this.resolveGuard(route)
        },
        (err) => {
          this._router.navigateByUrl('/project-management');
          return false;
        }
      )
    }
  }

  resolveGuard(route) {
    if (this.checkForPermission(route.data.type)) {
      return true;
    } else {
      this._router.navigateByUrl('/project-management')
      return false;
    }
  }

  checkForPermission(type: projectSettingsModulesTypes): boolean {
    return ProjectSettingsModulesStore.getProjectSettingsModules.find(x => x?.type == type)?.is_enabled ? true : false;
  }

}
