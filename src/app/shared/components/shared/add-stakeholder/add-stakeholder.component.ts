import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StakeholderService } from 'src/app/core/services/masters/organization/stakeholder/stakeholder.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AppStore } from 'src/app/stores/app.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { StakeholderTypeMasterStore } from "src/app/stores/masters/organization/stakeholder-type-master.store";
import { IssueListService } from "src/app/core/services/organization/context/issue-list/issue-list.service";
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-add-stakeholder',
  templateUrl: './add-stakeholder.component.html',
  styleUrls: ['./add-stakeholder.component.scss']
})
export class AddStakeholderComponent implements OnInit {

  form: FormGroup;
  formErrors: any;
  AppStore = AppStore;
  StakeholderTypeMasterStore = StakeholderTypeMasterStore;
  stakeHolderTypeId: number;

  constructor(private _formBuilder: FormBuilder,
    private _stakeholderService: StakeholderService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, 
    private _eventEmitterService: EventEmitterService,
    private _issueListService: IssueListService,
    private _helperService: HelperServiceService) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      stakeholder_type_id : ['',[Validators.required]],
      description: ['']
    });
  }

  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.valid) {
      this.stakeHolderTypeId=JSON.parse(JSON.stringify(this.form.value.stakeholder_type_id));
      let save;
      AppStore.enableLoading();
      if (this.form.value.id) {
        save = this._stakeholderService.updateItem(this.form.value.id, this.form.value);
      } else {
        save = this._stakeholderService.saveItem(this.form.value,true);
      }
      save.subscribe((res: any) => {
        this._issueListService.setStakeHolderType(StakeholderTypeMasterStore.getTypeById(this.form.value.stakeholder_type_id));
        AppStore.disableLoading();
        if(!this.form.value.id)
          this.resetForm();
        if (close) this.closeFormModal();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
          AppStore.disableLoading();
        }
      });
    }
  }

  closeFormModal(){
    if(!this.stakeHolderTypeId) this.stakeHolderTypeId = this.form.value.stakeholder_type_id;
    this._eventEmitterService.dismissStakeHolderModal();
    this._eventEmitterService.setStakeHolderType(this.stakeHolderTypeId)
  }

  cancel(){
    this.closeFormModal();
  }

  resetForm(){
    this.form.setValue({
      id:'',
      title: '',
      stakeholder_type_id: '',
      description: ''
    });
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
  }
//getting button name by language
getButtonText(text){
  return this._helperService.translateToUserLanguage(text);
}
}
