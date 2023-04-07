import { Component, OnInit } from '@angular/core';
import { BreadCrumbMenuItemStore } from "src/app/stores/general/breadcrumb-menu.store";
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ThemeStructureSettingStore } from "src/app/stores/settings/theme/theme-structure.store";

@Component({
  selector: 'app-error-occured',
  templateUrl: './error-occured.component.html',
  styleUrls: ['./error-occured.component.scss']
})
export class ErrorOccuredComponent implements OnInit {

  ThemeStructureSettingStore = ThemeStructureSettingStore;
  constructor() { }

  ngOnInit(): void {
    SubMenuItemStore.exportClicked = false;
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
  }

}
