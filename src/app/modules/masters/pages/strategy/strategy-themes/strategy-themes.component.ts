import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { StrategyThemes } from 'src/app/core/models/masters/strategy/strategy-theme';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { StrategyThemeService } from 'src/app/core/services/masters/strategy/strategic-theme/strategy-theme.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { StrategicThemesMasterStore } from 'src/app/stores/masters/strategy/strategy-theme.store';
declare var $: any;
@Component({
  selector: 'app-strategy-themes',
  templateUrl: './strategy-themes.component.html',
  styleUrls: ['./strategy-themes.component.scss']
})
export class StrategyThemesComponent implements OnInit {
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('titleInput') titleInput: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  StrategicThemesMasterStore = StrategicThemesMasterStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  reactionDisposer: IReactionDisposer;
  strategicThemesSubscriptionEvent: any;
  idleTimeoutSubscription: any;
  popupControlEventSubscription: any;
  networkFailureSubscription: any;

  strategicThemesObject = {
    component: 'Master',
    values: null,
    type: null
  };
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  constructor(private _helperService:HelperServiceService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _renderer2:Renderer2,
    private _eventEmitterService:EventEmitterService,
    private _strategicThemeService:StrategyThemeService) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_strategic_theme'});

    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'STRATEGY_THEME_LIST', submenuItem: { type: 'search' }},
        {activityName: 'CREATE_STRATEGY_THEME', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_STRATEGY_THEME_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_STRATEGY_THEME', submenuItem: {type: 'export_to_excel'}},
        {activityName: null, submenuItem: {type: 'close', path:'strategy-management'}},
      ]

      if(!AuthStore.getActivityPermission(1100,'CREATE_STRATEGY_THEME')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
  
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.addNewItem();
            }, 1000);
            break;
          case "template":
            this._strategicThemeService.generateTemplate();
            break;
          case "export_to_excel":
            this._strategicThemeService.exportToExcel();
            break;
          case "search":
            StrategicThemesMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      
      if(NoDataItemStore.clikedNoDataItem){
        this.addNewItem();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    })

     // for deleting/activating/deactivating using delete modal
     this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    // for closing the modal
    this.strategicThemesSubscriptionEvent = this._eventEmitterService.strategicThemeModalControl.subscribe(res => {
      this.closeFormModal();
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
      if(!status && $(this.formModal.nativeElement).hasClass('show')){
        this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
        this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
      if(!status && $(this.formModal.nativeElement).hasClass('show')){
        this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
        this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
      }
    })

    StrategicThemesMasterStore.setOrderBy('asc');
    this.pageChange(1);
  }

  addNewItem(){
    this.strategicThemesObject.type = 'Add';
    this.strategicThemesObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  pageChange(newPage: number = null) {
    if (newPage) StrategicThemesMasterStore.setCurrentPage(newPage);
    this._strategicThemeService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 100);
  }

  // for close modal
  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.strategicThemesObject.type = null;
  }

  getStrategicThemes(id: number) {
    
    const strategyTheme: StrategyThemes = StrategicThemesMasterStore.getStrategicThemesById(id);
    //set form value
    let strategyThemePreviewUrl = this._strategicThemeService.getThumbnailPreview('strategy_theme',strategyTheme.image_token);

    let strategyThemeDetail = {
      name: strategyTheme.title, 
      title : strategyTheme.title,
      ext: strategyTheme.image_ext,
      size: strategyTheme.image_size,
      url: strategyTheme.image_url,
      thumbnail_url: strategyTheme.image_url,
      token: strategyTheme.image_token,
      preview: strategyThemePreviewUrl
      // id: focusArea.id,
  };
  this._strategicThemeService.setDocumentDetails(strategyThemeDetail,strategyThemePreviewUrl);
    let docmetData
    this.strategicThemesObject.values = {
      id: strategyTheme.id,
      title: strategyTheme.title,
      description: strategyTheme.description,
      
    }
    this.strategicThemesObject.type = 'Edit';
    this.openFormModal();
    this._utilityService.detectChanges(this._cdr);
  }
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteStrategyTheme(status)
        break;

      case 'Activate': this.activateStrategyTheme(status)
        break;

      case 'Deactivate': this.deactivateStrategyTheme(status)
        break;

    }

  }
  // delete function call
  deleteStrategyTheme(status: boolean) {
    if (status && this.popupObject.id) {
      this._strategicThemeService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      },(error=>{
        if(error.status == 405 && StrategicThemesMasterStore.getStrategicThemesById(this.popupObject.id).status_id == AppStore.activeStatusId){
          let id = this.popupObject.id;
          this.closeConfirmationPopUp();
          this.clearPopupObject();
          setTimeout(() => {
            this.deactivate(id);
            this._utilityService.detectChanges(this._cdr);
          }, 500);
        }
        else{
          this.closeConfirmationPopUp();
          this.clearPopupObject();
        }
      })
      );
    }
    else {
      this.closeConfirmationPopUp();
      this.clearPopupObject();
    }
  }
  closeConfirmationPopUp(){
    $(this.confirmationPopUp.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }
  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
    // this.popupObject.title = '';
    // this.popupObject.subtitle = '';
    // this.popupObject.type = '';

  }
 // calling activcate function

 activateStrategyTheme(status: boolean) {
  if (status && this.popupObject.id) {

    this._strategicThemeService.activate(this.popupObject.id).subscribe(resp => {
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

// calling deactivate function

deactivateStrategyTheme(status: boolean) {
  if (status && this.popupObject.id) {

    this._strategicThemeService.deactivate(this.popupObject.id).subscribe(resp => {
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


  // for activate 
activate(id: number) {
  // event.stopPropagation();
  this.popupObject.type = 'Activate';
  this.popupObject.id = id;
  this.popupObject.title = 'Activate Strategy Theme?';
  this.popupObject.subtitle = 'common_activate_subtitle';

  $(this.confirmationPopUp.nativeElement).modal('show');
}
// for deactivate
deactivate(id: number) {
  // event.stopPropagation();
  this.popupObject.type = 'Deactivate';
  this.popupObject.id = id;
  this.popupObject.title = 'Deactivate Strategy Theme?';
  this.popupObject.subtitle = 'common_deactivate_subtitle';

  $(this.confirmationPopUp.nativeElement).modal('show');
}
// for delete
delete(id: number) {
  // event.stopPropagation();
  this.popupObject.type = '';
  this.popupObject.id = id;
  this.popupObject.title = 'Delete Strategy Theme?';
  this.popupObject.subtitle = 'common_delete_subtitle';

  $(this.confirmationPopUp.nativeElement).modal('show');

}
  sortTitle(type: string) {
    // IncidentTypesMasterStore.setCurrentPage(1);
    this._strategicThemeService.sortStrategicThemeList(type, SubMenuItemStore.searchText);
    this.pageChange();
  }
}
