import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, ChangeDetectionStrategy, OnDestroy, Renderer2 } from '@angular/core';
import { MsTypeVersionService } from 'src/app/core/services/masters/organization/ms-type-version/ms-type-version.service';
import { MsTypeService } from 'src/app/core/services/masters/organization/ms-type/ms-type.service';
import { IReactionDisposer, autorun } from 'mobx';
import { MsTypeVersionMasterStore } from 'src/app/stores/masters/organization/ms-type-version-master.store';
import { MsTypeMasterStore } from 'src/app/stores/masters/organization/ms-type-master.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from "src/app/stores/general/share-item.store";
import { ImportItemStore } from 'src/app/stores/general/import-item.store';

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-ms-type-version-master',
  templateUrl: './ms-type-version-master.component.html',
  styleUrls: ['./ms-type-version-master.component.scss']
})
export class MsTypeVersionMasterComponent implements OnInit, OnDestroy {

  @ViewChild('formModal') formModal: ElementRef;
  @ViewChild('titleInput') titleInput: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;
  
  reactionDisposer: IReactionDisposer;
  MsTypeVersionMasterStore = MsTypeVersionMasterStore;
  MsTypeMasterStore = MsTypeMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_ms_type_version_message';

  msTypeVersionObject = {
    component: 'Master',
    type: null,
    values: null
  }

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  msTypeVersionSubscriptionEvent: any = null;
  popupControlOrganizationMsTypeVersionEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor(
    private _msTypeVersionService: MsTypeVersionService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _msTypeService: MsTypeService, private _eventEmitterService: EventEmitterService
  ) { }

  ngOnInit() {

    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_ms_type_version'});
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'MS_TYPE_VERSION_LIST', submenuItem: { type: 'search' }},
        {activityName: 'CREATE_MS_TYPE_VERSION', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_MS_TYPE_VERSION_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_MS_TYPE_VERSION', submenuItem: {type: 'export_to_excel'}},
        // {activityName: 'SHARE_MS_TYPE_VERSION', submenuItem: {type: 'share'}},
        {activityName: 'IMPORT_MS_TYPE_VERSION', submenuItem: {type: 'import'}},
        {activityName: null, submenuItem: {type: 'close', path: 'organization'}},
      ]
      if(!AuthStore.getActivityPermission(1100,'CREATE_MS_TYPE_VERSION')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
   
      if (SubMenuItemStore.clikedSubMenuItem) {

        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.addNewItem();
            }, 500);
            break;
          case "template":
            this._msTypeVersionService.generateTemplate();
            break;
          case "export_to_excel":
            this._msTypeVersionService.exportToExcel();
            break;
          case "search":
            MsTypeVersionMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
              // this.searchMsTypeVersion(SubMenuItemStore.searchText);
            break;
          case "share":
            ShareItemStore.setTitle('share_ms_type_version_title');
            ShareItemStore.formErrors = {};
            break;
          case "import":
            ImportItemStore.setTitle('import_ms_type_version');
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
        this._msTypeVersionService.shareData(ShareItemStore.shareData).subscribe(res=>{
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
        this._msTypeVersionService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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

    this.msTypeVersionSubscriptionEvent = this._eventEmitterService.msTypeVersion.subscribe(res=>{
      this.closeFormModal();
    })

    // this.form = this._formBuilder.group({
    //   id: [''],
    //   ms_type_id:[''],
    //   title: ['', [Validators.required, Validators.maxLength(255)]],
    //   description: ['', [Validators.maxLength(255)]]
    // });


     // for deleting/activating/deactivating using delete modal
     this.popupControlOrganizationMsTypeVersionEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    this._msTypeService.getItems().subscribe();
   
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
    this.msTypeVersionObject.type = 'Add';
    this.msTypeVersionObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }
  pageChange(newPage: number = null) {
    if (newPage) MsTypeVersionMasterStore.setCurrentPage(newPage);
    this._msTypeVersionService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  
  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 100);
  }

  closeFormModal() {
    this.msTypeVersionObject.type = null;
    this.msTypeVersionObject.values = null;
    $(this.formModal.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }

  /**
   * Get particular competency group item
   * @param id  id of ms type version
   */

  getMsTypeVersion(id: number) {
    const MsTypeVersion = MsTypeVersionMasterStore.getMsTypeVersionById(id);
    this.msTypeVersionObject.type = 'Edit';
    this.msTypeVersionObject.values = {
      id: MsTypeVersion.id,
      ms_type_id: MsTypeVersion.ms_type_id,
      title: MsTypeVersion.title
    }
    // //set form value
    // this.form.reset();
    // this.form.markAsPristine();
    // this.form.setValue({
    //   id: MsTypeVersion.id,
    //   //TODO
    //   ms_type_id:1,
    //   title: MsTypeVersion.title,
    //   description: ''
    // });
    this.openFormModal();
    // setTimeout(() => this.titleInput.nativeElement.focus(), 150);
  }

  // cancel() {
  //   // FormErrorStore.setErrors(null);
  //   this.closeFormModal();
  //   this.form.reset();
  //   this.form.markAsPristine();
  // }
  
  newMsTypeVersion() {

    alert(1)
  }

 

  /**
   * Save & update ms type version
   * @param close  close modal if parameter is true
   */

  // save(close: boolean = false) {
  //   this.formErrors = null;
  //   if (this.form.valid) {
  //     let save;
  //     AppStore.enableLoading();
  //     if (this.form.value.id) {
  //       save = this._msTypeVersionService.updateItem(this.form.value.id, this.form.value);
  //     } else {
  //       save = this._msTypeVersionService.saveItem(this.form.value);
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
      case '': this.deleteMsTypeVersion(status)
        break;

      case 'Activate': this.activateMsTypeVersion(status)
        break;

      case 'Deactivate': this.deactivateMsTypeVersion(status)
        break;

    }

  }

  
  // delete function call
  deleteMsTypeVersion(status: boolean) {
    if (status && this.popupObject.id) {
      this._msTypeVersionService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      },(error=>{
        if(error.status == 405 && MsTypeVersionMasterStore.getMsTypeVersionById(this.popupObject.id).status_id == AppStore.activeStatusId){
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
  
    activateMsTypeVersion(status: boolean) {
      if (status && this.popupObject.id) {
  
        this._msTypeVersionService.activate(this.popupObject.id).subscribe(resp => {
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
  
    deactivateMsTypeVersion(status: boolean) {
      if (status && this.popupObject.id) {
  
        this._msTypeVersionService.deactivate(this.popupObject.id).subscribe(resp => {
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
      this.popupObject.title = 'Activate Issue MsType Version?';
      this.popupObject.subtitle = 'are_you_sure_activate';
  
      $(this.confirmationPopUp.nativeElement).modal('show');
    }
    // for deactivate
    deactivate(id: number) {
      event.stopPropagation();
      this.popupObject.type = 'Deactivate';
      this.popupObject.id = id;
      this.popupObject.title = 'Deactivate Issue MsType Version?';
      this.popupObject.subtitle = 'are_you_sure_deactivate';
  
      $(this.confirmationPopUp.nativeElement).modal('show');
    }
    // for delete
    delete(id: number) {
      event.stopPropagation();
      this.popupObject.type = '';
      this.popupObject.id = id;
      this.popupObject.title = 'Delete Issue MsType Version?';
      this.popupObject.subtitle = 'are_you_sure_delete';
  
      $(this.confirmationPopUp.nativeElement).modal('show');
  
    }
    // for serach
    searchMsTypeVersion(term: string){
      this._msTypeVersionService.getItems(false, `&q=${term}`).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });

    }

    // for sorting
    sortTitle(type: string) {
      // MsTypeMasterStore.setCurrentPage(1);
      this._msTypeVersionService.sortMsTypeVersionList(type, null);
      this.pageChange();
    }

    ngOnDestroy() {
      // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      this.msTypeVersionSubscriptionEvent.unsubscribe();
      this.popupControlOrganizationMsTypeVersionEventSubscription.unsubscribe();
      MsTypeVersionMasterStore.searchText = '';
      MsTypeVersionMasterStore.currentPage = 1 ;
      this.idleTimeoutSubscription.unsubscribe();
      this.networkFailureSubscription.unsubscribe();
    }
  

}
