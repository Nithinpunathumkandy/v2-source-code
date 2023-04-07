import { Component, OnInit, ChangeDetectorRef,Input } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { UtilityService } from "src/app/shared/services/utility.service";

import { ControlCategoryService } from 'src/app/core/services/masters/bpm/control-category/control-category.service';
import { ControlCategoryMasterStore } from 'src/app/stores/masters/bpm/control-category.master.store'

import {ControlSubcategoryService} from 'src/app/core/services/masters/bpm/control-subcategory/control-subcategory.service'
import { ControlSubcategoryMasterStore } from 'src/app/stores/masters/bpm/control-subcategory.master.store'

import { ControlTypesService } from 'src/app/core/services/masters/bpm/control-types/control-types.service'
import { ControlTypesMasterStore } from 'src/app/stores/masters/bpm/control-types.master.store'

import { ControlStore } from 'src/app/stores/bpm/controls/controls.store'
import {ControlsService} from 'src/app/core/services/bpm/controls/controls.service'

import {Controls } from 'src/app/core/models/bpm/controls/controls'
import { RiskTreatmentStore } from 'src/app/stores/risk-management/risks/risk-treatment.store';
import { AppStore } from 'src/app/stores/app.store';
@Component({
  selector: 'app-control-popup',
  templateUrl: './control-popup.component.html',
  styleUrls: ['./control-popup.component.scss']
})
export class ControlPopupComponent implements OnInit {
  @Input('removeProcess') removeProcess:boolean = false;
  @Input('controlsModalTitle')controlsModalTitle: any;
  @Input('title') title:boolean=false;

  reactionDisposer: IReactionDisposer;

  // Store Variables
  ControlCategoryMasterStore = ControlCategoryMasterStore;
  ControlSubcategoryMasterStore = ControlSubcategoryMasterStore;
  ControlTypesMasterStore = ControlTypesMasterStore;
  ControlStore = ControlStore;
  AppStore = AppStore;
  RiskTreatmentStore = RiskTreatmentStore;

  selectedControls: Controls[] = [];
  
  control_type_id = null;
  control_categories_id = null;
  checkSelectAll:boolean = false;
  searchText: any = null;  
  noDataMessage: string = 'no_data_found';

  constructor(private _eventEmitterService: EventEmitterService,
    private _controlCategSerivce: ControlCategoryService,
    private _controlSubCategService: ControlSubcategoryService,
    private _controlTypeService: ControlTypesService,
    private _controlService:ControlsService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
              
  ) { }

  ngOnInit(): void {
    ControlStore.saved = false;
    this.selectedControls = JSON.parse(JSON.stringify(ControlStore.selectedControlsList));
    if(this.removeProcess){
      this.removeControlForRisk(1);
    }
    else
    this.pageChange(1);
    this.getControlCategories();

    this.getTypes();
 
  //  this.removeControlForRisk();
    
  }

  removeControlForRisk(currentPage){
    this.checkSelectAll = false;
    if(currentPage) ControlStore.currentPage = currentPage; 
 
    this._controlService.getAllItems(false,'&exclude='+RiskTreatmentStore.selectedRiskControls).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
  }

  clear(){
    this.searchText = '';
    this.pageChange(1);
  }

  // getIds(process){
  //   let ids=[];
  //   for(let i of process){
  //     ids.push(i.id)
  //   }
  //   return ids;
  // }

  pageChange(currentPage){
    this.checkSelectAll = false;
    if(currentPage) ControlStore.currentPage = currentPage; 
    this._controlService.getAllItems(false).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
  }

  selectControls(controls){
    if(this.removeProcess){
      var posControl = ControlStore.processControl.findIndex(e=>e.id == controls.id);
      if(posControl!=-1){
        ControlStore.processControl.splice(posControl,1);
  
      }
      else
      ControlStore.processControl.push(controls);
  
    }
   
    var pos = this.selectedControls.findIndex(e=>e.id == controls.id);
    if(pos != -1)
        this.selectedControls.splice(pos,1);
    else
        this.selectedControls.push(controls);
  }

  
  save(close: boolean = false) {
    ControlStore.saved = true;
    ControlStore.saveSelected = true;
    let title = this.controlsModalTitle?.component ? this.controlsModalTitle?.component : 'item'
    if (this.removeProcess) {
      if (ControlStore.processControl.length > 0)
        this._utilityService.showSuccessMessage('controls_selected', 'Selected controls are mapped with the ' + title + ' successfully!');
    }
    this._controlService.selectRequiredControls(this.selectedControls);
    if (this.selectedControls.length > 0) this._utilityService.showSuccessMessage('controls_selected', 'Selected controls are mapped with the ' + title + ' successfully!');
    if (close) this.cancel();
  }

  cancel(){
    if(ControlStore.saved){
      // this._eventEmitterService.dismissCommonModal();
      this.searchText=null;
    }
    else{
      ControlStore.saved=false
      // this._eventEmitterService.dismissCommonModal();
      this.searchText=null;
      this.selectedControls = [];
    }
   
    // this.searchText=null;
    // if(!this.saved){
    //   ControlStore.processControl = [];
    // }
    // this.selectedControls = [];
    this._eventEmitterService.dismissCommonModal();
  }


  getControlCategories() {
    this._controlCategSerivce.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr)
    })
  }

  searchControlCategories(e){
    this._controlCategSerivce.getItems(false,'&q='+e.term).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getTypes() {
    this._controlTypeService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr)
    })
  }

  searchControlTypes(e){
    this._controlTypeService.getItems(false, '&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  sortControls() {
    var params = '';
    if(this.control_type_id) params = `&control_type_ids=${this.control_type_id}`;
    if(this.control_categories_id){
      if(params)
        params = params + `&control_category_ids=${this.control_categories_id}`;
      else
        params = `&control_category_ids=${this.control_categories_id}`;
    }
    this._controlService.getAllItems(false, params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchControls(event) {
    let searchText = event.target.value
    if(searchText){
      this._controlService.getAllItems(false,`&q=${searchText}`).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  checkControlsPresent(controls){
    var pos = this.selectedControls.findIndex(e=>e.id == controls.id);
    if(pos != -1)
        return true;
    else
        return false;
  }

  selectAll(event){
    if (event.target.checked) {
      this.checkSelectAll = true;
      for(let i of ControlStore.controlList){
        // this.selectCriteria(i,false)
        if(this.removeProcess){
          var posr = ControlStore.processControl.findIndex(e => e.id == i.id);
          if (posr == -1){
            ControlStore.processControl.push(i);}          
        }
        var pos = this.selectedControls.findIndex(e => e.id == i.id);
        if (pos == -1){
          this.selectedControls.push(i);}          
      }
    } else {
      this.checkSelectAll = false;
      for(let i of ControlStore.controlList){
        // this.selectCriteria(i);
        if(this.removeProcess){
          var posr = ControlStore.processControl.findIndex(e => e.id == i.id);
          if (posr == -1){
            ControlStore.processControl.splice(posr,i);}          
        }
        var pos = this.selectedControls.findIndex(e => e.id == i.id);
        if (pos != -1){
          this.selectedControls.splice(pos,1);}    
      }
    }
  }

}
