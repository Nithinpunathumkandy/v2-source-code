import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { TaskStatusesMasterStore } from 'src/app/stores/masters/project-management/task-statuses.store';
import { TaskStatusesService } from 'src/app/core/services/masters/project-management/task-statuses/task-statuses.service';
declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-task-statuses',
  templateUrl: './task-statuses.component.html'
})
export class TaskStatusesComponent implements OnInit {  

  reactionDisposer: IReactionDisposer;
  TaskStatusesMasterStore = TaskStatusesMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  constructor(private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _taskStatusesService: TaskStatusesService,) { }

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof TaskStatusesComponent
   */
  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'TASK_STATUS_LIST', submenuItem: { type: 'search' }},
        {activityName: null, submenuItem: {type: 'close', path: './'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
       
      NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    
          if (SubMenuItemStore.clikedSubMenuItem) {
            switch (SubMenuItemStore.clikedSubMenuItem.type) {
                case "search":
                  TaskStatusesMasterStore.searchText = SubMenuItemStore.searchText;
                  this.pageChange(1);
                  break;
              default:
                break;
            }
            SubMenuItemStore.unSetClickedSubMenuItem();
          }
          if(NoDataItemStore.clikedNoDataItem){
            NoDataItemStore.unSetClickedNoDataItem();
          }
        })
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) TaskStatusesMasterStore.setCurrentPage(newPage);
    this._taskStatusesService.getItems(false,null,true).subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

    sortTitle(type: string) {
      this._taskStatusesService.sortTaskStatusesList(type, null);
      this.pageChange();
    }
  
   /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof TaskStatusesComponent
   */
    ngOnDestroy() {
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      TaskStatusesMasterStore.searchText = '';
      TaskStatusesMasterStore.currentPage = 1 ;
    }
    
}
