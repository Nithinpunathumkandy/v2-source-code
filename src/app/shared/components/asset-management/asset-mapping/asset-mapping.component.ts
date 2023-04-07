import { ChangeDetectorRef, Component, Input, OnInit, Renderer2 } from '@angular/core';
import { AssetRegister } from 'src/app/core/models/asset-management/asset-register/asset-register';
import { AssetRegisterService } from 'src/app/core/services/asset-management/asset-register/asset-register.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AssetRegisterStore } from 'src/app/stores/asset-management/asset-register/asset-register-store';

@Component({
  selector: 'app-asset-mapping',
  templateUrl: './asset-mapping.component.html',
  styleUrls: ['./asset-mapping.component.scss']
})
export class AssetMappingComponent implements OnInit {

  @Input('removeselected') removeselected:boolean = false;
  @Input('assetModalTitle') assetModalTitle: any;
  @Input('title') title:boolean=false;

  AssetRegisterStore = AssetRegisterStore;
  AppStore = AppStore;
  searchText
  selectedStrat:AssetRegister[]=[]
  emptyStrategicObjectives="no_assets"
  
  constructor(
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _assetRegisterService: AssetRegisterService
  ) { }

  ngOnInit(): void {
    this.selectedStrat = JSON.parse(JSON.stringify(AssetRegisterStore.selectedAssets));
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) AssetRegisterStore.setCurrentPage(newPage);
    let params='';
    if(this.removeselected){
      params='exclude='+AssetRegisterStore.selectedAssets;
    }
    this._assetRegisterService.getItems(false,(params?params:'')).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  searchLocation(e){
    let params='';
    if(this.removeselected){
      params='&exclude='+AssetRegisterStore.selectedAssets;
    }
    AssetRegisterStore.setCurrentPage(1);
    this._assetRegisterService.getItems(false, `&q=${this.searchText}`+(params?params:'')).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

   //getting button name by language
   getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  save(close: boolean = false){
    AppStore.enableLoading();
    AssetRegisterStore.saveSelected=true;
    this._assetRegisterService.selectRequiredAssests(this.selectedStrat);
    AppStore.disableLoading();
    let title = this.assetModalTitle?.component ? this.assetModalTitle?.component : 'item'
    if(this.selectedStrat.length > 0) this._utilityService.showSuccessMessage('assets_selected','Selected assets are mapped with the '+this._helperService.translateToUserLanguage(title)+ ' successfully!');
    if(close) this.cancel();
    
  }

  cancel(){
   if(AssetRegisterStore.saveSelected){
    //  console.log("success");
     this._eventEmitterService.dismissAssetsMapping();
     this.searchText=null;
   }
   else{
     this.selectedStrat=[];
     AssetRegisterStore.saveSelected=false
    this._eventEmitterService.dismissAssetsMapping()
    this.searchText=null;
   }
 
  }

  clear(){
    this.searchText=''
    this.pageChange(1);
  }
  selectAlllocations(e){
    if (e.target.checked) {
      for(let i of AssetRegisterStore.allItems){
        var pos = this.selectedStrat.findIndex(e => e.id == i.id);
        if (pos == -1){
          this.selectedStrat.push(i);}          
      }
    } else {
      for(let i of AssetRegisterStore.allItems){
        var pos = this.selectedStrat.findIndex(e => e.id == i.id);
        if (pos != -1){
          this.selectedStrat.splice(pos,1);}    
      }
    }
  }

  locationSelected(locations){
     var pos = this.selectedStrat.findIndex(e=>e.id == locations.id);
     if(pos != -1)
         this.selectedStrat.splice(pos,1);
     else
         this.selectedStrat.push(locations);
  }

  
  locationPresent(id) {
     const index = this.selectedStrat.findIndex(e => e.id == id);
     if (index != -1)
       return true;
     else
       return false;
  }

}
