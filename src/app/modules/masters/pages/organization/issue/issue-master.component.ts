import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, ChangeDetectionStrategy, OnDestroy, Renderer2 } from '@angular/core';
import { IssueService } from 'src/app/core/services/masters/organization/issue/issue.service';
import { IReactionDisposer, autorun } from 'mobx';
import { IssueMasterStore } from 'src/app/stores/masters/organization/issue-master.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { Issue } from 'src/app/core/models/masters/organization/issue';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-issue-master',
  templateUrl: './issue-master.component.html',
  styleUrls: ['./issue-master.component.scss']
})
export class IssueMasterComponent implements OnInit {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  IssueMasterStore = IssueMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_issue_message';

  issueObject = {
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


  issueSubscriptionEvent: any = null;
  popupControlOrganizationTypeEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor(
    private _issueService: IssueService,
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2
  ) { }

  ngOnInit() {
    
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_issue_master'});
    this.reactionDisposer = autorun(() => {
      
      var subMenuItems = [
        {activityName: 'ISSUE_LIST', submenuItem: { type: 'search' }},
        {activityName: 'CREATE_ISSUE', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_ISSUE_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_ISSUE', submenuItem: {type: 'export_to_excel'}},
        // {activityName: 'SHARE_ISSUE', submenuItem: {type: 'share'}},
        {activityName: 'IMPORT_ISSUE', submenuItem: {type: 'import'}},
        {activityName: null, submenuItem: {type: 'close', path: 'organization'}},
      ]

      if(!AuthStore.getActivityPermission(1100,'CREATE_ISSUE')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
                                      
      
   
      if (SubMenuItemStore.clikedSubMenuItem) {

        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            console.log('new model in org');
            setTimeout(() => {
              this.addNewItem();
            }, 1000);
            break;
          case "template":
            this._issueService.generateTemplate();
            break;
          case "export_to_excel":
            this._issueService.exportToExcel();
            break;
          case "search":
            IssueMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            // this.searchIssue(SubMenuItemStore.searchText);
            break;
          case "share":
            ShareItemStore.setTitle('share_issues_title');
            ShareItemStore.formErrors = {};
            break;
          case "import":
            ImportItemStore.setTitle('import_issue');
            ImportItemStore.setImportFlag(true);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

    if(ShareItemStore.shareData){
      this._issueService.shareData(ShareItemStore.shareData).subscribe(res=>{
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
      this._issueService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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
    this.popupControlOrganizationTypeEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    // for closing the modal
    this.issueSubscriptionEvent = this._eventEmitterService.modalChange.subscribe(res => {
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
    this.issueObject.type = 'Add';
    this.issueObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  pageChange(newPage: number = null) {
    if (newPage) IssueMasterStore.setCurrentPage(newPage);
    this._issueService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }


  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.issueObject.type = null;
  }

  /**
   * Get particular competency group item
   * @param id  id of issue
   */

  getIssue(id: number) {
    const issue: Issue = IssueMasterStore.getIssueById(id);
    //set form value
    this.issueObject.values = {
      id: issue.id,
      title: issue.title,
      description: issue.description
    }
    this.issueObject.type = 'Edit';
    this.openFormModal();
  }
  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteIssue(status)
        break;

      case 'Activate': this.activateIssue(status)
        break;

      case 'Deactivate': this.deactivateIssue(status)
        break;

    }

  }


  // delete function call
  deleteIssue(status: boolean) {
    if (status && this.popupObject.id) {
      this._issueService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      },(error=>{
        if(error.status == 405 && IssueMasterStore.getIssueById(this.popupObject.id).status_id == AppStore.activeStatusId){
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

  activateIssue(status: boolean) {
    if (status && this.popupObject.id) {

      this._issueService.activate(this.popupObject.id).subscribe(resp => {
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

  deactivateIssue(status: boolean) {
    if (status && this.popupObject.id) {

      this._issueService.deactivate(this.popupObject.id).subscribe(resp => {
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
    this.popupObject.title = 'Activate Issue?';
    this.popupObject.subtitle = 'are_you_sure_activate';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for deactivate
  deactivate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Issue?';
    this.popupObject.subtitle = 'are_you_sure_deactivate';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for delete
  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Issue?';
    this.popupObject.subtitle = 'are_you_sure_delete';

    $(this.confirmationPopUp.nativeElement).modal('show');

  }
  // Sub-Menu Search 
  searchIssue(term: string) {
    this._issueService.getItems(false, `&q=${term}`).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  // for sorting
  sortTitle(type: string) {
    // IssueMasterStore.setCurrentPage(1);
    this._issueService.sortIssueList(type, null);
    this.pageChange();
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.issueSubscriptionEvent.unsubscribe();
    this.popupControlOrganizationTypeEventSubscription.unsubscribe();
    IssueMasterStore.searchText = '';
    IssueMasterStore.currentPage = 1 ;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }


}
