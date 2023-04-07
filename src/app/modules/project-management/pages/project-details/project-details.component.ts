import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { ProjectsStore } from 'src/app/stores/project-management/projects/projects.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { autorun, IReactionDisposer } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { ProjectManagementProjectsService } from 'src/app/core/services/project-management/projects/project-management-projects.service';
import { ActivatedRoute } from '@angular/router';
import { ProjectManagementInfoService } from 'src/app/core/services/project-management/project-details/info/project-management-info.service';
import { projectDetailStore } from 'src/app/stores/project-management/project-details/project-details.store';
import { ProjectSettingsModulesStore } from 'src/app/stores/project-management/project-details/project-settings/project-settings-modules/project-settings-modules.store';
import { projectSettingsModulesTypes } from 'src/app/core/models/project-management/project-details/project-settings/project-settings';
import { ProjectSettingsModulesService } from 'src/app/core/services/project-management/project-details/project-settings/modules-settings/project-settings-modules.service';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit, OnDestroy {
  ProjectsStore = ProjectsStore;
  projectDetailStore = projectDetailStore;
  OrganizationModulesStore = OrganizationModulesStore;
  reactionDisposer: IReactionDisposer
  projectSettingsModuleStore = ProjectSettingsModulesStore;

  constructor(
    private _helperService: HelperServiceService,
    private _settingsModulesService: ProjectSettingsModulesService,

    private _route: ActivatedRoute
    ) { 
      this._route.params.subscribe(params => {
        this.ProjectsStore.selectedProjectID = params.id;
      });
    }

  ngOnInit(): void {  
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    SubMenuItemStore.setNoUserTab(true);
    this.reactionDisposer = autorun(() => {
      // var subMenuItems = [
      //   { activityName: null, submenuItem: { type: 'close', path: '../' } }
      //   // { activityName: null, submenuItem: { type: 'template' } },
      //   // { activityName: 'EXPORT_TEST_AND_EXERCISE', submenuItem: { type: 'export_to_excel' } },
      //   // {activityName: null, submenuItem: {type: 'import'}},
      // ]
      // this._helperService.checkSubMenuItemPermissions(2800, subMenuItems);
      // if (SubMenuItemStore.clikedSubMenuItem) {
      //   switch (SubMenuItemStore.clikedSubMenuItem.type) {
      //     case "close":
      //       // this.addNewTest();
      //       break;
      //     // case "search":
      //     //   // TestAndExerciseStore.searchText = SubMenuItemStore.searchText;
      //     //   // this.pageChange(1);
      //     //   break;
      //     // case "refresh":
      //     //   // TestAndExerciseStore.unsetTreatmentList();
      //     //   // this.pageChange(1);
      //     //   break;
      //     default:
      //       break;
      //   }
      //   SubMenuItemStore.unSetClickedSubMenuItem();
      // }
      if (NoDataItemStore.clikedNoDataItem) {
        // this.addNewTest();
        NoDataItemStore.unSetClickedNoDataItem();
      }

    })
    this.getPermissionsForModules()
  }
  
  getPermissionsForModules(){
    this._settingsModulesService.getProjectSettingsModules().subscribe();
  }
  
  checkForPermission(type: projectSettingsModulesTypes){
    return ProjectSettingsModulesStore.getProjectSettingsModules.find(x => x?.type == type)?.is_enabled;
  }

  ngOnDestroy() {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
  }
}
