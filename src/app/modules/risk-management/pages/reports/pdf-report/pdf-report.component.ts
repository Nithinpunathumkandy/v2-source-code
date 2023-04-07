import { Component, OnInit } from '@angular/core';
import { AuthStore } from "src/app/stores/auth.store";

@Component({
	selector: 'app-pdf-report',
	templateUrl: './pdf-report.component.html',
	styleUrls: ['./pdf-report.component.scss'],
})

export class PdfReportComponent implements OnInit {
   AuthStore = AuthStore;
	constructor() { }

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof PdfReportComponent
   */

   /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof PdfReportComponent
   */
	ngOnInit(): void {

	}

}
