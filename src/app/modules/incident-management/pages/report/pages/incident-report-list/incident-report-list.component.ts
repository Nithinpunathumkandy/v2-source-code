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
import { IncidentReportStore } from 'src/app/stores/incident-management/report/incident-report.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;

@Component({
  selector: 'app-incident-report-list',
  templateUrl: './incident-report-list.component.html',
  styleUrls: ['./incident-report-list.component.scss']
})
export class IncidentReportListComponent implements OnInit {
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
	@ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  IncidentReportStore = IncidentReportStore
  reactionDisposer: IReactionDisposer;
  AuthStore = AuthStore;
  AppStore = AppStore
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
  workflowAddModalSubscription: any;
  popupControlEventSubscription: any;
  networkFailureSubscription: any;
  idleTimeoutSubscription: any;

  constructor(private _incidentReportService : IncidentReportService,private _imageService:ImageServiceService,
    private _helperService: HelperServiceService,    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, private _renderer2: Renderer2,   private _eventEmitterService:EventEmitterService,
    private _router: Router,

    ) { }


  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
      NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_new_report'});
      var subMenuItems = [
        // {activityName: null, submenuItem: {type: 'search'}},
        {activityName: 'CREATE_INCIDENT_REPORT', submenuItem: {type: 'new_modal'}},
        // {activityName: 'GENERATE_INCIDENT_TEMPLATE', submenuItem: {type: 'template'}},
        // {activityName: 'EXPORT_INCIDENT', submenuItem: {type: 'export_to_excel'}},
        // {activityName:null, submenuItem: {type: 'refresh'}}
      ]
      if(!AuthStore.getActivityPermission(1900,'CREATE_INCIDENT_REPORT')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);

    if (SubMenuItemStore.clikedSubMenuItem) {

      switch (SubMenuItemStore.clikedSubMenuItem.type) {
        case "new_modal":
          // IncidentReportStore.clearDocumentDetails();// clear document details
            // this.IncidentStore.unSelectControls();// clear controls details
            // this.IncidentStore.unSelectChecklist();// clear checklist details
           this.addIncidentReport();
          break;
        // case "template":
        //   // this._incidentService.generateTemplate();
        //   break;
        // case "export_to_excel":
        //   // this._incidentService.exportToExcel();
        //   break;
        // case "search":
        //   IncidentReportStore.searchText = SubMenuItemStore.searchText;
        //   this.pageChange(1);
        //   break;
          // case "refresh":
          //   IncidentReportStore.loaded = false;
          //   IncidentReportStore.searchText = null;
          //   this.pageChange(1);
          //   break;
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

   this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
    this.modalControl(item);
  })
   this.workflowAddModalSubscription = this._eventEmitterService.incidentReportAddModal.subscribe(res=>{
    
    this.closeModal()
    this._utilityService.detectChanges(this._cdr);
    });
  })
  this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
    if(!status){
      this.changeZIndex();
    }
  })
  this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
    if(!status){
      this.changeZIndex();
    }
  })
    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);
    this.pageChange(1)
  }

  scrollEvent = (event: any): void => {
    if(event.target.documentElement){
      const number = event.target.documentElement.scrollTop;
      if(number > 50){
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','45px');
        this._renderer2.addClass(this.navBar.nativeElement,'affix');
        // this.plainDev.style.height = '45px';
      }
      else{
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
        this._renderer2.removeClass(this.navBar.nativeElement,'affix');
        // this.plainDev.nativeElement.style.height = 'auto';
      }
    }
  }
  
  changeZIndex(){
    if($(this.formModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
    }
    
  }

  pageChange(newPage: number = null){
    if (newPage) IncidentReportStore.setCurrentPage(newPage);
    this._incidentReportService.getAllinvestigation().subscribe(res=>{this._utilityService.detectChanges(this._cdr);})
  }

  setRiskSort(type, callList: boolean = true) {
		this._incidentReportService.sortReportList(type, callList);
    this.pageChange();
	}

  addIncidentReport(){
    IncidentReportStore.setSubMenuHide(false);
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
    this.popupObject.title = 'Delete Incident?';
    this.popupObject.subtitle = 'Delete Incident';
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
      case '': this.deleteIncident(status)
        break;
    }

  }

  // delete function call
  deleteIncident(status: boolean) {
    if (status && this.popupObject.id) {
      this._incidentReportService.delete(this.popupObject.id).subscribe(resp => {
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
    this.networkFailureSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    // this._rightSidebarFilterService.resetFilter();
    // this.filterSubscription.unsubscribe();
    // RightSidebarLayoutStore.showFilter = false;
  }

}
