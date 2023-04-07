import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ModuleService } from 'src/app/core/services/masters/general/module/module.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ModuleMasterStore } from 'src/app/stores/masters/general/module-store';

declare var $: any;

@Component({
  selector: 'app-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.scss']
})
export class ModuleComponent implements OnInit {

  reactionDisposer:IReactionDisposer;
  ModuleMasterStore = ModuleMasterStore;
  AuthStore = AuthStore;
  AppStore = AppStore;

  constructor(
    private _helperService:HelperServiceService,
    private _utilityService:UtilityService,
    private _moduleService:ModuleService,
    private _cdr: ChangeDetectorRef,

  ) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle' });
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        { activityName: null, submenuItem: { type: 'close', path: 'masters' } },
      ]
      // if (!AuthStore.getActivityPermission(100, 'CREATE_MODULE')) {
      //   NoDataItemStore.deleteObject('subtitle');
      //   NoDataItemStore.deleteObject('buttonText');
      // }
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
    if (newPage) ModuleMasterStore.setCurrentPage(newPage);
    this._moduleService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  sortTitle(type: string) {
    //
    this._moduleService.sortModuleList(type, null);
    this.pageChange();
  }
}
