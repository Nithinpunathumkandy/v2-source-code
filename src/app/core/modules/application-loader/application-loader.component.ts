import { Component, OnInit } from '@angular/core';
import { ThemeStructureSettingStore } from "src/app/stores/settings/theme/theme-structure.store";

@Component({
  selector: 'app-application-loader',
  templateUrl: './application-loader.component.html',
  styleUrls: ['./application-loader.component.scss']
})
export class ApplicationLoaderComponent implements OnInit {

  ThemeStructureSettingStore = ThemeStructureSettingStore;
  constructor() { }

  ngOnInit(): void {
  }

}
