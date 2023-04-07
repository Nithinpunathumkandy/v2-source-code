import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, OnDestroy, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { Industry ,IndustryPaginationResponse } from 'src/app/core/models/masters/general/industry';
import {IndustryMasterStore} from 'src/app/stores/masters/general/industry-store';
import { IndustryService } from 'src/app/core/services/masters/general/industry/industry.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-industry',
  templateUrl: './industry.component.html',
  styleUrls: ['./industry.component.scss']
})
export class IndustryComponent implements OnInit , OnDestroy {
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;


  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  IndustryMasterStore = IndustryMasterStore;
  AuthStore = AuthStore;
  AppStore = AppStore;

  industryObject = {
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

  industrySubscriptionEvent: any = null;
  popupControlIndustryEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;


  constructor(private _industryService: IndustryService,
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2
    ) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_industry'});

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'INDUSTRY_LIST', submenuItem: { type: 'search' }},
        {activityName: 'CREATE_INDUSTRY', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_INDUSTRY_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_INDUSTRY', submenuItem: {type: 'export_to_excel'}},
        {activityName: 'IMPORT_INDUSTRY', submenuItem: {type: 'import'}},
        {activityName: null, submenuItem: {type: 'close', path: 'masters'}},
      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_INDUSTRY')){
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
            this._industryService.generateTemplate();
            break;
          case "export_to_excel":
            this._industryService.exportToExcel();
            break;
          case "search":
            IndustryMasterStore.searchText =SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "import":
            ImportItemStore.setTitle('import_industry');
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
        this._industryService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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
    this.popupControlIndustryEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    // for closing the modal
    this.industrySubscriptionEvent = this._eventEmitterService.industryControl.subscribe(res => {
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


    IndustryMasterStore.setOrderBy('asc');
    this.pageChange(1);
    

  }

  addNewItem(){
    this.industryObject.type = 'Add';
    this.industryObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }
  pageChange(newPage: number = null) {
    if (newPage) IndustryMasterStore.setCurrentPage(newPage);
    this._industryService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }
  // for opening modal
  openFormModal() {

    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 100);
  }
  // for close modal
  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.industryObject.type = null;
  }

  // for edit function

  getIndustry(id: number) {
    const industry: Industry = IndustryMasterStore.getIndustryById(id);
    //set form value
    this.industryObject.values = {
      id: industry.id,
      title: industry.title,
      industry_category_id: industry.industry_category_id
    }
    this.industryObject.type = 'Edit';
    this.openFormModal();
  }

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteIndustry(status)
        break;

      case 'Activate': this.activateIndustry(status)
        break;

      case 'Deactivate': this.deactivateIndustry(status)
        break;

    }

  }


  // delete function call
  deleteIndustry(status: boolean) {
    if (status && this.popupObject.id) {
      this._industryService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      },(error=>{
        if(error.status == 405 && IndustryMasterStore.getIndustryById(this.popupObject.id).status_id == AppStore.activeStatusId){
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

  activateIndustry(status: boolean) {
    if (status && this.popupObject.id) {

      this._industryService.activate(this.popupObject.id).subscribe(resp => {
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

  deactivateIndustry(status: boolean) {
    if (status && this.popupObject.id) {

      this._industryService.deactivate(this.popupObject.id).subscribe(resp => {
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
    this.popupObject.title = 'Activate Industry?';
    this.popupObject.subtitle = 'are_you_sure_activate';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for deactivate
  deactivate(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Industry?';
    this.popupObject.subtitle = 'are_you_sure_deactivate';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for delete
  delete(id: number) {
    // event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Industry?';
    this.popupObject.subtitle = 'are_you_sure_delete';

    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  // for sorting
  sortTitle(type: string) {
    // IndustryMasterStore.setCurrentPage(1);
    this._industryService.sortIndustrylList(type, null);
    this.pageChange();
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.industrySubscriptionEvent.unsubscribe();
    this.popupControlIndustryEventSubscription.unsubscribe();
    IndustryMasterStore.searchText = '';
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }


}




