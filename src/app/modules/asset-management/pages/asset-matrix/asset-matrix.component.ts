import {ChangeDetectorRef, Component,ElementRef,OnInit, Renderer2, ViewChild} from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AssetMatrixStore } from 'src/app/stores/asset-management/asset-matrix/asset-matrix-store';
import { AssetRegisterStore } from 'src/app/stores/asset-management/asset-register/asset-register-store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';


declare var $: any;
@Component({
  selector: 'app-asset-matrix',
  templateUrl: './asset-matrix.component.html',
  styleUrls: ['./asset-matrix.component.scss']
})
export class AssetMatrixComponent implements OnInit {
 

	@ViewChild('plainDev') plainDev: ElementRef;
	@ViewChild('navigationBar') navigationBar: ElementRef;

	AssetMatrixStore = AssetMatrixStore;

	constructor(private _renderer2:Renderer2,
		private _utilityService:UtilityService,
		private _cdr:ChangeDetectorRef) { }

		
	ngOnInit(): void {
	AssetRegisterStore.currentAssetPage=null;
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

	ngOnDestroy(){
		window.removeEventListener('scroll', this.scrollEvent);
	}

}
