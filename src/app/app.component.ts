import { Component, OnInit } from '@angular/core';
import { CoreService } from './core/services/core.service';
import { AppStore } from './stores/app.store';
import { LabelStore } from './stores/label.store';
import { NoConnectivityService } from "src/app/core/services/no-connectivity/no-connectivity.service";
import { PermissionSettingsService } from "src/app/core/services/permission-settings/permission-settings.service";

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	AppStore = AppStore;
	LabelStore = LabelStore;

	constructor(
		private _coreService: CoreService,
		private _noConnectivityService: NoConnectivityService,
		private _permissionSettingsService: PermissionSettingsService,
	) { }

	ngOnInit() {
		this._coreService.subscribeRouteEvents();
		this._noConnectivityService.checkConnectivity().subscribe(isOnline => this._noConnectivityService.setConnectionPresent(isOnline));
		this._permissionSettingsService.getOrganizationModules();
		this.LabelStore.setLabels();
	}
}
