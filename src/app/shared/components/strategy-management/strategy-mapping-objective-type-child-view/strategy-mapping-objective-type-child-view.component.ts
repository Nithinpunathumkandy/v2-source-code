import { Component, Input, OnInit } from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { StrategyManagementSettingStore } from 'src/app/stores/settings/strategy-management-settings.store';

@Component({
  selector: 'app-strategy-mapping-objective-type-child-view',
  templateUrl: './strategy-mapping-objective-type-child-view.component.html',
  styleUrls: ['./strategy-mapping-objective-type-child-view.component.scss']
})
export class StrategyMappingObjectiveTypeChildViewComponent implements OnInit {

  @Input('details') objectiveType: any[] = [];
  @Input('id') id: any;
  @Input('childIndex') childIndex: any;
  @Input('level') level: any;
  AppStore = AppStore;

  selectedIndex = 0;
  selectedObjectiveTypeId = 0;
  selectedObjIndex = 0;
  selectedObjectiveId = 0;
  StrategyManagementSettingStore = StrategyManagementSettingStore;
  
  constructor() { }

  ngOnInit(): void {
  }

  getNoDataSource(type,message){
    let noDataSource = {
      noData:message, border: false, imageAlign: type
    }
    return noDataSource;
  }

  changeAccordion(id,index){
    this.selectedObjectiveTypeId = id;
    if (this.selectedIndex == index)
      this.selectedIndex = null;
    else
      this.selectedIndex = index;
  }

  changeObjectAccordion(id,index){
    this.selectedObjectiveId = id;
    if (this.selectedObjIndex == index)
      this.selectedObjIndex = null;
    else
      this.selectedObjIndex = index;
  }
}
