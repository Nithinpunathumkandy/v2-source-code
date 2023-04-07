import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AuditProgramService } from 'src/app/core/services/internal-audit/audit-program/audit-program.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuditProgramMasterStore } from 'src/app/stores/internal-audit/audit-program/audit-program-store';
import { AuditableItemMasterStore } from 'src/app/stores/internal-audit/auditable-item/auditable-item-store';
import { AuditableItemService } from 'src/app/core/services/internal-audit/auditable-item/auditable-item.service';
import { AppStore } from 'src/app/stores/app.store';
import { HttpErrorResponse } from '@angular/common/http';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
declare var $: any;

@Component({
  selector: 'app-risk-ratings-list-modal',
  templateUrl: './risk-ratings-list-modal.component.html',
  styleUrls: ['./risk-ratings-list-modal.component.scss']
})
export class RiskRatingsListModalComponent implements OnInit {
  @Input('source') RiskRatingSource: any;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  AppStore= AppStore;
  AuditProgramMasterStore = AuditProgramMasterStore;
  AuditableItemMasterStore = AuditableItemMasterStore;
  showTotalAuditableItems:Boolean = false;
  allAuditableItems: boolean = false;
  auditableItemArray = [];
  auditableItemEmptyList = "Looks like we don't have any items added here!";
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  popupControlEventSubscription: any;
  auditableItemId=[];
  constructor(
    private _eventEmitterService:EventEmitterService,
    private _auditprogramService: AuditProgramService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _auditableItemService: AuditableItemService,
    private _helperService:HelperServiceService,
    ) { }

  ngOnInit(): void {
    if(this.RiskRatingSource){
      if(this.RiskRatingSource.value){
        let object = this.RiskRatingSource.value
        this.pageChange(object.id,object.riskRatingType)
      }
    }

    // for deleting  modal
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.deleteSelectedAuditableItems(item);
    })
  }

  auditableItems(newPage: number = null) {
    if (newPage) AuditableItemMasterStore.setCurrentPage(newPage);
    AuditableItemMasterStore.loaded = false;
    let params = `&audit_program_ids=${AuditProgramMasterStore.auditProgramId}`;
    let finalParams = params + `&remove_auditable_item_audit_program_auditor_id=${AuditProgramMasterStore.riskRateTypes[0].audit_program_auditor_id}`;
    this._auditableItemService.getItems(false,finalParams).subscribe(res=>{
      this.checkAuditableItemUpdation();
      this._utilityService.detectChanges(this._cdr);
    })
  }

  deleteSelectedAuditableItems(status){
    let object = this.RiskRatingSource.value
    let saveData = {
      "auditable_item_ids": this.auditableItemId,
     }
    if(status){
      this._auditprogramService.removeAuditableItem(this.popupObject.id,saveData).subscribe(res=>{
        
        this.pageChange(object.id,object.riskRatingType)
        this._utilityService.detectChanges(this._cdr);
      },(err: HttpErrorResponse) => {
                this.pageChange(object.id,object.riskRatingType)
        if (err.status == 422) {
          this._utilityService.showErrorMessage('Something went wrong!','');
        }
      });
    
    } 
    setTimeout(() => {
      this.auditableItemId = [];
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
  }

  deleteAuditableItems(id:number,auditorId){
    this.auditableItemId.push(id);
    event.stopPropagation();
      this.popupObject.type = '';
      this.popupObject.id = auditorId;
    this.popupObject.title = 'Delete Risk Ratings?';
    this.popupObject.subtitle = 'Are You Sure Want To Remove Auditable Item From Auditor ?';
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  checkAuditableItemUpdation(){
    if(AuditProgramMasterStore.riskRateTypes){
      let auditableItems = AuditProgramMasterStore.riskRateTypes;
      auditableItems.forEach(element => {
        for (let i = 0; i < AuditableItemMasterStore.allItems.length; i++) {
          const audit = AuditableItemMasterStore.allItems[i];
          
          if(audit.id == element.id){
            audit['is_enabled'] = true;
          }
        }
      });
      setTimeout(() => {
        this.getSelectedAuditableItem()
      }, 200);
      this._utilityService.detectChanges(this._cdr);
    }
  }

  pageChange(id,params){
    // if (newPage) AuditProgramMasterStore.setCurrentPage(newPage);
    // AuditProgramMasterStore.loaded = false;
    let finalParams='';
    if(params)finalParams = `?risk_rating=${params}`;
    if(params == 'na')finalParams = '';
    this._auditprogramService.getRiskRatingItem(id,finalParams).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  // Auditable Item selecting function
  selectAuditableItemPresent(event, auditableItem, index) {
    var itemCount = 0;
    if (event.target.checked) {
      AuditableItemMasterStore.allItems[index]['is_enabled'] = true;
      AuditableItemMasterStore.allItems.forEach(element => {
        if (element['is_enabled'] == false || !element.hasOwnProperty('is_enabled')) {
          itemCount++;
        }
      });
      this.auditableItemArray.push(AuditableItemMasterStore.allItems[index])
      if (itemCount == 0) {
        this.allAuditableItems = true;
      } else {
        this.allAuditableItems = false;
      }
    } else {

      AuditableItemMasterStore.allItems[index]['is_enabled'] = false;
      this.allAuditableItems = false;
    }
    // this.getSelectedAuditableItem();
  }

  // for checking all checkox
  checkAll(event) {
    if (event.target.checked) {
      AuditableItemMasterStore.allItems.forEach(element => {
        element['is_enabled'] = true;
      });
      this.allAuditableItems = true;
    } else {
      this.allAuditableItems = false;
      AuditableItemMasterStore.allItems.forEach(element => {
        element['is_enabled'] = false;
      });
    }

    this.getSelectedAuditableItem();

  }

  processingDataForSave(){
    var userArray = [];
    this.auditableItemArray.forEach(res=>{
      userArray.push(res.id)
    })
    return userArray;
  }

  // save function
  save(close: boolean = false){
    let saveData = {
     "auditable_item_ids": this.processingDataForSave(),
    }
     let save;
     AppStore.enableLoading();
       save = this._auditprogramService.updateAuditableItem(this.RiskRatingSource.value.id,saveData);
     
     save.subscribe((res: any) => {
       AppStore.disableLoading();
       this.auditableItemArray = [];
       setTimeout(() => {
         this._utilityService.detectChanges(this._cdr);
       }, 500);
       if (close) this.cancel();
     }, (err: HttpErrorResponse) => {
         AppStore.disableLoading();
         this._utilityService.detectChanges(this._cdr);
       
     });
 }

  getSelectedAuditableItem() {
    if (AuditableItemMasterStore.allItems.length > 0) {
      for (let i of AuditableItemMasterStore.allItems) {
        var pos = this.auditableItemArray.findIndex(e => e.id == i.id);
        if (i['is_enabled'] == true && pos == -1) {
          this.auditableItemArray.push(i);
        } else if (i['is_enabled'] == false && pos != -1) {
          this.auditableItemArray.splice(pos, 1);
        }
      }
    }
  }

  changeShowAuditableItems(){
    if(!this.showTotalAuditableItems){
      this.showTotalAuditableItems = true;
      this.auditableItems(1);
    }else{
      this.showTotalAuditableItems = false;
      let object = this.RiskRatingSource.value
        this.pageChange(object.id,object.riskRatingType)
    }
  }

  // cancel modal
  cancel() {
    let object = this.RiskRatingSource.value
    if(this.showTotalAuditableItems){
      this.pageChange(object.id,object.riskRatingType);
      this.showTotalAuditableItems = false;
      this._utilityService.detectChanges(this._cdr);
    }else{
      this._utilityService.detectChanges(this._cdr);
      this.closeFormModal();
    }
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  closeFormModal(){
    this._eventEmitterService.dismissRiskRatingListControlModal();
  }

  ngOnDestroy(){
    this.popupControlEventSubscription.unsubscribe()
  }
}
