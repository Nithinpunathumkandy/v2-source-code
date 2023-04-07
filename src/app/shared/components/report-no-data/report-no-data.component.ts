import { Component, Input, OnInit } from '@angular/core';
import { ThemeStructureSettingStore } from 'src/app/stores/settings/theme/theme-structure.store';

@Component({
  selector: 'app-report-no-data',
  templateUrl: './report-no-data.component.html',
  styleUrls: ['./report-no-data.component.scss']
})
export class ReportNoDataComponent implements OnInit {

  @Input('source') noData:string;
  @Input('height') height: boolean = true;
  @Input('border') border: boolean = true;
  ThemeStructureSettingStore = ThemeStructureSettingStore;
  constructor() { }

  ngOnInit(): void {
  }
}
