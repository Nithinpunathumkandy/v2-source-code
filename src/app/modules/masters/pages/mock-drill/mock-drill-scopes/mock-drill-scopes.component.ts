import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { MockDrillScopesService } from 'src/app/core/services/masters/mock-drill/mock-drill-scopes/mock-drill-scopes.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { MockDrillScopesMasterStore } from 'src/app/stores/masters/mock-drill/mock-drill-scopes-store';

declare var $: any;

@Component({
  selector: 'app-mock-drill-scopes',
  templateUrl: './mock-drill-scopes.component.html',
  styleUrls: ['./mock-drill-scopes.component.scss']
})
export class MockDrillScopesComponent implements OnInit {

  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  MockDrillScopesMasterStore = MockDrillScopesMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  AuthStore = AuthStore;
  AppStore = AppStore;
  popupObject = { type: '', title: '', id: null, subtitle: '' };
  deleteMockDrillSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  mailConfirmationData = 'share_mock_drill_scopes_message';

  constructor(private _mockDrillScopesService: MockDrillScopesService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService) { }

  mockDrillScopesObject = { component: 'Master', type: null, values: null }

  ngOnInit(): void {

    NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle' });

    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: 'MOCK_DRILL_SCOPE_LIST', submenuItem: { type: 'search' } },
        { activityName: 'EXPORT_MOCK_DRILL_SCOPE', submenuItem: { type: 'export_to_excel' } },
        { activityName: 'SHARE_MOCK_DRILL_SCOPE', submenuItem: { type: 'share' } },
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
            this._mockDrillScopesService.exportToExcel();
            break;
          case "share":
            ShareItemStore.setTitle('share_mock_drill_scopes');
            ShareItemStore.formErrors = {};
            break;
          case "search":
            MockDrillScopesMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (ShareItemStore.shareData) {
        this._mockDrillScopesService.shareData(ShareItemStore.shareData).subscribe(res => {
          ShareItemStore.unsetShareData();
          ShareItemStore.setTitle('');
          ShareItemStore.unsetData();
          $('.modal-backdrop').remove();
          document.body.classList.remove('modal-open');
          setTimeout(() => {
            $(this.mailConfirmationPopup.nativeElement).modal('show');
          }, 200);
        }, (error) => {
          if (error.status == 422) {
            ShareItemStore.processFormErrors(error.error.errors);
          }
          ShareItemStore.unsetShareData();
          this._utilityService.detectChanges(this._cdr);
          $('.modal-backdrop').remove();
          console.log(error);
        });
      }
    })

    // for deleting/activating/deactivating using delete modal
    this.deleteMockDrillSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => { })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => { })
    this.pageChange(1);
  }

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case 'Activate': this.activateMockDrillScopes(status)
        break;
      case 'Deactivate': this.deactivateMockDrillScopes(status)
        break;
    }
  }

  // calling activcate function
  activateMockDrillScopes(status: boolean) {
    if (status && this.popupObject.id) {

      this._mockDrillScopesService.activate(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
      });
    }
    else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);

  }

  // calling deactivate function
  deactivateMockDrillScopes(status: boolean) {
    if (status && this.popupObject.id) {

      this._mockDrillScopesService.deactivate(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
      });
    }
    else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
  }

  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
  }

  // for sorting
  sortTitle(type: string) {
    this._mockDrillScopesService.sortMockDrillStatusesList(type, null);
    this.pageChange();
  }

  pageChange(newPage: number = null) {
    if (newPage) MockDrillScopesMasterStore.setCurrentPage(newPage);
    this._mockDrillScopesService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }


  // for activate 
  activate(id: number) {
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'activate_mock_drill_scopes?';
    this.popupObject.subtitle = 'are_you_sure_activate';
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  // for deactivate
  deactivate(id: number) {
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'deactivate_mock_drill_scopes?';
    this.popupObject.subtitle = 'are_you_sure_deactivate';
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    MockDrillScopesMasterStore.searchText = '';
    MockDrillScopesMasterStore.currentPage = 1;
  }
}
