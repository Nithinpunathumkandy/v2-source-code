import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy, Renderer2 } from '@angular/core';
import { ReportMasterStore } from 'src/app/stores/masters/human-capital/report-master.store';
import { ReportService } from 'src/app/core/services/masters/human-capital/report/report.service'
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { HumanCapitalService } from "src/app/core/services/human-capital/human-capital-service/human-capital.service";
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { Report } from 'src/app/core/models/masters/human-capital/user-report';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AppStore } from "src/app/stores/app.store";
import { ShareItemStore } from "src/app/stores/general/share-item.store";
import { ImportItemStore } from "src/app/stores/general/import-item.store";

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-user-report-master',
  templateUrl: './user-report-master.component.html',
  styleUrls: ['./user-report-master.component.scss']
})
export class UserReportMasterComponent implements OnInit, OnDestroy {
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  ReportMasterStore = ReportMasterStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_user_report_message';

  userDocumentObject = {
    component: 'Master',
    values: null,
    type: null
  }

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  userDocumentSubscriptionEvent: any = null;
  popupUserDocumentEventSubscription: any
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;


  constructor(private _reportService: ReportService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _humanCapitalService: HumanCapitalService,
  ) { }

  ngOnInit(): void {
    // This will run whenever the store observable or computed which are used in this function changes.
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_report'});
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'USER_REPORT_LIST', submenuItem: { type: 'search' }},
        {activityName: 'CREATE_USER_REPORT', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_USER_REPORT_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_USER_REPORT', submenuItem: {type: 'export_to_excel'}},
        // {activityName: 'SHARE_USER_REPORT', submenuItem: { type: 'share'}},
        {activityName: 'IMPORT_USER_REPORT', submenuItem: {type: 'import'}},
        {activityName: null, submenuItem: {type: 'close', path:'human-capital'}},
      ]
      if(!AuthStore.getActivityPermission(1100,'CREATE_USER_REPORT')){
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
            this._reportService.generateTemplate();
            break;
          case "export_to_excel":
            this._reportService.exportToExcel();
            break;
          case "search":
            ReportMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "share":
            ShareItemStore.setTitle('share_user_report_title');
            ShareItemStore.formErrors = {};
            break;
          case "import":
            ImportItemStore.setTitle('import_user_report');
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
        this._reportService.shareData(ShareItemStore.shareData).subscribe(res=>{
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
        this._reportService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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
    this.popupUserDocumentEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    // for closing the modal
    this.userDocumentSubscriptionEvent = this._eventEmitterService.userDocumentControl.subscribe(res => {
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
    this.userDocumentObject.type = 'Add';
    this.userDocumentObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  pageChange(newPage: number = null) {
    if (newPage) ReportMasterStore.setCurrentPage(newPage);
    this._reportService.getReports(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.userDocumentObject.type = null;
  }

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteUserDocument(status)
        break;

      case 'Activate': this.activateUserDocument(status)
        break;

      case 'Deactivate': this.deactivateUserDocument(status)
        break;

    }

  }

  
  // delete function call
  deleteUserDocument(status: boolean) {
    if (status && this.popupObject.id) {
      this._reportService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      },(error=>{
        if(error.status == 405 && ReportMasterStore.getReportById(this.popupObject.id).status_id == AppStore.activeStatusId){
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

  activateUserDocument(status: boolean) {
    if (status && this.popupObject.id) {

      this._reportService.activate(this.popupObject.id).subscribe(resp => {
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

  deactivateUserDocument(status: boolean) {
    if (status && this.popupObject.id) {

      this._reportService.deactivate(this.popupObject.id).subscribe(resp => {
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
    this.popupObject.title = 'Activate User Report?';
    this.popupObject.subtitle = 'are_you_sure_activate';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for deactivate
  deactivate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate User Report?';
    this.popupObject.subtitle = 'are_you_sure_deactivate';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for delete
  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete  User Report?';
    this.popupObject.subtitle = 'are_you_sure_delete';

    $(this.confirmationPopUp.nativeElement).modal('show');

  }


  getReport(id) {

    this.ReportMasterStore.clearDocumentDetails();
    this._reportService.getIndividualReport(id).subscribe(res => {



      if (ReportMasterStore.loaded) {

        const UserReport: Report = ReportMasterStore.individualReportDetails;

        //set form value
        if (UserReport.documents && UserReport.documents.length > 0) {
          for (let i of UserReport.documents) {
            let docurl = this._humanCapitalService.getThumbnailPreview('user-reports', i.token);
            let docDetails = {
              created_at: i.created_at,
              created_by: i.created_by,
              updated_at: i.updated_at,
              updated_by: i.updated_by,
              name: i.title,
              ext: i.ext,
              size: i.size,
              url: i.url,
              thumbnail_url: i.url,
              token: i.token,
              preview: docurl,
              id: i.id,
              user_report_id: i.user_report_id

            };
            this._reportService.setDocumentDetails(docDetails, docurl);
          }

        }

        //set form value
        this.userDocumentObject.values = {
          id: UserReport.id,
          description: UserReport.description,
          title: UserReport.title,
          report_frequency_id: UserReport.report_frequency.id,
          documents: ''
        }
        this.userDocumentObject.type = 'Edit';

        this.openFormModal();
      }


      this._utilityService.detectChanges(this._cdr);
    });
  }

  // for sorting
  sortTitle(type: string) {
    // ReportMasterStore.setCurrentPage(1);
    this._reportService.sortUserReportList(type, null);
    this.pageChange();
  }


  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.popupUserDocumentEventSubscription.unsubscribe();
    this.userDocumentSubscriptionEvent.unsubscribe();
    ReportMasterStore.searchText = '';
    ReportMasterStore.currentPage = 1 ;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
 
  }


}
