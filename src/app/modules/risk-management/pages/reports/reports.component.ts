import { Router } from '@angular/router';
import { Component, OnInit,ChangeDetectorRef,ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from "src/app/stores/auth.store";
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { RisksStore } from 'src/app/stores/risk-management/risks/risks.store';

@Component({
	selector: 'app-reports',
	templateUrl: './reports.component.html',
	styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

	@ViewChild('plainDev') plainDev: ElementRef;
	@ViewChild('navigationBar') navigationBar: ElementRef;
	AppStore = AppStore;
	AuthStore = AuthStore;
	OrganizationModulesStore = OrganizationModulesStore;
	constructor(private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _renderer2:Renderer2) { }

	ngOnInit(): void {
		RisksStore.riskId = null;
		AppStore.showDiscussion = false;
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
		  this._renderer2.addClass(this.navigationBar.nativeElement, 'affix');
		}
		else {
		  this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
		  this._renderer2.removeClass(this.navigationBar.nativeElement, 'affix');
		}
	  }

}
