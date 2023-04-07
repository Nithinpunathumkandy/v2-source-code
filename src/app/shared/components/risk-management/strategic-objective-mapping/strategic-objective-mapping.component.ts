import { Component, OnInit , ChangeDetectorRef , Renderer2 , ViewChild , ElementRef , Input  } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AppStore } from "src/app/stores/app.store";
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Strategic , StrategicObjectivesPaginationResponse} from 'src/app/core/models/masters/risk-management/strategic-objectives';
import { StrategicObjectivesMasterStore } from 'src/app/stores/masters/risk-management/strategic-objectives-store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { StrategicObjectivesService } from 'src/app/core/services/masters/risk-management/strategic-objectives/strategic-objectives.service';

@Component({
  selector: 'app-strategic-objective-mapping',
  templateUrl: './strategic-objective-mapping.component.html',
  styleUrls: ['./strategic-objective-mapping.component.scss']
})
export class StrategicObjectiveMappingComponent implements OnInit {

  @Input('removeselected') removeselected:boolean = false;
  @Input('strategicModalTitle')strategicModalTitle: any;
  @Input('title') title:boolean=false;
  
  StrategicObjectivesMasterStore = StrategicObjectivesMasterStore;
  AppStore = AppStore;
  searchText
  selectedStrat:Strategic[]=[]
  emptyStrategicObjectives="no_strategic_objectives"

  constructor(
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _strategicObjectivesService:StrategicObjectivesService
  ) { }

  ngOnInit(): void {
    this.selectedStrat = JSON.parse(JSON.stringify(StrategicObjectivesMasterStore.selectedStrategic));
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) StrategicObjectivesMasterStore.setCurrentPage(newPage);
    let params='';
    if(this.removeselected){
      params='exclude='+StrategicObjectivesMasterStore.selectedStrategic;
    }
    this._strategicObjectivesService.getItems(false,(params?params:''),true).subscribe(() => setTimeout(() => {
      document.getElementById('selectall')['checked'] = false;
      this._utilityService.detectChanges(this._cdr)
    }, 100));
  }

  searchLocation(e){
    let params='';
    if(this.removeselected){
      params='&exclude='+StrategicObjectivesMasterStore.selectedStrategic;
    }
    StrategicObjectivesMasterStore.setCurrentPage(1);
    this._strategicObjectivesService.getItems(false, `&q=${this.searchText}`+(params?params:'')).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

   //getting button name by language
   getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  save(close: boolean = false){
    AppStore.enableLoading();
    StrategicObjectivesMasterStore.saveSelected=true;
    this._strategicObjectivesService.selectRequiredLocation(this.selectedStrat);
    AppStore.disableLoading();
    let title = this.strategicModalTitle?.component ? this.strategicModalTitle.component : 'item'
    if(this.selectedStrat.length > 0) this._utilityService.showSuccessMessage('strategic_objectives_selected','Selected strategic objectives are mapped with the ' +title + ' successfully!');
    if(close) this.cancel();
    
  }

  cancel(){
   if(StrategicObjectivesMasterStore.saveSelected){
    //  console.log("success");
     this._eventEmitterService.dismissStrategicObjectivesMapping();
     this.searchText=null;
   }
   else{
     this.selectedStrat=[];
     StrategicObjectivesMasterStore.saveSelected=false
    this._eventEmitterService.dismissStrategicObjectivesMapping()
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
      for(let i of StrategicObjectivesMasterStore.allItems){
        var pos = this.selectedStrat.findIndex(e => e.id == i.id);
        if (pos == -1){
          this.selectedStrat.push(i);}          
      }
    } else {
      for(let i of StrategicObjectivesMasterStore.allItems){
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
