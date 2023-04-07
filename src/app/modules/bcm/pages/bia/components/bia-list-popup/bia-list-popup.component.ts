import { Component, Input, OnInit } from '@angular/core';
import { AnyNaptrRecord } from 'dns';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { BiaImpactCategoryInformationMasterStore } from 'src/app/stores/masters/bcm/bia-impact-category-information';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
@Component({
  selector: 'app-bia-list-popup',
  templateUrl: './bia-list-popup.component.html',
  styleUrls: ['./bia-list-popup.component.scss']
})
export class BiaListPopupComponent implements OnInit {

  @Input('source') bialist
  emptyList = "emptyList"

  BiaImpactCategoryInformationMasterStore=BiaImpactCategoryInformationMasterStore
  ImpactCategoryInfo: any = [];
  constructor(private _eventEmitterService : EventEmitterService,
   ) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({ title: "Looks like we don't have category information to display here!"});
  }
  closeFormModal() {
    this._eventEmitterService.dismissEventTaskModal();
  }
 
}
