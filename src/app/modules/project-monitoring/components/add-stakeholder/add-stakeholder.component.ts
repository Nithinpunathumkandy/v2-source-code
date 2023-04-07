import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Input, ChangeDetectorRef, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { StakeholdersListService } from 'src/app/core/services/organization/stakeholder/stakeholders-list/stakeholders-list.service';
import { ProjectMonitoringService } from 'src/app/core/services/project-monitoring/project-monitoring/project-monitoring.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { StakeholderTypeMasterStore } from 'src/app/stores/masters/organization/stakeholder-type-master.store';
import { StakeholdersStore } from 'src/app/stores/organization/stakeholders/stakeholders.store';
import { ProjectMonitoringStore } from 'src/app/stores/project-monitoring/project-monitoring.store';
import { StakeholderStore } from 'src/app/stores/project-monitoring/project-stakeholder-store';

@Component({
  selector: 'app-add-stakeholders',
  templateUrl: './add-stakeholder.component.html',
  styleUrls: ['./add-stakeholder.component.scss']
})
export class AddStakeholderComponent implements OnInit {
  @Input('source') StakeholderSource: any;
  @ViewChild('formModal', { static: true }) formModal: ElementRef;


  StakeholderStore = StakeholderStore;
  StakeholdersStore = StakeholdersStore;
	AppStore = AppStore;
	form: FormGroup;
	formErrors: any;
  stakeholderObject = {
    component: 'Master',
    type: null,
    values: null
  }
  stakeHolderSubscriptionEvent: any;

  constructor(
		private _formBuilder: FormBuilder,
		private _cdr: ChangeDetectorRef,
		private _eventEmitterService: EventEmitterService,
		private _utilityService: UtilityService,
		private _helperService: HelperServiceService,
    private _projectService : ProjectMonitoringService,
    private _stakeholderListService: StakeholdersListService,
    private _renderer2: Renderer2,
  ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
			// project_id : null,
			stakeholder_ids: ['', [Validators.required]],
    });
      // if(this.StakeholderSource.type =="Edit"){
      //   this.editData()
      // }
      this.stakeHolderSubscriptionEvent = this._eventEmitterService.modalChange.subscribe(res => {
        this.closeStakeholderMasteModal();
      })
      this.editData()

      this.getStakeholders()
    }

    getStakeholders(){
    //   if (newPage) StakeholderStore.setCurrentPage(newPage);

    this._stakeholderListService.getItems('&status=all').subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
    }

    editData(){
      this.form.patchValue({
        // project_id : this.StakeholderSource.value.projectId,
        stakeholder_ids: StakeholderStore.allItems
      })
      this._utilityService.detectChanges(this._cdr);

    }

    getEditValue(fields) {
      var returnValues = [];
      for (let i of fields) {  
          returnValues.push(i);
      }
      return returnValues;
    }

    processSaveData() {
      let saveData = {
        // project_id : ProjectMonitoringStore.selectedProjectId ,
        stakeholder_ids : this.form.value.stakeholder_ids ? this._helperService.getArrayProcessed(this.form.value.stakeholder_ids,'id') : null,
      }
      
      return saveData;
    }

    addStakeHolderMaster(){
      this.stakeholderObject.type = 'Add';
      this._utilityService.detectChanges(this._cdr);
      this.stakeholderMasterModal();
    }
   
  
    stakeholderMasterModal() {
      this._renderer2.addClass(this.formModal.nativeElement,'show');
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index','99999');
      this._renderer2.setStyle(this.formModal.nativeElement,'display','block');
      this._utilityService.detectChanges(this._cdr);
    }
  
    closeStakeholderMasteModal() {
      this.stakeholderObject.type = null;
      this._renderer2.removeClass(this.formModal.nativeElement,'show');
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index','9999');
      this._renderer2.setStyle(this.formModal.nativeElement,'display','none');
      this._utilityService.detectChanges(this._cdr);
      this.searchStakeholder({term : StakeholdersStore.lastInsertedId},true)
  
    }

    searchStakeholder(e,patchValue:boolean = false){
      this._stakeholderListService.getItems('&q=' + e.term).subscribe((res) => {
        if(patchValue){
          for(let i of res.data){
            if(StakeholderStore.allItems && i.id == e.term && this.form.value.stakeholder_ids){
              let obj = {
                id : i.id,
                title : i.title,
                data : []
              }
              StakeholderStore.allItems.push(obj)
              this.form.patchValue({ stakeholder_ids: StakeholderStore.allItems });
              break;
            }
            else if(i.id == e.term){
              this.form.patchValue({ stakeholder_ids: [i] });
              break;
            }
          }
          // _incidentDamageTypesService.lastIsertedId = null;
        }
        this._utilityService.detectChanges(this._cdr);
      });
    }

    save(close: boolean = false) {
      this.formErrors = null;
      if (this.form.valid) {
        let save;
        AppStore.enableLoading();
        if (this.StakeholderSource.type == "Edit") {
          save = this._projectService.updateStakeholder(this.processSaveData(), this.StakeholderSource.value.id);
        } else {
          save = this._projectService.saveStakeholder(this.processSaveData());
        }
        save.subscribe((res: any) => {
          if (!this.form.value.id) {
            this.resetForm();
          }
          AppStore.disableLoading();
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
          }, 500);
          if (close) this.cancel();
        }, (err: HttpErrorResponse) => {
          if (err.status == 422) {
            this.formErrors = err.error.errors;
          }
          else if (err.status == 500 || err.status == 403) {
            this.cancel();
          }
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
        });
      }
    }

    resetForm() {
      this.form.reset();
      this.formErrors = null;
    }

    cancel(){
      this._eventEmitterService.dismissProjectStakeholderModal();
     }

  getButtonText(text) {
		return this._helperService.translateToUserLanguage(text);
	}

  ngOnDestroy(){
    this.stakeHolderSubscriptionEvent.unsubscribe()
  }

}
