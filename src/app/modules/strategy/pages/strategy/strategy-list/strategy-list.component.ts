import { Component, ElementRef, OnInit, ViewChild, Renderer2, ChangeDetectorRef } from '@angular/core';
import { Router } from "@angular/router";
import { IReactionDisposer, autorun } from "mobx";
import { AppStore } from 'src/app/stores/app.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { UtilityService } from "src/app/shared/services/utility.service";
import { StrategyService } from 'src/app/core/services/strategy-management/strategy/strategy.service';
import { StrategyStore } from 'src/app/stores/strategy-management/strategy.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { Subscription } from 'rxjs';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { StrategyDaashboardStore } from 'src/app/stores/strategy-management/dashboard.store';
import { HttpErrorResponse } from '@angular/common/http';
import { StrategyManagementSettingsServiceService } from 'src/app/core/services/settings/organization_settings/strategy-management-settings/strategy-management-settings-service.service';
import { StrategyManagementSettingStore } from 'src/app/stores/settings/strategy-management-settings.store';
declare var $: any;

@Component({
  selector: 'app-strategy-list',
  templateUrl: './strategy-list.component.html',
  styleUrls: ['./strategy-list.component.scss']
})
export class StrategyListComponent implements OnInit {
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('settingsModal') settingsModal: ElementRef;

  SubMenuItemStore = SubMenuItemStore;
  StrategyStore = StrategyStore;
  AppStore = AppStore
  AuthStore = AuthStore
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  StrategyManagementSettingStore= StrategyManagementSettingStore;
  reactionDisposer: IReactionDisposer;
  popupControlEventSubscription: any;
  settingsModalEventSubscription : any;
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  filterSubscription: Subscription = null;

  constructor(private _renderer2: Renderer2, private _router: Router, private _strategyService: StrategyService,
    private _helperService: HelperServiceService, private _cdr: ChangeDetectorRef, private _imageService: ImageServiceService,
    private _utilityService: UtilityService, private _eventEmitterService: EventEmitterService,
    private _rightSidebarFilterService: RightSidebarFilterService,private _strategyManagementService : StrategyManagementSettingsServiceService) { }

  ngOnInit(): void {

    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.StrategyStore.loaded = false;
      this.pageChange(1);
    })

    SubMenuItemStore.setNoUserTab(true);
    AppStore.showDiscussion = false;
    NoDataItemStore.setNoDataItems({ title: "No Strategies has been added", subtitle: 'Click on the below button to add a new strategy', buttonText: 'New Strategy' });
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        // { activityName: null, submenuItem: { type: 'configuration' } },
        { activityName: null, submenuItem: { type: 'search' } },
        { activityName: null, submenuItem: { type: 'refresh' } },
        { activityName: 'CREATE_STRATEGY_PROFILE', submenuItem: { type: 'new_modal' } },
        // {activityName: 'GENERATE_STRATEGY_PROFILE_TEMPLATE', submenuItem: {type: 'template'}},
        { activityName: 'EXPORT_STRATEGY_PROFILE', submenuItem: { type: 'export_to_excel' } },
        
      ]
      if (!AuthStore.getActivityPermission(3200, 'CREATE_STRATEGY_PROFILE')) {
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(3200, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.createNewStrategy();
            break;
          case "template":
            this._strategyService.generateTemplate();
            break;
          case "export_to_excel":
            this._strategyService.exportToExcel();
            break;
          case "search":
            StrategyStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case 'refresh':
            StrategyStore.loaded = false
            StrategyDaashboardStore.statusType = null
            this.pageChange(1);
            break;
          case "configuration":
            this.goToSettings();
            // this._router.navigateByUrl('bcm/bia-configuration/bia-rating');
            break

          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (NoDataItemStore.clikedNoDataItem) {
        this.createNewStrategy();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    });

    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
      window.addEventListener('scroll', this.scrollEvent, true);
    }, 1000);

    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    this.settingsModalEventSubscription = this._eventEmitterService.settingsModal.subscribe(item => {
      this.closeSettingsModal();
    })

    StrategyStore._strategyProfileId = null

    RightSidebarLayoutStore.filterPageTag = 'strategy_profile';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
      'strategy_profile_status_ids',
    ]);

    this.pageChange(1)
    this.getStrategySettingsDetails();
  }

  scrollEvent = (event: any): void => {
    if (event.target.documentElement) {
      const number = event.target.documentElement.scrollTop;
      if (number > 50) {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', '45px');
        this._renderer2.addClass(this.navBar.nativeElement, 'affix');
      }
      else {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
        this._renderer2.removeClass(this.navBar.nativeElement, 'affix');
      }
    }
  }

  pageChange(newPage: number = null) {
    let params = ''
    if (StrategyDaashboardStore.statusType == 'new')
      params = '&strategy_profile_status_ids=' + 1
    else if (StrategyDaashboardStore.statusType == 'on-going')
      params = '&strategy_profile_status_ids=' + 2
    if (newPage) StrategyStore.setCurrentPage(newPage);
    this._strategyService.getItems(false, params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getStrategySettingsDetails(){
    this._strategyManagementService.getItems().subscribe(()=>this._utilityService.detectChanges(this._cdr))
  }

  createNewStrategy() {
    this._router.navigateByUrl('strategy-management/strategy-profiles/add')
  }

  goToSettings(){
    this._renderer2.addClass(this.settingsModal.nativeElement,'show');
    this._renderer2.setStyle(this.settingsModal.nativeElement,'display','block');
    this._renderer2.setStyle(this.settingsModal.nativeElement,'z-index',99999);
    this._renderer2.setStyle(this.settingsModal.nativeElement,'overflow','auto'); 
  }

  closeSettingsModal(){
    this._renderer2.removeClass(this.settingsModal.nativeElement,'show');
    this._renderer2.setStyle(this.settingsModal.nativeElement,'display','none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }

  // for delete
  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'delete_strategy_profile?';
    this.popupObject.subtitle = 'common_delete_subtitle';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  close(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Close';
    this.popupObject.id = id;
    this.popupObject.title = 'close_strategy_profile?';
    this.popupObject.subtitle = 'Are you sure want to Close';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  activate(id: number) {

    event.stopPropagation();
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'Activate Strategy Profile?';
    this.popupObject.subtitle = 'strategy_activate_subtitle';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  passive(id: number) {
    event.stopPropagation();
      this.popupObject.type = 'Passivate';
      this.popupObject.id = id;
      this.popupObject.title = 'passivate?';
      this.popupObject.subtitle = 'common_passive_subtitle';
      this._utilityService.detectChanges(this._cdr);
      $(this.confirmationPopUp.nativeElement).modal('show');
  }

  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
    this.popupObject.type = null;
  }

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteProfile(status)
        break;
      case 'Close': this.closeProfile(status)
        break;
      case 'Activate': this.activateStrategyProfile(status)
        break;
      case 'Passivate': this.passiveStrategyProfile(status)
        break;
    }

  }

  // delete function call
  deleteProfile(status: boolean) {
    if (status && this.popupObject.id) {
      this._strategyService.deleteStrategyProfile(this.popupObject.id).subscribe(resp => {
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

  // delete function call
  closeProfile(status: boolean) {
    if (status && this.popupObject.id) {
      this._strategyService.closeStrategyProfile(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
      }, (err: HttpErrorResponse) => {
        if (err.status == 423) {
          this._utilityService.showErrorMessage("error", err.error.message)
        }
      });
    }
    else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);

  }

  activateStrategyProfile(status: boolean) {
    if (status && this.popupObject.id) {
      let dataObject = {
        comment: null
      }
      this._strategyService.activateStrategyProfile(this.popupObject.id, dataObject).subscribe(resp => {
        // setTimeout(() => {
        //   this._utilityService.detectChanges(this._cdr);
        // }, 500);
        this.pageChange(StrategyStore.currentPage);
        this._utilityService.detectChanges(this._cdr);
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

  passiveStrategyProfile(status: boolean) {
    if (status && this.popupObject.id) {
      let dataObject = {
        comment: null
      }
      this._strategyService.passiveStrategyProfile(this.popupObject.id, dataObject).subscribe(resp => {
        // setTimeout(() => {
        //   this._utilityService.detectChanges(this._cdr);
        // }, 500);
        this.pageChange(StrategyStore.currentPage);
        this._utilityService.detectChanges(this._cdr);
        this.clearPopupObject();
      });
    }
    else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }, 250);

  }
  editStrategyProfile(id) {
    event.stopPropagation();
    StrategyStore._strategyProfileId = id
    this._strategyService.getItem(id).subscribe(res => {
      this._router.navigateByUrl('strategy-management/strategy-profiles/edit');
      this._utilityService.detectChanges(this._cdr)
    });
  }

  sortTitle(type: string) {
    this._strategyService.sortStrategyProfiles(type, SubMenuItemStore.searchText);
    this.pageChange()
  }

  gotoDetails(id) {
    if (AuthStore.getActivityPermission(3200, 'STRATEGY_PROFILE_DETAILS')) {
      StrategyStore.setSelectedId(id)
      this._router.navigateByUrl('strategy-management/strategy-profiles/' + id);
    }
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }
  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  getPopupDetails(user){
    let userDetailObject: any = {};
    if(user){
      userDetailObject['first_name'] = user.created_by_first_name ? user.created_by_first_name : '';
      userDetailObject['last_name'] = user.created_by_last_name ? user.created_by_last_name :'';
      userDetailObject['designation'] = user.created_by_designation? user.created_by_designation: null;
      userDetailObject['image_token'] = user.created_by_image_token ? user.created_by_image_token : null;
      userDetailObject['email'] = user.email ? user.email: null;
      userDetailObject['mobile'] = user.mobile ? user.mobile: null;
      userDetailObject['id'] = user.created_by;
      userDetailObject['department'] = typeof(user.created_by_department) == 'string' ? user.created_by_department : null;
      userDetailObject['status_id'] = user.status_id ? user.status_id : 1;
      userDetailObject['created_at'] = user?.created_at;
      return userDetailObject;
    }
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.popupControlEventSubscription.unsubscribe();
    this.settingsModalEventSubscription.unsubscribe();
    StrategyStore.searchText = null;
    SubMenuItemStore.searchText = '';
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    StrategyDaashboardStore.statusType = null
    StrategyStore.unsetProfiles();
  }

}
