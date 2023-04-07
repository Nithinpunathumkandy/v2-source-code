import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { UtilityService } from "src/app/shared/services/utility.service";
import { TrainingReportStore } from 'src/app/stores/training/training-report/training-report-store';
import { TrainingReportList } from 'src/app/core/models/training/training-reports/training-reports';
import { AuthStore } from 'src/app/stores/auth.store';

@Component({
  selector: 'app-training-report',
  templateUrl: './training-report.component.html',
  styleUrls: ['./training-report.component.scss']
})
export class TrainingReportComponent implements OnInit {

	@ViewChild('plainDev') plainDev: ElementRef;
	@ViewChild('navBar') navBar: ElementRef;

	TrainingReportStore = TrainingReportStore;
	AuthStore = AuthStore;
	OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
	OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
	
	reactionDisposer: IReactionDisposer;
	initializeTrainingList: TrainingReportList[];
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
   * @memberof TrainingReportComponent
   */
  ngOnInit(): void {
	setTimeout(() => {
		this.Report_loader = true;
		this._utilityService.detectChanges(this._cdr);
	  }, 100);

	this.reactionDisposer = autorun(() => {
		if (OrganizationLevelSettingsStore.organizationLevelSettings && OrganizationGeneralSettingsStore.organizationSettings) {
			this.trainingList();
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
		TrainingReportStore.selectedReportObject = obj;
		SubMenuItemStore.datefilterValue = 'year';
		this._router.navigateByUrl('trainings/reports/' + obj.type);
	}
	// for getting the list of data shows in training section
	trainingList(): void {
		this.initializeTrainingList = this.TrainingReportStore.TrainingReportListArray.filter(function (i) {
			return i.reportType == 'training';
		});
		for (var i = 0; i < this.initializeTrainingList.length; i++) {
			if (this.initializeTrainingList[i].hasOwnProperty('checkLevel') && !this.OrganizationLevelSettingsStore.organizationLevelSettings[this.initializeTrainingList[i].checkLevel]) {
				this.initializeTrainingList.splice(i, 1);
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
