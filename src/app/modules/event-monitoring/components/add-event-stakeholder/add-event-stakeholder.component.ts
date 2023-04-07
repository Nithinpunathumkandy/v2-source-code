import { ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { toJS } from 'mobx';
import { AppStore } from 'src/app/stores/app.store';
import * as myCkEditor from 'src/assets/build/ckeditor';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { StakeholdersStore } from "src/app/stores/organization/stakeholders/stakeholders.store";
import { SupportivesMasterStore } from 'src/app/stores/masters/event-monitoring/supportives-store';
import { NeedsExpectationsStore } from 'src/app/stores/masters/organization/needs-expectations.store';
import { CommunicationMasterStore } from 'src/app/stores/masters/event-monitoring/communication-store';
import { EventStakeholderStore } from 'src/app/stores/event-monitoring/events/event-stakeholder-store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { EventInfluenceMasterStore } from 'src/app/stores/masters/event-monitoring/event-influence-store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { SupportivesService } from 'src/app/core/services/masters/event-monitoring/supportives/supportives.service';
import { ProjectContractTypeMasterStore } from 'src/app/stores/masters/project-monitoring/project-contract-type-store';
import { CommunicationService } from 'src/app/core/services/masters/event-monitoring/communication/communication.service';
import { EventStakeholderService } from 'src/app/core/services/event-monitoring/event-stakeholder/event-stakeholder.service';
import { EventEngagementStrategyMasterStore } from 'src/app/stores/masters/event-monitoring/event-engagement-strategy-store';
import { EventInfluenceService } from 'src/app/core/services/masters/event-monitoring/event-influence/event-influence.service';
import { StakeholdersListService } from "src/app/core/services/organization/stakeholder/stakeholders-list/stakeholders-list.service";
import { NeedsandexpectationsService } from 'src/app/core/services/masters/organization/needsandexpectations/needsandexpectations.service';
import { ProjectContractTypeService } from 'src/app/core/services/masters/project-monitoring/project-contract-type/project-contract-type.service';
import { EventEngagementStrategyService } from 'src/app/core/services/masters/event-monitoring/event-engagement-strategy/event-engagement-strategy.service';

@Component({
  selector: 'app-add-event-stakeholder',
  templateUrl: './add-event-stakeholder.component.html',
  styleUrls: ['./add-event-stakeholder.component.scss']
})
export class AddEventStakeholderComponent implements OnInit, OnDestroy {

  @Input('source') source
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('contractTypeformModal', { static: true }) contractTypeformModal: ElementRef;
  @ViewChild('engagementFormModal', { static: true }) engagementFormModal: ElementRef;
  @ViewChild('communicationFormModal', { static: true }) communicationFormModal: ElementRef;


  alreayItem: boolean = false;
  contractFlag:boolean = true
  alreayCommunication: boolean = false;
  stakeholderObject = {
    component: 'Master',
    type: null,
    values: null
  }
  projectContractTypeObject = {
    component: 'Master',
    type: null,
    values: null
  }
  eventEngagementStrategyObject = {
    component: 'Master',
    type: null,
    values: null
  }
  communicationObject = {
    component: 'Master',
    type: null,
    values: null
  }
  eventEngagementStratergySubscriptionEvent : any;
  stakeHolderSubscriptionEvent: any;
  projectContractTypeSubscriptionEvent: any;
  communicationSubscriptionEvent : any;
  public Editor;
  form: FormGroup;
  formErrors: any;
  AppStore = AppStore
  StakeholdersStore = StakeholdersStore;
  EventStakeholderStore = EventStakeholderStore
  SupportivesMasterStore = SupportivesMasterStore;
  NeedsExpectationsStore = NeedsExpectationsStore;
  CommunicationMasterStore = CommunicationMasterStore;
  EventInfluenceMasterStore = EventInfluenceMasterStore;
  ProjectContractTypeMasterStore = ProjectContractTypeMasterStore;
  EventEngagementStrategyMasterStore = EventEngagementStrategyMasterStore;

  furtherAction = "yes"

  constructor(
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _supportivesService: SupportivesService,
    private _eventEmitterService: EventEmitterService,
    private _communicationService: CommunicationService,
    private _eventInfluenceService: EventInfluenceService,
    private _eventStakeholderService: EventStakeholderService,
    private _stakeholderListService: StakeholdersListService,
    private _needExpectationService: NeedsandexpectationsService,
    private _projectContractTypeService: ProjectContractTypeService,
    private _eventEngagementStrategyService: EventEngagementStrategyService,
    private _renderer2: Renderer2,
  ) { this.Editor = myCkEditor; }

  public onReady(editor: any) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: [''],
      event_id: [],
      stakeholder_id: [null, [Validators.required]],
      is_contracted: [],
      contract_type_id: [],
      event_stakeholder_communications: null,
      communication_channel_ids: [[], [Validators.required]],
      event_stakeholder_need_and_expectation_ids: [null, [Validators.required]],
      feedback: [''],
      description: [''],
      event_supportive_id: [null, [Validators.required]],
      engagement_strategy_id: [null, [Validators.required]],
      event_influence_id: [null, [Validators.required]],
    });

    if (this.source.type == 'Edit') {
      if (this.source.values?.is_contracted == 1) {
        this.furtherAction = "yes"
      } else {
        this.furtherAction = "no"
      }
      this.setFormValues()
    }
    this.stakeHolderSubscriptionEvent = this._eventEmitterService.modalChange.subscribe(res => {
      this.closeStakeholderMasteModal();
    })
    this.projectContractTypeSubscriptionEvent = this._eventEmitterService.projectContractType.subscribe(res=>{
      this.closeContractTypeMasteModal();
    });
    this.eventEngagementStratergySubscriptionEvent = this._eventEmitterService.eventEngagementStratergy.subscribe(res=>{
      this.closeEngagementModal();
    })
    this.communicationSubscriptionEvent = this._eventEmitterService.communication.subscribe(res=>{
      this.closeCommunicationModal();
    })
  }

  setFormValues() {
    console.log( this.source.values);
    console.log(this.form.value);
    
    this.getCommunication()
    this.getContractType()
    this.getEngagement()
    this.getInfluence()
    this.getStakeholder()
    this.getSupportive()
    this.setCommunication()
    this.getNeedsExpectation()
    this.form.patchValue({
      id: this.source.values.id,
      event_id: EventsStore?.selectedEventId,
      stakeholder_id: this.source.values.stakeholder ? this.source.values?.stakeholder?.id : null,
      is_contracted: this.furtherAction == "yes" ? 1 : 0,
      contract_type_id: this.source.values?.contract_type ? this.source.values?.contract_type : null,      
      communication_channel_ids: this._helperService.getArrayProcessed(this.source.values?.communication_channels,  'id'),
      feedback: this.source.values?.feedback ? this.source.values?.feedback : '',
      description: this.source.values?.description ? this.source.values?.description : '',
      event_supportive_id: this.source.values?.event_supportive ? this.source.values?.event_supportive : null,
      engagement_strategy_id: this.source.values?.engagement_strategy ? this.source.values?.engagement_strategy?.id : null,
      event_influence_id: this.source.values?.event_influence ? this.source.values?.event_influence : null,
      event_stakeholder_need_and_expectation_ids: this.source.values?.event_stakeholder_need_and_expectation ? this.source.values?.event_stakeholder_need_and_expectation : null,
    })
  }

  addCommunication() {
    if (EventStakeholderStore._communications.length > 0) {
      let pos = EventStakeholderStore._communications.findIndex(e => e.title === this.form.value.event_stakeholder_communications)
      if (pos == -1) {
        EventStakeholderStore._communications.push({ title: this.form.value.event_stakeholder_communications });
        this.form.patchValue({ event_stakeholder_communications: '' });
        this.alreayCommunication = false;
      } else {
        this.alreayCommunication = true;
      }
    } else {
      EventStakeholderStore._communications.push({ title: this.form.value.event_stakeholder_communications });
      this.form.patchValue({ event_stakeholder_communications: '' });
    }
  }

  deleteCommunication(index) {
    EventStakeholderStore._communications.splice(index, 1);
  }

  setCommunication() {
    EventStakeholderStore._communications = []
    for (let i of toJS(EventStakeholderStore.IndividualStakeholderDetails?.event_stakeholder_communication)) {
      EventStakeholderStore._communications.push(i);
    }
  }

  save(close: boolean = false) {
    let save;
    if (this.form.value.id) {
      save = this._eventStakeholderService.updateItem(this.form.value.id, this.getSaveData());
    }
    else {
      save = this._eventStakeholderService.saveItem(this.getSaveData());
    }
    save.subscribe(res => {
      AppStore.disableLoading();
      this.resetForm();
      if (close) this.cancel();
      this._utilityService.detectChanges(this._cdr);
    }, (err: HttpErrorResponse) => {
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
      if (err.status == 422) {
        this.formErrors = err.error.errors;
        this._utilityService.detectChanges(this._cdr);
      }
    })
    console.log(this.getSaveData());
    console.log(this.form.value);
    
  }

  getSaveData() {
    
    
    let saveData = {
      id: this.form.value?.id ? this.form.value.id : null,
      event_id: EventsStore?.selectedEventId,
      stakeholder_id: this.form.value.stakeholder_id? this.form.value.stakeholder_id: null,
      is_contracted: this.furtherAction == "yes" ? 1 : 0,
      contract_type_id: this.form.value.contract_type_id?.id ? this.form.value.contract_type_id?.id : null,
      event_stakeholder_communications: EventStakeholderStore._communications,
      communication_channel_ids:this.form.value.communication_channel_ids,      
      feedback: this.form.value?.feedback ? this.form.value?.feedback : '',
      description: this.form.value?.description ? this.form.value?.description : '',
      event_supportive_id: this.form.value.event_supportive_id?.id ? this.form.value.event_supportive_id?.id : null,
      engagement_strategy_id: this.form.value.engagement_strategy_id? this.form.value.engagement_strategy_id : null,
      event_influence_id: this.form.value.event_influence_id?.id ? this.form.value.event_influence_id?.id : null,
      event_stakeholder_need_and_expectation_ids: this._helperService.getArrayProcessed(this.form.value.event_stakeholder_need_and_expectation_ids, 'id'),
    }
    return saveData
  }

  changeStatus(event) {
    this.furtherAction = event
    if(event=='yes'){
      this.contractFlag=true
    }else{
      this.contractFlag=false
    }
  }

  descriptionValueChange(event) {
    this._utilityService.detectChanges(this._cdr);
  }

  getDescriptionLength() {
    var regex = /(<([^>]+)>)/ig;
    var result = this.form.value.description.replace(regex, "");
    return result.length;
  }

  getStakeholder() {
    this._stakeholderListService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr)
    });
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
      this.form.patchValue({stakeholder_id:StakeholdersStore.lastInsertedId});
        this.getStakeholder();
        this._utilityService.detectChanges(this._cdr);
    });
  }

  // searchStakeholder(event) {
  //   this._stakeholderListService.getItems('&q=' + event.term).subscribe(res => {
  //     this._utilityService.detectChanges(this._cdr)
  //   });
  // }

  getNeedsExpectation() {
    this._needExpectationService.getItems(null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  searchNeedsExpectation(event) {
    this._needExpectationService.getItems('&q=' + event.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr)
    });
  }

  getContractType() {
    this._projectContractTypeService.getItems(true).subscribe(res => {
      this._utilityService.detectChanges(this._cdr)
    });
  }

  addNewContractType(){
    this.projectContractTypeObject.type = 'Add';
    this._utilityService.detectChanges(this._cdr);
    this.contractTypeMasterModal();
  }

  contractTypeMasterModal() {
    this._renderer2.addClass(this.contractTypeformModal.nativeElement,'show');
    this._renderer2.setStyle(this.contractTypeformModal.nativeElement,'z-index','99999');
    this._renderer2.setStyle(this.contractTypeformModal.nativeElement,'display','block');
    this._utilityService.detectChanges(this._cdr);
  }

  closeContractTypeMasteModal() {
    this.projectContractTypeObject.type = null;
    this._renderer2.removeClass(this.contractTypeformModal.nativeElement,'show');
    this._renderer2.setStyle(this.contractTypeformModal.nativeElement,'z-index','9999');
    this._renderer2.setStyle(this.contractTypeformModal.nativeElement,'display','none');
    this._utilityService.detectChanges(this._cdr);
    this.searchContractType({term : ProjectContractTypeMasterStore.lastInsertedProjectContractType})

  }

  searchContractType(event) {
    this._projectContractTypeService.getItems(false, '&q=' + event.term).subscribe(res => {
      this.form.patchValue({contract_type_id:ProjectContractTypeMasterStore.lastInsertedProjectContractType});
        this.getContractType();
        this._utilityService.detectChanges(this._cdr);
    });
  }

  getCommunication() {
    this._communicationService.getItems(true).subscribe(res => {
      this._utilityService.detectChanges(this._cdr)
    });
  }

  addNewCommunication(){
    this.communicationObject.type = 'Add';
    this._utilityService.detectChanges(this._cdr);
    this.CommunicationMasterModal();
  }

  CommunicationMasterModal() {
    this._renderer2.addClass(this.communicationFormModal.nativeElement,'show');
    this._renderer2.setStyle(this.communicationFormModal.nativeElement,'z-index','99999');
    this._renderer2.setStyle(this.communicationFormModal.nativeElement,'display','block');
    this._utilityService.detectChanges(this._cdr);
  }

  closeCommunicationModal() {
    this.communicationObject.type = null;
    this._renderer2.removeClass(this.communicationFormModal.nativeElement,'show');
    this._renderer2.setStyle(this.communicationFormModal.nativeElement,'z-index','9999');
    this._renderer2.setStyle(this.communicationFormModal.nativeElement,'display','none');
    this._utilityService.detectChanges(this._cdr);
    this.searchCommunication({term : CommunicationMasterStore.lastInsertedCommunication})

  }

  searchCommunication(event) {
    this._communicationService.getItems(false, '&q=' + event.term).subscribe(res => {
      this.form.patchValue({communication_channel_ids:CommunicationMasterStore.lastInsertedCommunication});
        this.getCommunication();
        this._utilityService.detectChanges(this._cdr);
    });
  }

  getEngagement() {
    this._eventEngagementStrategyService.getItems(true).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  addNewEngagement(){
    this.eventEngagementStrategyObject.type = 'Add';
    this._utilityService.detectChanges(this._cdr);
    this.EngagementMasterModal();
  }

  EngagementMasterModal() {
    this._renderer2.addClass(this.engagementFormModal.nativeElement,'show');
    this._renderer2.setStyle(this.engagementFormModal.nativeElement,'z-index','99999');
    this._renderer2.setStyle(this.engagementFormModal.nativeElement,'display','block');
    this._utilityService.detectChanges(this._cdr);
  }

  closeEngagementModal() {
    this.eventEngagementStrategyObject.type = null;
    this._renderer2.removeClass(this.engagementFormModal.nativeElement,'show');
    this._renderer2.setStyle(this.engagementFormModal.nativeElement,'z-index','9999');
    this._renderer2.setStyle(this.engagementFormModal.nativeElement,'display','none');
    this._utilityService.detectChanges(this._cdr);
    this.searchEngagement({term : EventEngagementStrategyMasterStore.lastInsertedId})

  }

  searchEngagement(event) {
    this._eventEngagementStrategyService.getItems(false, '&q=' + event.term).subscribe(res => {
      this.form.patchValue({engagement_strategy_id:EventEngagementStrategyMasterStore.lastInsertedId});
        this.getEngagement();
        this._utilityService.detectChanges(this._cdr);
    });
  }

  getSupportive() {
    this._supportivesService.getItems(true).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchSupportive(event) {
    this._supportivesService.getItems(false, '&q=' + event.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getInfluence() {
    this._eventInfluenceService.getItems(true).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchInfluence(event) {
    this._eventInfluenceService.getItems(false, '&q=' + event.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    EventStakeholderStore._communications = []
  }

  cancel() {
    this.closeFormModal();
    this.resetForm();
  }

  closeFormModal() {
    this._eventEmitterService.dismissEventStakeholderModal();
  }

  ngOnDestroy(): void {
    this.resetForm()
    EventStakeholderStore._communications = []
    this.projectContractTypeSubscriptionEvent.unsubscribe();
    this.stakeHolderSubscriptionEvent.unsubscribe();
    this.eventEngagementStratergySubscriptionEvent.unsubscribe();
    this.communicationSubscriptionEvent.unsubscribe();
  }

}
