import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { DocumentAccessTypePaginationResponse } from 'src/app/core/models/masters/knowledge-hub/document-access-type';
import {DocumentAccessTypeMasterStore} from 'src/app/stores/masters/knowledge-hub/document-access-type-store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { DocumentAccessTypeService } from 'src/app/core/services/masters/knowledge-hub/document-access-type/document-access-type.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';

@Component({
  selector: 'app-document-access-type',
  templateUrl: './document-access-type.component.html',
  styleUrls: ['./document-access-type.component.scss']
})
export class DocumentAccessTypeComponent implements OnInit , OnDestroy {


  DocumentAccessTypeMasterStore = DocumentAccessTypeMasterStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;

  constructor(private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _documentAccessTypeService: DocumentAccessTypeService) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'DOCUMENT_ACCESS_TYPE_LIST', submenuItem: { type: 'search' }},
        {activityName: null, submenuItem: {type: 'close',  path: 'knowledge-hub'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
              
      NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "search":
            DocumentAccessTypeMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
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
    })

    this.pageChange(1);

  }

  // page change event
  pageChange(newPage: number = null) {
    if (newPage) DocumentAccessTypeMasterStore.setCurrentPage(newPage);
    this._documentAccessTypeService.getAllItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  // for sorting
  sortTitle(type: string) {
    // DocumentAccessTypeMasterStore.setCurrentPage(1);
    this._documentAccessTypeService.sortDocumentAccessTypesList(type, SubMenuItemStore.searchText);
    this.pageChange();
  }

  ngOnDestroy(){
     // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
     if (this.reactionDisposer) this.reactionDisposer();
     SubMenuItemStore.makeEmpty();
     DocumentAccessTypeMasterStore.searchText = '';
     DocumentAccessTypeMasterStore.currentPage = 1 ;
  }

}
