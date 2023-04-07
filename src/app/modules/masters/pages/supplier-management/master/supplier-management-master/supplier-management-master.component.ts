import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SubMenuItemStore } from "src/app/stores/general/sub-menu-item.store";
import { MasterMenuStore } from "src/app/stores/masters/masters.store";
import { MasterService } from "src/app/core/services/masters/masters/master.service";

@Component({
  selector: "app-supplier-management-master",
  templateUrl: "./supplier-management-master.component.html",
  styleUrls: ["./supplier-management-master.component.scss"],
})
export class SupplierManagementMasterComponent implements OnInit {
  SubMenuItemStore = SubMenuItemStore;
  MasterMenuStore = MasterMenuStore;

  constructor(private _router: Router, private _masterService: MasterService) {}

  /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof SupplierManagementMasterComponent
   */
  ngOnInit(): void {
    SubMenuItemStore.makeEmpty();
  }

  getModuleId() {
    return this._masterService.getItemByPath(this._router.url);
  }
}
