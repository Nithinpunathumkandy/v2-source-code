import { Component, OnInit, Input, ViewChild, ElementRef, Renderer2, HostListener } from '@angular/core';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { SubMenuItem } from 'src/app/core/models/general/sub-menu.model';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { AppStore } from 'src/app/stores/app.store';

declare var $: any;

@Component({
  selector: 'app-sub-menu-drop-down',
  templateUrl: './sub-menu-drop-down.component.html',
  styleUrls: ['./sub-menu-drop-down.component.scss']
})
export class SubMenuDropDownComponent  {

  @ViewChild('searchField') searchField: ElementRef;
	@ViewChild('searchFieldSmall') searchFieldSmall: ElementRef;
	SubMenuItemStore = SubMenuItemStore;
	searchText = null;
	AppStore = AppStore;
	dateType = "";

  actionItems=['submit','activity_log','review_update','review_modal',
				'new_modal', 'edit_modal', 'delete', 'refresh','update_modal','checkin','checkout']
  integrationItems=['download','export_to_excel','template','import']
  viewItems=['grid','list','edit_mode','view_mode', 'user_grid_system',
             'full_view']
  reviewItems=['workflow','history','approve','review','reject','review_submit']

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
		else if (item.type == 'auditee_accept')
			SubMenuItemStore.acceptClicked = true;
		else if (item.type == 'un_mark_audited')
			SubMenuItemStore.unmarkAuditClicked = true;
		else if (item.type == 'close_risk')
			SubMenuItemStore.closeRiskClicked = true;
		else if (item.type == 'close_cmn')
			SubMenuItemStore.closeClicked = true;
		else if (item.type == 'apply_to_users')
			SubMenuItemStore.applyToUsersClicked = true;
		else if (item.type == 'user_grid_system')
			SubMenuItemStore.userGridSystem = !SubMenuItemStore.userGridSystem;
		if (SubMenuItemStore.userGridSystem)
			SubMenuItemStore.gridTitle = 'grid_view';
		else
			SubMenuItemStore.gridTitle = 'list_view';

		SubMenuItemStore.setClickedSubMenuItem(item);
	}
  checkDropDown(type){

    if(SubMenuItemStore.subMenuItems){



    switch (type) {


      case 'action':
        let matchedActionItem = SubMenuItemStore.subMenuItems.filter(x => this.actionItems.includes(x['type']));
        if(matchedActionItem.length>0)
        return true

        break;
      case 'view':
        let matchedViewItem = SubMenuItemStore.subMenuItems.filter(x => this.viewItems.includes(x['type']));
        if(matchedViewItem.length>0)
        return true
        break;
      case 'review_group':
        let matchedReviewItem = SubMenuItemStore.subMenuItems.filter(x => this.reviewItems.includes(x['type']));
        if(matchedReviewItem.length>0)
        return true
        break;  
      case 'integration':
        let matchedIntegrationItem = SubMenuItemStore.subMenuItems.filter(x => this.integrationItems.includes(x['type']));
        if(matchedIntegrationItem.length>0)
        return true
       break;
    
      default:
        break;
    }
  }


  }

	typeOfDate(event) {
		SubMenuItemStore.setDatefilterValue(event.target.value);
		SubMenuItemStore.setClickedSubMenuItem({ type: 'datefilter' } as SubMenuItem);
	}

	clearSearchText(item: SubMenuItem) {
		this.searchText = null;
		if (item.type == 'search')
			SubMenuItemStore.setSearchText(this.searchText);
		SubMenuItemStore.setClickedSubMenuItem(item);
	}

	close_submenu() {
		this.searchText = null;
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
				if (!this.searchText && this.searchField?.nativeElement) {
					setTimeout(() => {
						if (this.searchField)
							this._renderer2.removeClass(this.searchField?.nativeElement, 'sb-search-open');

						// if (this.searchFieldSmall)
						// 	this._renderer2.removeClass(this.searchFieldSmall?.nativeElement, 'sb-search-open');
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
		if (this.searchField.nativeElement) {
			this._renderer2.addClass(this.searchField?.nativeElement, 'sb-search-open');
			// if (type == 'big')
			// 	this._renderer2.addClass(this.searchField?.nativeElement, 'sb-search-open');
			// else
			// 	this._renderer2.addClass(this.searchFieldSmall?.nativeElement, 'sb-search-open');
		}
	}


}
