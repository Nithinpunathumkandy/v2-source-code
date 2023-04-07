import { Component, OnInit, Input } from '@angular/core';
import { ThemeStructureSettingStore } from "src/app/stores/settings/theme/theme-structure.store";

@Component({
  selector: 'app-no-data-list',
  templateUrl: './no-data-list.component.html',
  styleUrls: ['./no-data-list.component.scss']
})
export class NoDataListComponent implements OnInit {
  @Input('source') noData:string;
  @Input('height') height: boolean = true;
  @Input('border') border: boolean = true;
  ThemeStructureSettingStore = ThemeStructureSettingStore;
  constructor() { }

  ngOnInit(): void {
  }

}
