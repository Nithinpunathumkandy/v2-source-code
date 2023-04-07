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
import { ImpactAreaService } from 'src/app/core/services/bcm/impact-area/impact-area.service';
import { ImpactAreaStore } from 'src/app/stores/bcm/configuration/impact-area/impact-area-store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-impact-area',
  templateUrl: './impact-area.component.html',
  styleUrls: ['./impact-area.component.scss']
})
export class ImpactAreaComponent implements OnInit, OnDestroy {
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('impactAreaModal', { static: true }) impactAreaModal: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  ImpactAreaStore = ImpactAreaStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_impact_area_message';
  biaModalSubscription: any;
  popupControlEventSubscription: any;
  networkFailureSubscription: any;
  idleTimeoutSubscription: any;

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

  constructor(private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _renderer2: Renderer2,
    private _impactAreaService: ImpactAreaService) { }


  /**
  * @description
  * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  * Add 'implements OnInit' to the class.
  *
  * @memberof ImpactAreaComponent
  */
  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: 'BIA_IMPACT_AREA_LIST', submenuItem: { type: 'search' } },
        { activityName: 'CREATE_BIA_IMPACT_AREA', submenuItem: { type: 'new_modal' } },
        { activityName: 'GENERATE_BIA_IMPACT_AREA_TEMPLATE', submenuItem: { type: 'template' } },
        { activityName: 'IMPORT_BIA_IMPACT_AREA', submenuItem: { type: 'import' } },
        { activityName: 'EXPORT_BIA_IMPACT_AREA', submenuItem: { type: 'export_to_excel' } },
        { activityName: 'SHARE_BIA_IMPACT_AREA', submenuItem: { type: 'share' } },
        { activityName: null, submenuItem: { type: 'close', path: 'bcm' } },
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_bia_impact_area' });
      if (!AuthStore.getActivityPermission(100, 'CREATE_BIA_IMPACT_AREA')) {
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
            this._impactAreaService.generateTemplate();
            break;
          case "import":
            ImportItemStore.setTitle('import_impact_area');
            ImportItemStore.setImportFlag(true);
            break;
          case "export_to_excel":
            this._impactAreaService.exportToExcel();
            break;
          case "search":
            ImpactAreaStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "share":
            ShareItemStore.setTitle('share_impact_area_title');
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
        this._impactAreaService.importData(ImportItemStore.getFileDetails).subscribe(res => {
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
        this._impactAreaService.shareData(ShareItemStore.shareData).subscribe(res => {
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
    
    this.pageChange(1);
  }


  pageChange(newPage: number = null) {
    if (newPage) ImpactAreaStore.setCurrentPage(newPage);
    this._impactAreaService.getItems(false, null, true).subscribe(() => setTimeout(() =>
      this._utilityService.detectChanges(this._cdr), 100));
  }
  changeZIndex(){
    if($(this.impactAreaModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.impactAreaModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.impactAreaModal.nativeElement,'overflow','auto');
    }
  }
  openRatingNewModal() {
    this.biaRatingObject.type = "Add";
    this.biaRatingObject.values = null; // for clearing the value
    setTimeout(() => {
      $(this.impactAreaModal.nativeElement).modal('show');
    }, 100);
  }
  closeFormRatingNewModal() {
    this.biaRatingObject.type = null
    $(this.impactAreaModal.nativeElement).modal('hide');
  }

  // for activate 
  activate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'Activate Impact Area?';
    this.popupObject.subtitle = 'common_activate_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for deactivate
  deactivate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Impact Area?';
    this.popupObject.subtitle = 'common_deactivate_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.delete(status)
          break;
      case 'Activate': this.activateArea(status)
        break;
      case 'Deactivate': this.deactivateArea(status)
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

  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
  }

  // calling activcate function
  activateArea(status: boolean) {
    if (status && this.popupObject.id) {
      this._impactAreaService.activate(this.popupObject.id).subscribe(resp => {
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
  deactivateArea(status: boolean) {
    if (status && this.popupObject.id) {
      this._impactAreaService.deactivate(this.popupObject.id).subscribe(resp => {
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

  sortTitle(type: string) {
    this._impactAreaService.sortImpactAreaList(type, null);
    this.pageChange();
  }


  /**
  * @description
  * Called once, before the instance is destroyed.
  * Add 'implements OnDestroy' to the class.
  *
  * @memberof ImpactAreaComponent
  */
  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.popupControlEventSubscription.unsubscribe();
    ImpactAreaStore.searchText = '';
    ImpactAreaStore.currentPage = 1 ;
    this.networkFailureSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
  }

}
