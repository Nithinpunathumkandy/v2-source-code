import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { SlaStatusesService } from 'src/app/core/services/masters/compliance-management/sla-statuses/sla-statuses.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { SlaStatusesMasterStore } from 'src/app/stores/masters/compliance-management/sla-statuses-store';
import { IReactionDisposer, autorun } from 'mobx';

@Component({
  selector: 'app-sla-statuses',
  templateUrl: './sla-statuses.component.html',
  styleUrls: ['./sla-statuses.component.scss']
})
export class SlaStatusesComponent implements OnInit {

  SlaStatusesMasterStore = SlaStatusesMasterStore;
  reactionDisposer: IReactionDisposer;
  constructor(private _utilityService: UtilityService,
    private _slaStatusesService: SlaStatusesService,
		private _helperService: HelperServiceService,
		private _cdr: ChangeDetectorRef,) { }

  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {

			var subMenuItems = [
				{ activityName: 'SLA_CATEGORY_LIST', submenuItem: { type: 'search' } },
				{ activityName: 'EXPORT_SLA_CATEGORY', submenuItem: { type: 'export_to_excel' } },
				{ activityName: null, submenuItem: { type: 'close', path: 'compliance-management' } },
			]
			this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

			if (SubMenuItemStore.clikedSubMenuItem) {

				switch (SubMenuItemStore.clikedSubMenuItem.type) {
				
					case "export_to_excel":
						this._slaStatusesService.exportToExcel();
						break;
					case "search":
						SlaStatusesMasterStore.searchText = SubMenuItemStore.searchText;
						this.pageChange(1);
						// this.searchSlaCategory(SubMenuItemStore.searchText);
						break;

					default:
						break;
				}
				// Don't forget to unset clicked item immediately after using it
				SubMenuItemStore.unSetClickedSubMenuItem();
			}

		})

    this.pageChange();
  }

  pageChange(newPage: number = null) {
		if (newPage) SlaStatusesMasterStore.setCurrentPage(newPage);
		this._slaStatusesService.getItems(false, null).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
	}

  // for sorting
	sortTitle(type: string) {
		this._slaStatusesService.sortSlaStatuseslList(type, null);
		this.pageChange();
	}
}
