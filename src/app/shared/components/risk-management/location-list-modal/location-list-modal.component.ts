import { Component, OnInit , ChangeDetectionStrategy, OnDestroy, ElementRef, ViewChild, ChangeDetectorRef, Renderer2,Input } from '@angular/core';
import { Location} from 'src/app/core/models/masters/general/location';
import {LocationMasterStore} from 'src/app/stores/masters/general/location-store';

import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { LocationService } from 'src/app/core/services/masters/general/location/location.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';

@Component({
  selector: 'app-location-list-modal',
  templateUrl: './location-list-modal.component.html',
  styleUrls: ['./location-list-modal.component.scss']
})
export class LocationListModalComponent implements OnInit {
  @Input('removeselected') removeselected:boolean = false;
  @Input('locationModalTitle')locationModalTitle: any;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  LocationMasterStore = LocationMasterStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  searchText=null;
  selectedLocations:Location[]=[];
  emptyLocation="no_locations"

  constructor(
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _locationService:LocationService
  ) { }

  ngOnInit(): void {
    this.selectedLocations = JSON.parse(JSON.stringify(LocationMasterStore.selectedLocationList));
    this.pageChange(1);

  }

  pageChange(newPage: number = null) {
    if (newPage) LocationMasterStore.setCurrentPage(newPage);
    let params='';
    if(this.removeselected){
      params='exclude='+LocationMasterStore.selectedLocationList;
    }
    this._locationService.getItems(false,(params?params:''),true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  searchLocation(e){
    let params='';
    if(this.removeselected){
      params='&exclude='+LocationMasterStore.selectedLocationList;
    }
    LocationMasterStore.setCurrentPage(1);
    this._locationService.getItems(false, `&q=${this.searchText}`+(params?params:'')).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  sortTitle(type: string) {
    // LocationMasterStore.setCurrentPage(1);
    this._locationService.sortLocationlList(type, null);
    this.pageChange();
  }

   //getting button name by language
   getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  save(close: boolean = false){
    AppStore.enableLoading();
    LocationMasterStore.saveSelected=true
    this._locationService.selectRequiredLocation(this.selectedLocations);
    AppStore.disableLoading();
    let title = this.locationModalTitle?.component ? this.locationModalTitle?.component : 'item'
    if(this.selectedLocations.length > 0) this._utilityService.showSuccessMessage('locations_selected','Selected locations are mapped with the ' +title + ' successfully!');
    if(close) this.cancel();
    
  }

  cancel(){
   if(LocationMasterStore.saveSelected){
     console.log("success");
     this._eventEmitterService.dismissLocationMasterModal();
     this.searchText=null;
   }
   else{
     this.selectedLocations=[];
    LocationMasterStore.saveSelected=false
    this._eventEmitterService.dismissLocationMasterModal()
    this.searchText=null;
   }
 
  }

  clear(){
    this.searchText=''
    this.pageChange(1);
  }
  selectAlllocations(e){
    // if(event.target.checked){
    //   this.selectedLocations = LocationMasterStore.allItems;
    // }
    // else{
    //   this.selectedLocations = [];
    // }

    if (e.target.checked) {
      for(let i of LocationMasterStore.allItems){
        var pos = this.selectedLocations.findIndex(e => e.id == i.id);
        if (pos == -1){
          this.selectedLocations.push(i);}          
      }
    } else {
      for(let i of LocationMasterStore.allItems){
        var pos = this.selectedLocations.findIndex(e => e.id == i.id);
        if (pos != -1){
          this.selectedLocations.splice(pos,1);}    
      }
    }
  }

  locationSelected(locations){
    //console.log(issues);
    //var pos=this.selectedIssues.
    
     var pos = this.selectedLocations.findIndex(e=>e.id == locations.id);
     if(pos != -1)
         this.selectedLocations.splice(pos,1);
     else
         this.selectedLocations.push(locations);
  }

  
  locationPresent(id) {
    //console.log(id);
    
     const index = this.selectedLocations.findIndex(e => e.id == id);
     if (index != -1)
       return true;
     else
       return false;
  }

}
