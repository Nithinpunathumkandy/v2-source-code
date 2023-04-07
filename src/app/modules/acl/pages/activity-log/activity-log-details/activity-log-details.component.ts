import { Component, OnInit } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';

@Component({
  selector: 'app-activity-log-details',
  templateUrl: './activity-log-details.component.html',
  styleUrls: ['./activity-log-details.component.scss']
})
export class ActivityLogDetailsComponent implements OnInit {
  reactionDisposer: IReactionDisposer;
  constructor(private _helperService:HelperServiceService,) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: null, submenuItem: {type: 'close', path: "/security/activity-logs"}},
      ]
      this._helperService.checkSubMenuItemPermissions(1200, subMenuItems);
    //   if (SubMenuItemStore.clikedSubMenuItem) {
    //     switch (SubMenuItemStore.clikedSubMenuItem.type) {
    //       case "export_to_excel":
    //         // this._activityLogService.exportToExcel();
    //         break;
    //       default:
    //         break;
    //     }
    //     // Don't forget to unset clicked item immediately after using it
    //     SubMenuItemStore.unSetClickedSubMenuItem();
    //   }
    })
    // SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
  }

  ngOnDestroy(){
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  }
}
