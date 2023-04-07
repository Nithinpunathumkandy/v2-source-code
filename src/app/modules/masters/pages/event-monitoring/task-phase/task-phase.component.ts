import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { TaskPhaseService } from 'src/app/core/services/masters/event-monitoring/task-phase/task-phase.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { TaskPhaseMasterStore } from 'src/app/stores/masters/event-monitoring/task-phase-store';

declare var $: any;

@Component({
  selector: 'app-task-phase',
  templateUrl: './task-phase.component.html',
  styleUrls: ['./task-phase.component.scss']
})
export class TaskPhaseComponent implements OnInit {

  reactionDisposer:IReactionDisposer;
  TaskPhaseMasterStore = TaskPhaseMasterStore;
  AuthStore = AuthStore;
  AppStore = AppStore;

  constructor(
    private _helperService:HelperServiceService,
    private _utilityService:UtilityService,
    private _taskPhaseService:TaskPhaseService,
    private _cdr: ChangeDetectorRef,

  ) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle' });
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        { activityName: null, submenuItem: { type: 'close', path: 'event-monitoring' } },
      ]
      if (!AuthStore.getActivityPermission(100, 'CREATE_TASK_PHASES')) {
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          default:
            break;
        }

        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (NoDataItemStore.clikedNoDataItem) {
        NoDataItemStore.unSetClickedNoDataItem();
      }
    })
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) TaskPhaseMasterStore.setCurrentPage(newPage);
    this._taskPhaseService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  sortTitle(type: string) {
    //
    this._taskPhaseService.sortTaskPhaseList(type, null);
    this.pageChange();
  }
}
