import { Component, OnInit } from '@angular/core';
import { BreadCrumbMenuItemStore } from "src/app/stores/general/breadcrumb-menu.store";
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Component({
  selector: 'app-breadcrumb-menu',
  templateUrl: './breadcrumb-menu.component.html',
  styleUrls: ['./breadcrumb-menu.component.scss']
})
export class BreadcrumbMenuComponent implements OnInit {

  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  constructor(
    private _helperService:HelperServiceService
  ) { }

  ngOnInit(): void {
    
  }

  getInitialItem(){
    if(BreadCrumbMenuItemStore.breadCrumbMenuItems.length > 0)
    {
      return BreadCrumbMenuItemStore.breadCrumbMenuItems[0];
    }
    else
      return null;
  }

  getBreadCrumbMenuItemsLength(){
    return BreadCrumbMenuItemStore.breadCrumbMenuItems.length;
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

}
