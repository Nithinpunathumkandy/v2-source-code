import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit , Input , ChangeDetectorRef, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventSpecificationService } from 'src/app/core/services/event-monitoring/events/event-specification/event-specification.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import{EventEquipmentMasterStore} from 'src/app/stores/masters/event-monitoring/event-equipment-store';
import { EventEquipmentService } from 'src/app/core/services/masters/event-monitoring/event-equipment/event-equipment.service';
import { AppStore } from 'src/app/stores/app.store';


@Component({
  selector: 'app-event-specification-modal',
  templateUrl: './event-specification-modal.component.html',
  styleUrls: ['./event-specification-modal.component.scss']
})
export class EventSpecificationModalComponent implements OnInit {
  
  @Input('source') SpecificationSource: any;
  @ViewChild('equipmentTypeAddformModal', { static: true }) equipmentTypeAddformModal: ElementRef;
  formErrors: any;
  form: FormGroup;
  selectedId: any = null;
  AppStore = AppStore;
  EventEquipmentMasterStore = EventEquipmentMasterStore;
  availabilityStatus = "yes"
  equipmentTypeObject = {
    component: 'Master',
    type: null,
    values: null
  };
  equipmentTypeSubscriptionEvent : any;

  constructor(
    private _eventSpecificationService : EventSpecificationService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _eventEquipmentService: EventEquipmentService,
    private _formBuilder: FormBuilder,
    private _renderer2:Renderer2
  ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: null,
      event_equipment_id: [null, [Validators.required, Validators.maxLength(255)]],
      availability_status: [null],
      comments: ['']
    });

    if(this.SpecificationSource.type == "Edit"){
      if(this.SpecificationSource.value.availability_status == 1){
        this.availabilityStatus = "yes"
      }else{
        this.availabilityStatus = "no"
      }
      this.setFormValues()
    }   
    if(this.SpecificationSource.type=='Edit'){
      this.setFormValues();
    }

    this.equipmentTypeSubscriptionEvent = this._eventEmitterService.eventEquipment.subscribe(res=>{
      this.closeEquipmentTypeMasterModal();
    });
    console.log(this.processSaveData());

  }

  save(close: boolean = false) {
    this.formErrors = null;
      let save;
      AppStore.enableLoading();
      if (this.SpecificationSource.type == "Edit" || this.form.value.id) {
        let id = this.selectedId ? this.selectedId : this.SpecificationSource.value.id
        save = this._eventSpecificationService.updateItem(this.processSaveData(), id);
      } else {
        save = this._eventSpecificationService.saveItem(this.processSaveData());
      }
      save.subscribe((res: any) => {
        if (!this.form.value.id) {
          this.resetForm();
        }
        this.getSpecificationList()
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.closeFormModal();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
        }
        else if (err.status == 500 || err.status == 403) {
          this.closeFormModal();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      });
      
      console.log(this.form.value);
      console.log(this.processSaveData());
      
  }

  processSaveData() {
    let saveData = {
      comments : this.form.value.comments ? this.form.value.comments : null,
      availability_status : this.availabilityStatus == "yes" ? 1 : 0,
      event_equipment_id : this.form.value.event_equipment_id ? this.form.value.event_equipment_id : null,
      
      
    }
    
    return saveData;
  }

  closeFormModal() {

    this.resetForm();
    this._eventEmitterService.dismissEventSpecificationModal();

  }

  resetForm() {
    this.form.reset();
    this.formErrors = null;
    this.selectedId == null
    AppStore.disableLoading();

  }

  getSpecificationList(){
    this._eventSpecificationService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  openEquipmentType(){
    this.equipmentTypeObject.type = 'Add';
    this._utilityService.detectChanges(this._cdr);
    this.equipmentTypeMasterModal();
  }

  equipmentTypeMasterModal() {
    this._renderer2.addClass(this.equipmentTypeAddformModal.nativeElement,'show');
    this._renderer2.setStyle(this.equipmentTypeAddformModal.nativeElement,'z-index','99999');
    this._renderer2.setStyle(this.equipmentTypeAddformModal.nativeElement,'display','block');
    this._utilityService.detectChanges(this._cdr);
  }

  closeEquipmentTypeMasterModal() {
    this.equipmentTypeObject.type = null;
    this._renderer2.removeClass(this.equipmentTypeAddformModal.nativeElement,'show');
    this._renderer2.setStyle(this.equipmentTypeAddformModal.nativeElement,'z-index','9999');
    this._renderer2.setStyle(this.equipmentTypeAddformModal.nativeElement,'display','none');
    this._utilityService.detectChanges(this._cdr);
    this.searchEventEquipment({term : EventEquipmentMasterStore.lastInsertedEventEquipment})
    

  }

  cancel(){
    this._eventEmitterService.dismissEventSpecificationModal();
   }

   getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  
  getEventEquipment() {

    this._eventEquipmentService.getItems().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  searchEventEquipment(event) {

    this._eventEquipmentService.getItems(false,'q='+event.term).subscribe(res => {
      this.form.patchValue({event_equipment_id:EventEquipmentMasterStore.lastInsertedEventEquipment});
        this.getEventEquipment();
        this._utilityService.detectChanges(this._cdr);
    });
  }

  setFormValues() {
    if (this.SpecificationSource.value) {     
      let { comments, equipment_required } = this.SpecificationSource.value
      this.form.patchValue({
        comments: this.SpecificationSource.value.comments ? this.SpecificationSource.value.comments : '',
        event_equipment_id: this.SpecificationSource.value.event_equipment ? this.processEventSpecification(this.SpecificationSource.value.event_equipment) : null,
      })
      

    }
  }

  processEventSpecification(eventSpecification){
    let formattedSpecification = {
      id: eventSpecification.id,
      status_id: eventSpecification.status_id,
      event_equipment_title: eventSpecification.language[0].pivot.title
    }
    return formattedSpecification;
  }

  changeStatus(event){
    this.availabilityStatus = event
  }
}
