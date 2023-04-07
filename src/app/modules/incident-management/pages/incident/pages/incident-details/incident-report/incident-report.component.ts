import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { IncidentReportService } from 'src/app/core/services/incident-management/report/incident-report.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IncidentStore } from 'src/app/stores/incident-management/incident/incident-store';
import { IncidentReportStore } from 'src/app/stores/incident-management/report/incident-report.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { IncidentService } from 'src/app/core/services/incident-management/incident/incident.service';
import { IncidentInvestigationStore } from 'src/app/stores/incident-management/investigation-store';
import { data } from 'jquery';

declare var $: any;

@Component({
  selector: 'app-incident-report',
  templateUrl: './incident-report.component.html',
  styleUrls: ['./incident-report.component.scss']
})
export class IncidentReportsComponent implements OnInit {
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
	@ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  IncidentReportStore = IncidentReportStore
  reactionDisposer: IReactionDisposer;
  AuthStore = AuthStore;
  AppStore = AppStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
	workFlowObject = {
		values: null,
		type: null,
		module_id: null
	}
  popupObject = {
		title: '',
		id: null,
		subtitle: '',
		status: '',
		type: null
	};

  incidentReportObject = {
		reportId: null,
		fullView: true,
		bookView: false
	};
  workflowAddModalSubscription: any;
  popupControlEventSubscription: any;

  constructor(private _incidentReportService : IncidentReportService,private _imageService:ImageServiceService,
    private _helperService: HelperServiceService,    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, private _renderer2: Renderer2,   private _eventEmitterService:EventEmitterService,
    private _router: Router, private _incidentService: IncidentService,
    private _IncidentReportService: IncidentReportService) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_new_report'});
    this.reactionDisposer = autorun(() => {
      if(!AuthStore.getActivityPermission(1900,'CREATE_INCIDENT_REPORT')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
    if (SubMenuItemStore.clikedSubMenuItem) {

      switch (SubMenuItemStore.clikedSubMenuItem.type) {
        case "new_modal":
           this.addIncidentReport();
          break;
        case "full_view":
						this.incidentReportObject.bookView = true;
						this.incidentReportObject.fullView = false;
            IncidentReportStore.fullView = true;
            this._IncidentReportService.getItem(this.incidentReportObject.reportId).subscribe(res => {
              this._utilityService.detectChanges(this._cdr);
            });
            this.setSubMenu();
						this._utilityService.detectChanges(this._cdr);
						break;
				case "book_view":
						this.incidentReportObject.bookView = false;
						this.incidentReportObject.fullView = true;
            IncidentReportStore.fullView = false;
            this._IncidentReportService.getItem(this.incidentReportObject.reportId).subscribe(res => {
              this._utilityService.detectChanges(this._cdr);
            });
            this.setSubMenu();
						this._utilityService.detectChanges(this._cdr);
						break;
        default:
          break;
      }
      // Don't forget to unset clicked item immediately after using it
      SubMenuItemStore.unSetClickedSubMenuItem();
    }

    if(NoDataItemStore.clikedNoDataItem){
      // IncidentStore.clearDocumentDetails();
      this.addIncidentReport();
       NoDataItemStore.unSetClickedNoDataItem();
   }

  })
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    this.workflowAddModalSubscription = this._eventEmitterService.incidentReportAddModal.subscribe(res=>{
      this.closeModal()
      this._utilityService.detectChanges(this._cdr);
    });
    this.pageChange();
    // if(!IncidentInvestigationStore.selectedId) 
    this.getInvestigation();
    // this.setSubMenu();
  }

  pageChange(newPage: number = null){
    this._incidentReportService.getIncidentReport().subscribe(res=> {
      if(res) {
        this.incidentReportObject.reportId = res.data[0].id;
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getInvestigation(){
      this._incidentService.getItem(IncidentStore.selectedId).subscribe(res => {
        if (res['investigation'].length != 0) {
          IncidentInvestigationStore.setSelectedInvestigationId(res['investigation'][0].id);
          this.setSubMenu();
        }
        else{
          if(NoDataItemStore.noDataItems.hasOwnProperty('subtitle')){
            NoDataItemStore.deleteObject('subtitle');
            NoDataItemStore.deleteObject('buttonText');
          }
          let subMenuItems = [
            {activityName:null, submenuItem: {type: 'close', path: '../incidents'}}
          ]
          this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
        }
        this._utilityService.detectChanges(this._cdr);
      })
  }

  setSubMenu(){
    if(IncidentReportStore.allItems.length > 0 && this.incidentReportObject.bookView == false) {
      let subMenuItems = [
        // {activityName:null, submenuItem: {type: 'full_view'}},
        {activityName:null, submenuItem: {type: 'close', path: '../incidents'}}
      ]
      this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
    }
    else if(IncidentReportStore.allItems.length > 0 && this.incidentReportObject.fullView == false) {
      let subMenuItems = [
        // {activityName:null, submenuItem: {type: 'book_view'}},
        {activityName:null, submenuItem: {type: 'close', path: '../incidents'}}
      ]
      this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
    }
    else if(IncidentReportStore.allItems.length == 0){
      let subMenuItems = [
        {activityName: 'CREATE_INCIDENT_REPORT', submenuItem: {type: 'new_modal'}},
        {activityName:null, submenuItem: {type: 'close', path: '../incidents'}}
      ]
      this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
    }
  }

  addIncidentReport(){
    IncidentReportStore.setSubMenuHide(true);
		// $(this.formModal.nativeElement).modal('show');
		this.workFlowObject.type="add";
		// this._utilityService.detectChanges(this._cdr);
    $('.modal-backdrop').add();
    document.body.classList.add('modal-open')

    setTimeout(() => {
      this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'block');
      // this._renderer2.setStyle(this.controlDetails.nativeElement, 'z-index', 999999);
      this._renderer2.removeAttribute(this.formModal.nativeElement, 'aria-hidden');
      this._renderer2.addClass(this.formModal.nativeElement, 'show')
      this._utilityService.detectChanges(this._cdr)
    }, 100);
	  }

    closeModal(){ 
      // $(this.formModal.nativeElement).modal('hide');

      this._renderer2.removeClass(this.formModal.nativeElement, 'show')
      document.body.classList.remove('modal-open')
      this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'none');
      // this._renderer2.setStyle(this.controlDetails.nativeElement, 'fade', 'opacity: 0;');
      this._renderer2.setAttribute(this.formModal.nativeElement, 'aria-hidden', 'true');
      $('.modal-backdrop').remove();
      this.workFlowObject.type = null;
      this.pageChange();
      setTimeout(() => {
        this._renderer2.removeClass(this.formModal.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr);
      }, 100);
      }

      createImagePreview(type, token) {
        return this._imageService.getThumbnailPreview(type, token)
      }
        // Returns default image
        getDefaultImage(type) {
          return this._imageService.getDefaultImageUrl(type);
        }

        edit(id) {
          event.stopPropagation();
          this._incidentReportService.getItem(id).subscribe(res => {
            var workFlowDetails = res;
            // this.workFlowObject.module_id = this.moduleGroupId;
            // this.workFlowObject.values = {
            // id: workFlowDetails.id,
            // title:workFlowDetails.title,
            // organization_ids : workFlowDetails.organizations? workFlowDetails.organizations[0].id: [],
            // module_ids: workFlowDetails.module.id,
            
            // }
            this.workFlowObject.type = 'Edit';
            // IncidentWorkflowStore.addFlag=false;
            this._utilityService.detectChanges(this._cdr);
            this.addIncidentReport()
        
          })
          }

          goToDetails(id){
            this._router.navigateByUrl('/incident-management/incident-reports/'+id)
          }

              // for delete
  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'delete';
    this.popupObject.subtitle = 'delete_report';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');

  }

    // for popup object clearing
    clearPopupObject() {
      this.popupObject.id = null;
    }

   // modal control event
   modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteIncidentReport(status)
        break;
    }

  }

  // delete function call
  deleteIncidentReport(status: boolean) {
    if (status && this.popupObject.id) {
      this._incidentReportService.delete(this.popupObject.id,IncidentStore.selectedId).subscribe(resp => {
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

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    IncidentReportStore.searchText = null;
    this.popupControlEventSubscription.unsubscribe();
    this.workflowAddModalSubscription.unsubscribe();
    IncidentReportStore.unsetAllIncidents();
    IncidentReportStore.fullView = false;
    //this.reportId = null;
    // this._rightSidebarFilterService.resetFilter();
    // this.filterSubscription.unsubscribe();
    // RightSidebarLayoutStore.showFilter = false;
  }

}
