import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { ImpactAreaService } from 'src/app/core/services/bcm/impact-area/impact-area.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { BiaSettingsService } from 'src/app/core/services/settings/organization_settings/bia-settings/bia-settings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BiaMatrixStore } from 'src/app/stores/bcm/configuration/bia-matrix.store';
import { ImpactAreaStore } from 'src/app/stores/bcm/configuration/impact-area/impact-area-store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';

declare var $: any;
@Component({
  selector: 'app-impact-area',
  templateUrl: './impact-area.component.html',
  styleUrls: ['./impact-area.component.scss']
})
export class ImpactAreaComponent implements OnInit {

  @ViewChild('ratingModal', { static: true }) ratingModal: ElementRef;
  @ViewChild('biaScaleModal', { static: true }) biaScaleModal: ElementRef;
  @ViewChild('tierConfigModal', { static: true }) tierConfigModal: ElementRef;
  @ViewChild('impactAreaModal', { static: true }) impactAreaModal: ElementRef;
  @ViewChild('impactScenarioModal', { static: true }) impactScenarioModal: ElementRef;
  @ViewChild('impactCategoryModal', { static: true }) impactCategoryModal: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  biaRatingObject = {
    type: null,
    values: null
  }
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  mailConfirmationData = 'share_impact_area_message';
  biaModalSubscription: any;
  popupControlEventSubscription: any;
  networkFailureSubscription: any;
  idleTimeoutSubscription: any;
  AppStore = AppStore;
  AuthStore = AuthStore;
  BiaMatrixStore = BiaMatrixStore;
  ImpactAreaStore = ImpactAreaStore;
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;

  constructor(
    private _eventEmitterService: EventEmitterService,
    private _router: Router,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, 
    private _impactAreaService: ImpactAreaService,
    private _renderer2: Renderer2,
    private _biaSettingService: BiaSettingsService
  ) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_impact_area'});
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'BIA_IMPACT_AREA_LIST', submenuItem: {type: 'search'}},
        {activityName: null, submenuItem: {type: 'refresh'}},
        {activityName: 'CREATE_BIA_IMPACT_AREA', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_BIA_IMPACT_AREA_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_BIA_IMPACT_AREA', submenuItem: {type: 'export_to_excel'}},
        {activityName: 'IMPORT_BIA_IMPACT_AREA', submenuItem: {type: 'import'}},
        {activityName: 'SHARE_BIA_IMPACT_AREA', submenuItem: {type: 'share'}},
      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_BIA_IMPACT_AREA')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(600, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.openRatingNewModal()
              this._utilityService.detectChanges(this._cdr);
            }, 100);
            break;
          case "template":
              this._impactAreaService.generateTemplate();
            break;
          case "export_to_excel":
            this._impactAreaService.exportToExcel();
            break;
          case "import":
            ImportItemStore.setTitle('import_impact_area');
            ImportItemStore.setImportFlag(true);
            break;
          case "share":
              ShareItemStore.setTitle('share_impact_area_title');
              ShareItemStore.formErrors = {};
              break;
          case "search":
            ImpactAreaStore.searchText = SubMenuItemStore.searchText;
              this.searchImpactAreaList();
              break;
          case "refresh":
              this.pageChange(1);
              break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if(NoDataItemStore.clikedNoDataItem){
        this.openRatingNewModal();
        NoDataItemStore.unSetClickedNoDataItem();
      }

      if(ShareItemStore.shareData){
        this._impactAreaService.shareData(ShareItemStore.shareData).subscribe(res=>{
            ShareItemStore.unsetShareData();
            ShareItemStore.setTitle('');
            ShareItemStore.unsetData();
            $('.modal-backdrop').remove();
            document.body.classList.remove('modal-open');
            setTimeout(() => {
              $(this.mailConfirmationPopup.nativeElement).modal('show');              
            }, 200);
        },(error)=>{
          if(error.status == 422){
            ShareItemStore.processFormErrors(error.error.errors);
          }
          ShareItemStore.unsetShareData();
          this._utilityService.detectChanges(this._cdr);
          $('.modal-backdrop').remove();
          console.log(error);
        });
      }
      if(ImportItemStore.importClicked){
        ImportItemStore.importClicked = false;
        this._impactAreaService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    SubMenuItemStore.setNoUserTab(true);
    this._biaSettingService.getItems().subscribe()
    this.biaModalSubscription = this._eventEmitterService.ImpactAreaModal.subscribe(res=>{
      this.closeFormRatingNewModal();
    })
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
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
    // console.log("areadat",BiaMatrixStore.impactArea)

    this.pageChange(1);
  }

  searchImpactAreaList(){
    ImpactAreaStore.setCurrentPage(1);
    this._impactAreaService.getItems(false).subscribe(() => this._utilityService.detectChanges(this._cdr));
  }

  changeZIndex(){
    if($(this.impactAreaModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.impactAreaModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.impactAreaModal.nativeElement,'overflow','auto');
    }
  }

  pageChange(newPage: number = null) {

    if (newPage) ImpactAreaStore.setCurrentPage(newPage);
    this._impactAreaService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })

  }

  sortTitle(type: string) {
    this._impactAreaService.sortImpactAreaList(type, SubMenuItemStore.searchText);
    this.pageChange()
  }

  openRatingNewModal() {
    this.biaRatingObject.type="Add";
    this.biaRatingObject.values = null; // for clearing the value
    setTimeout(() => {
      $(this.impactAreaModal.nativeElement).modal('show');
    }, 100);
  }
  closeFormRatingNewModal() {
    this.biaRatingObject.type=null
    this.pageChange()
    $(this.impactAreaModal.nativeElement).modal('hide');
  }

    // modal control event
    modalControl(status: boolean) {
      switch (this.popupObject.type) {
        case '': this.delete(status)
          break;
  
        case 'Activate': this.activateImpactArea(status)
          break;
  
        case 'Deactivate': this.deactivateImpactArea(status)
          break;
  
      }
  
    }
  
  delete(status) {
    if (status && this.popupObject.id) {
  
      this._impactAreaService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this.pageChange();
          this._utilityService.detectChanges(this._cdr);
       
        }, 500);
        this.clearDeleteObject();
  
      });
    }
    else {
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
  
  }
  
  deleteImpactArea(id){
    this.popupObject.id = id;
    this.popupObject.type = '';
    this.popupObject.subtitle='common_delete_subtitle'
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  
  clearDeleteObject() {
  
    this.popupObject.id = null;
    this.popupObject.type = '';
    this.popupObject.subtitle='';
  
  }
  
   // calling activcate function
  
   activateImpactArea(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._impactAreaService.activate(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this.pageChange();
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
  
  deactivateImpactArea(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._impactAreaService.deactivate(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this.pageChange();
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
    // this.popupObject.title = '';
    // this.popupObject.subtitle = '';
    // this.popupObject.type = '';
  
  }
  
  // for activate 
  activate(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'Activate Impact Area?';
    this.popupObject.subtitle = 'common_activate_subtitle';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for deactivate
  deactivate(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Impact Area?';
    this.popupObject.subtitle = 'common_deactivate_subtitle';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  editImpactArea(id){
    this._impactAreaService.getItem(id).subscribe(res=>{
  
      let AreaDetails = res;
      if(res){
        this.biaRatingObject.values = {
          id: AreaDetails.id,
          title: AreaDetails.title,
          bia_impact_scenario_id: AreaDetails.biaImpactScenario?.id,
          
        }
      this.biaRatingObject.type = 'Edit';
      this._utilityService.detectChanges(this._cdr);
      setTimeout(() => {
        $(this.impactAreaModal.nativeElement).modal('show');
      }, 100);
    
      }
    })
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.popupControlEventSubscription.unsubscribe();
    this.biaModalSubscription.unsubscribe();
    ImpactAreaStore.searchText = '';
    this.networkFailureSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  }


}
