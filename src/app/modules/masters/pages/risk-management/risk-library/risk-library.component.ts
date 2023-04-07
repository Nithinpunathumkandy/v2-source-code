import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy, Renderer2 } from '@angular/core';
import{RiskLibraryMasterStore} from 'src/app/stores/masters/risk-management/risk-library-store';
import { RiskLibrary } from 'src/app/core/models/masters/risk-management/risk-library';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { RiskLibraryService } from 'src/app/core/services/masters/risk-management/risk-library/risk-library.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { ImportItemStore } from "src/app/stores/general/import-item.store";


declare var $: any;

@Component({
  selector: 'app-risk-library',
  templateUrl: './risk-library.component.html',
  styleUrls: ['./risk-library.component.scss']
})
export class RiskLibraryComponent implements OnInit {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;
  @ViewChild('viewmorepopup') viewmorepopup:ElementRef;

  reactionDisposer: IReactionDisposer;
  RiskLibraryMasterStore = RiskLibraryMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_risk_library_message';
  value;

  riskLibraryObject = {
    component: 'Master',
    values: null,
    type: null
  };

  riskLibraryPopupObject={
    component: 'Master',
    values: null,
    type: null
  }

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
 
  riskLibrarySubscriptionEvent: any = null;
  popupControlRiskLibraryEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  viewmorePopupEvent:any=null;

  constructor(  private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _riskLibraryService: RiskLibraryService){}

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'New Risk Library'});
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'RISK_LIBRARY_LIST', submenuItem: { type: 'search' }},
        {activityName: 'CREATE_RISK_LIBRARY', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_RISK_LIBRARY_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_RISK_LIBRARY', submenuItem: {type: 'export_to_excel'}},
        {activityName: 'SHARE_RISK_LIBRARY', submenuItem: {type: 'share'}},
        {activityName: 'IMPORT_RISK_LIBRARY', submenuItem: {type: 'import'}},
        {activityName: null, submenuItem: {type: 'close', path: 'risk-management'}},
      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_RISK_LIBRARY')){
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
                this._riskLibraryService.generateTemplate();
                break;
              case "export_to_excel":
                this._riskLibraryService.exportToExcel();
                break;
              case "search":
                RiskLibraryMasterStore.searchText = SubMenuItemStore.searchText;
                this.pageChange(1);
                break;
              case "share":
                ShareItemStore.setTitle('share_risk_library_title');
                ShareItemStore.formErrors = {};
                break;
              case "import":
                ImportItemStore.setTitle('import_risk_library');
                ImportItemStore.setImportFlag(true);
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
          if(ShareItemStore.shareData){
            this._riskLibraryService.shareData(ShareItemStore.shareData).subscribe(res=>{
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
            this._riskLibraryService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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

         // for deleting/activating/deactivating using delete modal
      this.popupControlRiskLibraryEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
        this.modalControl(item);
      })
      this.riskLibrarySubscriptionEvent = this._eventEmitterService.riskLibrary.subscribe(res => {
        this.closeFormModal();
      })

      this.viewmorePopupEvent=this._eventEmitterService.riskViewMore.subscribe(res =>{
        this.closeViewMore();
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


    this.pageChange(1);
  }
  addNewItem(){
    this.riskLibraryObject.type = 'Add';
    this.riskLibraryObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }
  pageChange(newPage: number = null) {
    if (newPage) RiskLibraryMasterStore.setCurrentPage(newPage);
    this._riskLibraryService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.riskLibraryObject.type = null;
    $(this.viewmorepopup.nativeElement).modal('hide');
    this.riskLibraryObject.type = null;
  }

  activate(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'Activate Risk Library?';
    this.popupObject.subtitle = 'common_activate_subtitle';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for deactivate
  deactivate(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Risk Library?';
    this.popupObject.subtitle = 'common_deactivate_subtitle';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  
  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteRiskLibrary(status)
      break;
      
      case 'Activate': this.activateRiskLibrary(status)
        break;
  
      case 'Deactivate': this.deactivateRiskLibrary(status)
        break;
  
    }
  
  }
  

  // delete function call
  deleteRiskLibrary(status: boolean) {
    if (status && this.popupObject.id) {
      this._riskLibraryService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      },(error=>{
        if(error.status == 405 && RiskLibraryMasterStore.getRiskLibraryById(this.popupObject.id).status_id == AppStore.activeStatusId){
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

  getRiskLibraryDetails(details){
    console.log(details);
    this.riskLibraryPopupObject.type='show'
    this.value=details;
    this.openPopup()
  }

  openPopup(){
    setTimeout(() => {
      $(this.viewmorepopup.nativeElement).modal('show');
    }, 50);
  }

  closeViewMore(){
    $(this.viewmorepopup.nativeElement).modal('hide');
    this._renderer2.setStyle(this.viewmorepopup.nativeElement, 'display', 'none');
    this.riskLibraryPopupObject.type = null;
  }

 // get perticuller risk library
  getRiskLibrary(id: number) {
    this._riskLibraryService.getItem(id).subscribe(res=>{

          this.loadPopup();
          this._utilityService.detectChanges(this._cdr);
        
      })
   
  }
loadPopup()
{
  
  
  const riskLibrarySingle: RiskLibrary = RiskLibraryMasterStore.individualRiskLibraryId;
        
        this.riskLibraryObject.values = {
          id: riskLibrarySingle.id,
          title: riskLibrarySingle.title,
          description: riskLibrarySingle.description,
          // impact:riskLibrarySingle.impact,
          // category_title:riskLibrarySingle.risk_category?.id,
          // risk_source:riskLibrarySingle.risk_sources ? this.getEdit(riskLibrarySingle.risk_sources) :[],
          // risk_type:riskLibrarySingle.risk_types?this.getEdit(riskLibrarySingle.risk_types) :[],
          // risk_areas:riskLibrarySingle.risk_areas?this.getEdit(riskLibrarySingle.risk_areas) :[]
        }
        this.riskLibraryObject.type = 'Edit';
        this.openFormModal();
}

getEdit(data){
  var returnData = []
    
    data.forEach(element => {
      returnData.push(element.id)
    });
    return returnData;
}

  // for delete
delete(id: number) {
  // event.stopPropagation();
  this.popupObject.type = '';
  this.popupObject.id = id;
  this.popupObject.title = 'Delete Risk Library?';
  this.popupObject.subtitle = 'common_delete_subtitle';

  $(this.confirmationPopUp.nativeElement).modal('show');

}
  
  // calling activcate function
  
  activateRiskLibrary(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._riskLibraryService.activate(this.popupObject.id).subscribe(resp => {
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
  
  deactivateRiskLibrary(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._riskLibraryService.deactivate(this.popupObject.id).subscribe(resp => {
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
  
    sortTitle(type: string) {
      //RiskLibraryMasterStore.setCurrentPage(1);
      this._riskLibraryService.sortRiskLibraryList(type, null);
      this.pageChange();
    }
  
    ngOnDestroy() {
      // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      this.riskLibrarySubscriptionEvent.unsubscribe();
      this.popupControlRiskLibraryEventSubscription.unsubscribe();
      RiskLibraryMasterStore.searchText = '';
      RiskLibraryMasterStore.currentPage = 1 ;
      this.idleTimeoutSubscription.unsubscribe();
      this.networkFailureSubscription.unsubscribe();
    }
  

}
