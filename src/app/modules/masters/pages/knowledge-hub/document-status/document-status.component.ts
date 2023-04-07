import { Component, OnInit,ChangeDetectionStrategy,ViewChild,ElementRef,ChangeDetectorRef,Renderer2, OnDestroy } from '@angular/core';
import { DocumentStatusMasterStore} from 'src/app/stores/masters/knowledge-hub/document-status-store';
import { DocumentStatus } from 'src/app/core/models/masters/knowledge-hub/document-status';
import { SubMenuItemStore} from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AppStore } from "src/app/stores/app.store";
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { DocumentStatusService } from 'src/app/core/services/masters/knowledge-hub/document-status/document-status.service';

declare var $:any;
@Component({
  selector: 'app-document-status',
  templateUrl: './document-status.component.html',
  styleUrls: ['./document-status.component.scss']
})
export class DocumentStatusComponent implements OnInit,OnDestroy {
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  DocumentStatusMasterStore = DocumentStatusMasterStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_document_type_message';

  documentTypeObject = {
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


  documentTypesSubscriptionEvent: any = null;
  popupControlDocumentTypesEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor(private _documentStatusService:DocumentStatusService,
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2
    ) { }

  

  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'DOCUMENT_STATUS_LIST', submenuItem: { type: 'search' }},
        {activityName: 'EXPORT_DOCUMENT_STATUS', submenuItem: {type: 'export_to_excel'}},
        {activityName: null, submenuItem: {type: 'close', path: 'knowledge-hub'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
                           
      NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "export_to_excel":
            this._documentStatusService.exportToExcel();
            break;
          case "search":
            DocumentStatusMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      
    })
    
     this.pageChange(1);
    

  }
  pageChange(newPage: number = null) {
    if (newPage) DocumentStatusMasterStore.setCurrentPage(newPage);
    this._documentStatusService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }
  sortTitle(type: string) {
    this._documentStatusService.sortDocumentStatusList(type, SubMenuItemStore.searchText);
    this.pageChange();
  }
  getDocumentType(){
    
  }
  ngOnDestroy(){
    SubMenuItemStore.makeEmpty();
    DocumentStatusMasterStore.currentPage = 1 ;
    DocumentStatusMasterStore.searchText = '' ;
  }

}
