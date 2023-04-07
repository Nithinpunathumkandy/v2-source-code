import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, ChangeDetectionStrategy, OnDestroy, Renderer2 } from '@angular/core';
import { StakeholderService } from 'src/app/core/services/masters/organization/stakeholder/stakeholder.service';
import { IReactionDisposer, autorun } from 'mobx';
import { StakeholdersStore } from 'src/app/stores/organization/stakeholders/stakeholders.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { Stakeholder } from 'src/app/core/models/organization/stakeholder/stakeholder';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-stakeholder-master',
  templateUrl: './stakeholder-master.component.html',
  styleUrls: ['./stakeholder-master.component.scss']
})
export class StakeholderMasterComponent implements OnInit {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  reactionDisposer: IReactionDisposer;
  StakeholderMasterStore = StakeholdersStore;
  SubMenuItemStore = SubMenuItemStore;
  AppStore = AppStore;

  stakeHolderObject = {
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


  stakeHolderSubscriptionEvent: any = null;
  popupControlOrganizationstakeHolderEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

 
  constructor(
    private _stakeholderService: StakeholderService,
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2
  ) { }

  ngOnInit() {
    this.reactionDisposer = autorun(() => {
                                                            
     NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'stakeholder_new_button'});
   
      if (SubMenuItemStore.clikedSubMenuItem) {

        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.addNewItem();
            }, 1000);
            break;
          case "template":
            this._stakeholderService.generateTemplate();
            break;
          case "export_to_excel":
            this._stakeholderService.exportToExcel();
            break;
          case "search":
            this.StakeholderMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            // this.searchStakeHolder(SubMenuItemStore.searchText);
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
    this.popupControlOrganizationstakeHolderEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    // for closing the modal
    this.stakeHolderSubscriptionEvent = this._eventEmitterService.modalChange.subscribe(res => {
      this.closeFormModal();
    })


    SubMenuItemStore.setSubMenuItems([
      { type: 'search' },
      { type: 'new_modal' },
      { type: 'template' },
      { type: 'export_to_excel' },
      { type: 'close', path: 'organization' },
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

    this.pageChange(1);
  }
  addNewItem(){
    this.stakeHolderObject.type = 'Add';
    this.stakeHolderObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  pageChange(newPage: number = null) {
    if (newPage) this.StakeholderMasterStore.setCurrentPage(newPage);
    this._stakeholderService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }
  
  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.stakeHolderObject.type = null;
  }

  /**
   * Get particular competency group item
   * @param id  id of Stakeholder
   */

  getStakeholder(id: number) {
    const stakeholder: Stakeholder = this.StakeholderMasterStore.getStakeholderById(id);
    //set form value
    this.stakeHolderObject.values = {
      id: stakeholder.id,
      title: stakeholder.title,
      stakeholder_type_id: stakeholder.stakeholder_type_id
    }
    this.stakeHolderObject.type = 'Edit';
    this.openFormModal();
  }

   // modal control event
   modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteStakeholder(status)
        break;

      case 'Activate': this.activateStakeholder(status)
        break;

      case 'Deactivate': this.deactivateStakeholder(status)
        break;

    }

  }

  
  // delete function call
  deleteStakeholder(status: boolean) {
    if (status && this.popupObject.id) {
      this._stakeholderService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      },(error=>{
        if(error.status == 405 && this.StakeholderMasterStore.getStakeholderById(this.popupObject.id).status_id == AppStore.activeStatusId){
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

  activateStakeholder(status: boolean) {
    if (status && this.popupObject.id) {

      this._stakeholderService.activate(this.popupObject.id).subscribe(resp => {
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

  deactivateStakeholder(status: boolean) {
    if (status && this.popupObject.id) {

      this._stakeholderService.deactivate(this.popupObject.id).subscribe(resp => {
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
    this.popupObject.title = 'Activate Stakeholder?';
    this.popupObject.subtitle = 'are_you_sure_activate';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for deactivate
  deactivate(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Stakeholder?';
    this.popupObject.subtitle = 'are_you_sure_deactivate';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for delete
  delete(id: number) {
    // event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Stakeholder?';
    this.popupObject.subtitle = 'are_you_sure_delete';

    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  // Sub-Menu Search 
  searchStakeHolder(term: string) {
    this._stakeholderService.getItems(false, `&q=${term}`).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  // for sorting
  sortTitle(type: string) {
    // this.StakeholderMasterStore.setCurrentPage(1);
    this._stakeholderService.sortStakeholderList(type, null);
    this.pageChange();
  }


  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.stakeHolderSubscriptionEvent.unsubscribe();
    this.popupControlOrganizationstakeHolderEventSubscription.unsubscribe();
    this.StakeholderMasterStore.searchText = '';
    this.StakeholderMasterStore.currentPage = 1 ;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }

 
}
