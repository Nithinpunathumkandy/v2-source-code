import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IReactionDisposer, autorun } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ProjectTasksService } from 'src/app/core/services/project-management/project-details/project-tasks/project-tasks.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ProjectTasksStore } from 'src/app/stores/project-management/project-details/project-tasks/project-tasks';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html'
})
export class TaskDetailsComponent implements OnInit {

  reactionDisposer: IReactionDisposer;
  ProjectTasksStore = ProjectTasksStore;
  AppStore = AppStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  remainingDaysAre: number = 0;
  todayDate: any = new Date();

  constructor(
    private _helperService: HelperServiceService,
    private _projectTasksService: ProjectTasksService,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _activatedRouter: ActivatedRoute,
  ) { }

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof TaskDetailsComponent
   */
  ngOnInit(): void {
    let id: number;
    this._activatedRouter.params.subscribe(params => {
      id = +params['id']; // (+) converts string 'id' to a number
     this.getProjectTaskDetails(id);
    });

    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    this.reactionDisposer = autorun(() => {
        var subMenuItems = [
          // { activityName: 'UPDATE_TASK', submenuItem: { type: 'edit_modal' } },
          { activityName: null, submenuItem: { type: 'close', path: '../' } },
        ]

      this._helperService.checkSubMenuItemPermissions(600,subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          // case "update_modal":
          //   // this.updateCaModal();
          //   break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    });
  }

  getProjectTaskDetails(id){
    this._projectTasksService.getItem(id).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getDaysRemaining() {
    let startDate = new Date(ProjectTasksStore?.indivitualProjectTasks?.target_date);
    this.remainingDaysAre = Math.floor((startDate.getTime() - this.todayDate.getTime()) / 1000 / 60 / 60 / 24);
    if (this.remainingDaysAre >= 0)
      this.remainingDaysAre = this.remainingDaysAre + 1;
    else
      this.remainingDaysAre = 0;
    return this.remainingDaysAre;
  }

  assignUserValues(user) {
    if (user) {
      var userInfoObject = {
        first_name: '',
        last_name: '',
        designation: '',
        image_token: '',
        mobile: null,
        email: '',
        id: null,
        department: '',
        status_id: null
      }

      userInfoObject.first_name = user?.first_name;
      userInfoObject.last_name = user?.last_name;
      userInfoObject.designation = user?.designation;
      userInfoObject.image_token = user?.image.token;
      userInfoObject.email = user?.email;
      userInfoObject.mobile = user?.mobile;
      userInfoObject.id = user?.id;
      userInfoObject.status_id = user?.status.id
      userInfoObject.department = user?.department;
      return userInfoObject;
    }
  }

  getCreatedByPopupDetails(users, created?: string) {
    let userDetial: any = {};
    userDetial['first_name'] = users?.first_name ? users?.first_name : null;
    userDetial['last_name'] = users?.last_name ? users?.last_name : null;
    userDetial['designation'] = users?.designation ? users?.designation :null;
    userDetial['image_token'] = users?.image_token ? users?.image_token : users?.image_token;
    userDetial['email'] = users?.email ? users?.email : null;
    userDetial['mobile'] = users?.mobile ? users?.mobile : null;
    userDetial['id'] = users?.id;
    userDetial['department'] = users?.department;
    userDetial['status_id'] = users?.status_id ? users?.status_id : users?.status?.id;
    userDetial['created_at'] = created ? created : null;
    return userDetial;
  }

   /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof TaskDetailsComponent
   */
    ngOnDestroy() {
      // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
    }

}
