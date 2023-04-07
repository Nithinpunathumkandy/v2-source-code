import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IReactionDisposer, autorun } from 'mobx';
import { Subscription } from 'rxjs';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { JsoObservationsService } from 'src/app/core/services/jso/jso-observations/jso-observations.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { JsoObservationStore } from 'src/app/stores/jso/jso-observations/jso-observations-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any

@Component({
  selector: 'app-jso-observations-list',
  templateUrl: './jso-observations-list.component.html',
  styleUrls: ['./jso-observations-list.component.scss']
})
export class JsoObservationsListComponent implements OnInit {

  @ViewChild('formModal', { static: false }) formModal: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  
  filterSubscription: Subscription = null;
  JsoObservationStore = JsoObservationStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  jsoUnsafeActionEvent: any = null;
  jsoSubscriptionEvent: any = null;
  jsoUnsafeActionCategorySubscriptionEvent: any = null;
  jsoUnsafeActionSubCategorySubscriptionEvent: any = null;
  jsoUnsafeActionObservedGroupSubscriptionEvent: any = null;
  deleteEventSubscription: any;
  networkFailureSubscription:any;
  jsoObservationTypeSubscriptionEvent: any = null;
  idleTimeoutSubscription: any;

  deleteObject = {
    id: null,
    position: null,
    type: '',
    subtitle:'',
    category:''
  };

  formObject = {
    id: null,
    type : null,
    values : null
  };

  constructor(private _jsoObservationService:JsoObservationsService,
    private _router:Router,
    private _renderer2: Renderer2,
    private _utilityService:UtilityService,
    private _helperService:HelperServiceService,
    private _eventEmitterService:EventEmitterService,
    private _humanCapitalService:HumanCapitalService,
    private _imageService:ImageServiceService,
    private _cdr:ChangeDetectorRef,
    private _rightSidebarFilterService: RightSidebarFilterService
    ) { }

  ngOnInit(): void {
    RightSidebarLayoutStore.showFilter = true;

    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.JsoObservationStore.loaded = false;
      this.getItems(1);
    });
    AppStore.showDiscussion = false;
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: null, submenuItem: { type: 'search'} },
        {activityName:null, submenuItem: {type: 'refresh'}},
        { activityName: 'CREATE_JSO_OBSERVATION', submenuItem: { type: 'new_modal' } },
        // { activityName: 'JSO_OBSERVATION_TEMPLATE', submenuItem: { type: 'template' } },
        { activityName: 'EXPORT_JSO_OBSERVATION', submenuItem: { type: 'export_to_excel' } },
       
      ]
      
      NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'Add JSO'});
      if(NoDataItemStore.clikedNoDataItem){
        this.addJsoObservations();
        NoDataItemStore.unSetClickedNoDataItem();
      }

      this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this._utilityService.detectChanges(this._cdr);
              this.addJsoObservations();
            }, 1000);
            break;
            case "template":
              this._jsoObservationService.generateTemplate();
            break;
          case "export_to_excel":
            this._jsoObservationService.exportToExcel();
            break;
          case "search":
            JsoObservationStore.searchText = SubMenuItemStore.searchText;
            this.getItems(1);
            break;
          case 'refresh':
            JsoObservationStore.loaded = false;
            this.getItems(1);
            break 
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })
    this.getItems(1);

    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;

    this.jsoUnsafeActionCategorySubscriptionEvent = this._eventEmitterService.jsoUnsafeActionCategory.subscribe(res => {
      this.changeZIndex();
    })
    this.jsoUnsafeActionSubCategorySubscriptionEvent = this._eventEmitterService.jsoUnsafeActionSubCategory.subscribe(res => {
      this.changeZIndex();
    })
    this.jsoUnsafeActionObservedGroupSubscriptionEvent = this._eventEmitterService.jsoUnsafeActionObservedGroup.subscribe(res => {
      this.changeZIndex();
    })
    this.jsoSubscriptionEvent = this._eventEmitterService.JsoUnsafeActionModel.subscribe(res => {
      this.changeZIndex();
    })
    this.jsoObservationTypeSubscriptionEvent = this._eventEmitterService.jsoObservationType.subscribe(res => {
      this.changeZIndex();
    })
    this.jsoSubscriptionEvent = this._eventEmitterService.JsoUnsafeActionModel.subscribe(res => {
      this.changeZIndex();
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

    this.jsoUnsafeActionEvent = this._eventEmitterService.JsoModel.subscribe(res => {
      this.closeFormModal();
    })

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.delete(item);
    });

    RightSidebarLayoutStore.filterPageTag = 'jso_observation';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
      'jso_observation_type_ids'
    ]);

  }

  getItems(newPage: number = null){
    if (newPage) JsoObservationStore.setCurrentPage(newPage);
    this._jsoObservationService.getItems(false,'').subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  getTimezoneFormatted(time){
    return this._helperService.timeZoneFormatted(time);
  }

  setJsoSort(type) {
    this._jsoObservationService.sortJsoObservationsList(type);
    this.getItems();
  }

  getDetails(id){
    if (AuthStore.getActivityPermission(100, 'JSO_OBSERVATION_DETAILS')) {
    JsoObservationStore.jso_id = id;
    this._router.navigateByUrl('/jso/jso-observations/'+id);
    }
  }

  // openFormModal(){ 
  //   $(this.formModal.nativeElement).modal('show');
  // }

  addJsoObservations(){
    this.formObject.type = 'Add';
    this.formObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
  }

  editJsoObservations(id,value){
    this.formObject.id = id;
    this.formObject.type = 'Edit';
    this.formObject.values = value; 
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  deleteJsoObservation(id){
    this.deleteObject.id = id;
    this.deleteObject.type = 'are_you_sure_delete';
    this.deleteObject.category = 'delete'
    this.deleteObject.subtitle = "jso_observation_delete_subtitile" 
    $(this.deletePopup.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  clearDeleteObject() {

    this.deleteObject.id = null;
    this.deleteObject.position = null;
    this.deleteObject.type = '';
    this.deleteObject.subtitle = '';
  }

  delete(status) {
    if (status && this.deleteObject.id) {
      this._jsoObservationService.delete(this.deleteObject.id).subscribe(resp => {
        // setTimeout(() => {
        //   this._utilityService.detectChanges(this._cdr);
        //   if (JsoObservationStore.currentPage > 1) {
        //     JsoObservationStore.currentPage = Math.ceil(JsoObservationStore.totalItems / 15);
        //   }
        // }, 500);
        this.clearDeleteObject();
        this._router.navigateByUrl('/jso/jso-observations');
        this._utilityService.detectChanges(this._cdr);
      },
        (err: HttpErrorResponse) => {
          // console.log(err)
          // if (err.status == 422) {

          //   this._utilityService.showErrorMessage(err.error.message, 'Error :');
          // }
          this._utilityService.showErrorMessage('Error :', err.error.message ? err.error.message : 'Something Went Wrong Try Again Later' );
        });
    }
    else {
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('hide');
    }, 250);
  }

  createImagePreview(type, token) {
    return this._humanCapitalService.getThumbnailPreview(type, token);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  changeZIndex(){
    if($(this.formModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
    }
  }

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    NoDataItemStore.unsetNoDataItems();
    SubMenuItemStore.makeEmpty();
    // window.removeEventListener('scroll',this.scrollEvent);
    this.jsoUnsafeActionCategorySubscriptionEvent.unsubscribe();
    this.jsoUnsafeActionSubCategorySubscriptionEvent.unsubscribe();
    this.jsoUnsafeActionObservedGroupSubscriptionEvent.unsubscribe();
    this.jsoSubscriptionEvent.unsubscribe();
    this.jsoObservationTypeSubscriptionEvent.unsubscribe();
    this.deleteEventSubscription.unsubscribe();
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    JsoObservationStore.searchText = null;
    SubMenuItemStore.searchText = '';
  }

  closeFormModal() {
    // this.getItems(1);
    this.formObject.type = null;
    this.formObject.values = null;
    $(this.formModal.nativeElement).modal('hide');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }

}
