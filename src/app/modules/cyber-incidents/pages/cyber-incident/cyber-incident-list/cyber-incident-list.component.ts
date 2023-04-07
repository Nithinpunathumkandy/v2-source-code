import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef, Renderer2, OnDestroy} from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { Router } from "@angular/router";
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { CyberIncidentService } from 'src/app/core/services/cyber-incident/cyber-incident.service';
import { CyberIncidentStore } from 'src/app/stores/cyber-incident/cyber-incident-store';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { Subscription } from 'rxjs';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { CyberIncidentDashBoardStore } from 'src/app/stores/cyber-incident/cyber-incident-dashboard-store';

declare var $: any;
@Component({
  selector: 'app-cyber-incident-list',
  templateUrl: './cyber-incident-list.component.html',
  styleUrls: ['./cyber-incident-list.component.scss']
})
export class CyberIncidentListComponent implements OnInit,OnDestroy {
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('formModal') formModal: ElementRef;

  reactionDisposer: IReactionDisposer;
  AuthStore = AuthStore;
  AppStore = AppStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  NoDataItemStore = NoDataItemStore;
  SubMenuItemStore = SubMenuItemStore;
  CyberIncidentStore=CyberIncidentStore;
  

  deleteObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  incidentObject = {
    values: null,
    type: null
  };

  addIncidentSubscription: any = null;
  deletePopupScubscription: any;
  filterSubscription: Subscription = null;


  constructor(private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2,
    private _cyberIncidentService:CyberIncidentService,
    private _humanCapitalService: HumanCapitalService,
    private _router: Router,
    private _rightSidebarFilterService: RightSidebarFilterService) {

  }

  ngOnInit(): void {
    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.CyberIncidentStore.loaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.pageChange(1);
    });

    RightSidebarLayoutStore.filterPageTag = 'cyber_incident';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'division_ids',
      'section_ids',
      'sub_section_ids',
      'department_ids',
      'cyber_incident_classification_ids',
      'cyber_incident_status_ids',
      // 'reporting_user_ids',
      'cyber_incident_ids',
      'reporting_user_ids'
    ]);
    // let currentYear = parseInt(new Date().getFullYear().toString());
    // if (!RightSidebarLayoutStore.isFilterSelected('year', currentYear)) {
    //   RightSidebarLayoutStore.setFilterItem('year', currentYear);
    //   RightSidebarLayoutStore.setFilterValue('year', {title: currentYear, id: currentYear});
    // }
    
    NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_incident' });
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: '', submenuItem: { type: 'search' } },
        { activityName: '', submenuItem: { type: 'refresh' } },
        { activityName: '', submenuItem: { type: 'new_modal' } },
        { activityName: '', submenuItem: { type: 'export_to_excel' } },

      ]

      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.createIncident();
            break;
          // case "template":
          //   this._eventService.generateTemplate();
          //   break;
          case "export_to_excel":
            this._cyberIncidentService.exportToExcel();
            break;
          case "search":
            CyberIncidentStore.searchText  = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "refresh":
            CyberIncidentStore.unsetCyberIncident();
            CyberIncidentDashBoardStore.unsetincidentDashboardParam();
            this.pageChange(1)
            break;
            // case "import":
            //   ImportItemStore.setTitle('import_event');
            //   ImportItemStore.setImportFlag(true);
            //   break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if (NoDataItemStore.clikedNoDataItem) {
        this.createIncident();
        NoDataItemStore.unSetClickedNoDataItem();
      }

      this.addIncidentSubscription = this._eventEmitterService.addCyberIncidentModal.subscribe(res => {
        this.closeFormModal();
      })
      this.deletePopupScubscription = this._eventEmitterService.deletePopup.subscribe(item => {
        this.delete(item);
      })
    })
    this.pageChange();
  }

  pageChange(page?)
  {
    if (page) CyberIncidentStore.setCurrentPage(page);
    var additionalParams = ''
    if (CyberIncidentDashBoardStore.incidentDashboardParam) {
			additionalParams = CyberIncidentDashBoardStore.incidentDashboardParam;
		}
    this._cyberIncidentService.getAllItems(false, additionalParams ? additionalParams : '').subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }
  createImageUrl(token) {
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

  closeFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);

    }, 100);
    this._renderer2.removeClass(this.formModal.nativeElement, 'show');
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '9999');
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'none');
    this.incidentObject.type = null;
  }

  createIncident() {
    this.incidentObject.type = 'Add';
    this.incidentObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();

  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
    this._renderer2.addClass(this.formModal.nativeElement, 'show');
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '99999');
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto')
  }

  gotoDetailsPage(id: number) {
    this._router.navigateByUrl(`/cyber-incident/cyber-incidents/${id}`)
  }

  deleteIncident(id,event)
  {
    event.stopPropagation();
    this.deleteObject.id = id;
    this.deleteObject.type = '';
    this.deleteObject.subtitle = 'Delete Cyber Incident?';
    $(this.deletePopup.nativeElement).modal('show');
  }
  delete(status) {
    let type;
    if (status && this.deleteObject.id) {
      switch (this.deleteObject.type) {
        case '': type = this._cyberIncidentService.delete(this.deleteObject.id);
          break;
      }
      type.subscribe(resp => {
        this.closeConfirmationPopUp();
        this.pageChange(CyberIncidentStore.currentPage);
        // setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
        this.clearDeleteObject();
      }, (error => {
        this.closeConfirmationPopUp();
        setTimeout(() => {
          if (error.status == 405) {
            // this.deactivate(this.deleteObject.id);
    
            this._utilityService.detectChanges(this._cdr);
          }
        }, 100);

      }));
    }
    else {
      this.closeConfirmationPopUp();
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('hide');
    }, 250);

  }
  closeConfirmationPopUp() {
    // setTimeout(() => {
    $(this.deletePopup.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
    // }, 250);
  }
  clearDeleteObject() {
    this.deleteObject.id = null;
    this.deleteObject.subtitle = '';
  }
  edit(id,event)
  {
    event.stopPropagation();
    this._cyberIncidentService.getItem(id).subscribe(res => {
      this.incidentObject.type = 'Edit';
      this.incidentObject.values = res; // for clearing the value
      this.openFormModal();
      this._utilityService.detectChanges(this._cdr);
    })
  }

  ngOnDestroy()
  {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    CyberIncidentStore.unsetCyberIncident();
    CyberIncidentStore.unsetSelectedItemDetails();
    this.deletePopupScubscription.unsubscribe();
    this.addIncidentSubscription.unsubscribe();
    this.filterSubscription.unsubscribe();
  }

}
