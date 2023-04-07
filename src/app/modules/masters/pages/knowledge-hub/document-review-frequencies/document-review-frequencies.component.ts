import { Component, OnInit, ChangeDetectorRef, OnDestroy} from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { AppStore } from "src/app/stores/app.store";
import { AuthStore } from 'src/app/stores/auth.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { DocumentReviewFrequenciesMasterStore } from 'src/app/stores/masters/knowledge-hub/document-review-frequencies-store';
import { DocumentReviewFrequenciesService } from 'src/app/core/services/masters/knowledge-hub/document-review-frequencies/document-review-frequencies.service';

@Component({
  selector: 'app-document-review-frequencies',
  templateUrl: './document-review-frequencies.component.html',
  styleUrls: ['./document-review-frequencies.component.scss']
})
export class DocumentReviewFrequenciesComponent implements OnInit , OnDestroy {

  AppStore = AppStore;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;      
  DocumentReviewFrequenciesMasterStore=DocumentReviewFrequenciesMasterStore

  constructor(
    private _cdr: ChangeDetectorRef,        
    private _utilityService:UtilityService,
    private _helperService: HelperServiceService,
    private _documentReviewFrequenciesService:DocumentReviewFrequenciesService,
  ) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'DOCUMENT_REVIEW_FREQUENCY_LIST', submenuItem: { type: 'search' }},
        {activityName: 'EXPORT_DOCUMENT_REVIEW_FREQUENCY', submenuItem: {type: 'export_to_excel'}},
        {activityName: null, submenuItem: {type: 'close', path: 'knowledge-hub'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
          if (SubMenuItemStore.clikedSubMenuItem) {
            switch (SubMenuItemStore.clikedSubMenuItem.type) {
              case "search":
                DocumentReviewFrequenciesMasterStore.searchText = SubMenuItemStore.searchText;
                this.pageChange(1);
                break;
              case "export_to_excel":
                this._documentReviewFrequenciesService.exportToExcel();
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
    if (newPage) DocumentReviewFrequenciesMasterStore.setCurrentPage(newPage);
    this._documentReviewFrequenciesService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  sortTitle(type: string) {
    this._documentReviewFrequenciesService.sortRiskMatrixLikelihood(type, null);
    this.pageChange();
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    SubMenuItemStore.searchText='';
    DocumentReviewFrequenciesMasterStore.currentPage = 1 ;
    DocumentReviewFrequenciesMasterStore.searchText='';
  }

}
