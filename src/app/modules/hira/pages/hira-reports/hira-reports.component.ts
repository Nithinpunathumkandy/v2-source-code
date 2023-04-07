import { Component, ElementRef, OnInit, ViewChild, Renderer2, ChangeDetectorRef } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from "src/app/stores/auth.store";
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';

@Component({
  selector: 'app-hira-reports',
  templateUrl: './hira-reports.component.html',
  styleUrls: ['./hira-reports.component.scss']
})
export class HiraReportsComponent implements OnInit {

	@ViewChild('plainDev') plainDev: ElementRef;
	@ViewChild('navigationBar') navigationBar: ElementRef;
	AppStore = AppStore;
	AuthStore = AuthStore;
	OrganizationModulesStore = OrganizationModulesStore;
  constructor(private _renderer2: Renderer2, private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService) { }

  ngOnInit(): void {
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
