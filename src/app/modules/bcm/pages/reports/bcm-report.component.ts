import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { UtilityService } from "src/app/shared/services/utility.service";
import { BCMReportStore } from 'src/app/stores/bcm/bcm-report/bcm-report-store';
import { BCMReportList } from 'src/app/core/models/bcm/bcm-report/bcm-report';

@Component({
  selector: 'app-bcm-report',
  templateUrl: './bcm-report.component.html'
})
export class BCMReportComponent implements OnInit {

	@ViewChild('plainDev') plainDev: ElementRef;
	@ViewChild('navBar') navBar: ElementRef;
	BCMReportStore = BCMReportStore;
	reactionDisposer: IReactionDisposer;
	OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
	OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
	initializeBcmList: BCMReportList[];
	Report_loader: boolean = false;

  constructor(
	private _router: Router,
	private _utilityService: UtilityService,
	private _cdr: ChangeDetectorRef, private _renderer2: Renderer2
  ) { }

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof BCMReportComponent
   */
  ngOnInit(): void {
	setTimeout(() => {
		this.Report_loader = true;
		this._utilityService.detectChanges(this._cdr);
	  }, 100);

	this.reactionDisposer = autorun(() => {
		if (OrganizationLevelSettingsStore.organizationLevelSettings && OrganizationGeneralSettingsStore.organizationSettings) {
			this.bcmList();
			this._utilityService.detectChanges(this._cdr);
		}
	})

	setTimeout(() => {
		this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
		window.addEventListener('scroll', this.scrollEvent, true);
		this._utilityService.detectChanges(this._cdr);
	}, 250);
  }

  scrollEvent = (event: any): void => {
	const number = event.target.documentElement?.scrollTop;
	if (number > 50) {
	  this._renderer2.setStyle(this.plainDev.nativeElement, 'height', '45px');
	  this._renderer2.addClass(this.navBar.nativeElement, 'affix');
	}
	else {
	  this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
	  this._renderer2.removeClass(this.navBar.nativeElement, 'affix');
	}
  }
  // for moveing to next page
	getReport(obj) {
		BCMReportStore.selectedReportObject = obj;
		SubMenuItemStore.datefilterValue = 'year';
		this._router.navigateByUrl('bcm/reports/' + obj.type);
	}
	// for getting the list of data shows in bcm section
	bcmList(): void {
		this.initializeBcmList = this.BCMReportStore.BCMReportListArray.filter(function (i) {
			return i.reportType == 'bcm';
		});
		for (var i = 0; i < this.initializeBcmList.length; i++) {
			if (this.initializeBcmList[i].hasOwnProperty('checkLevel') && !this.OrganizationLevelSettingsStore.organizationLevelSettings[this.initializeBcmList[i].checkLevel]) {
				this.initializeBcmList.splice(i, 1);
				i--;
			}
		}

	}

   /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof BCMReportComponent
   */
	ngOnDestroy(){
		window.removeEventListener('scroll', this.scrollEvent, true);
	}

}
