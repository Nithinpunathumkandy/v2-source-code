import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy, Renderer2 } from '@angular/core';

import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { ImpactScenarioService } from 'src/app/core/services/bcm/impact-scenario/impact-scenario.service';
import { ImpactScenarioStore } from 'src/app/stores/bcm/configuration/impact-scenario/impact-scenario-store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';


declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-impact-scenario',
  templateUrl: './impact-scenario.component.html',
  styleUrls: ['./impact-scenario.component.scss']
})
export class ImpactScinarioComponent implements OnInit, OnDestroy {
  @ViewChild('impactScenarioModal', { static: true }) impactScenarioModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  ImpactScenarioStore = ImpactScenarioStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_impact_scenario_message';


  biaRatingObject = {
    type: null,
    values: null
  };

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  popupImpactRatingEventSubscription: any;
  biaModalSubscription: any;
  networkFailureSubscription: any;
  idleTimeoutSubscription: any;

  constructor(private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _renderer2:Renderer2,
    private _impactScenarioService: ImpactScenarioService) { }


  /**
  * @description
  * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  * Add 'implements OnInit' to the class.
  *
  * @memberof ImpactScinarioComponent
  */
  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: 'BIA_IMPACT_SCENARIO_LIST', submenuItem: { type: 'search' } },
        { activityName: 'CREATE_BIA_IMPACT_SCENARIO', submenuItem: { type: 'new_modal' } },
        { activityName: 'GENERATE_BIA_IMPACT_SCENARIO_TEMPLATE', submenuItem: { type: 'template' } },
        { activityName: 'IMPORT_BIA_IMPACT_SCENARIO', submenuItem: { type: 'import' } },
        { activityName: 'EXPORT_BIA_IMPACT_SCENARIO', submenuItem: { type: 'export_to_excel' } },
        { activityName: 'SHARE_BIA_IMPACT_SCENARIO', submenuItem: { type: 'share' } },
        { activityName: null, submenuItem: { type: 'close', path: 'bcm' } },
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_bia_impact_scenario' });
      if (!AuthStore.getActivityPermission(100, 'CREATE_BIA_IMPACT_SCENARIO')) {
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      if (SubMenuItemStore.clikedSubMenuItem) {

        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.openRatingNewModal()
              this._utilityService.detectChanges(this._cdr);
            }, 100);
            break;
          case "template":
            this._impactScenarioService.generateTemplate();
            break;
          case "import":
            ImportItemStore.setTitle('import_impact_scenario');
            ImportItemStore.setImportFlag(true);
            break;
          case "export_to_excel":
            this._impactScenarioService.exportToExcel();
            break;
          case "search":
            ImpactScenarioStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "share":
            ShareItemStore.setTitle('share_impact_scenario_title');
            ShareItemStore.formErrors = {};
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (NoDataItemStore.clikedNoDataItem) {
        this.openRatingNewModal();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      if (ImportItemStore.importClicked) {
        ImportItemStore.importClicked = false;
        this._impactScenarioService.importData(ImportItemStore.getFileDetails).subscribe(res => {
          ImportItemStore.unsetFileDetails();
          ImportItemStore.setTitle('');
          ImportItemStore.setImportFlag(false);
          $('.modal-backdrop').remove();
          this._utilityService.detectChanges(this._cdr);
        }, (error) => {
          if (error.status == 422) {
            ImportItemStore.processFormErrors(error.error.errors);
          }
          else if (error.status == 500 || error.status == 403) {
            ImportItemStore.unsetFileDetails();
            ImportItemStore.setImportFlag(false);
            $('.modal-backdrop').remove();
          }
          this._utilityService.detectChanges(this._cdr);
        })
      }
      if (ShareItemStore.shareData) {
        this._impactScenarioService.shareData(ShareItemStore.shareData).subscribe(res => {
          ShareItemStore.unsetShareData();
          ShareItemStore.setTitle('');
          ShareItemStore.unsetData();
          $('.modal-backdrop').remove();
          document.body.classList.remove('modal-open');
          setTimeout(() => {
            $(this.mailConfirmationPopup.nativeElement).modal('show');
          }, 200);
        }, (error) => {
          if (error.status == 422) {
            ShareItemStore.processFormErrors(error.error.errors);
          }
          ShareItemStore.unsetShareData();
          this._utilityService.detectChanges(this._cdr);
          $('.modal-backdrop').remove();
          console.log(error);
        });
      }
    })

    // for deleting/activating/deactivating using delete modal
    this.popupImpactRatingEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    this.biaModalSubscription = this._eventEmitterService.ImpactScenarioModal.subscribe(res => {
      this.closeFormRatingNewModal();
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
    this.pageChange(1);
  }
  


  pageChange(newPage: number = null) {
    if (newPage) ImpactScenarioStore.setCurrentPage(newPage);
    this._impactScenarioService.getItems(false, null, true).subscribe(() => setTimeout(() =>
      this._utilityService.detectChanges(this._cdr), 100));
  }

  changeZIndex(){
    if($(this.impactScenarioModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.impactScenarioModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.impactScenarioModal.nativeElement,'overflow','auto');
    }
  }


  openRatingNewModal() {
    this.biaRatingObject.type = "Add"
    this.biaRatingObject.values = null; // for clearing the value
    setTimeout(() => {
      $(this.impactScenarioModal.nativeElement).modal('show');
    }, 100);
  }
  closeFormRatingNewModal() {
    this.biaRatingObject.type = null
    $(this.impactScenarioModal.nativeElement).modal('hide');
  }


  // for activate 
  activate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'Activate Impact Scenario?';
    this.popupObject.subtitle = 'common_activate_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for deactivate
  deactivate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Impact Scenario?';
    this.popupObject.subtitle = 'common_deactivate_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
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

  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
  }

  // calling activcate function
  activateImpactScenario(status: boolean) {
    if (status && this.popupObject.id) {

      this._impactScenarioService.activate(this.popupObject.id).subscribe(resp => {
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
  deactivateImpactScenario(status: boolean) {
    if (status && this.popupObject.id) {

      this._impactScenarioService.deactivate(this.popupObject.id).subscribe(resp => {
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


  sortTitle(type: string) {
    this._impactScenarioService.sortImpactScenarioList(type, null);
    this.pageChange();
  }


  /**
  * @description
  * Called once, before the instance is destroyed.
  * Add 'implements OnDestroy' to the class.
  *
  * @memberof ImpactScinarioComponent
  */
  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.popupImpactRatingEventSubscription.unsubscribe();
    ImpactScenarioStore.searchText = '';
    ImpactScenarioStore.currentPage = 1 ;
    this.networkFailureSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
  }

}
