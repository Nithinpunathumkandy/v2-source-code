import { Component, OnInit,Input } from '@angular/core';
import { NoDataItemStore } from "src/app/stores/general/no-data-item.store";
import { ThemeStructureSettingStore } from "src/app/stores/settings/theme/theme-structure.store";

@Component({
  selector: 'app-no-data',
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.scss']
})
export class NoDataComponent implements OnInit {
  @Input('heightChange') heightChange:string;
  NoDataItemStore = NoDataItemStore;
  @Input('border') border: boolean = true;
  @Input('height') height: boolean = false;
  ThemeStructureSettingStore = ThemeStructureSettingStore;
  constructor() { }

  ngOnInit(): void {
  }

  buttonClicked() {
    NoDataItemStore.setClickedNoDataItem(true);
  }

}
