import { Component, OnInit , Input , ChangeDetectorRef } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RiskLibraryService } from 'src/app/core/services/masters/risk-management/risk-library/risk-library.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import{RiskLibraryMasterStore} from 'src/app/stores/masters/risk-management/risk-library-store';
import { AppStore } from 'src/app/stores/app.store';

@Component({
  selector: 'app-risk-library-popup',
  templateUrl: './risk-library-popup.component.html',
  styleUrls: ['./risk-library-popup.component.scss']
})
export class RiskLibraryPopupComponent implements OnInit {

  @Input('source') RiskLibrarySource: any;
  AppStore = AppStore;

  RiskLibraryMasterStore = RiskLibraryMasterStore;

  constructor(
    private _riskLibraryService:RiskLibraryService,
    private _utilityService:UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService:EventEmitterService,
    private _helperService:HelperServiceService
  ) { }

  ngOnInit(): void {
    this.getDetails(this.RiskLibrarySource)    
  }

  getDetails(id:number){
    this._riskLibraryService.getItem(id).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
  })
  }

  // getAreas(areas){
  //   return this._helperService.getArrayProcessed(areas,'title').toString();
  // }
  // getSources(sources){
  //   return this._helperService.getArrayProcessed(sources,'title').toString();
  // }
  // getTypes(types){
  //   if(types !=0){
  //     let e;
  //     e=this._helperService.getArrayProcessed(types,'is_external').toString();
  //     if(e==="1"){
  //       return "External";
  //     }
  //     let i=this._helperService.getArrayProcessed(types,'is_internal').toString();
  //     if(i==="1"){
  //       return "Internal"
  //     }
  //     else{
  //       return "External,Internal"
  //     }
  //   }
  // }

  cancel(){
    this._eventEmitterService.dismissRiskViewMorePopup();
  }

  ngOnDestroy(){
    
  }

}
