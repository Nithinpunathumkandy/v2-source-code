import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { Tag } from 'src/app/core/models/masters/knowledge-hub/tag';
import {TagMasterStore} from 'src/app/stores/masters/knowledge-hub/tag-store';
import { TagService } from 'src/app/core/services/masters/knowledge-hub/tag/tag.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AppStore } from "src/app/stores/app.store";
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { ImportItemStore } from "src/app/stores/general/import-item.store";

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit,OnDestroy {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  
  TagMasterStore = TagMasterStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_tag_message';

  tagObject = {
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


  tagSubscriptionEvent: any = null;
  popupControlDocumentTagEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor( private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _tagService: TagService,
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_tag'});

    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'TAG_LIST', submenuItem: { type: 'search' }},
        {activityName: 'CREATE_TAG', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_TAG_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_TAG', submenuItem: {type: 'export_to_excel'}},
        {activityName: 'SHARE_TAG', submenuItem: {type: 'share'}},
        {activityName: 'IMPORT_TAG', submenuItem: {type: 'import'}},
        {activityName: null, submenuItem: {type: 'close', path: 'knowledge-hub'}},
      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_TAG')){
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
            this._tagService.generateTemplate();
            break;
          case "export_to_excel":
            this._tagService.exportToExcel();
            break;
          case "search":
            TagMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "share":
            ShareItemStore.setTitle('share_tag_title');
            ShareItemStore.formErrors = {};
            break;
          case "import":
            ImportItemStore.setTitle('import_tag');
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
        this._tagService.shareData(ShareItemStore.shareData).subscribe(res=>{
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
        this._tagService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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
    this.popupControlDocumentTagEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    // for closing the modal
    this.tagSubscriptionEvent = this._eventEmitterService.documentTagControl.subscribe(res => {
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
    this.tagObject.type = 'Add';
    this.tagObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }
  pageChange(newPage: number = null) {
    if (newPage) TagMasterStore.setCurrentPage(newPage);
    this._tagService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
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
    this.tagObject.type = null;
  }

  // for edit function

  getTag(id: number) {
    const tag: Tag = TagMasterStore.getTagById(id);
    //set form value
    this.tagObject.values = {
      id: tag.id,
      title: tag.title,
      description: tag.description
    }
    this.tagObject.type = 'Edit';
    this.openFormModal();
  }

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteTag(status)
        break;

      case 'Activate': this.activateTag(status)
        break;

      case 'Deactivate': this.deactivateTag(status)
        break;

    }

  }


  // delete function call
  deleteTag(status: boolean) {
    if (status && this.popupObject.id) {
      this._tagService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      },(error=>{
        if(error.status == 405 && TagMasterStore.getTagById(this.popupObject.id).status_id == AppStore.activeStatusId){
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

  activateTag(status: boolean) {
    if (status && this.popupObject.id) {

      this._tagService.activate(this.popupObject.id).subscribe(resp => {
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

  deactivateTag(status: boolean) {
    if (status && this.popupObject.id) {

      this._tagService.deactivate(this.popupObject.id).subscribe(resp => {
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
    this.popupObject.title = 'Activate Tag?';
    this.popupObject.subtitle = 'common_activate_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for deactivate
  deactivate(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Tag?';
    this.popupObject.subtitle = 'common_deactivate_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for delete
  delete(id: number) {
    // event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Tag?';
    this.popupObject.subtitle = 'common_delete_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  // for sorting
  sortTitle(type: string) {
    // TagMasterStore.setCurrentPage(1);
    this._tagService.sortTaglList(type, SubMenuItemStore.searchText);
    this.pageChange();
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.tagSubscriptionEvent.unsubscribe();
    this.popupControlDocumentTagEventSubscription.unsubscribe();
    TagMasterStore.searchText = '';
    TagMasterStore.currentPage = 1 ;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }


}
