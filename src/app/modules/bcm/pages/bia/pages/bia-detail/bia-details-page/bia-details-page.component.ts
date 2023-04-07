import { Component, OnInit } from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { BiaStore } from 'src/app/stores/bcm/bia/bia.store';
import { OrganizationLevelSettingsStore } from "src/app/stores/settings/organization-level-settings.store";

@Component({
  selector: 'app-bia-details-page',
  templateUrl: './bia-details-page.component.html',
  styleUrls: ['./bia-details-page.component.scss']
})
export class BiaDetailsPageComponent implements OnInit {

  BiaStore = BiaStore
  AppStore = AppStore
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  emptyTier = "emptyTier";
  sideCollapsed: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

  returnInHours(from,to?){
    let inHours
    if(!to){
      if(from<1){
        inHours = from*24
      }
    }
    return Math.round(inHours)
  }

  vitalAccordianClick(index){
    let vital = BiaStore.ImpactResult.process.process_vital_record
    for (let i = 0; i < vital.length; i++) {
      const element = vital[i];
      if(i==index){
        element["is_accordion_active"]=!element["is_accordion_active"]
      }else{
        element["is_accordion_active"]= false
      }
    }
  }

  getCreatedByPopupDetails(users, created?: string,type:any='') {
    let userDetails: any = {};
    if(type=='user'){
      userDetails['first_name'] = users?.first_name;
      userDetails['last_name'] = users?.last_name;
      userDetails['designation'] = users?.designation;
      userDetails['image_token'] = users?.image?.token;
      userDetails['email'] = users?.email;
      userDetails['mobile'] = users?.mobile;
      userDetails['id'] = users?.id;
      userDetails['department'] = users?.department;
      userDetails['status_id'] = users?.status?.id;
      userDetails['created_at'] = null;
    }
    if(type=='default'){
      userDetails['first_name'] = users?.created_by?.first_name;
      userDetails['last_name'] = users?.created_by?.last_name;
      userDetails['designation'] = users?.created_by?.designation.title;
      userDetails['image_token'] = users?.created_by?.image_token;
      userDetails['email'] = users?.created_by?.email;
      userDetails['mobile'] = users?.created_by?.mobile;
      userDetails['id'] = users?.created_by.id;
      userDetails['department'] = users?.created_by.department?.title;
      userDetails['status_id'] = users?.created_by.status_id;
      userDetails['created_at'] = created ? created : null;
    }
    return userDetails;

  }

}
