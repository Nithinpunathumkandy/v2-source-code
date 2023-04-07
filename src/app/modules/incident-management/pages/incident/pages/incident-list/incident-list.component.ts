import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { IncidentService } from 'src/app/core/services/incident-management/incident/incident.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IncidentDashBoardStore } from 'src/app/stores/incident-management/incident-dashboard/incident-dashboard.store';
import { IncidentStore } from 'src/app/stores/incident-management/incident/incident-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;

@Component({
  selector: 'app-incident-list',
  templateUrl: './incident-list.component.html',
  styleUrls: ['./incident-list.component.scss']
})
export class IncidentListComponent implements OnInit {
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  reactionDisposer: IReactionDisposer;

  SubMenuItemStore = SubMenuItemStore;
  IncidentStore = IncidentStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AuthStore = AuthStore;
  AppStore = AppStore
  filterSubscription: Subscription = null;

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  popupControlEventSubscription: any;

  constructor(private _utilityService: UtilityService,
              private _cdr: ChangeDetectorRef,
              private _router: Router,
              private _incidentService : IncidentService,
              private _imageService:ImageServiceService,
              private _eventEmitterService: EventEmitterService,
              private _helperService: HelperServiceService,
              private _rightSidebarFilterService: RightSidebarFilterService,
              private _renderer2: Renderer2

    ) { }

  ngOnInit(): void {
    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.IncidentStore.loaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.pageChange(1);
    })
    this.reactionDisposer = autorun(() => {
      NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_incident_button'});
      var subMenuItems = [
        {activityName: null, submenuItem: {type: 'search'}},
        {activityName:null, submenuItem: {type: 'refresh'}},
        {activityName: 'CREATE_INCIDENT', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_INCIDENT_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_INCIDENT', submenuItem: {type: 'export_to_excel'}},
        {activityName: 'IMPORT_INCIDENT', submenuItem: {type: 'import'}},
      ]
      if(!AuthStore.getActivityPermission(1900,'CREATE_INCIDENT')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);

    if (SubMenuItemStore.clikedSubMenuItem) {

      switch (SubMenuItemStore.clikedSubMenuItem.type) {
        case "new_modal":
          IncidentStore.clearDocumentDetails();// clear document details
            // this.IncidentStore.unSelectControls();// clear controls details
            // this.IncidentStore.unSelectChecklist();// clear checklist details
            this.addIncidentItem();
          break;
        case "template":
          this._incidentService.generateTemplate();
          break;
        case "export_to_excel":
          this._incidentService.exportToExcel();
          break;
        case "search":
          IncidentStore.searchText = SubMenuItemStore.searchText;
          this.pageChange(1);
          break;
        case "refresh":
            IncidentStore.loaded = false;
            IncidentStore.searchText = null;
            this.pageChange(1);
            break;
        case "import":
          ImportItemStore.setTitle('import_incident');
          ImportItemStore.setImportFlag(true);
        default:
          break;
      }
      // Don't forget to unset clicked item immediately after using it
      SubMenuItemStore.unSetClickedSubMenuItem();
    }

    if(NoDataItemStore.clikedNoDataItem){
      IncidentStore.clearDocumentDetails();
      this.addIncidentItem();
      NoDataItemStore.unSetClickedNoDataItem();
    }
    if(ImportItemStore.importClicked){
      ImportItemStore.importClicked = false;
      this._incidentService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
        ImportItemStore.unsetFileDetails();
        ImportItemStore.setTitle('');
        ImportItemStore.setImportFlag(false);
        $('.modal-backdrop').remove();
        this._utilityService.detectChanges(this._cdr);
      },(error)=>{
        if(error.status == 422){
          ImportItemStore.processFormErrors(error.error.errors);
        }
        else if(error.status == 500 || error.status == 403){
          ImportItemStore.unsetFileDetails();
          ImportItemStore.setImportFlag(false);
          $('.modal-backdrop').remove();
        }
        this._utilityService.detectChanges(this._cdr);
      })
    }
  })

  this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
    this.modalControl(item);
  })

    // setting submenu items
    RightSidebarLayoutStore.filterPageTag = 'incident_register';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
      'incident_category_ids',
      'incident_sub_category_ids',
      'incident_damage_type_ids',
      'incident_status_ids',
    ]);
    let currentYear = parseInt(new Date().getFullYear().toString());
    if (!RightSidebarLayoutStore.isFilterSelected('year', currentYear)) {
      RightSidebarLayoutStore.setFilterItem('year', currentYear);
      RightSidebarLayoutStore.setFilterValue('year', {title: currentYear, id: currentYear});
    }
    this.pageChange()

    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);

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

   // for user previrews
   assignUserValues(user) {
    if(user){
    var userInfoObject={
      first_name:'',
      last_name:'',
      designation:'',
      image_token:'',
      mobile:null,
      email:'',
      id:null,
      department:'',
      status_id:null
    }

    userInfoObject.first_name = user?.first_name?user?.first_name:user?.user?.first_name;
    userInfoObject.last_name = user?.last_name?user?.last_name:user?.user?.last_name;
    userInfoObject.designation = user?.designation_title ? user?.designation_title: user?.designation ? user?.designation: user?.user?.designation ? user?.user?.designation?.title: null;
    userInfoObject.image_token = user?.image_token ? user?.image_token : user?.image ? user?.image?.token : user?.user ? user?.user?.image_token:null;
    userInfoObject.email = user?.email;
    userInfoObject.mobile = user?.mobile;
    userInfoObject.id = user?.id;
    userInfoObject.status_id = user?.status_id
    userInfoObject.department = user?.department? user?.department: user?.user?.department?.title ? user?.user?.department?.title: null;
     return userInfoObject;
  }
  }

  gotToIncidentDetails(){
    this._router.navigateByUrl('incident-management/details');

  }

  addIncidentItem(){
    this._router.navigateByUrl('incident-management/add-incident');
  }

  // getAllIncidents(newPage: number = null){
  //   if (newPage) IncidentStore.setCurrentPage(newPage);
  //  this._incidentService.getItems().subscribe(res=>{
  //    this._utilityService.detectChanges(this._cdr)
  //  })
  // }

  pageChange(newPage: number = null) {
    if (newPage) IncidentStore.setCurrentPage(newPage);
    var additionalParams = ''
    if (IncidentDashBoardStore.incidentDashboardParam) {
			additionalParams = IncidentDashBoardStore.incidentDashboardParam;
		}
    this._incidentService.getItems(false, additionalParams ? additionalParams : '').subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }
    // Returns default image
    getDefaultImage(type) {
      return this._imageService.getDefaultImageUrl(type);
    }

    sortTitle(type: string) {
      this._incidentService.sortIncidentList(type, SubMenuItemStore.searchText);
      this.pageChange()
    }

     // for delete
  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Incident?';
    this.popupObject.subtitle = 'Are you sure you want to delete this incident ?';
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
      this._incidentService.delete(this.popupObject.id).subscribe(resp => {
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

    //edit function

    editIncidentItem(id:number){
      event.stopPropagation();
      this._incidentService.getItem(id).subscribe(res=>{
        this._router.navigateByUrl('/incident-management/edit-incident');
        this._utilityService.detectChanges(this._cdr)
      });
  
    }


  gotoIncidentDetails(incidentId) {
    if (AuthStore.getActivityPermission(100, 'INCIDENT_DETAILS')) {
      IncidentStore.unsetIssueDetails();
      IncidentStore.setSelectedIncidentId(incidentId);
      this._router.navigateByUrl('/incident-management/' + IncidentStore.selectedId + '/info')
    }
  }

  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    IncidentStore.searchText = null;
    this.popupControlEventSubscription.unsubscribe();
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    IncidentStore.searchText=null;
    SubMenuItemStore.searchText = '';
    IncidentDashBoardStore.incidentDashboardParam = '';
  }


}
