import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { AprService } from 'src/app/core/services/bpm/advanced-process/apr.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { LocationService } from 'src/app/core/services/masters/general/location/location.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { AdvancePrStore } from 'src/app/stores/bpm/process/adavanc-pr-store';
import { AdvanceProcessStore } from 'src/app/stores/bpm/process/advance-process.store';
import { ProcessStore } from 'src/app/stores/bpm/process/processes.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { LocationMasterStore } from 'src/app/stores/masters/general/location-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

@Component({
  selector: 'app-apr',
  templateUrl: './apr.component.html',
  styleUrls: ['./apr.component.scss']
})
export class AprComponent implements OnInit {

  AppStore = AppStore;
  AdvancePrStore = AdvancePrStore
  AdvanceProcessStore = AdvanceProcessStore
  advanceProcessDiscovery = AdvancePrStore.advanceProcessRecovery
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  pipe = new DatePipe('en-US');
  formErrors: any;
  location: string;
  deleteEventSubscription: any;
  processEmptyList = 'No Activities under this Process'
  constructor(
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _locationService:LocationService,
    private _router: Router,
    private _aprService:AprService,
    private _eventEmitterService: EventEmitterService
  ) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({title: "apr_nodata_title", subtitle: 'apr_nodata_subtitle',buttonText: 'add_new_apr'});
    AppStore.showDiscussion = false;
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: null, submenuItem: {type: 'close', path: "../"}},
      ]
      // if(!AuthStore.getActivityPermission(100,'CREATE_PROCESS_STAKEHOLDER')){
      //   NoDataItemStore.deleteObject('subtitle');
      //   NoDataItemStore.deleteObject('buttonText');
      // }
      this._helperService.checkSubMenuItemPermissions(600, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {

        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.formErrors = null;
              this.openApr()
              this._utilityService.detectChanges(this._cdr);
            }, 100);
            break;
            case "edit_modal":
            setTimeout(() => {
              this.formErrors = null;
              this._router.navigateByUrl('bpm/process/edit-advanced-process-discovery');
              this._utilityService.detectChanges(this._cdr);
            }, 100);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if(NoDataItemStore.clikedNoDataItem){
        this.openApr()
        NoDataItemStore.unSetClickedNoDataItem();
      }
    })
    // this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(
      
    // );
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    SubMenuItemStore.setNoUserTab(true);
    this.getLocationMaster()
    this.getAdvanceProcessDiscovery()
    AdvanceProcessStore._primaryProcessOwner = ProcessStore?.processDetails?.process_owner;
  }

  applicationAccordianClick(index){
    let application = AdvanceProcessStore.advanceProcessDiscovery?.process_application_tools
    for (let i = 0; i < application.length; i++) {
      const element = application[i];
      if(i==index){
        element["is_accordion_active"]=!element["is_accordion_active"]
      }else{
        element["is_accordion_active"]= false
      }
    }
  }

  assetsClick(index){
    let application = AdvanceProcessStore.advanceProcessDiscovery?.process_assets
    for (let i = 0; i < application.length; i++) {
      const element = application[i];
      if(i==index){
        element["is_accordion_active"]=!element["is_accordion_active"]
      }else{
        element["is_accordion_active"]= false
      }
    }
  }

  vitalAccordianClick(index){
    let vital = AdvanceProcessStore.advanceProcessDiscovery?.process_vital_record
    for (let i = 0; i < vital.length; i++) {
      const element = vital[i];
      if(i==index){
        element["is_accordion_active"]=!element["is_accordion_active"]
      }else{
        element["is_accordion_active"]= false
      }
    }
  }

  getAdvanceProcessDiscovery(){
    this._aprService.getProcessRecoveries().subscribe(res=>{
      if(res.critical_operation&& res.critical_operation.id){
        SubMenuItemStore.setSubMenuItems([
          { type: 'edit_modal' },
          { type: "close", path: "../" }
        ])
      }else{
        SubMenuItemStore.setSubMenuItems([
          { type: 'new_modal' },
          { type: "close", path: "../" }
        ])
      }

    })
  }

  timeFormat (time) {
    if (time) {
      // Check correct time format and split into components
      time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

      if (time.length > 1) { // If time format correct
        time = time.slice(1);  // Remove full string match value
        time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
      }
      time.splice(3, 1)
      return time.join(''); // return adjusted time or original string
    }else{
      return '';
    }
       
  }

  accordianClick(index){
    let process = AdvanceProcessStore.advanceProcessDiscovery.process_dependency.related_processes
    for (let i = 0; i < process.length; i++) {
      const element = process[i];
      if(i==index){
        element["is_accordion_active"]=!element["is_accordion_active"]
      }else{
        element["is_accordion_active"]= false
      }
      if(AdvanceProcessStore.process_index!=index){
        AdvanceProcessStore.process_index = index;
      }else{
        AdvanceProcessStore.process_index = null;
      }
    }
  }

  getLocationMaster(newPage: number = null) {
    this._locationService.getItems(false,null,true).subscribe(res => {
     this.location =  LocationMasterStore.getLocationById(AdvancePrStore.advanceProcessRecovery?.location)?.title
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 200)
    });
  }

  getPopupDetails(user, is_created_by: boolean = false) {
  
    let userDetailObject: any = {};
    if(user){
      userDetailObject['first_name'] = user.first_name ? user.first_name : user.name ? user.name : '';
      userDetailObject['last_name'] = user.last_name;
      userDetailObject['designation'] = user.designation_title? user.designation_title: user.designation?.title ? user.designation.title : user.designation?user.designation: null;
      userDetailObject['image_token'] = user.image_token ? user.image_token : user.image?.token ? user.image?.token : null;
      userDetailObject['email'] = user.email ? user.email: null;
      userDetailObject['mobile'] = user.mobile ? user.mobile: null;
      userDetailObject['id'] = user.id;
      userDetailObject['department'] = typeof(user.department) == 'string' ? user.department : user.department?.title ? user.department?.title : null;
      userDetailObject['status_id'] = user.status_id ? user.status_id : 1;
      if(is_created_by) userDetailObject['created_at'] = ProcessStore.processDetails.created_at;
      return userDetailObject;
    }
}

  openApr(){
    this._router.navigateByUrl('bpm/process/add-advanced-process-discovery');
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    AdvanceProcessStore.processLoaded = false
  }

}
