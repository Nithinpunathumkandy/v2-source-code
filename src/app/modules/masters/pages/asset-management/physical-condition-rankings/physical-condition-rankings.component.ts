import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy, Renderer2 } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { PhysicalConditionRankingsMasterStore } from 'src/app/stores/masters/asset-management/physical-condition-rankings-store';
import { PhysicalConditionRankingsService } from 'src/app/core/services/masters/asset-management/physical-condition-rankings/physical-condition-rankings.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-physical-condition-rankings',
  templateUrl: './physical-condition-rankings.component.html',
  styleUrls: ['./physical-condition-rankings.component.scss']
})
export class PhysicalConditionRankingsComponent implements OnInit, OnDestroy {

  @ViewChild('physicalConditionRankings') physicalConditionRankings: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  PhysicalConditionRankingsMasterStore = PhysicalConditionRankingsMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_physical_condition_ranking_message';
  rankingModalSubscription: any;
  popupControlEventSubscription: any;
  networkFailureSubscription: any;
  idleTimeoutSubscription: any;


  rankingsObject = {
    type: null,
    values: null
  }

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };


  constructor(private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _physicalConditionRankingsService: PhysicalConditionRankingsService,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2,
  ) { }

  /**
  * @description
  * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  * Add 'implements OnInit' to the class.
  *
  * @memberof PhysicalConditionRankingsComponent
  */
  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        // {activityName: '', submenuItem: { type: 'search' }},

        { activityName: 'PHYSICAL_CONDITION_RANKING_LIST', submenuItem: { type: 'search' } },
        { activityName: 'CREATE_PHYSICAL_CONDITION_RANKING', submenuItem: { type: 'new_modal' } },
        { activityName: 'GENERATE_PHYSICAL_CONDITION_RANKING', submenuItem: { type: 'template' } },
        { activityName: 'IMPORT_PHYSICAL_CONDITION_RANKING', submenuItem: { type: 'import' } },
        { activityName: 'EXPORT_PHYSICAL_CONDITION_RANKING', submenuItem: { type: 'export_to_excel' } },
        { activityName: 'SHARE_PHYSICAL_CONDITION_RANKING', submenuItem: { type: 'share' } },

        { activityName: null, submenuItem: { type: 'close', path: 'asset-management' } },
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_physical_condition_ranking' });
      if(!AuthStore.getActivityPermission(100,'CREATE_PHYSICAL_CONDITION_RANKING')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      if (SubMenuItemStore.clikedSubMenuItem) {

        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.openNewModal()
              this._utilityService.detectChanges(this._cdr);
            }, 100);
            break;
          case "template":
            this._physicalConditionRankingsService.generateTemplate();
            break;
          case "import":
            ImportItemStore.setTitle('import_physical_condition_rankings');
            ImportItemStore.setImportFlag(true);
            break;
          case "export_to_excel":
            this._physicalConditionRankingsService.exportToExcel();
            break;
          case "share":
            ShareItemStore.setTitle('share_physical_condition_rankings');
            ShareItemStore.formErrors = {};
            break;
          case "search":
            PhysicalConditionRankingsMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (NoDataItemStore.clikedNoDataItem) {
        this.openNewModal();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      if (ShareItemStore.shareData) {
        this._physicalConditionRankingsService.shareData(ShareItemStore.shareData).subscribe(res => {
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
    this.rankingModalSubscription = this._eventEmitterService.PhysicalConditionRankings.subscribe(res => {
      this.closeNewModal();
    })
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
      if (!status) {
        this.changeZIndex();
      }
    })
    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
      if (!status) {
        this.changeZIndex();
      }
    })

    this.pageChange(1);
  }


  pageChange(newPage: number = null) {
    if (newPage) PhysicalConditionRankingsMasterStore.setCurrentPage(newPage);
    this._physicalConditionRankingsService.getItems(false, null, true).subscribe(() => setTimeout(() =>
      this._utilityService.detectChanges(this._cdr), 100));
  }

  changeZIndex() {
    if ($(this.physicalConditionRankings.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.physicalConditionRankings.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.physicalConditionRankings.nativeElement, 'overflow', 'auto');
    }
  }

  sortTitle(type: string) {
    this._physicalConditionRankingsService.sortPhysicalConditionRankingsList(type, null);
    this.pageChange();
  }


  openNewModal() {
    this.rankingsObject.type = "Add";
    this.rankingsObject.values = null; // for clearing the value
    setTimeout(() => {
      $(this.physicalConditionRankings.nativeElement).modal('show');
    }, 100);
  }

  closeNewModal() {
    this.rankingsObject.type = null
    $(this.physicalConditionRankings.nativeElement).modal('hide');
  }

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.delete(status)
        break;
      case 'Activate': this.activateArea(status)
        break;
      case 'Deactivate': this.deactivateArea(status)
        break;
    }
  }

  delete(status) {
    if (status && this.popupObject.id) {

      this._physicalConditionRankingsService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this.pageChange();
          this._utilityService.detectChanges(this._cdr);

        }, 500);
        this.clearDeleteObject();

      });
    }
    else {
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);

  }

  // for activate 
  activate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'Activate Bia Tire?';
    this.popupObject.subtitle = 'common_activate_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for deactivate
  deactivate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Bia Tire?';
    this.popupObject.subtitle = 'common_deactivate_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deletephysicalConditionRank(id) {
    this.popupObject.id = id;
    this.popupObject.type = '';
    this.popupObject.subtitle = 'common_delete_subtitle'

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  clearDeleteObject() {

    this.popupObject.id = null;
    this.popupObject.type = '';
    this.popupObject.subtitle = '';

  }

  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
  }

  // calling activcate function
  activateArea(status: boolean) {
    if (status && this.popupObject.id) {
      this._physicalConditionRankingsService.activate(this.popupObject.id).subscribe(resp => {
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
  deactivateArea(status: boolean) {
    if (status && this.popupObject.id) {
      this._physicalConditionRankingsService.deactivate(this.popupObject.id).subscribe(resp => {
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

  editphysicalConditionRankings(id) {
    this._physicalConditionRankingsService.getItem(id).subscribe(res => {

      let physicalConditionRankings = res;
      if (res) {
        this.rankingsObject.values = {
          id: physicalConditionRankings.id,
          title: physicalConditionRankings.title,

          // from:TireDetails?.bia_scale[0]?.from,
          // to:TireDetails?.bia_scale[0]?.to,
          // bia_scale_category:TireDetails?.bia_scale[0]?.bia_scale_category.type

        }
        this.rankingsObject.type = 'Edit';
        this._utilityService.detectChanges(this._cdr);
        setTimeout(() => {
          $(this.physicalConditionRankings.nativeElement).modal('show');
        }, 100);

      }
    })
  }


  /**
  * @description
  * Called once, before the instance is destroyed.
  * Add 'implements OnDestroy' to the class.
  *
  * @memberof PhysicalConditionRankingsComponent
  */
  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    PhysicalConditionRankingsMasterStore.searchText = '';
    PhysicalConditionRankingsMasterStore.currentPage = 1 ;
  }

}
