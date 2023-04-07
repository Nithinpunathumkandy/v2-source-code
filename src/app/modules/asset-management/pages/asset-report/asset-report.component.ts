import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { AssetReportList } from 'src/app/core/models/asset-management/asset-report/asset-report';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AssetReportStore } from 'src/app/stores/asset-management/asset-report/asset-report-store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';

@Component({
  selector: 'app-asset-report',
  templateUrl: './asset-report.component.html',
  styleUrls: ['./asset-report.component.scss']
})
export class AssetReportComponent implements OnInit {

	@ViewChild('plainDev') plainDev: ElementRef;
	@ViewChild('navBar') navBar: ElementRef;
	AssetReportStore = AssetReportStore;
	reactionDisposer: IReactionDisposer;
	OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
	OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
	initializeAssetList: AssetReportList[];
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
   * @memberof AssetReportComponent
   */
  ngOnInit(): void {
	setTimeout(() => {
		this.Report_loader = true;
		this._utilityService.detectChanges(this._cdr);
	  }, 100);

	this.reactionDisposer = autorun(() => {
		if (OrganizationLevelSettingsStore.organizationLevelSettings && OrganizationGeneralSettingsStore.organizationSettings) {
			this.assetList();
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
		AssetReportStore.selectedReportObject = obj;
		SubMenuItemStore.datefilterValue = 'year';
		this._router.navigateByUrl('asset-management/reports/' + obj.type);
	}
	// for getting the list of data shows in asset section
	assetList(): void {
		this.initializeAssetList = this.AssetReportStore.AssetReportListArray.filter(function (i) {
			return i.reportType == 'asset';
		});
		for (var i = 0; i < this.initializeAssetList.length; i++) {
			if (this.initializeAssetList[i].hasOwnProperty('checkLevel') && !this.OrganizationLevelSettingsStore.organizationLevelSettings[this.initializeAssetList[i].checkLevel]) {
				this.initializeAssetList.splice(i, 1);
				i--;
			}
			if (this.initializeAssetList[i]?.hasOwnProperty('checkType') && this.initializeAssetList[i]?.checkType=='is_criticality' && (!OrganizationModulesStore.checkIndividualSubModule(3300,58801))) {
				this.initializeAssetList.splice(i, 1);
				i--;
			}
			if (this.initializeAssetList[i]?.hasOwnProperty('checkType') && this.initializeAssetList[i]?.checkType=='is_maintenance' && (!OrganizationModulesStore.checkIndividualSubModule(3300,60901))) {
				this.initializeAssetList.splice(i, 1);
				i--;
			}

		}

	}

   /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof TrainingReportComponent
   */
	ngOnDestroy(){
		window.removeEventListener('scroll', this.scrollEvent, true);
	}


}
