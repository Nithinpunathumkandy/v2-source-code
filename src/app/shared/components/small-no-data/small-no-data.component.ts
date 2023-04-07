import { Component, OnInit,Input } from '@angular/core';
import { NoDataItemStore } from "src/app/stores/general/no-data-item.store";
import { ThemeStructureSettingStore } from "src/app/stores/settings/theme/theme-structure.store";

@Component({
  selector: 'app-small-no-data',
  templateUrl: './small-no-data.component.html',
  styleUrls: ['./small-no-data.component.scss']
})
export class SmallNoDataComponent implements OnInit {

  @Input('heightChange') heightChange:string;
  NoDataItemStore = NoDataItemStore;
  @Input('border') border: boolean = true;
  @Input('height') height: boolean = false;
  @Input('minHight') minHight: boolean = false;
  ThemeStructureSettingStore = ThemeStructureSettingStore;
  constructor() { }

  ngOnInit(): void {
  }

  buttonClicked() {
    NoDataItemStore.setClickedNoDataItem(true);
  }

}
