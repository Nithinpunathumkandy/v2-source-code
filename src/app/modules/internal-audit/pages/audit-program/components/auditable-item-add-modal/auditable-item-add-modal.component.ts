import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuditProgramService } from 'src/app/core/services/internal-audit/audit-program/audit-program.service';
import { AuditableItemService } from 'src/app/core/services/internal-audit/auditable-item/auditable-item.service';
import { RiskRatingService } from 'src/app/core/services/masters/external-audit/risk-rating/risk-rating.service';
import { AuditableItemCategoryService } from 'src/app/core/services/masters/internal-audit/auditable-item-category/auditable-item-category.service';
import { AuditableItemTypeService } from 'src/app/core/services/masters/internal-audit/auditable-item-type/auditable-item-type.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { ProcessStore } from 'src/app/stores/bpm/process/processes.store';
import { AuditFindingsStore } from 'src/app/stores/internal-audit/audit-findings/audit-findings-store';
import { AuditPlanScheduleMasterStore } from 'src/app/stores/internal-audit/audit-plan-schedule/audit-plan-schedule-store';
import { AuditProgramMasterStore } from 'src/app/stores/internal-audit/audit-program/audit-program-store';
import { AuditableItemMasterStore } from 'src/app/stores/internal-audit/auditable-item/auditable-item-store';
import { RiskRatingMasterStore } from 'src/app/stores/masters/external-audit/risk-rating-store';
import { AuditItemCategoryMasterStore } from 'src/app/stores/masters/internal-audit/audit-item-category-store';
import { AuditItemTypeMasterStore } from 'src/app/stores/masters/internal-audit/auditable-item-type';

@Component({
  selector: 'app-auditable-item-add-modal',
  templateUrl: './auditable-item-add-modal.component.html',
  styleUrls: ['./auditable-item-add-modal.component.scss']
})
export class AuditableItemAddModalComponent implements OnInit {
  @Input('source') CommonAuditableItemSource: any;
  AppStore = AppStore;
  ProcessStore = ProcessStore;
  RiskRatingMasterStore = RiskRatingMasterStore;
  AuditItemCategoryMasterStore = AuditItemCategoryMasterStore;
  AuditableItemMasterStore = AuditableItemMasterStore;
  AuditProgramMasterStore = AuditProgramMasterStore;
  AuditItemTypeMasterStore = AuditItemTypeMasterStore;
  auditableItemArray = [];
  riskRatingId;
  auditable_item_type_id;
  auditable_item_category_id;
  formErrors: any;

  form: FormGroup;
  searchTerm;

  allAuditableItems: boolean = false;

  auditableItemEmptyList = "No Auditable Item To Show";
  constructor(private _auditableItemCategoryService: AuditableItemCategoryService,
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _helperService:HelperServiceService,
    private _auditableItemTypesService: AuditableItemTypeService,
    private _cdr: ChangeDetectorRef,
    private _auditProgramService: AuditProgramService,
    private _auditableItemService: AuditableItemService,
    private _riskRatingService: RiskRatingService,
   ) { }

  ngOnInit(): void {

    this.form = new FormGroup({});
    // calling auditable Item Api
    this.pageChange(1);

    // calling other apis
    this.getRiskRating();
    this.getAuditableItemCategory();
    this.getAuditableItemType();


  }

  pageChange(newPage: number = null) {
    if (newPage) AuditableItemMasterStore.setCurrentPage(newPage);
     let params= `&remove_auditable_item_program_id=${AuditProgramMasterStore.auditProgramId}`;
      this._auditableItemService.getItemsForAuditProgam(false,params).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
        if (AuditableItemMasterStore.loaded) {
          if (this.auditableItemArray.length > 0) {
            AuditableItemMasterStore.allItems.forEach(element => {
              this.auditableItemArray.forEach(item => {
                if (element.id == item.id) {
                  element['is_enabled'] = true;
                }
              });
            });
          } else {
            this.auditableItemArray = [];
          }
          this._utilityService.detectChanges(this._cdr);
        }
      });
  }

  // for getting audit risk rating
  getRiskRating() {

    this._riskRatingService.getAllItems().subscribe(res => {

      this._utilityService.detectChanges(this._cdr);
    })

  }

  // for getting auditable item category
  getAuditableItemCategory() {
    this._auditableItemCategoryService.getItems().subscribe(res => {

      this._utilityService.detectChanges(this._cdr);
    })

  }

  // getting auditable Item Type
  getAuditableItemType() {
   this._auditableItemTypesService.getAllItems().subscribe(res=>{
     this._utilityService.detectChanges(this._cdr)
   })
  }

  // search for process
  searchAuditableItemType(e) {
    this._auditableItemTypesService.getAllItems(false, '&q=' + e.term).subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });

  }


  // for searching auditable item category
  searchAuditableItemCategory(e) {
    this._auditableItemCategoryService.getItems(false, '&q=' + e.term).subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });

  }

  // search process function
  searchAuditableItem() {
    AuditableItemMasterStore.setCurrentPage(1);
     let params = "";
      params= `&remove_auditable_item_program_id=${AuditProgramMasterStore.auditProgramId}`;
      if (this.searchTerm) {
        this._auditableItemService.getItemsForAuditProgam(false, `&q=${this.searchTerm}` + params).subscribe(res => {
          if(res.data.length == 0){
            this.auditableItemEmptyList = "Your search did not match any auditable Items. Please make sure you typed the auditable Item name correctly, and then try again."
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

  // processing data for save function
  processSaveData() {
    var saveAuditableItemArray = [];
    this.auditableItemArray.forEach(element => {
      saveAuditableItemArray.push(element.id);
    });
    var items = {

      "auditable_item_ids": saveAuditableItemArray
    }

    return items;

  }


  // save function
  save(close: boolean = false) {
    if (this.auditableItemArray.length == 0) {
      this._utilityService.showErrorMessage('Error!', 'Please Select One Auditable Item Atleast');
    } else {

      this.formErrors = null;
      if (this.auditableItemArray.length > 0) {
        let save;
        AppStore.enableLoading();
          save = this._auditProgramService.saveImportAuditableItem(AuditProgramMasterStore.auditProgramId, this.processSaveData());

          save.subscribe((res: any) => {
            AppStore.disableLoading();
            setTimeout(() => {
              this._utilityService.detectChanges(this._cdr);
              this.auditableItemArray=[]
              this.allAuditableItems = false;
              this.pageChange()
            }, 500);
            if (close) this.cancel();
          }, (err: HttpErrorResponse) => {
            if (err.status == 422) {
              this.formErrors = err.error.errors;
            } else if(err.status == 500 || err.status == 403){
              this.cancel();
            }
            AppStore.disableLoading();
            this._utilityService.detectChanges(this._cdr);

          });
        }
      }
  }


  // process sort function
  sortAuditableItems() {
    var params = '';
      if (this.riskRatingId) {
        if (params)
          params = params + `&risk_rating_ids=${this.riskRatingId}&remove_auditable_item_program_id=${AuditProgramMasterStore.auditProgramId}`;
        else
          params = `&risk_rating_ids=${this.riskRatingId}&remove_auditable_item_program_id=${AuditProgramMasterStore.auditProgramId}`;
      }
  
      if (this.auditable_item_type_id) {
        if (params)
          params = params + `&auditable_item_type_ids=${this.auditable_item_type_id}&remove_auditable_item_program_id=${AuditProgramMasterStore.auditProgramId}`;
        else
          params = `&auditable_item_type_ids=${this.auditable_item_type_id}&remove_auditable_item_program_id=${AuditProgramMasterStore.auditProgramId}`;
      }
  
      if (this.auditable_item_category_id) {
        if (params)
          params = params + `&auditable_item_category_ids=${this.auditable_item_category_id}&remove_auditable_item_program_id=${AuditProgramMasterStore.auditProgramId}`;
        else
          params = `&auditable_item_category_ids=${this.auditable_item_category_id}&remove_auditable_item_program_id=${AuditProgramMasterStore.auditProgramId}`;
      }
  
      // go back to initial state when no filters applied
      if (this.auditable_item_type_id == null && this.auditable_item_category_id == null && this.riskRatingId == null) {
        this.pageChange(1);
      } else {
        this._auditableItemService.getItemsForAuditProgam(false, params).subscribe(res => {
          if(res.data.length == 0){
            this.auditableItemEmptyList = "Your search did not match any auditable Items. Please make sure you typed the auditable Item name correctly, and then try again."
          }
          this._utilityService.detectChanges(this._cdr);
        });
      }
  }

  checkSelectedStatus(id: number){
    var pos = this.auditableItemArray.findIndex(e => e.id == id);
    if(pos != -1) return true;
    else return false;
  }

  // Auditable Item selecting function
  selectAuditableItemPresent(event, auditableItem, index) {
    var pos = this.auditableItemArray.findIndex(e=>e.id == auditableItem.id);
    if(pos != -1)
        this.auditableItemArray.splice(pos,1);
    else
        this.auditableItemArray.push(auditableItem);
  }

  // for checking all checkox
  checkAll(event) {
    if (event.target.checked) {
      this.allAuditableItems = true;
      for(let i of AuditableItemMasterStore.allItems){
        var pos = this.auditableItemArray.findIndex(e => e.id == i.id);
        if (pos == -1){
          this.auditableItemArray.push(i);}          
      }
    } else {
      this.allAuditableItems = false;
      for(let i of AuditableItemMasterStore.allItems){
        var pos = this.auditableItemArray.findIndex(e => e.id == i.id);
        if (pos != -1){
          this.auditableItemArray.splice(pos,1);}    
      }
    }

  }


  // close modal function
  closeModal() {
    this._eventEmitterService.dismissImportAuditableItemsModal();
    this.auditableItemArray = [];
    this.pageChange(1);// calling for redreshing the list
  }

  // cancel function
  cancel() {

    AppStore.disableLoading();
    this.closeModal();
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }


}
