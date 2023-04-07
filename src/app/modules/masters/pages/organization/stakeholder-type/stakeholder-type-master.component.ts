import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { StakeholderTypeService } from 'src/app/core/services/masters/organization/stakeholder-type/stakeholder-type.service';
import { IReactionDisposer, autorun } from 'mobx';
import { StakeholderTypeMasterStore } from 'src/app/stores/masters/organization/stakeholder-type-master.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from "src/app/stores/general/share-item.store";
import { ImportItemStore } from 'src/app/stores/general/import-item.store';

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-stakeholder-type-master',
  templateUrl: './stakeholder-type-master.component.html',
  styleUrls: ['./stakeholder-type-master.component.scss']
})
export class StakeholderTypeMasterComponent implements OnInit , OnDestroy{
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  StakeholderTypeMasterStore = StakeholderTypeMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_stakeholder_type_message';

  popupObject = {
    type: 'Activate',
    title: '',
    id: null,
    subtitle: ''
  };

  popupControlOrganizationStakeholderTypeEventSubscription: any;

  constructor(
    private _stakeholderTypeService: StakeholderTypeService,
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'STAKEHOLDER_TYPE_LIST', submenuItem: { type: 'search' }},
        // {activityName: 'GENERATE_STAKEHOLDER_TYPE_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_STAKEHOLDER_TYPE', submenuItem: {type: 'export_to_excel'}},
        // {activityName: 'SHARE_STAKEHOLDER_TYPE', submenuItem: {type: 'share'}},
        // {activityName: 'IMPORT_STAKEHOLDER_TYPE', submenuItem: {type: 'import'}},
        {activityName: null, submenuItem: {type: 'close', path: 'organization'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
                                                             
     NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
   
      if (SubMenuItemStore.clikedSubMenuItem) {

        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "template":
            this._stakeholderTypeService.generateTemplate();
            break;
          case "export_to_excel":
            this._stakeholderTypeService.exportToExcel();
            break;
          case "search":
            StakeholderTypeMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            // this.searchStakeHolderType(SubMenuItemStore.searchText);
              break;
          case "share":
            ShareItemStore.setTitle('share_stakeholder_type_title');
            ShareItemStore.formErrors = {};
            break;
          case "import":
            ImportItemStore.setTitle('import_stakeholder_type');
            ImportItemStore.setImportFlag(true);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if(NoDataItemStore.clikedNoDataItem){
       
        NoDataItemStore.unSetClickedNoDataItem();
      }
      if(ShareItemStore.shareData){
        this._stakeholderTypeService.shareData(ShareItemStore.shareData).subscribe(res=>{
            ShareItemStore.unsetShareData();
            ShareItemStore.setTitle('');
            ShareItemStore.unsetData();
            $('.modal-backdrop').remove();
            document.body.classList.remove('modal-open');
            setTimeout(() => {
              $(this.mailConfirmationPopup.nativeElement).modal('show');              
            }, 200);
        },(error)=>{
          if (error.status == 422){
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
        this._stakeholderTypeService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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

    // for activating/deactivating using delete modal
    this.popupControlOrganizationStakeholderTypeEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) StakeholderTypeMasterStore.setCurrentPage(newPage);
    this._stakeholderTypeService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }
  
  // Sub-Menu Search 
  searchStakeHolderType(term: string) {
    this._stakeholderTypeService.getItems(false, `&q=${term}`).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

   // modal control event
   modalControl(status:boolean) {
    switch (this.popupObject.type) {
      case 'Activate':  this.activateStakeholderType(status)
        break;

      case 'Deactivate': this.deactivateStakeholderType(status)
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


  // calling activcate function

  activateStakeholderType(status:boolean) {
    if (status && this.popupObject.id) {

      this._stakeholderTypeService.activate(this.popupObject.id).subscribe(resp => {
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

  deactivateStakeholderType(status:boolean) {
    if (status && this.popupObject.id) {

      this._stakeholderTypeService.deactivate(this.popupObject.id).subscribe(resp => {
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
  activate(id:number) {
    event.stopPropagation();
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'Activate Stakeholder Type?';
    this.popupObject.subtitle = 'are_you_sure_activate';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for deactivate
  deactivate(id:number) {
    event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Stakeholder Type?';
    this.popupObject.subtitle = 'are_you_sure_deactivate';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }


  // for sorting
  sortTitle(type: string) {
    // StakeholderTypeMasterStore.setCurrentPage(1);
    this._stakeholderTypeService.sortStakeholderTypeList(type, null);
    this.pageChange();
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.popupControlOrganizationStakeholderTypeEventSubscription.unsubscribe();
    StakeholderTypeMasterStore.searchText = '';
    StakeholderTypeMasterStore.currentPage = 1 ;
  }

}
