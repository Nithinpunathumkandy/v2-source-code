import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, ChangeDetectionStrategy, OnDestroy, Renderer2 } from '@angular/core';
import { IssueCategoryService } from 'src/app/core/services/masters/organization/issue-category/issue-category.service';
import { IReactionDisposer, autorun } from 'mobx';
import { IssueCategoryMasterStore } from 'src/app/stores/masters/organization/issue-category-master.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IssueCategory } from 'src/app/core/models/masters/organization/issue-category';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from "src/app/stores/general/share-item.store";
import { ImportItemStore } from "src/app/stores/general/import-item.store";

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-issue-category-master',
  templateUrl: './issue-category-master.component.html',
  styleUrls: ['./issue-category-master.component.scss']
})
export class IssueCategoryMasterComponent implements OnInit, OnDestroy {
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;
  @ViewChild('successPopup') successPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  IssueCategoryMasterStore = IssueCategoryMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_issue_category_message';

  issueCategoryObject = {
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


  issueCategorySubscriptionEvent: any = null;
  popupControlOrganizationIssueCtaegoryEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor(
    private _issueCategoryService: IssueCategoryService,
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2
  ) { }

  ngOnInit() {

    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_issue_category'});
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'ISSUE_CATEGORY_LIST', submenuItem: { type: 'search' }},
        {activityName: 'CREATE_ISSUE_CATEGORY', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_ISSUE_CATEGORY_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_ISSUE_CATEGORY', submenuItem: {type: 'export_to_excel'}},
        // {activityName: 'SHARE_ISSUE_CATEGORY', submenuItem: {type: 'share'}},
        {activityName: 'IMPORT_ISSUE_CATEGORY', submenuItem: {type: 'import'}},
        {activityName: null, submenuItem: {type: 'close', path: 'organization'}},
      ]
      if(!AuthStore.getActivityPermission(1100,'CREATE_ISSUE_CATEGORY')){
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
            this._issueCategoryService.generateTemplate();
            break;
          case "export_to_excel":
            this._issueCategoryService.exportToExcel();
            break;
          case "search":
            IssueCategoryMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            // this.searchIssueCategory(SubMenuItemStore.searchText);
            break;
          case "share":
            ShareItemStore.setTitle('share_issue_category_title');
            ShareItemStore.formErrors = {};
            break;
          case "import":
            ImportItemStore.setTitle('import_issue_category');
            ImportItemStore.setImportFlag(true);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if(ShareItemStore.shareData){
        this._issueCategoryService.shareData(ShareItemStore.shareData).subscribe(res=>{
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
        this._issueCategoryService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
          ImportItemStore.setImportFlag(false);
          ImportItemStore.setTitle('');
          ImportItemStore.unsetFileDetails();
          $('.modal-backdrop').remove();
          document.body.classList.remove('modal-open');
          this._utilityService.detectChanges(this._cdr);    
          setTimeout(() => {
            $(this.successPopup.nativeElement).modal('show');       
          }, 200);
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

      if(NoDataItemStore.clikedNoDataItem){
        this.addNewItem();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    })

    // for deleting/activating/deactivating using delete modal
    this.popupControlOrganizationIssueCtaegoryEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    // for closing the modal
    this.issueCategorySubscriptionEvent = this._eventEmitterService.modalChange.subscribe(res => {
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
    this.issueCategoryObject.type = 'Add';
    this.issueCategoryObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }
  pageChange(newPage: number = null) {
    if (newPage) IssueCategoryMasterStore.setCurrentPage(newPage);
    this._issueCategoryService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }


  
  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.issueCategoryObject.type = null;
  }

  /**
   * Get particular competency group item
   * @param id  id of issue Category
   */

   
  getIssueCategory(id: number) {
    const issueCategory: IssueCategory = IssueCategoryMasterStore.getIssueById(id);
    //set form value
    this.issueCategoryObject.values = {
      id: issueCategory.id,
      title: issueCategory.title,
      color_code: issueCategory.color_code,
      label:issueCategory.label
    }
    this.issueCategoryObject.type = 'Edit';
    this.openFormModal();
  }

  
   // modal control event
   modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteIssueCategory(status)
        break;

      case 'Activate': this.activateIssueCategory(status)
        break;

      case 'Deactivate': this.deactivateIssueCategory(status)
        break;

    }

  }

 
  // delete function call
  deleteIssueCategory(status: boolean) {
    if (status && this.popupObject.id) {
      this._issueCategoryService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      },(error=>{
        if(error.status == 405 && IssueCategoryMasterStore.getIssueById(this.popupObject.id).status_id == AppStore.activeStatusId){
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
  
    activateIssueCategory(status: boolean) {
      if (status && this.popupObject.id) {
  
        this._issueCategoryService.activate(this.popupObject.id).subscribe(resp => {
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
  
    deactivateIssueCategory(status: boolean) {
      if (status && this.popupObject.id) {
  
        this._issueCategoryService.deactivate(this.popupObject.id).subscribe(resp => {
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
      this.popupObject.title = 'Activate Issue Category?';
      this.popupObject.subtitle = 'are_you_sure_activate';
  
      $(this.confirmationPopUp.nativeElement).modal('show');
    }
    // for deactivate
    deactivate(id: number) {
      event.stopPropagation();
      this.popupObject.type = 'Deactivate';
      this.popupObject.id = id;
      this.popupObject.title = 'Deactivate Issue Category?';
      this.popupObject.subtitle = 'are_you_sure_deactivate';
  
      $(this.confirmationPopUp.nativeElement).modal('show');
    }
    // for delete
    delete(id: number) {
      event.stopPropagation();
      this.popupObject.type = '';
      this.popupObject.id = id;
      this.popupObject.title = 'Delete Issue Category?';
      this.popupObject.subtitle = 'are_you_sure_delete';
  
      $(this.confirmationPopUp.nativeElement).modal('show');
  
    }

    // Sub-Menu Search 
    searchIssueCategory(term: string) {
    this._issueCategoryService.getItems(false, `&q=${term}`).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  // for sorting
  sortTitle(type: string) {
    // IssueCategoryMasterStore.setCurrentPage(1);
    this._issueCategoryService.sortIssueCategoryList(type, null);
    this.pageChange();
  }

  

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.issueCategorySubscriptionEvent.unsubscribe();
    this.popupControlOrganizationIssueCtaegoryEventSubscription.unsubscribe();
    IssueCategoryMasterStore.searchText = '';
    IssueCategoryMasterStore.currentPage = 1 ;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }

}
