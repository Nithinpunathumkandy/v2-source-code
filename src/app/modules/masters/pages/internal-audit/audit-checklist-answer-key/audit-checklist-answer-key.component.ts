import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuditChecklistAnswerKeyService } from 'src/app/core/services/masters/internal-audit/audit-checklist-answer-key/audit-checklist-answer-key.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuditCheckListAnswerKeyMasterStore } from 'src/app/stores/masters/internal-audit/audit-checklist-answer-key-store';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';

@Component({
  selector: 'app-audit-checklist-answer-key',
  templateUrl: './audit-checklist-answer-key.component.html',
  styleUrls: ['./audit-checklist-answer-key.component.scss']
})
export class AuditChecklistAnswerKeyComponent implements OnInit {

  AuditCheckListAnswerKeyMasterStore = AuditCheckListAnswerKeyMasterStore;
  reactionDisposer: IReactionDisposer;
  constructor(private auditChecklistService:AuditChecklistAnswerKeyService,
    private _utilityService:UtilityService,
    private _helperService:HelperServiceService,
    private _cdr:ChangeDetectorRef) { }

  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'AUDIT_CHECKLIST_ANSWER_KEY_LIST', submenuItem: { type: 'search' }},
        {activityName: null, submenuItem: {type: 'close', path:'internal-audit'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
          
      NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    
      if (SubMenuItemStore.clikedSubMenuItem) {         
            AuditCheckListAnswerKeyMasterStore.searchText = SubMenuItemStore.searchText;
            this.getItems(1)
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })

    this.getItems(1)
  }

  getItems(newPage: number = null){
    if (newPage) AuditCheckListAnswerKeyMasterStore.setCurrentPage(newPage);
    this.auditChecklistService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  // for sorting
  sortTitle(type: string) {
    this.auditChecklistService.sortAuditCheckList(type);
    this.getItems();
  }
}
