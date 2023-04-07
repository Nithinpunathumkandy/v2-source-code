import { Component, Input, OnInit } from '@angular/core';
import { ThemeStructureSettingStore } from "src/app/stores/settings/theme/theme-structure.store";

@Component({
  selector: 'app-no-chart-data',
  templateUrl: './no-chart-data.component.html',
  styleUrls: ['./no-chart-data.component.scss']
})
export class NoChartDataComponent implements OnInit {
  @Input('source') noData:string;
  @Input('border') border: boolean = true;
  @Input('width') width: boolean = true;
  ThemeStructureSettingStore = ThemeStructureSettingStore;
  constructor() { }

  ngOnInit(): void {
  }

}
