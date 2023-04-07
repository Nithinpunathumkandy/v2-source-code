import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { ImpactScenarioService } from 'src/app/core/services/bcm/impact-scenario/impact-scenario.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { BiaSettingsService } from 'src/app/core/services/settings/organization_settings/bia-settings/bia-settings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BiaMatrixStore } from 'src/app/stores/bcm/configuration/bia-matrix.store';
import { ImpactScenarioStore } from 'src/app/stores/bcm/configuration/impact-scenario/impact-scenario-store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';

declare var $: any;
@Component({
  selector: 'app-impact-scenario',
  templateUrl: './impact-scenario.component.html',
  styleUrls: ['./impact-scenario.component.scss']
})
export class ImpactScenarioComponent implements OnInit {

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
  biaModalSubscription: any;
  popupControlEventSubscription:any;
  networkFailureSubscription: any;
  idleTimeoutSubscription: any;
  mailConfirmationData = 'share_impact_scenario_message';
  BiaMatrixStore = BiaMatrixStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  ImpactScenarioStore = ImpactScenarioStore;
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;

  constructor(
    private _eventEmitterService: EventEmitterService,
    private _router: Router,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, 
    private _impactScenarioService: ImpactScenarioService,
    private _renderer2: Renderer2,
    private _biaSettingService: BiaSettingsService
  ) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_impact_scenario'});
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'BIA_IMPACT_SCENARIO_LIST', submenuItem: {type: 'search'}},
        {activityName: null, submenuItem: {type: 'refresh'}},
        {activityName: 'CREATE_BIA_IMPACT_SCENARIO', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_BIA_IMPACT_SCENARIO_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_BIA_IMPACT_SCENARIO', submenuItem: {type: 'export_to_excel'}},
        {activityName: 'IMPORT_BIA_IMPACT_SCENARIO', submenuItem: {type: 'import'}},
        {activityName: 'SHARE_BIA_IMPACT_SCENARIO', submenuItem: {type: 'share'}},
      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_BIA_IMPACT_SCENARIO')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(600, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.openRatingNewModal();
              this.pageChange();
              this._utilityService.detectChanges(this._cdr);
            }, 100);
            break;
            case "template":
              this._impactScenarioService.generateTemplate();
            break;
          case "export_to_excel":
            this._impactScenarioService.exportToExcel();
            break;
          case "import":
            ImportItemStore.setTitle('import_impact_scenario');
            ImportItemStore.setImportFlag(true);
            break;
          case "share":
              ShareItemStore.setTitle('share_impact_scenario_title');
              ShareItemStore.formErrors = {};
              break;
          case "search":
            ImpactScenarioStore.searchText = SubMenuItemStore.searchText;
              this.searchImpactScenarioList();
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
        this._impactScenarioService.shareData(ShareItemStore.shareData).subscribe(res=>{
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
        this._impactScenarioService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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
    this.biaModalSubscription = this._eventEmitterService.ImpactScenarioModal.subscribe(res=>{
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

    // console.log("scenData",BiaMatrixStore.impactScenario)
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {

    if (newPage) ImpactScenarioStore.setCurrentPage(newPage);
    this._impactScenarioService.getItems(false,null,true).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })

  }

  changeZIndex(){
    if($(this.impactScenarioModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.impactScenarioModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.impactScenarioModal.nativeElement,'overflow','auto');
    }
  }

  sortTitle(type: string) {
    this._impactScenarioService.sortImpactScenarioList(type, SubMenuItemStore.searchText);
    this.pageChange()
  }

  searchImpactScenarioList(){
    ImpactScenarioStore.setCurrentPage(1);
    this._impactScenarioService.getItems(false).subscribe(() => this._utilityService.detectChanges(this._cdr));
  }

  openRatingNewModal() {
    this.biaRatingObject.type="Add"
    this.biaRatingObject.values = null; // for clearing the value
    setTimeout(() => {
      $(this.impactScenarioModal.nativeElement).modal('show');
    }, 100);
  }
  closeFormRatingNewModal() {
    this.biaRatingObject.type=null
    this.pageChange(1)
    $(this.impactScenarioModal.nativeElement).modal('hide');
  }

    // modal control event
    modalControl(status: boolean) {
      switch (this.popupObject.type) {
        case '': this.delete(status)
          break;
  
        case 'Activate': this.activateImpactScenario(status)
          break;
  
        case 'Deactivate': this.deactivateImpactScenario(status)
          break;
  
      }
  
    }
  
  delete(status) {
    if (status && this.popupObject.id) {
  
      this._impactScenarioService.delete(this.popupObject.id).subscribe(resp => {
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
  
  deleteImpactScenario(id){
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
  
   activateImpactScenario(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._impactScenarioService.activate(this.popupObject.id).subscribe(resp => {
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
  
  deactivateImpactScenario(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._impactScenarioService.deactivate(this.popupObject.id).subscribe(resp => {
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
    this.popupObject.title = 'Activate Impact Scenario?';
    this.popupObject.subtitle = 'common_activate_subtitle';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for deactivate
  deactivate(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Impact Scenario?';
    this.popupObject.subtitle = 'common_deactivate_subtitle';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  editImpactScenario(id){
    this._impactScenarioService.getItem(id).subscribe(res=>{
  
      let ScenarioDetails = res;
      if(res){
        this.biaRatingObject.values = {
          id: ScenarioDetails.id,
          title: ScenarioDetails.title,
          bia_impact_category_id: ScenarioDetails.biaImpactCategory?.id,
          
        }
      this.biaRatingObject.type = 'Edit';
      this._utilityService.detectChanges(this._cdr);
      setTimeout(() => {
        $(this.impactScenarioModal.nativeElement).modal('show');
      }, 100);
    
      }
    })
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.popupControlEventSubscription.unsubscribe();
    this.biaModalSubscription.unsubscribe();
    ImpactScenarioStore.searchText = '';
    this.networkFailureSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  }

}
