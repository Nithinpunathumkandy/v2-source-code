import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-complaint-action-plans',
  templateUrl: './customer-complaint-action-plans.component.html',
  styleUrls: ['./customer-complaint-action-plans.component.scss']
})
export class CustomerComplaintActionPlansComponent implements OnInit {

  constructor() { }

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof CustomerComplaintActionPlansComponent
   */
  ngOnInit(): void {
  }

   /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof CustomerComplaintActionPlansComponent
   */
  ngOnDestroy(){}

}
