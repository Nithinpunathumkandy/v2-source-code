import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild,Renderer2, ChangeDetectorRef } from '@angular/core';
import { Router } from "@angular/router";
import { IReactionDisposer, autorun } from "mobx";
import { Subscription } from 'rxjs';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { InitiativeService } from 'src/app/core/services/strategy-management/initiatives/initiative.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { StrategyInitiativeStore } from 'src/app/stores/strategy-management/initiative.store';
import { StrategyStore } from 'src/app/stores/strategy-management/strategy.store';
import { InitiativeStore } from '../../../initiative.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { StrategyManagementSettingsServiceService } from 'src/app/core/services/settings/organization_settings/strategy-management-settings/strategy-management-settings-service.service';
import { StrategyManagementSettingStore } from 'src/app/stores/settings/strategy-management-settings.store';
declare var $: any;
@Component({
  selector: 'app-initiative-list',
  templateUrl: './initiative-list.component.html',
  styleUrls: ['./initiative-list.component.scss']
})
export class InitiativeListComponent implements OnInit {

  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;


  SubMenuItemStore = SubMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
  OrganizationModulesStore = OrganizationModulesStore;
  StrategyManagementSettingStore = StrategyManagementSettingStore;
  reactionDisposer: IReactionDisposer;
  InitiativeStore = InitiativeStore
  AppStore =  AppStore;
  AuthStore= AuthStore
  StrategyInitiativeStore = StrategyInitiativeStore;
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
              private _rightSidebarFilterService: RightSidebarFilterService,private _strategyManagementService:StrategyManagementSettingsServiceService,
    ) { }

  ngOnInit(): void {

    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.StrategyInitiativeStore.loaded = false;
      this.pageChange(1);
    })
    
    SubMenuItemStore.setNoUserTab(true);
    AppStore.showDiscussion = false;
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'New Initative'});
   

    this.reactionDisposer = autorun(() => {      
      var subMenuItems = [
        {activityName: null, submenuItem: {type: 'search'}},
        {activityName: 'CREATE_STRATEGY_INITIATIVE', submenuItem: {type: 'new_modal'}},
        {activityName: ' GENERATE_STRATEGY_INITATIVE_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_STRATEGY_INITATIVE', submenuItem: {type: 'export_to_excel'}},
        {activityName:null, submenuItem: {type: 'refresh'}}
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
          case "template":
            this._intiativeService.generateTemplate();
            break;
          case "export_to_excel":
            this._intiativeService.exportToExcel();
            break;
          case "search":
            StrategyInitiativeStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
            case 'refresh':
              StrategyInitiativeStore.loaded = false
              this.pageChange(1); 
              break
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

    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);

    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.deleteInitiative(item);
    })
    RightSidebarLayoutStore.filterPageTag = 'strategy_initiative';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
    'organization_ids',
    'division_ids',
    'department_ids',
    'section_ids',
    'sub_section_ids',
    'strategy_profile_focus_area_ids',
    'strategy_profile_objective_ids',
    'strategy_initiative_action_ids',
    'target_unit_ids',
    'strategy_review_frequency_ids',
    'strategy_profile_ids',

    ]);

    this.pageChange(1);
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

  createNewInitiative(){
    this._router.navigateByUrl('strategy-management/strategy-initiatives/add')
  }

  pageChange(newPage:number = null){
    if (newPage) StrategyInitiativeStore.setCurrentPage(newPage);
    this._intiativeService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
      
    })
  }

  getStrategySettingsDetails(){
    this._strategyManagementService.getItems().subscribe(()=>this._utilityService.detectChanges(this._cdr))
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

 

  gotoDetails(id){
    StrategyInitiativeStore.setInitiativeId(id)
    this._router.navigateByUrl('strategy-management/strategy-initiatives/'+id)
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
      // StrategyStore.setObjectiveId(res.strategy_profile_objective.id)
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
      // event.stopPropagation();
      // this.popupObject.type = 'Activate';
      // this.popupObject.id = id;
      // this.popupObject.title = 'Activate Strategy Initiative?';
      // this.popupObject.subtitle = 'common_activate_subtitle';
      // this._utilityService.detectChanges(this._cdr);
      // $(this.confirmationPopUp.nativeElement).modal('show');

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

     // modal control event
//  modalControl(status: boolean) {
//   switch (this.popupObject.type) {
//     case '': this.deleteProfile(status)
//       break;
//     case 'Cancel': this.closeInitiative(status)
//       break;
//     case 'Activate': this.closeInitiative(status)
//       break;
//     case 'Deactivate': this.closeInitiative(status)
//       break;
//   }

// }

  // deleteProfile(status: boolean) {
  //   if (status && this.popupObject.id) {
  //     this._intiativeService.deleteStrategyInitiatives(this.popupObject.id).subscribe(resp => {
  //       setTimeout(() => {
  //         this._utilityService.detectChanges(this._cdr);
  //       }, 500);
  //       this.clearPopupObject();
  //     });
  //   }
  //   else {
  //     this.clearPopupObject();
  //   }
  //   setTimeout(() => {
  //     $(this.confirmationPopUp.nativeElement).modal('hide');
  //   }, 250);

  // }

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
        this.pageChange(StrategyInitiativeStore.currentPage)
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

  // closeInitiative(status: boolean) {
  //   if (status && this.popupObject.id) {
  //     this._intiativeService.closeStrategyInitiatives(this.popupObject.id).subscribe(resp => {
  //       setTimeout(() => {
  //         this._utilityService.detectChanges(this._cdr);
  //       }, 500);
  //       this.clearPopupObject();
  //     },(err: HttpErrorResponse) => {
  //       if (err.status == 423) {
  //         this._utilityService.showErrorMessage("error",err.error.message ) 
  //       }
  //     });
  //   }
  //   else {
  //     this.clearPopupObject();
  //   }
  //   setTimeout(() => {
  //     $(this.confirmationPopUp.nativeElement).modal('hide');
  //   }, 250);
  // }

  getTitle(action_title?, initiativeTitle?){
    let title = (action_title ? action_title+' ' : '')+initiativeTitle
    return title
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

  getNoDataSource(type,message){
    let noDataSource = {
      noData:message, border: false, imageAlign: type
    }
    return noDataSource;
  }
  
  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.popupControlEventSubscription.unsubscribe();
    StrategyInitiativeStore.searchText = null;
    SubMenuItemStore.searchText = '';
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    StrategyInitiativeStore.unsetInitiatives();
  }

}
