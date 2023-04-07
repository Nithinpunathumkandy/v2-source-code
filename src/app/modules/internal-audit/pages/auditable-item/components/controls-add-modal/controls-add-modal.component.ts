import { Component, OnInit, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { ControlCategoryMasterStore } from 'src/app/stores/masters/bpm/control-category.master.store';
import { ControlCategoryService } from 'src/app/core/services/masters/bpm/control-category/control-category.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuditableItemMasterStore } from 'src/app/stores/internal-audit/auditable-item/auditable-item-store';
import { AuditableItemService } from 'src/app/core/services/internal-audit/auditable-item/auditable-item.service';
import { ControlStore } from 'src/app/stores/bpm/controls/controls.store';
import { ControlsService } from 'src/app/core/services/bpm/controls/controls.service';
import { ControlTypesService } from 'src/app/core/services/masters/bpm/control-types/control-types.service';
import { ControlTypesMasterStore } from 'src/app/stores/masters/bpm/control-types.master.store';
import { FormGroup } from '@angular/forms';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AppStore } from 'src/app/stores/app.store';


@Component({
  selector: 'app-controls-add-modal',
  templateUrl: './controls-add-modal.component.html',
  styleUrls: ['./controls-add-modal.component.scss']
})
export class ControlsAddModalComponent implements OnInit {


  ControlCategoryMasterStore = ControlCategoryMasterStore;
  AuditableItemMasterStore = AuditableItemMasterStore;
  ControlTypesMasterStore = ControlTypesMasterStore;
  ControlStore = ControlStore;
  AppStore = AppStore;
  controlAddPopupEvent: any;
  closechildEvent: any;
  controlCategory;
  controlsArray = [];

  form: FormGroup;
  searchTerm;
  allControls: boolean = false;
  control_type_id = null;
  control_categories_id = null;

  isSelected: boolean = false;

  controlslistEmptyList = "No Controls To Show";
  constructor(public _controlCategService: ControlCategoryService,
    private _eventEmitterService: EventEmitterService,
    private _auditableItemService: AuditableItemService,
    private _helperService:HelperServiceService,
    private _utilityService: UtilityService,
    private _controLService: ControlsService,
    private _controlTypeService: ControlTypesService,
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,) { }

  ngOnInit(): void {

    this.form = new FormGroup({});
    this.pageChange(1);
    this.getControlCategories();
    this.controlsArray = JSON.parse(JSON.stringify(AuditableItemMasterStore.controlsToDisplay));
    this.getTypes();

  }

  pageChange(newPage: number = null) {
    this.allControls = false;
    if (newPage) ControlStore.setCurrentPage(newPage);
    this._controLService
      .getAllItems()
      .subscribe(res => {
        this._utilityService.detectChanges(this._cdr);

        // if (ControlStore.control_loaded) {
        //   if (this.controlsArray.length > 0) {
        //     ControlStore.controlList.forEach(element => {
        //       this.controlsArray.forEach(item => {
        //         if (element.id == item.id) {
        //           element['is_enabled'] = true;
        //         }
        //       });
        //     });
        //   } else {
        //     this.controlsArray = [];
        //   }
        //   this._utilityService.detectChanges(this._cdr);
        // }
      }
      );
  }


  searchControls() {
    ControlStore.setCurrentPage(1);
    if (this.searchTerm) {
      this._controLService.getAllItems(false, `&q=${this.searchTerm}`).subscribe(res => {
        if(res.data.length == 0){
          this.controlslistEmptyList = "Your search did not match any controls. Please make sure you typed the Control name correctly, and then try again."
        }
        this._utilityService.detectChanges(this._cdr);
      });
    } else {
      this.pageChange();
    }
  }

  clearSearchBar() {
    this.searchTerm = '';
    this.pageChange();
  }

  // for getting controls
  getControlCategories() {
    this._controlCategService.getItems().subscribe(res => {

      this._utilityService.detectChanges(this._cdr);
    })

  }

  getTypes() {
    this._controlTypeService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr)
    })
  }

  searchControlCategories(e) {
    this._controlCategService.getItems(false, '&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchControlTypes(e) {
    this._controlTypeService.getItems(false, '&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }


  sortControls() {
    var params = '';
    if (this.control_type_id) params = `&control_type_ids=${this.control_type_id}`;
    if (this.control_categories_id) {
      if (params)
        params = params + `&control_category_ids=${this.control_categories_id}`;
      else
        params = `&control_category_ids=${this.control_categories_id}`;
    }
    this._controLService.getAllItems(false, params).subscribe(res => {
      if(res.data.length == 0){
        this.controlslistEmptyList = "Your search did not match any controls. Please make sure you typed the Control name correctly, and then try again."
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }


  checkAll(event) {
    // if (event.target.checked) {
    //   ControlStore.controlList.forEach(element => {
    //     element['is_enabled'] = true;
    //   });
    //   this.allControls = true;
    // } else {
    //   this.allControls = false;
    //   ControlStore.controlList.forEach(element => {
    //     element['is_enabled'] = false;
    //   });
    // }

    // this.getSelectedControls();
    if (event.target.checked) {
      this.allControls = true;
      for(let i of ControlStore.controlList){
        var pos = this.controlsArray.findIndex(e => e.id == i.id);
        if (pos == -1){
          this.controlsArray.push(i);}          
      }
    } else {
      this.allControls = false;
      for(let i of ControlStore.controlList){
        var pos = this.controlsArray.findIndex(e => e.id == i.id);
        if (pos != -1){
          this.controlsArray.splice(pos,1);}    
      }
    }

  }

  // getSelectedControls() {
  //   if (ControlStore.controlList.length > 0) {
  //     for (let i of ControlStore.controlList) {
  //       var pos = this.controlsArray.findIndex(e => e.id == i.id);
  //       if (i['is_enabled'] == true && pos == -1) {
  //         this.controlsArray.push(i);
  //       }
  //       else if (i['is_enabled'] == false && pos != -1) {
  //         this.controlsArray.splice(pos, 1);
  //       }
  //     }
  //   }
  // }

  save(close: boolean = false) {
    this._auditableItemService.selectRequiredControls(this.controlsArray);
    this._utilityService.showSuccessMessage('Controls Selected', 'The selected controls has been added to your list');
    if (close) this.cancel();
  }

  checkSelectedStatus(id: number){
    var pos = this.controlsArray.findIndex(e => e.id == id);
    if(pos != -1) return true;
    else return false;
  }


  selectControls(event, controls, index) {
    // var itemCount = 0;
    // if (event.target.checked) {
    //   ControlStore.controlList[index]['is_enabled'] = true;
    //   ControlStore.controlList.forEach(element => {
    //     if (element['is_enabled'] == false || !element.hasOwnProperty('is_enabled')) {
    //       itemCount++;
    //     }
    //   });
    //   if (itemCount == 0) {
    //     this.allControls = true;
    //   } else {
    //     this.allControls = false;
    //   }
    // } else {

    //   ControlStore.controlList[index]['is_enabled'] = false;
    //   this.allControls = false;
    // }

    // this.getSelectedControls();
    var pos = this.controlsArray.findIndex(e=>e.id == controls.id);
    if(pos != -1)
        this.controlsArray.splice(pos,1);
    else
        this.controlsArray.push(controls);
  }



  cancel() {
    this._eventEmitterService.dismissAUditableItemControlAddModal();
    this.controlsArray = [];
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }


}
