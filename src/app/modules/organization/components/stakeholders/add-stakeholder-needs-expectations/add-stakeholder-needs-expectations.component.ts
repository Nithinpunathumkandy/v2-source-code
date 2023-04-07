import { Component, OnInit, ChangeDetectorRef, Input, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppStore } from "src/app/stores/app.store";
import { UtilityService } from "src/app/shared/services/utility.service";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";

import { NeedsandexpectationsService } from "src/app/core/services/masters/organization/needsandexpectations/needsandexpectations.service";
import { NeedsExpectationsStore } from "src/app/stores/masters/organization/needs-expectations.store";
import { StakeholderDetailsService } from "src/app/core/services/organization/stakeholder/stakeholder-details/stakeholder-details.service";
import { HttpErrorResponse } from '@angular/common/http';
import { StakeholderDetailsStore } from 'src/app/stores/organization/stakeholders/stakeholder-details.store';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

declare var $: any;

@Component({
  selector: 'app-add-stakeholder-needs-expectations',
  templateUrl: './add-stakeholder-needs-expectations.component.html',
  styleUrls: ['./add-stakeholder-needs-expectations.component.scss']
})
export class AddStakeholderNeedsExpectationsComponent implements OnInit {

  @Input('source') stakeholderDetails:any;
  @ViewChild('needsExpectationsDiv',{static:false}) needsExpectationsDiv: ElementRef;
  form: FormGroup;
  formErrors: any;
  needAndExpectations:any = null;
  needExpectationFormSubscriptioncloseEvent = null;
  selectedNeedExpectations:Array<{title:string,id: number}> = [];
  AppStore = AppStore;
  NeedsExpectationsStore = NeedsExpectationsStore;
  constructor(private _formBuilder: FormBuilder, private _needsExpectationService: NeedsandexpectationsService,
    private _cdr: ChangeDetectorRef, private _utilityService: UtilityService, private _eventEmitterService: EventEmitterService,
    private _stakeholderDetailsService: StakeholderDetailsService, private _helperService: HelperServiceService) { }

  ngOnInit(): void {
    this.selectedNeedExpectations = [];
    this.setExistingNeedsAndExpectations();
    this.getNeedsAndExpectations();
    this.needExpectationFormSubscriptioncloseEvent = this._eventEmitterService.modalChange.subscribe(res=>{
      if(res == 6)
        this.setNeedExpectationsValue();
    })
  }

  getNeedsAndExpectations(){
    this._needsExpectationService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  addNeedsExpectations(){
    let pos = this.selectedNeedExpectations.findIndex(e=>e.id == this.needAndExpectations.id);
    if(pos == -1){
      this.selectedNeedExpectations.push({
        title: this.needAndExpectations.title,
        id: this.needAndExpectations.id
      })
    }
    this.needAndExpectations = null;
    this.checkForScrollbar();
  }

  searchNeedsAndExpectations(e,status:boolean = false){
    this._needsExpectationService.getItems('&q='+e.term).subscribe(res=>{
      if(status)
        this.needAndExpectations = res.data[0];
      this._utilityService.detectChanges(this._cdr);
    })
  }

  setNeedExpectationsValue(){
    if(NeedsExpectationsStore.lastInsertedId)
    this.searchNeedsAndExpectations({term: NeedsExpectationsStore.lastInsertedId},true)
  }

  save(close: boolean = false){
    if(this.selectedNeedExpectations.length > 0){
      AppStore.enableLoading();
      let formData = this.createFormData();
      let save = this._stakeholderDetailsService.addStakeholderNeedsAndExpectaions(formData,this.stakeholderDetails.stakeholder_id);
      save.subscribe(res=>{
        AppStore.disableLoading();
        if(close)
          this.closeFormModal();
        this.selectedNeedExpectations = [];
        this._utilityService.detectChanges(this._cdr);
      }, (err: HttpErrorResponse) => {
        AppStore.disableLoading();
        if (err.status == 422) {
          this.formErrors = err.error.errors;
        }
        this._utilityService.detectChanges(this._cdr);
      })
    }
  }

  cancel(){
    this.closeFormModal();
  }

  closeFormModal(){
    this.selectedNeedExpectations = [];
    this._eventEmitterService.closeStakeholderNeedsAndExpectationModal();
  }

  addNeedsExpectation(){
    this._eventEmitterService.openStakeholderNeedExpectationFormModal(true);
  }

  // removeNeedExp(index) {
	// 	this.selectedNeedExpectations.splice(index, 1);
	// }

  createFormData(){
    var needsArray = [];
    // for(let i of this.selectedNeedExpectations){
    //   needsArray.push(i.id);
    // }
    needsArray = this.findDifference();
    var returnData = {
      "stakeholders": [
          {
            "stakeholder_id":this.stakeholderDetails.stakeholder_id,
            "need_and_expectation_ids": needsArray
          }
      ] 
    };
    return returnData;
  }

  findDifference(){
    let originalData = [];
    let newData = [];
    StakeholderDetailsStore.stakeholderNeedsAndExpectations.forEach(e=>{
      originalData.push(e.need_and_expectation_id);
    })
    this.selectedNeedExpectations.forEach(e=>{
      newData.push(e.id);
    })
    let difference = newData.filter(x => !originalData.includes(x));
    return difference;
  }

  setExistingNeedsAndExpectations(){
    // console.log(StakeholderDetailsStore.stakeholderNeedsAndExpectations);
    for(let i of StakeholderDetailsStore.stakeholderNeedsAndExpectations){
      if(!i.process_id && !i.organization_issue_id)
        this.selectedNeedExpectations.push({title: i.need_and_expectation_title, id: i.need_and_expectation_id });
    }
    this.checkForScrollbar();
    this._utilityService.detectChanges(this._cdr);
  }

  checkForScrollbar(){
    setTimeout(() => {
      if($(this.needsExpectationsDiv?.nativeElement).height() >= 150){
        $(this.needsExpectationsDiv.nativeElement).mCustomScrollbar();
      }
      else{
        $(this.needsExpectationsDiv?.nativeElement).mCustomScrollbar("destroy");
      }
    }, 250);
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

}
