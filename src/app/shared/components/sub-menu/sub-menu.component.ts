import { Component, OnInit, Input, ViewChild, ElementRef, Renderer2, HostListener } from '@angular/core';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { SubMenuItem } from 'src/app/core/models/general/sub-menu.model';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { AppStore } from 'src/app/stores/app.store';

declare var $: any;
@Component({
	selector: 'app-sub-menu',
	templateUrl: './sub-menu.component.html',
	styleUrls: ['./sub-menu.component.scss']
})
export class SubMenuComponent {

	@ViewChild('searchField') searchField: ElementRef;
	@ViewChild('searchFieldSmall') searchFieldSmall: ElementRef;
	SubMenuItemStore = SubMenuItemStore;
	searchText = '';
	AppStore = AppStore;
	dateType = "";

	constructor(private _renderer2: Renderer2, private _helperService: HelperServiceService) { }

	itemClicked(item: SubMenuItem) {
		if (item.type == 'search')
			SubMenuItemStore.setSearchText(this.searchText);
		else if (item.type == 'export_to_excel')
			SubMenuItemStore.exportClicked = true;
		else if (item.type == 'go_to_incident')
			SubMenuItemStore.exportClicked = true;
		else if (item.type == 'import')
			SubMenuItemStore.importClicked = true;
		else if (item.type == 'template')
			SubMenuItemStore.templateClicked = true;
		else if (item.type == 'publish_plan')
			SubMenuItemStore.publishClicked = true;
		else if (item.type == 'mark_audited')
			SubMenuItemStore.markAuditClicked = true;
		else if (item.type == 'mark_completed')
		SubMenuItemStore.markCompletedClicked = true;
		else if (item.type == 'auditee_accept')
			SubMenuItemStore.acceptClicked = true;
		else if (item.type == 'un_mark_audited')
			SubMenuItemStore.unmarkAuditClicked = true;			
		else if (item.type == 'user_grid_system')
			SubMenuItemStore.userGridSystem = !SubMenuItemStore.userGridSystem;
		if (SubMenuItemStore.userGridSystem)
			SubMenuItemStore.gridTitle = 'grid_view';
		else
			SubMenuItemStore.gridTitle = 'list_view';

		SubMenuItemStore.setClickedSubMenuItem(item);
	}

	typeOfDate(event) {
		SubMenuItemStore.setDatefilterValue(event.target.value);
		SubMenuItemStore.setClickedSubMenuItem({ type: 'datefilter' } as SubMenuItem);
	}

	clearSearchText(item: SubMenuItem) {
		this.searchText = '';
		if (item.type == 'search')
			SubMenuItemStore.setSearchText(this.searchText);
		SubMenuItemStore.setClickedSubMenuItem(item);
	}

	close_submenu() {
		this.searchText = '';
		SubMenuItemStore.unsetSearchText();
	}

	checkItemPresent(item) {
		if (SubMenuItemStore.subMenuItems) {
			for (let i of SubMenuItemStore.subMenuItems) {
				if (i.type == item) {
					return true;
				}
			}
			return false;
		}
		else
			return false;
	}

	returnItem(item) {
		if (SubMenuItemStore.subMenuItems) {
			for (let i of SubMenuItemStore.subMenuItems) {
				if (i.type == item) {
					return i;
				}
			}
		}
	}

	@HostListener('document:click', ['$event'])
	onClick(event) {
		setTimeout(() => {
			if (this.searchField?.nativeElement) {
				if (!this.searchText && this.searchField?.nativeElement && this.searchFieldSmall?.nativeElement) {
					setTimeout(() => {
						if (this.searchField)
							this._renderer2.removeClass(this.searchField?.nativeElement, 'sb-search-open');

						if (this.searchFieldSmall)
							this._renderer2.removeClass(this.searchFieldSmall?.nativeElement, 'sb-search-open');
					}, 1000);
				}
			}
		}, 150);
	}

	getButtonText(text) {
		return this._helperService.translateToUserLanguage(text);
	}

	searchClicked(e, type) {
		e.stopPropagation();
		if (this.searchField.nativeElement && this.searchFieldSmall.nativeElement) {
			if (type == 'big')
				this._renderer2.addClass(this.searchField?.nativeElement, 'sb-search-open');
			else
				this._renderer2.addClass(this.searchFieldSmall?.nativeElement, 'sb-search-open');
		}
	}


}
