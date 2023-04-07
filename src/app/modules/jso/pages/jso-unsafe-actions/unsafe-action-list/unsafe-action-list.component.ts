import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { JsoUnsafeActionsService } from 'src/app/core/services/jso/unsafe-actions/jso-unsafe-actions.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { JsoUnsafeActionStore } from 'src/app/stores/jso/unsafe-actions/jso-unsafe-actions-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any

@Component({
  selector: 'app-unsafe-action-list',
  templateUrl: './unsafe-action-list.component.html',
  styleUrls: ['./unsafe-action-list.component.scss']
})
export class UnsafeActionListComponent implements OnInit {
  @ViewChild('formModal', { static: false }) formModal: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;

  JsoUnsafeActionStore = JsoUnsafeActionStore;
  AppStore = AppStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;
 unsafeActionSubscriptionEvent: any = null;
 filterSubscription: Subscription = null;

 jsoSubscriptionEvent:any;
 deleteEventSubscription:any;
 networkFailureSubscription:any;
 jsoUnsafeActionCategorySubscriptionEvent:any = null;
 jsoUnsafeActionSubCategorySubscriptionEvent:any = null;
 jsoUnsafeActionObservedGroupSubscriptionEvent:any = null;
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
  constructor(private _unsafeActionService:JsoUnsafeActionsService,
    private _humanCapitalService:HumanCapitalService,
    private _renderer2: Renderer2,
    private _helperService:HelperServiceService,
    private _cdr:ChangeDetectorRef,
    private _router:Router,
    private _utilityService:UtilityService,
    private _eventEmitterService:EventEmitterService,
    private _imageService:ImageServiceService,
    private _rightSidebarFilterService: RightSidebarFilterService
    ) { }

  ngOnInit(): void {
    RightSidebarLayoutStore.showFilter = true;

    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.JsoUnsafeActionStore.loaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.getItems(1);
    });

    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: null, submenuItem: { type: 'search'} },
        {activityName:null, submenuItem: {type: 'refresh'}},
        // { activityName: 'TEMPLATE_JSO_OBSERVATION_UNSAFE_ACTION', submenuItem: { type: 'template' } },
        { activityName: 'EXPORT_JSO_OBSERVATION_UNSAFE_ACTION', submenuItem: { type: 'export_to_excel' } },
       
      ]
      NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    
      // if(NoDataItemStore.clikedNoDataItem){
      //   this.addNewRiskTreatment();
      //   NoDataItemStore.unSetClickedNoDataItem();
      // }

      this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
            case "template":
              this._unsafeActionService.generateTemplate();
            break;
          case "export_to_excel":
            this._unsafeActionService.exportToExcel();
            break;
          case "search":
            JsoUnsafeActionStore.searchText = SubMenuItemStore.searchText;
            this.getItems(1);
            break;
          case 'refresh':
            JsoUnsafeActionStore.loaded = false;
            this.getItems(1);
            break 
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })

    this.jsoSubscriptionEvent = this._eventEmitterService.JsoUnsafeActionModel.subscribe(res => {
      this.closeFormModal();
    })

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.delete(item);
    });

    this.jsoUnsafeActionCategorySubscriptionEvent = this._eventEmitterService.jsoUnsafeActionCategory.subscribe(res => {
      this.changeZIndex();
    })
    this.jsoUnsafeActionSubCategorySubscriptionEvent = this._eventEmitterService.jsoUnsafeActionSubCategory.subscribe(res => {
      this.changeZIndex();
    })
    this.jsoUnsafeActionObservedGroupSubscriptionEvent = this._eventEmitterService.jsoUnsafeActionObservedGroup.subscribe(res => {
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

    this.getItems(1);
    RightSidebarLayoutStore.filterPageTag = 'jso_unsafe';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
      'unsafe_action_category_ids',
      'unsafe_action_sub_category_ids',
      'unsafe_action_observed_group_ids'
    ]);
  }

  getItems(newPage: number = null){
    if (newPage) JsoUnsafeActionStore.setCurrentPage(newPage);
    this._unsafeActionService.getItems(false,'').subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  createImagePreview(type, token) {
    return this._humanCapitalService.getThumbnailPreview(type, token);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  editUnsafeActions(id,value){
    this.formObject.id = id;
    this.formObject.type = 'Edit';
    this.formObject.values = value; 
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
  }

  getDetails(id){
    if (AuthStore.getActivityPermission(100, 'JSO_OBSERVATION_UNSAFE_ACTION_DETAILS')) {
    JsoUnsafeActionStore.unsafeAction_id = id;
    this._router.navigateByUrl('/jso/unsafe-actions/'+id);
    }
  }

  closeFormModal() {
    // this.getItems(1);
    this.formObject.type = null;
    this.formObject.values = null;
    $(this.formModal.nativeElement).modal('hide');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }

  deleteUnsafeAction(id){
    this.deleteObject.id = id;
    this.deleteObject.type = 'are_you_sure_delete';
    this.deleteObject.category = 'delete'
    this.deleteObject.subtitle = "jso_unsafe_action_delete_subtitile" 
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
      this._unsafeActionService.delete(this.deleteObject.id).subscribe(resp => {
        // setTimeout(() => {
        //   this._utilityService.detectChanges(this._cdr);
        //   if (JsoUnsafeActionStore.currentPage > 1) {
        //     JsoUnsafeActionStore.currentPage = Math.ceil(JsoUnsafeActionStore.totalItems / 15);
        //   }
        // }, 500);
        this.clearDeleteObject();
        this.getItems(JsoUnsafeActionStore.currentPage)
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

  setUnsafeActionSort(type){
    this._unsafeActionService.sortUnsafeActionList(type);
    this.getItems();
  }
 
  changeZIndex(){
    if($(this.formModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
    }
  }

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    // NoDataItemStore.unsetNoDataItems();
    SubMenuItemStore.makeEmpty();
    // window.removeEventListener('scroll',this.scrollEvent);
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    this.jsoUnsafeActionCategorySubscriptionEvent.unsubscribe();
    this.jsoUnsafeActionSubCategorySubscriptionEvent.unsubscribe();
    this.jsoUnsafeActionObservedGroupSubscriptionEvent.unsubscribe();
    this.jsoSubscriptionEvent.unsubscribe();
    this.deleteEventSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    JsoUnsafeActionStore.searchText = null;
		SubMenuItemStore.searchText = '';
  }

}
