import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { AuditReportService } from 'src/app/core/services/internal-audit/report/report/audit-report.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuditStore } from 'src/app/stores/internal-audit/audit/audit-store';
import { AuditReportsStore } from 'src/app/stores/internal-audit/report/audit-report-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;
@Component({
  selector: 'app-audit-reports-list',
  templateUrl: './audit-reports-list.component.html',
  styleUrls: ['./audit-reports-list.component.scss']
})
export class AuditReportsListComponent implements OnInit, OnDestroy {
  @ViewChild('generateReportModal') generateReportModal: ElementRef;
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  AuditReportsStore = AuditReportsStore;
  AuditStore = AuditStore;
  AuthStore = AuthStore;
  reportObject = {
    component: 'Master',
    type: null
  };


  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };


  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AppStore = AppStore;
	filterSubscription: Subscription = null;
  generateReportEvent: any;
  popupControlAuditableEventSubscription: any;
  networkFailureSubscription: any;
  constructor(private _eventEmitterService: EventEmitterService,
    private _auditReportService: AuditReportService,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,
    private _router : Router,
    private _renderer2: Renderer2, private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _rightSidebarFilterService: RightSidebarFilterService,) { }

  ngOnInit(): void {

    RightSidebarLayoutStore.showFilter = true;
		this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
		  this.AuditReportsStore.loaded = false;
		  this.getReports();
		})
    
    AppStore.showDiscussion = false;
    NoDataItemStore.setNoDataItems({ title: "Looks like we don't have any generated Report!", subtitle: 'Generate report if there is any. To generate, simply tap the button below.', buttonText: 'Generate Report' });
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'CREATE_AUDIT_REPORT', submenuItem: {type: 'new_modal'}}
      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_AUDIT_REPORT')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(1000, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.openGenerateReportModal();
            }, 1000);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (NoDataItemStore.clikedNoDataItem) {
        this.openGenerateReportModal();

        NoDataItemStore.unSetClickedNoDataItem();
      }

    })

    
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
      window.addEventListener('scroll', this.scrollEvent, true);
    }, 1000);
    // calling generate report Modal
    this.generateReportEvent = this._eventEmitterService.generateAuditReportModalControl.subscribe(res => {
      this.closeGenerateReportModal()
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
      if(!status){
        if($(this.generateReportModal.nativeElement).hasClass('show')){
          this._renderer2.setStyle(this.generateReportModal.nativeElement,'z-index',999999);
          this._renderer2.setStyle(this.generateReportModal.nativeElement,'overflow','auto');
        }  
      }
    })


    // for deleting/activating/deactivating using delete modal
    this.popupControlAuditableEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    // NoDataItemStore.setNoDataItems({ title: "Looks like we don't have any generated Report!", subtitle: 'Generate report if there is any. To generate, simply tap the button below.', buttonText: 'Generate Report' });
    // setting submenu items
    // SubMenuItemStore.setSubMenuItems([
    //   { type: 'new_modal', path: 'internal-audit' }
    // ]);

    RightSidebarLayoutStore.filterPageTag = 'ia_report';
		this._rightSidebarFilterService.setFiltersForCurrentPage([
		  'organization_ids',
		  'division_ids',
		  'department_ids',
		  'section_ids',
		  'sub_section_ids',
      'audit_report_status_ids',
		  'audit_ids',
		]);

    this.getReports(1);
  }

  getReports(newPage: number = null) {
    if (newPage) AuditReportsStore.setCurrentPage(newPage);
    this._auditReportService.getItems().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }


  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }



  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }


  scrollEvent = (event: any): void => {
    if (event.target.documentElement) {
      const number = event.target.documentElement.scrollTop;
      if (number > 50) {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', '45px');
        this._renderer2.addClass(this.navBar.nativeElement, 'affix');
        // this.plainDev.style.height = '45px';
      }
      else {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
        this._renderer2.removeClass(this.navBar.nativeElement, 'affix');
        // this.plainDev.nativeElement.style.height = 'auto';
      }
    }
  }

  openGenerateReportModal() {
    this.reportObject.type = 'Add';
    $('.modal-backdrop').add();
    document.body.classList.add('modal-open')
    this._renderer2.setStyle(this.generateReportModal.nativeElement, 'display', 'block');
    // this._renderer2.setStyle(this.controlDetails.nativeElement, 'z-index', 999999);
    this._renderer2.removeAttribute(this.generateReportModal.nativeElement, 'aria-hidden');

    setTimeout(() => {
      this._renderer2.addClass(this.generateReportModal.nativeElement, 'show')
      this._utilityService.detectChanges(this._cdr)
    }, 100);
  }

  closeGenerateReportModal() {
    this.reportObject.type = null;
    this._renderer2.removeClass(this.generateReportModal.nativeElement, 'show')
    document.body.classList.remove('modal-open')
    this._renderer2.setStyle(this.generateReportModal.nativeElement, 'display', 'none');
    // this._renderer2.setStyle(this.controlDetails.nativeElement, 'fade', 'opacity: 0;');
    this._renderer2.setAttribute(this.generateReportModal.nativeElement, 'aria-hidden', 'true');
    $('.modal-backdrop').remove();
    setTimeout(() => {
      this._renderer2.removeClass(this.generateReportModal.nativeElement, 'show')
      this._utilityService.detectChanges(this._cdr)
    }, 200);

  }

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteAuditReport(status)
        break;

    }

  }

  // delete function call
  deleteAuditReport(status: boolean) {

    if (status && this.popupObject.id) {

      this._auditReportService.delete(this.popupObject.id).subscribe(resp => {
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
    this.popupObject.title = '';
    this.popupObject.subtitle = '';
    this.popupObject.type = '';

  }

  
  // for delete
  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Audit Report?';
    this.popupObject.subtitle = 'Delete Audit Report?';

    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  //	report details call

  getReportDetails(id:number){
    AuditStore.audit_report_id = null;
    this._router.navigateByUrl('/internal-audit/audit-reports/'+id);
    this._utilityService.detectChanges(this._cdr);
  }

  getTimezoneFormatted(time){
    return this._helperService.timeZoneFormatted(time);
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.generateReportEvent.unsubscribe();
    this.popupControlAuditableEventSubscription.unsubscribe();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    AuditStore.audit_report_id = null;
    this.networkFailureSubscription.unsubscribe();
    AuditReportsStore.clearAuditReorts();
    this._rightSidebarFilterService.resetFilter();
		this.filterSubscription.unsubscribe();
		RightSidebarLayoutStore.showFilter = false;
  }
}
