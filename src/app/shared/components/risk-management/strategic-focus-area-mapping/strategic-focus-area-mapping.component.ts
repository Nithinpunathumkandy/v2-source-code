import { Component, OnInit , ChangeDetectorRef , Renderer2 , ViewChild , ElementRef , Input  } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AppStore } from "src/app/stores/app.store";
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Strategic , StrategicObjectivesPaginationResponse} from 'src/app/core/models/masters/risk-management/strategic-objectives';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { FocusAreaService } from 'src/app/core/services/masters/strategy/focus-area/focus-area.service';
import { FocusAreaMasterStore } from 'src/app/stores/masters/strategy/focus-area-master-store';
import { FocusArea } from 'src/app/core/models/masters/strategy/focus-area.model';

@Component({
  selector: 'app-strategic-focus-area-mapping',
  templateUrl: './strategic-focus-area-mapping.component.html',
  styleUrls: ['./strategic-focus-area-mapping.component.scss']
})
export class StrategicFocusAreaMappingComponent implements OnInit {

  @Input('removeselected') removeselected:boolean = false;
  @Input('strategicFocusAreaTitle')strategicFocusAreaTitle;
  FocusAreaMasterStore = FocusAreaMasterStore;
  AppStore = AppStore;
  searchText
  selectedStrat:FocusArea[]=[]
  emptyStrategicObjectives="no_strategic_focusarea"

  constructor(
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _FocusAreaService:FocusAreaService
  ) { }

  ngOnInit(): void {
    this.selectedStrat = JSON.parse(JSON.stringify(FocusAreaMasterStore.selectedStrategic));
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) FocusAreaMasterStore.setCurrentPage(newPage);
    let params='';
    if(this.removeselected){
      params='exclude='+FocusAreaMasterStore.selectedStrategic;
    }
    this._FocusAreaService.getItems(false,(params?params:''),true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  searchLocation(e){
    let params='';
    if(this.removeselected){
      params='&exclude='+FocusAreaMasterStore.selectedStrategic;
    }
    FocusAreaMasterStore.setCurrentPage(1);
    this._FocusAreaService.getItems(false, `&q=${this.searchText}`+(params?params:'')).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

   //getting button name by language
   getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  save(close: boolean = false){
    AppStore.enableLoading();
    FocusAreaMasterStore.saveSelected=true;
    this._FocusAreaService.selectRequiredLocation(this.selectedStrat);
    AppStore.disableLoading();
    let title = this.strategicFocusAreaTitle?.component ? this.strategicFocusAreaTitle.component : 'item'
    if(this.selectedStrat.length > 0) this._utilityService.showSuccessMessage('strategic_focusarea_selected','Selected focus area are mapped with the ' +title + ' successfully!');
    if(close) this.cancel();
    
  }

  cancel(){
   if(FocusAreaMasterStore.saveSelected){
    //  console.log("success");
     this._eventEmitterService.dismissstrategicFocusAreaMapping();
     this.searchText=null;
   }
   else{
     this.selectedStrat=[];
     FocusAreaMasterStore.saveSelected=false
    this._eventEmitterService.dismissstrategicFocusAreaMapping()
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
      for(let i of FocusAreaMasterStore.allItems){
        var pos = this.selectedStrat.findIndex(e => e.id == i.id);
        if (pos == -1){
          this.selectedStrat.push(i);}          
      }
    } else {
      for(let i of FocusAreaMasterStore.allItems){
        var pos = this.selectedStrat.findIndex(e => e.id == i.id);
        if (pos != -1){
          this.selectedStrat.splice(pos,1);}    
      }
    }
  }

  locationSelected(locations){
    //console.log(issues);
    //var pos=this.selectedIssues.
    
     var pos = this.selectedStrat.findIndex(e=>e.id == locations.id);
     if(pos != -1)
         this.selectedStrat.splice(pos,1);
     else
         this.selectedStrat.push(locations);
  }

  
  locationPresent(id) {
    //console.log(id);
    
     const index = this.selectedStrat.findIndex(e => e.id == id);
     if (index != -1)
       return true;
     else
       return false;
  }
}
