import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { MockDrillActionStatusService } from 'src/app/core/services/masters/mock-drill/mock-drill-action-status/mock-drill-action-status.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { MockDrillActionStatusMasterStore } from 'src/app/stores/masters/mock-drill/mock-drill-action-status-store';
declare var $: any;
@Component({
  selector: 'app-mock-drill-action-plan-status',
  templateUrl: './mock-drill-action-plan-status.component.html',
  styleUrls: ['./mock-drill-action-plan-status.component.scss']
})
export class MockDrillActionPlanStatusComponent implements OnInit {

  MockDrillActionStatusMasterStore = MockDrillActionStatusMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  AuthStore = AuthStore;
  AppStore = AppStore;
  popupObject = { type: '', title: '', id: null, subtitle: '' };
  deleteMockDrillSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  constructor(private _mockDrillStatusService: MockDrillActionStatusService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService) { }

  mockDrillStatusObject = { component: 'Master', type: null, values: null }

  ngOnInit(): void {

    NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle' });

    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: 'MOCK_DRILL_ACTION_PLAN_STATUS_LIST', submenuItem: { type: 'search' } },
        { activityName: 'EXPORT_MOCK_DRILL_ACTION_PLAN_STATUS', submenuItem: { type: 'export_to_excel' } },
        { activityName: null, submenuItem: { type: 'close', path: 'mock-drill' } },
      ]
      if (!AuthStore.getActivityPermission(100, '')) {
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "export_to_excel":
            this._mockDrillStatusService.exportToExcel();
            break;
          case "search":
            MockDrillActionStatusMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => { })
    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => { })
    this.pageChange(1);
  }
  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
  }
  // for sorting
  sortTitle(type: string) {
    this._mockDrillStatusService.sortMockDrillStatusesList(type, null);
    this.pageChange();
  }
  pageChange(newPage: number = null) {
    if (newPage) MockDrillActionStatusMasterStore.setCurrentPage(newPage);
    this._mockDrillStatusService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    MockDrillActionStatusMasterStore.searchText = '';
    MockDrillActionStatusMasterStore.currentPage = 1;
  }
}
