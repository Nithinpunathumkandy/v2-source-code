import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';

import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { BackupAtOffsiteStatusesService } from 'src/app/core/services/masters/bpm/backup-at-offsite-statuses/backup-at-offsite-statuses.service';
import { BackupAtOffsiteStatusesMasterStore } from 'src/app/stores/masters/bpm/backup-at-offsite-statuses.master.store';
declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-backup-at-offsite-statuses',
  templateUrl: './backup-at-offsite-statuses.component.html',
  styleUrls: ['./backup-at-offsite-statuses.component.scss']
})
export class BackupAtOffsiteStatusesComponent implements OnInit, OnDestroy {
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  BackupAtOffsiteStatusesMasterStore = BackupAtOffsiteStatusesMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;

  
  constructor(  private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _backupAtOffsiteStatusesService: BackupAtOffsiteStatusesService){}
  

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof BackupAtOffsiteStatusesComponent
   */
  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'BACKUP_AT_OFFSITE_STATUS_LIST', submenuItem: { type: 'search' }},
        {activityName: null, submenuItem: {type: 'close', path: 'bpm'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    
          if (SubMenuItemStore.clikedSubMenuItem) {
    
            switch (SubMenuItemStore.clikedSubMenuItem.type) {
              case "search":
                BackupAtOffsiteStatusesMasterStore.searchText = SubMenuItemStore.searchText;
                this.pageChange(1);
                break;
              default:
                break;
            }
            // Don't forget to unset clicked item immediately after using it
            SubMenuItemStore.unSetClickedSubMenuItem();
          }
          if(NoDataItemStore.clikedNoDataItem){
           
            NoDataItemStore.unSetClickedNoDataItem();
          }
        })

    this.pageChange(1);
  }


  pageChange(newPage: number = null) {
    if (newPage) BackupAtOffsiteStatusesMasterStore.setCurrentPage(newPage);
    this._backupAtOffsiteStatusesService.getItems(false,null,true).subscribe(() => setTimeout(() => 
    this._utilityService.detectChanges(this._cdr), 100));
  }

  sortTitle(type: string) {
    this._backupAtOffsiteStatusesService.sortbackupAtOffsiteStatusesList(type, null);
    this.pageChange();
  }


   /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof BackupAtOffsiteStatusesComponent
   */
  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BackupAtOffsiteStatusesMasterStore.searchText = '';
    BackupAtOffsiteStatusesMasterStore.currentPage = 1 ;
  }

}
