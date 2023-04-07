import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import {Label,LabelPaginationResponse} from 'src/app/core/models/masters/general/label';
import{LabelMasterStore} from 'src/app/stores/masters/general/label-store';

import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { LabelService } from 'src/app/core/services/masters/general/label/label.service';
import { LanguageSettingsStore } from 'src/app/stores/settings/language-settings.store';
import { LanguageService } from 'src/app/core/services/settings/languages/language.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-general-master',
  templateUrl: './general-master.component.html',
  styleUrls: ['./general-master.component.scss']
})
export class GeneralMasterComponent implements OnInit,  OnDestroy {
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('titleInput') titleInput: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  LabelMasterStore = LabelMasterStore;
  LanguageSettingsStore = LanguageSettingsStore;

  labelObject = {
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


  labelSubscriptionEvent: any = null;
  popupControlLabelEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor(private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _labelService: LabelService,
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef, private _languageService: LanguageService) { }

  ngOnInit(): void {


    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_label'});
    
     // This will run whenever the store observable or computed which are used in this function changes.
     this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {

        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.addNewItem();
            }, 1000);
            break;
          case "template":
           this._labelService.generateTemplate();
            break;
          case "export_to_excel":
            this._labelService.exportToExcel();
            break;
          case "search":
           this.searchLabels(SubMenuItemStore.searchText);
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
     this.popupControlLabelEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

     // for closing the modal
     this.labelSubscriptionEvent = this._eventEmitterService.labelControl.subscribe(res => {
      this.closeFormModal();
    })



    SubMenuItemStore.setSubMenuItems([
      { type: 'search' },
      { type: 'new_modal' },
      { type: 'template' },
      { type: 'export_to_excel' },
      { type: 'close', path: 'general' },
    ]);

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

    LabelMasterStore.setOrderBy('asc');
    this.pageChange(1);

  }

  addNewItem(){
    this.labelObject.type = 'Add';
    this.labelObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }
  pageChange(newPage: number = null) {
    if (newPage) LabelMasterStore.setCurrentPage(newPage);
    this._labelService.getItems().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  getLanguage(){
    if(!LanguageSettingsStore.languages){
      this._languageService.getItems().subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    }
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
    this.labelObject.type = null;
  }


  // for edit

  getLabel(id: number){
    const label: Label = LabelMasterStore.getLabelById(id);
    console.log(label);
    //set form value
    this.labelObject.values = {
      id: label.id,
      label_title: label.key,
      languages: label.languages
    }
    this.labelObject.type = 'Edit';
    this.openFormModal();

  }


   // modal control event
   modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteLabel(status)
        break;

      case 'Activate': this.activateLabel(status)
        break;

      case 'Deactivate': this.deactivateLabel(status)
        break;

    }

  }


  // delete function call
  deleteLabel(status: boolean) {
    if (status && this.popupObject.id) {
      this._labelService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      },(error=>{
        if(error.status == 405){
          let id = this.popupObject.id;
          this.closeConfirmationPopUp();
          this.clearPopupObject();
          setTimeout(() => {
            this.deactivate(id);
            this._utilityService.detectChanges(this._cdr);
          }, 500);
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

  activateLabel(status: boolean) {
    if (status && this.popupObject.id) {

      this._labelService.activate(this.popupObject.id).subscribe(resp => {
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

  deactivateLabel(status: boolean) {
    if (status && this.popupObject.id) {

      this._labelService.deactivate(this.popupObject.id).subscribe(resp => {
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
    this.popupObject.title = 'Activate Label?';
    this.popupObject.subtitle = 'common_activate_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for deactivate
  deactivate(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Label?';
    this.popupObject.subtitle = 'common_deactivate_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for delete
  delete(id: number) {
    // event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Label?';
    this.popupObject.subtitle = 'common_delete_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  // for sorting
  sortTitle(type: string) {
    LabelMasterStore.setCurrentPage(1);
    this._labelService.sortGenerallList(type, SubMenuItemStore.searchText);
  }



  // seraching
  searchLabels(term: string){
    this._labelService.getItems(false, `&q=${term}`).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
   });

  }

  ngOnDestroy(){

     // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
     if (this.reactionDisposer) this.reactionDisposer();
     SubMenuItemStore.makeEmpty();
     this.labelSubscriptionEvent.unsubscribe();
     this.popupControlLabelEventSubscription.unsubscribe();
     LabelMasterStore.searchTerm = '';
     this.idleTimeoutSubscription.unsubscribe();
     this.networkFailureSubscription.unsubscribe();
   }
 
}
