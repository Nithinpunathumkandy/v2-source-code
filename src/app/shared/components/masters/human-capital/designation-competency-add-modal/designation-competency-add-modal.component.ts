import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, Renderer2, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { CompetencyGroupService } from 'src/app/core/services/masters/human-capital/competency-group/competency-group.service';
import { CompetencyService } from 'src/app/core/services/masters/human-capital/competency/competency.service';
import { DesignationService } from 'src/app/core/services/masters/human-capital/designation/designation.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { CompetencyGroupMasterStore } from 'src/app/stores/masters/human-capital/competency-group-master.store';
import { CompetencyMasterStore } from 'src/app/stores/masters/human-capital/competency-master.store';
declare var $: any;
@Component({
  selector: 'app-designation-competency-add-modal',
  templateUrl: './designation-competency-add-modal.component.html',
  styleUrls: ['./designation-competency-add-modal.component.scss']
})
export class DesignationCompetencyAddModalComponent implements OnInit {
  @ViewChild('groupModal') groupModal: ElementRef;
  @ViewChild('competencyAddModal') competencyAddModal: ElementRef;
  @Input('source') competencyAddSource: any;
  AppStore = AppStore;
  competencyForm: FormGroup;
  competencyArray = {
    competencies: []
  };
  CompetencyGroupMasterStore = CompetencyGroupMasterStore;
  CompetencyMasterStore = CompetencyMasterStore;
  competencyObject = {
    component: 'Master',
    values: null,
    type: null
  };

  competencyGroupObject = {
    component: 'Master',
    values: null,
    type: null
  };
  formErrors = null;
  competencyGroupSubscriptionEvent: any = null;
  competencySubscriptionEvent: any = null;
  duplicate = null;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  msg: any;

  constructor(private _formBuilder: FormBuilder,
    private _competencyGroupService: CompetencyGroupService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _eventEmitterService: EventEmitterService,
    private _competencyService: CompetencyService,
    private _designationService: DesignationService) { }

  ngOnInit(): void {
    this.competencyForm = this._formBuilder.group({
      competency_group_id: [null],
      competency_id: [null],
      required: ['']
    });

    this.competencyGroupSubscriptionEvent = this._eventEmitterService.competencyGroupControl.subscribe(res => {
      this.closeCompetencyGroupModal();
    })

    // for closing the modal
    this.competencySubscriptionEvent = this._eventEmitterService.competencyControl.subscribe(res => {
      this.closeAddCompetencyModal();
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
      if (!status) {
        this.processZIndex();
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
      if (!status) {
        this.processZIndex();
      }
    })



  }

  processZIndex() {

    if ($(this.competencyAddModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.competencyAddModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.competencyAddModal.nativeElement, 'overflow', 'auto');
    }
    else if ($(this.groupModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.groupModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.groupModal.nativeElement, 'overflow', 'auto');
    }
  }

  closeCompetencyModal() {
    AppStore.disableLoading();
    this.competencyForm.reset();
    this.competencyArray.competencies = [];
    this._eventEmitterService.dismissHumanCapitalDesignationCompetencyAddControlModal();
    // this.getCompetency();

  }
  openCompetencyGroupModal() {
    this.competencyGroupObject.type = 'add';
    this.formErrors = null;
    AppStore.disableLoading();

    $(this.groupModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.groupModal.nativeElement, 'z-index', '99999');
    this._renderer2.setStyle(this.groupModal.nativeElement, 'display', 'block');
    // this._renderer2.setStyle(this.groupModal.nativeElement, 'overflow', 'auto');
  }

  closeCompetencyGroupModal() {
    this.competencyGroupObject.type = null;

    $(this.groupModal.nativeElement).modal('hide');
    // this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '9999999');
    this._renderer2.setStyle(this.groupModal.nativeElement, 'z-index', '9999');
    this._renderer2.setStyle(this.groupModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
    if (CompetencyGroupMasterStore.lastInsertedId) {
      this._competencyGroupService.getItems(false, 'q=' + CompetencyGroupMasterStore.lastInsertedId).subscribe(res => {
        this.competencyForm.patchValue({
          competency_group_id: CompetencyGroupMasterStore.lastInsertedId
        })
        this._utilityService.detectChanges(this._cdr);
      })

    }
  }

  getCompetencyGroups() {
    this._competencyGroupService.getItems().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  getCompetencies() {
    let params = '';
    if (this.competencyForm.value.competency_group_id) {
      params = 'competency_group_ids=' + this.competencyForm.value.competency_group_id
    }
    if (this.competencyAddSource.values.displayArray.length > 0) {
      if (params) params = params + '&selected_ids=' + this.getSelectedCompetency();
      else params = 'selected_ids=' + this.getSelectedCompetency();
    }
    this._competencyService.getItems(false, (params ? params : null)).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  getSelectedCompetency() {
    let selectedArray = [];
    for (let i of this.competencyAddSource.values.displayArray) {
      selectedArray.push(i.competency.id);
    }
    return selectedArray;
  }


  searchCompetencyGroups(e) {
    let params = '';
    if (this.competencyForm.value.competency_group_id) {
      params = '&competency_group_ids=' + this.competencyForm.value.competency_group_id
    }
    this._competencyGroupService.getItems(false, 'q=' + e.term + params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

  }


  closeAddCompetencyModal() {
    let id = null
    $(this.competencyAddModal.nativeElement).modal('hide');
    this.competencyObject.type = null;

    // this._renderer2.setStyle(this.competencyAddModal.nativeElement, 'z-index', '9999');
    this._renderer2.setStyle(this.competencyAddModal.nativeElement, 'display', 'none');
    // $('.modal-backdrop').remove();

    // this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '9999999');

    if (CompetencyMasterStore.lastInsertedId) {
      this._competencyService.getItems(false, 'q=' + CompetencyMasterStore.lastInsertedId).subscribe(res => {
        for (let i of res['data']) {
          if (i.id == CompetencyMasterStore.lastInsertedId) {
            id = i;
          }
        }
        this.competencyForm.patchValue({
          competency_id: id
        })
        this._utilityService.detectChanges(this._cdr);
      })

    }


  }


  openAddCompetencyModal() {
    this.competencyObject.type = 'add';
    this.formErrors = null;
    AppStore.disableLoading();

    $(this.competencyAddModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.competencyAddModal.nativeElement, 'z-index', '99999');
    this._renderer2.setStyle(this.competencyAddModal.nativeElement, 'display', 'block');
    // this._renderer2.setStyle(this.competencyAddModal.nativeElement, 'overflow', 'auto');
  }

  saveCompetency(close: boolean = false) {

    this.formErrors = null;

    for (let i of this.competencyAddSource.values.displayArray) {
      this.competencyArray.competencies.push({ competency_id: i.competency.id, required: i.required })
    }
    AppStore.enableLoading();

    this._designationService.updateCompetency(this.competencyAddSource.values.designation_id, this.competencyArray)
      .subscribe((res: any) => {
        this.competencyForm.reset();
        this.competencyForm.markAsPristine();
        this.competencyArray.competencies = [];
        this._utilityService.detectChanges(this._cdr);
        AppStore.disableLoading();
        if (close) this.closeCompetencyModal();
      }, (err: HttpErrorResponse) => {
        AppStore.disableLoading();
        // this.competencyForm.markAsPristine();
        this.competencyArray.competencies = [];
        if (err.status == 422) {
          this.formErrors = err.error.errors;
        }
        else if(err.status == 500 || err.status == 403){
          this.closeCompetencyModal();
        }
        this._utilityService.detectChanges(this._cdr);
      });

  }

  getRequired() {
    this.msg = null;
    if(this.competencyForm.value.required < 0 || this.competencyForm.value.required > 10) {
      this.msg = "Only allow values between 1 to 10";
    }
  }


  pushCompetency() {
    this.isDuplicate(this.competencyForm.value.competency_id.id);
    if (this.duplicate == null) {
      this.competencyAddSource.values.displayArray.push({ competency: this.competencyForm.value.competency_id, required: this.competencyForm.value.required });
      this.competencyForm.controls['required'].reset();
      this.competencyForm.controls['competency_id'].reset();
    }

  }


  removeOption(index) {
    this.competencyAddSource.values.displayArray.splice(index, 1);
  }


  isDuplicate(id) {
    this.duplicate = null
    for (let i of this.competencyAddSource.values.displayArray) {
      if (i.competency.id == id) {
        this.duplicate = 'Competency already added';
      }
      if (this.duplicate != null) {
        break;
      }
    }
  }



  searchCompetencies(e) {
    let params = '';
    if (this.competencyForm.value.competency_group_id) {
      params = '&competency_group_ids=' + this.competencyForm.value.competency_group_id
    }

    this._competencyService.getItems(false, 'q=' + e.term + (params ? params : '')).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

  }

  ngOnDestroy() {
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.competencyGroupSubscriptionEvent.unsubscribe();
    this.competencySubscriptionEvent.unsubscribe();
  }

}
