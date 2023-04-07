import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, ChangeDetectionStrategy, OnDestroy, Renderer2 } from '@angular/core';
import { MsTypeService } from 'src/app/core/services/masters/organization/ms-type/ms-type.service';
import { IReactionDisposer, autorun } from 'mobx';
import { MsTypeMasterStore } from 'src/app/stores/masters/organization/ms-type-master.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { MsType } from 'src/app/core/models/masters/organization/ms-type';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { Router } from "@angular/router";
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from "src/app/stores/general/share-item.store";
import { ImportItemStore } from 'src/app/stores/general/import-item.store';

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-ms-type-master',
  templateUrl: './ms-type-master.component.html',
  styleUrls: ['./ms-type-master.component.scss']
})
export class MsTypeMasterComponent implements OnInit,OnDestroy {

  @ViewChild('formModal') formModal: ElementRef;
  @ViewChild('titleInput') titleInput: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;
  
  reactionDisposer: IReactionDisposer;
  MsTypeMasterStore = MsTypeMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore= AppStore;
  mailConfirmationData = 'share_ms_type_message';

  msTypeObject = {
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

  msTypeSubscriptionEvent: any = null;
  popupControlOrganizationMsTypeEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor(
    private _msTypeService: MsTypeService, private _renderer2: Renderer2,
    private _utilityService: UtilityService, private _router: Router,
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    
     private _eventEmitterService: EventEmitterService
  ) { }

  ngOnInit() {

    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_ms_type'});
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'MS_TYPE_LIST', submenuItem: { type: 'search' }},
        {activityName: 'CREATE_MS_TYPE', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_MS_TYPE_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_MS_TYPE', submenuItem: {type: 'export_to_excel'}},
        // {activityName: 'SHARE_MS_TYPE', submenuItem: {type: 'share'}},
        {activityName: 'IMPORT_MS_TYPE', submenuItem: {type: 'import'}},
        {activityName: null, submenuItem: {type: 'close', path: 'organization'}},
      ]
      if(!AuthStore.getActivityPermission(1100,'CREATE_MS_TYPE')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
   
      if (SubMenuItemStore.clikedSubMenuItem) {

        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.addNewItem();
            }, 200);
            break;
          case "template":
            this._msTypeService.generateTemplate();
            break;
          case "export_to_excel":
            this._msTypeService.exportToExcel();
            break;
            case "search":
              MsTypeMasterStore.searchText = SubMenuItemStore.searchText;
              this.pageChange(1);
              // this.searchMsType(SubMenuItemStore.searchText);
              break;
            case "share":
              ShareItemStore.setTitle('share_ms_type_title');
              ShareItemStore.formErrors = {};
              break;
            case "import":
              ImportItemStore.setTitle('import_ms_type');
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
        this._msTypeService.shareData(ShareItemStore.shareData).subscribe(res=>{
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
        this._msTypeService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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
    
    this.msTypeSubscriptionEvent = this._eventEmitterService.msType.subscribe(res=>{
      this.closeFormModal();
    })
    // this.form = this._formBuilder.group({
    //   id: [''],
    //   code:['',[Validators.required, Validators.maxLength(45)]],
    //   title: ['', [Validators.required, Validators.maxLength(255)]],
    //   description: ['', [Validators.maxLength(255)]]
    // });

     // for deleting/activating/deactivating using delete modal
     this.popupControlOrganizationMsTypeEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
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
    this.msTypeObject.type = 'Add';
    this.msTypeObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  pageChange(newPage: number = null) {
    if (newPage) MsTypeMasterStore.setCurrentPage(newPage);
    this._msTypeService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  
  openFormModal() {
    // this._renderer2.setStyle(this.formModal.nativeElement,'z-index','999999');
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 100);
  }

  closeFormModal() {
    this.msTypeObject.type = null;
    this.msTypeObject.values = null;
    $(this.formModal.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
    //this._router.navigateByUrl('/masters/ms-type');
    // this._renderer2.setStyle(this.formModal.nativeElement,'z-index','99999');
    // this._renderer2.setStyle(this.formModal.nativeElement,'display','none');
    // this._renderer2.setAttribute(this.formModal.nativeElement,'aria-hidden','true');
    // this._renderer2.removeClass(this.formModal.nativeElement,'show');
  }

  /**
   * Get particular competency group item
   * @param id  id of ms type
   */


  getMsType(id: number) {
    const msType: MsType = MsTypeMasterStore.getTypeById(id);
    //set form value
    // this.form.reset();
    // this.form.markAsPristine();
    this.msTypeObject.values = {
      id: msType.id,
      title: msType.title,
      description: msType.description
    }
    this.msTypeObject.type = 'Edit';
    // this.form.setValue({
    //   id: msType.id,
    //   title: msType.title,
    //   description: ''
    // });
    this.openFormModal();
    // setTimeout(() => this.titleInput.nativeElement.focus(), 150);
  }

  cancel() {
    // FormErrorStore.setErrors(null);
    this.closeFormModal();
    // this.form.reset();
    // this.form.markAsPristine();
  }
  
  newMsType() {
    alert(1)
  }

  /**
   * Save & update ms type
   * @param close  close modal if parameter is true
   */

  // save(close: boolean = false) {
  //   this.formErrors = null;
  //   if (this.form.valid) {
  //     let save;
  //     AppStore.enableLoading();
  //     if (this.form.value.id) {
  //       save = this._msTypeService.updateItem(this.form.value.id, this.form.value);
  //     } else {
  //       save = this._msTypeService.saveItem(this.form.value);
  //     }
  //     save.subscribe((res: any) => {
  //       AppStore.disableLoading();
  //       if (close) this.closeFormModal();
  //     }, (err: HttpErrorResponse) => {
  //       if (err.status == 422) {
  //         this.formErrors = err.error.errors;
  //         AppStore.disableLoading();
  //       }
  //     });
  //   }
  // }

   // modal control event
   modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteMsType(status)
        break;

      case 'Activate': this.activateMsType(status)
        break;

      case 'Deactivate': this.deactivateMsType(status)
        break;

    }

  }
 // delete function call
 deleteMsType(status: boolean) {
  if (status && this.popupObject.id) {
    this._msTypeService.delete(this.popupObject.id).subscribe(resp => {
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      this.closeConfirmationPopUp();
      this.clearPopupObject();
    },(error=>{
      if(error.status == 405 && MsTypeMasterStore.getTypeById(this.popupObject.id).status_id == AppStore.activeStatusId){
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
  
    activateMsType(status: boolean) {
      if (status && this.popupObject.id) {
  
        this._msTypeService.activate(this.popupObject.id).subscribe(resp => {
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
  
    deactivateMsType(status: boolean) {
      if (status && this.popupObject.id) {
  
        this._msTypeService.deactivate(this.popupObject.id).subscribe(resp => {
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
      event.stopPropagation();
      this.popupObject.type = 'Activate';
      this.popupObject.id = id;
      this.popupObject.title = 'Activate Issue MsType?';
      this.popupObject.subtitle = 'are_you_sure_activate';
  
      $(this.confirmationPopUp.nativeElement).modal('show');
    }
    // for deactivate
    deactivate(id: number) {
      event.stopPropagation();
      this.popupObject.type = 'Deactivate';
      this.popupObject.id = id;
      this.popupObject.title = 'Deactivate Issue MsType?';
      this.popupObject.subtitle = 'are_you_sure_deactivate';
  
      $(this.confirmationPopUp.nativeElement).modal('show');
    }
    // for delete
    delete(id: number) {
      event.stopPropagation();
      this.popupObject.type = '';
      this.popupObject.id = id;
      this.popupObject.title = 'Delete Issue MsType?';
      this.popupObject.subtitle = 'are_you_sure_delete';
  
      $(this.confirmationPopUp.nativeElement).modal('show');
  
    }

    // for search
    searchMsType(term: string){
      this._msTypeService.getItems(false, `&q=${term}`).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }

    // for sorting
  sortTitle(type: string) {
    // MsTypeMasterStore.setCurrentPage(1);
    this._msTypeService.sortMsTypeList(type, null);
    this.pageChange();
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.msTypeSubscriptionEvent.unsubscribe();
    this.popupControlOrganizationMsTypeEventSubscription.unsubscribe();
    MsTypeMasterStore.searchText = '';
    MsTypeMasterStore.currentPage = 1 ;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }

}
