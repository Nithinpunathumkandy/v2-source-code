import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy, Renderer2 } from '@angular/core';
import { ReportFrequencyService } from 'src/app/core/services/masters/human-capital/report-frequency/report-frequency.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ReportFrequency,ReportFrequencyPaginationResponse } from 'src/app/core/models/masters/human-capital/report-frequency';
import {ReportFrequencyMasterStore} from 'src/app/stores/masters/human-capital/report-frequency-store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AppStore } from "src/app/stores/app.store";
import { ShareItemStore } from "src/app/stores/general/share-item.store";
import { ImportItemStore } from "src/app/stores/general/import-item.store";

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-report-frequency',
  templateUrl: './report-frequency.component.html',
  styleUrls: ['./report-frequency.component.scss']
})
export class ReportFrequencyComponent implements OnInit , OnDestroy {
  @ViewChild('titleInput') titleInput: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  
  ReportFrequencyMasterStore = ReportFrequencyMasterStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_report_frequency_message';

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  popupControlEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor(private _reportFrequencyService: ReportFrequencyService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2) { }

  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'REPORT_FREQUENCY_LIST', submenuItem: { type: 'search' }},
        // {activityName: 'GENERATE_REPORT_FREQUENCY_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_REPORT_FREQUENCY', submenuItem: {type: 'export_to_excel'}},
        // {activityName: 'SHARE_REPORT_FREQUENCY', submenuItem: { type: 'share'}},
        // {activityName: 'IMPORT_REPORT_FREQUENCY', submenuItem: {type: 'import'}},
        {activityName: null, submenuItem: {type: 'close', path:'human-capital'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
                     
      NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
     
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "search":
            ReportFrequencyMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
            // case "template":
            //   this._reportFrequencyService.generateTemplate();
            //   break;
            case "export_to_excel":
              this._reportFrequencyService.exportToExcel();
              break;
            // case "share":
            //   ShareItemStore.setTitle('share_report_frequency_title');
            //   ShareItemStore.formErrors = {};
            //   break;
            // case "import":
            //   ImportItemStore.setTitle('import_report_frequency');
            //   ImportItemStore.setImportFlag(true);
            //   break;
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
        this._reportFrequencyService.shareData(ShareItemStore.shareData).subscribe(res=>{
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
        this._reportFrequencyService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    
   
    this.pageChange(1);

  }
  // page change event
  pageChange(newPage: number = null) {
    if (newPage) ReportFrequencyMasterStore.setCurrentPage(newPage);
    this._reportFrequencyService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }


  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {

      case 'Activate': this.activateReportFrequency(status)
        break;

      case 'Deactivate': this.deactivateReportFrequency(status)
        break;

        case '': this.deleteReportFrequency(status)
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

  // delete function call
  deleteReportFrequency(status: boolean) {
    if (status && this.popupObject.id) {
      this._reportFrequencyService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      },(error=>{
        if(error.status == 405 && ReportFrequencyMasterStore.getReportFrequencyById(this.popupObject.id).status_id == AppStore.activeStatusId){
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
 

  // calling activcate function

  activateReportFrequency(status: boolean) {
    if (status && this.popupObject.id) {

      this._reportFrequencyService.activate(this.popupObject.id).subscribe(resp => {
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

  deactivateReportFrequency(status: boolean) {
    if (status && this.popupObject.id) {

      this._reportFrequencyService.deactivate(this.popupObject.id).subscribe(resp => {
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
    this.popupObject.title = 'Activate Report Frequency?';
    this.popupObject.subtitle = 'are_you_sure_activate';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for deactivate
  deactivate(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Report Frequency?';
    this.popupObject.subtitle = 'are_you_sure_deactivate';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  // for delete
  delete(id: number) {
    // event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Report Frequency?';
    this.popupObject.subtitle = 'are_you_sure_delete';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }


  // for sorting
  sortTitle(type: string) {
    // ReportFrequencyMasterStore.setCurrentPage(1);
    this._reportFrequencyService.sortReportFrequencieslList(type, null);
    this.pageChange();
  }


  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.popupControlEventSubscription.unsubscribe();
    ReportFrequencyMasterStore.searchText = '';
    ReportFrequencyMasterStore.currentPage = 1 ;
    // this.idleTimeoutSubscription.unsubscribe();
    // this.networkFailureSubscription.unsubscribe();
  }

}



