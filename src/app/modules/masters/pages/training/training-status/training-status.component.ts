import { ChangeDetectorRef, Component, OnInit, Renderer2 } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { TrainingStatusService } from 'src/app/core/services/masters/training/training-status/training-status.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { TrainingStatusMasterStore } from 'src/app/stores/masters/training/training-status-master-store';

@Component({
  selector: 'app-training-status',
  templateUrl: './training-status.component.html',
  styleUrls: ['./training-status.component.scss']
})
export class TrainingStatusComponent implements OnInit {

  TrainingStatusMasterStore = TrainingStatusMasterStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;

  constructor(private _trainingStatusService:TrainingStatusService,
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_training_category' });
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: 'UNSAFE_ACTION_CATEGORY_LIST', submenuItem: { type: 'search' } },  
        { activityName: 'EXPORT_UNSAFE_ACTION_CATEGORY', submenuItem: { type: 'export_to_excel' } },
        { activityName: null, submenuItem: { type: 'close', path: 'training' } },
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
           
          case "export_to_excel":
            this._trainingStatusService.exportToExcel();
            break;
          case "search":
            TrainingStatusMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          
          
          default:
            break;
        }
        //Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

    })

    // TrainingStatusMasterStore.setOrderBy('asc');
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) TrainingStatusMasterStore.setCurrentPage(newPage);
    this._trainingStatusService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  sortTitle(type: string) {
    this._trainingStatusService.sortTrainingStatus(type, SubMenuItemStore.searchText);
    this.pageChange();
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    TrainingStatusMasterStore.searchText = '';
    TrainingStatusMasterStore.currentPage = 1 ;
    }

}
