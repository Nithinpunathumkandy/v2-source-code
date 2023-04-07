import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { InitiativeService } from 'src/app/core/services/strategy-management/initiatives/initiative.service';
import { InitiativeStore } from 'src/app/modules/strategy/initiative.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { StrategyManagementSettingStore } from 'src/app/stores/settings/strategy-management-settings.store';
import { StrategyInitiativeStore } from 'src/app/stores/strategy-management/initiative.store';
import { StrategyStore } from 'src/app/stores/strategy-management/strategy.store';
declare var $: any;

@Component({
  selector: 'app-strategy-initiatives',
  templateUrl: './strategy-initiatives.component.html',
  styleUrls: ['./strategy-initiatives.component.scss']
})
export class StrategyInitiativesComponent implements OnInit {

  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  AppStore =  AppStore;
  AuthStore= AuthStore;
  InitiativeStore = InitiativeStore;
  SubMenuItemStore = SubMenuItemStore;
  StrategyInitiativeStore = StrategyInitiativeStore;
  OrganizationModulesStore = OrganizationModulesStore;
  StrategyManagementSettingStore = StrategyManagementSettingStore
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore

  reactionDisposer: IReactionDisposer;
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  
  popupControlEventSubscription: any;
  filterSubscription: Subscription = null;

  constructor(private _renderer2: Renderer2, private _router: Router,private _utilityService: UtilityService,
    private _imageService: ImageServiceService,private _intiativeService : InitiativeService,
    private _cdr: ChangeDetectorRef, private _eventEmitterService: EventEmitterService,private _helperService: HelperServiceService,
    private _rightSidebarFilterService: RightSidebarFilterService) { }

  ngOnInit(): void {
    SubMenuItemStore.setNoUserTab(true);
    AppStore.showDiscussion = false;
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'initiative_add_button_title'});
   

    this.reactionDisposer = autorun(() => {      
      var subMenuItems = [
        {activityName: null, submenuItem: {type: 'search'}},
        {activityName: 'CREATE_STRATEGY_INITIATIVE', submenuItem: {type: 'new_modal'}},
      ]
      if(!AuthStore.getActivityPermission(3200,'CREATE_STRATEGY_INITIATIVE')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(3200, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.createNewInitiative();
            break;
          case "search":
            StrategyInitiativeStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;          
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      } 
      if(NoDataItemStore.clikedNoDataItem){
        this.createNewInitiative();
       NoDataItemStore.unSetClickedNoDataItem();
     }
    });

    // setTimeout(() => {
    //   this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
    //   window.addEventListener('scroll',this.scrollEvent,true);
    // }, 1000);

    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.deleteInitiative(item);
    })
    this.pageChange(1);
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

  createNewInitiative(){
    StrategyInitiativeStore.modalFrom = 'profiles';
    event.stopPropagation();
    this._router.navigateByUrl('strategy-management/strategy-initiatives/add')
    this._utilityService.detectChanges(this._cdr)
  }

  pageChange(newPage:number = null){
    if (newPage) StrategyInitiativeStore.setCurrentPage(newPage);
    this._intiativeService.getItems(true,'?strategy_profile_ids='+StrategyStore.strategyProfileId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  sortTitle(type: string) {
    this._intiativeService.sortStrategyInitiative(type, SubMenuItemStore.searchText);
    this.pageChange()
  }

  editStrategyInitiative(id){
    event.stopPropagation();
    StrategyInitiativeStore.setInitiativeId(id) 
    this._intiativeService.getInduvalInitiative(id).subscribe(res=>{
      StrategyStore.setSelectedId(res.strategy_profile.id)
      StrategyStore.setObjectiveId(res.strategy_profile_objective.id)
      this._router.navigateByUrl('strategy-management/strategy-initiatives/edit');
      this._utilityService.detectChanges(this._cdr)
    });
  }

    // for delete
    delete(id: number) {
      event.stopPropagation();
      this.popupObject.type = 'Delete';
      this.popupObject.id = id;
      this.popupObject.title = 'delete_initiative?';
      this.popupObject.subtitle = 'common_delete_subtitle';
      this._utilityService.detectChanges(this._cdr);
      $(this.confirmationPopUp.nativeElement).modal('show');
  
    }

    // for close
    close(id: number) {
      event.stopPropagation();
      this.popupObject.type = 'Close';
      this.popupObject.id = id;
      this.popupObject.title = 'Close Initiative?';
      this.popupObject.subtitle = 'Are you sure to close';
      this._utilityService.detectChanges(this._cdr);
      $(this.confirmationPopUp.nativeElement).modal('show');
  
    }

    activate(id: number) {
      event.stopPropagation();
      this.popupObject.type = 'Activate';
      this.popupObject.id = id;
      this.popupObject.title = 'Activate Strategy Initiative?';
      this.popupObject.subtitle = 'strategy_activate_subtitle?';
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
    this._utilityService.detectChanges(this._cdr);
  }

  deleteInitiative(status) {//delete
    let deleteId = [];
    let deleteData;
    let dataObject = {
      comment : null
    }
    if (status && this.popupObject.id) {  
      switch(this.popupObject.type){
        case 'Delete':
          deleteData = this._intiativeService.deleteStrategyInitiatives(this.popupObject.id);
          break;
        case 'Close':
          deleteData = this._intiativeService.closeStrategyInitiatives(this.popupObject.id);
          break;
          case 'Activate':
          deleteData = this._intiativeService.activateStrategyInitiatives(this.popupObject.id,dataObject);
          break;
          case 'Passivate':
          deleteData = this._intiativeService.passivateStrategyInitiatives(this.popupObject.id,dataObject);
          break;
      }

      deleteData.subscribe(resp => {
        // setTimeout(() => {
        //   this._utilityService.detectChanges(this._cdr);
        // }, 500);
        this.pageChange(StrategyInitiativeStore.currentPage);
        this.clearPopupObject();
        this._utilityService.detectChanges(this._cdr);
        // }
      },(err: HttpErrorResponse) => {
        if (err.status == 423) {
          this._utilityService.showErrorMessage("error",err.error.message ) 
        }
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

  getTitle(action_title?, initiativeTitle?){
    let title = (action_title ? action_title+' ' : '')+initiativeTitle
    return title
  }
  gotoDetails(data){
    StrategyInitiativeStore.setInitiativeId(data.id)
    this._router.navigateByUrl('strategy-management/strategy-initiatives/'+data.id)
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
  
  ngOnDestroy(){
    SubMenuItemStore.makeEmpty();
    SubMenuItemStore.searchText = '';
    StrategyInitiativeStore.searchText = null;
    this.popupControlEventSubscription.unsubscribe();
    if (this.reactionDisposer) this.reactionDisposer();
    // this._rightSidebarFilterService.resetFilter();
    // this.filterSubscription.unsubscribe();
    StrategyInitiativeStore.unsetInitiatives();
  }

}
