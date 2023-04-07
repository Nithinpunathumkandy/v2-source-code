import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy, Renderer2 } from '@angular/core';
import{FaqMasterStore} from 'src/app/stores/masters/general/faq-store';
import { FaqSingle } from 'src/app/core/models/masters/general/faq';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { FaqService } from 'src/app/core/services/masters/general/faq/faq.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';

declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit,OnDestroy {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  reactionDisposer: IReactionDisposer;
  FaqMasterStore = FaqMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;

  faqObject = {
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

  faqSubscriptionEvent: any = null;
  popupControlFaqEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor(  private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _faqService: FaqService,
    private _renderer2: Renderer2){}


    ngOnInit(): void {
      NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_faq'});
      this.reactionDisposer = autorun(() => {
  
        var subMenuItems = [
          {activityName: 'FAQ_LIST', submenuItem: { type: 'search' }},
          {activityName: 'CREATE_FAQ', submenuItem: {type: 'new_modal'}},
          {activityName: 'GENERATE_FAQ_TEMPLATE', submenuItem: {type: 'template'}},
          {activityName: 'EXPORT_FAQ', submenuItem: {type: 'export_to_excel'}},
          {activityName: 'IMPORT_FAQ', submenuItem: {type: 'import'}},
          {activityName: null, submenuItem: {type: 'close', path: 'masters'}},
        ]
        if(!AuthStore.getActivityPermission(100,'CREATE_FAQ')){
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
                case "export_to_excel":
                  this._faqService.exportToExcel();
                  break;
                case "template":
                    this._faqService.generateTemplate();
                    break;
                case "search":
                    FaqMasterStore.searchText = SubMenuItemStore.searchText;
                    this.pageChange(1);
                    break;
                case "import":
                    ImportItemStore.setTitle('import_faq');
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
            if(ImportItemStore.importClicked){
              ImportItemStore.importClicked = false;
              this._faqService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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
  
           //for deleting/activating/deactivating using delete modal
        this.popupControlFaqEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
          this.modalControl(item);
        })
  
        this.faqSubscriptionEvent = this._eventEmitterService.faq.subscribe(res => {
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
    
       this.pageChange(1);
    }

    addNewItem(){
      this.faqObject.type = 'Add';
      this.faqObject.values = null; // for clearing the value
      this._utilityService.detectChanges(this._cdr);
      this.openFormModal();
    }
    pageChange(newPage: number = null) {
      if (newPage) FaqMasterStore.setCurrentPage(newPage);
      this._faqService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
    }
  

    openFormModal() {
      setTimeout(() => {
        $(this.formModal.nativeElement).modal('show');
      }, 50);
    }
  
    closeFormModal() {
      $(this.formModal.nativeElement).modal('hide');
      this.faqObject.type = null;
    }

    activate(id: number) {
      event.stopPropagation();
      this.popupObject.type = 'Activate';
      this.popupObject.id = id;
      this.popupObject.title = 'Activate Faq?';
      this.popupObject.subtitle = 'are_you_sure_activate';
    
      $(this.confirmationPopUp.nativeElement).modal('show');
    }
    // for deactivate
    deactivate(id: number) {
      event.stopPropagation();
      this.popupObject.type = 'Deactivate';
      this.popupObject.id = id;
      this.popupObject.title = 'Deactivate Faq?';
      this.popupObject.subtitle = 'are_you_sure_deactivate';
    
      $(this.confirmationPopUp.nativeElement).modal('show');
    }
    
    // modal control event
    modalControl(status: boolean) {
      switch (this.popupObject.type) {
        case '': this.deleteFaq(status)
        break;
        
        case 'Activate': this.activateFaq(status)
          break;
    
        case 'Deactivate': this.deactivateFaq(status)
          break;
    
      }
    
    }

    // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
    // this.popupObject.title = '';
    // this.popupObject.subtitle = '';
    // this.popupObject.type = '';
  
  }

  // delete function call
  deleteFaq(status: boolean) {
    if (status && this.popupObject.id) {
      this._faqService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      },(error=>{
        if(error.status == 405 && FaqMasterStore.getFaqById(this.popupObject.id).status_id == AppStore.activeStatusId){
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
 

  // get perticuller risk control plan
  getFaq(id: number) {
    this._faqService.getItem(id).subscribe(res=>{

        this.loadPopup();
        this._utilityService.detectChanges(this._cdr);
      })
      
  
  }


  loadPopup()
  {
   
    const faqSingle: FaqSingle = FaqMasterStore.individualFaqId;
      
    this.faqObject.values = {
      id: faqSingle.id,
      module_group:faqSingle.module_group,
      languages: faqSingle.languages,
            
    }
   
    this.faqObject.type = 'Edit';
    this.openFormModal();
  }

   // for delete
delete(id: number) {
  // event.stopPropagation();
  this.popupObject.type = '';
  this.popupObject.id = id;
  this.popupObject.title = 'Delete Faq ?';
  this.popupObject.subtitle = 'are_you_sure_delete';

  $(this.confirmationPopUp.nativeElement).modal('show');

}
  
  // calling activcate function
  
  activateFaq(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._faqService.activate(this.popupObject.id).subscribe(resp => {
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
  
  deactivateFaq(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._faqService.deactivate(this.popupObject.id).subscribe(resp => {
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
     //FaqMasterStore.setCurrentPage(1);
      this._faqService.sortFaqList(type, null);
      this.pageChange();
    }
  
    ngOnDestroy() {
      // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      this.faqSubscriptionEvent.unsubscribe();
      this.popupControlFaqEventSubscription.unsubscribe();
      FaqMasterStore.searchText = '';
      this.idleTimeoutSubscription.unsubscribe();
      this.networkFailureSubscription.unsubscribe();
    }

}
