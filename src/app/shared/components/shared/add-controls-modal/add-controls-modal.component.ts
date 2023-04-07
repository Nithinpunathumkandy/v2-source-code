import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { ControlStore } from "src/app/stores/bpm/controls/controls.store";
import { ControlTypesMasterStore } from "src/app/stores/masters/bpm/control-types.master.store";
import { ControlCategoryMasterStore } from "src/app/stores/masters/bpm/control-category.master.store";
import { ControlSubcategoryMasterStore } from "src/app/stores/masters/bpm/control-subcategory.master.store";
import { ControlsService } from "src/app/core/services/bpm/controls/controls.service";
import { ControlCategoryService } from "src/app/core/services/masters/bpm/control-category/control-category.service";
import { ControlSubcategoryService } from "src/app/core/services/masters/bpm/control-subcategory/control-subcategory.service";
import { ControlTypesService } from "src/app/core/services/masters/bpm/control-types/control-types.service";
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

declare var $: any;
@Component({
  selector: 'app-add-controls-modal',
  templateUrl: './add-controls-modal.component.html',
  styleUrls: ['./add-controls-modal.component.scss']
})
export class AddControlsModalComponent implements OnInit {

  @ViewChild('controlTypesFormModal') controlTypesFormModal: ElementRef;
  @ViewChild('controlCategoryFormModal') controlCategoryFormModal: ElementRef;
  @ViewChild('controlSubCategoryFormModal') controlSubCategoryFormModal: ElementRef;
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @Input('source') ControlSource: any;
  @ViewChild('objectiveItemsDiv',{static:false}) objectiveItemsDiv: ElementRef;

  controlForm:FormGroup;
  controlFormErrors:any;
  AppStore = AppStore;
  ControlStore = ControlStore;
  ControlTypesMasterStore = ControlTypesMasterStore;
  ControlCategoryMasterStore = ControlCategoryMasterStore;
  ControlSubcategoryMasterStore=ControlSubcategoryMasterStore
  controlObjectives = []
  sortedObjectivesData = []
  categId: any;
  controlId: number;

  serviceSubscriptionEvent: any = null;
  idleTimeoutSubscription: any;
  objectiveError= null;


  constructor(private _utilityService: UtilityService, private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder, public _controlService: ControlsService,
    private _renderer2: Renderer2,
    private _router: Router,
    private _controlCategoryService:ControlCategoryService,
    private _controlSubCategoryService:ControlSubcategoryService,
    private _controlTypeService:ControlTypesService,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService) { }

  ngOnInit(): void {

    setTimeout(() => {
      this.checkForObjectiveItemsScrollbar();
      this._utilityService.detectChanges(this._cdr);
    }, 50);

    // this.checkForObjectiveItemsScrollbar();

    this.getControlCategories();
    // this.getControlSubCategories();
    this.getControlTypes();
    // Control Add Form

     // Event Emitter Subscription from Add Service Category Component
     this.serviceSubscriptionEvent = this._eventEmitterService.controlCategory.subscribe(res=>{
      this.closeCategoryModal();
     })
     this.serviceSubscriptionEvent = this._eventEmitterService.controlSubCategory.subscribe(res=>{
      this.closeSubCategoryModal();
     })
    
     this.serviceSubscriptionEvent = this._eventEmitterService.controlTypes.subscribe(res=>{
      this.closeControlTypes();
     })
    
     this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
      if(!status){
        if($(this.controlTypesFormModal.nativeElement).hasClass('show')){
          this._renderer2.setStyle(this.controlTypesFormModal.nativeElement,'z-index',999999);
          this._renderer2.setStyle(this.controlTypesFormModal.nativeElement,'overflow','auto');
        }
        if($(this.controlCategoryFormModal.nativeElement).hasClass('show')){
          this._renderer2.setStyle(this.controlCategoryFormModal.nativeElement,'z-index',999999);
          this._renderer2.setStyle(this.controlCategoryFormModal.nativeElement,'overflow','auto');
        }
        if($(this.controlSubCategoryFormModal.nativeElement).hasClass('show')){
          this._renderer2.setStyle(this.controlSubCategoryFormModal.nativeElement,'z-index',999999);
          this._renderer2.setStyle(this.controlSubCategoryFormModal.nativeElement,'overflow','auto');
        }
      }
    })

    
    this.serviceSubscriptionEvent = this._eventEmitterService.commonModal.subscribe((res:any) => {
      if (res == 'save') {
         this._router.navigateByUrl("/bpm/controls/"+this.controlId);
      }
     
    })
    

    this.controlForm = this._formBuilder.group({
      id: [''],
      reference_code:['',[Validators.required,Validators.maxLength(10)]],
      title: ['',[Validators.required, Validators.maxLength(255)]],
      description: [''],
      control_type_id: ['',[Validators.required]],
      control_category_id: [''],
      control_sub_category_id:[''],
      control_objectives: [this.controlObjectives]
    })

    this.resetForm();

    if (this.ControlSource) {
      
  
    if (this.ControlSource.hasOwnProperty('values') && this.ControlSource.values) {
      
      let {id,reference_code,title,description,control_type_id,control_category_id,control_sub_category_id,control_objectives}=this.ControlSource.values
      // To Set SubCategory By Cateogory ID While Edit.
      this.categId = control_category_id
      this.getControlSubCategories()
      
      // To Set the Objectives While on Update.
      control_objectives.forEach(element => {
        this.sortedObjectivesData.push(element.title)
      })

      this.controlForm.setValue({
        id: id,
        reference_code:reference_code?reference_code:'',
        title: title?title:'',
        description: description?description:'',
        control_type_id: control_type_id?control_type_id:'',
        control_category_id: control_category_id?control_category_id:'',
        control_sub_category_id: control_sub_category_id ? control_sub_category_id : '',
        control_objectives:''
      })
      this.checkForObjectiveItemsScrollbar();
      }
    }


  }
  // Add Objectives

  addObjectives() {
    
    let dataArray=[]

    //Check For Data and push - to remove empty string 
    if (this.controlForm.value.control_objectives) {
      dataArray.push(this.controlForm.value.control_objectives)
    }

    // Checking For Duplicates and Setting Error Flag
    dataArray.forEach(e => {
      
      if (this.sortedObjectivesData.indexOf(e) == -1) {
        this.sortedObjectivesData.push(e)
      } else {
        this.objectiveError = 'Objective Already Added';
        setTimeout(() => {
          this.objectiveError = null;;
        }, 1000);
      }
      this.checkForObjectiveItemsScrollbar();
    })
    this.controlForm.controls['control_objectives'].reset()

  }

  // Removing Objectives by Position
  removeObjectives(position){
    this.sortedObjectivesData.splice(position, 1);
    this.checkForObjectiveItemsScrollbar();
  }

  getControlCategories(){
    this._controlCategoryService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr)
    });
  }

  eventChange(id) {
    this.categId = id
    ControlSubcategoryMasterStore.selectedCategoryId = this.categId
    ControlSubcategoryMasterStore.choose_control_sub_category=true
    this.getControlSubCategories()
    this.controlForm.controls['control_sub_category_id'].reset()

  }
  getControlSubCategories() {

   
    this._controlSubCategoryService.getSubCategoryByCategory(this.categId).subscribe(res => {
      this._utilityService.detectChanges(this._cdr)
    });

  }

  // Open Control Category  Modal

  addControlCategory(){

    ControlCategoryMasterStore.add_conrol_category_modal = true;
    $(this.controlCategoryFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.formModal.nativeElement,'z-index','99999');
    this._utilityService.detectChanges(this._cdr);
  }
  
  closeCategoryModal() {
    ControlCategoryMasterStore.add_conrol_category_modal = false;
    $(this.controlCategoryFormModal.nativeElement).modal('hide');
    if (ControlCategoryMasterStore.lastInsertedcontrolCategory) {
      this.controlForm.controls['control_sub_category_id'].reset()
      this.controlForm.patchValue({ control_category_id: ControlCategoryMasterStore.lastInsertedcontrolCategory });
      this.categId = ControlCategoryMasterStore.lastInsertedcontrolCategory
      this.getControlSubCategories()
    }
    
    this._utilityService.detectChanges(this._cdr);
  }

  // Open Control Category  Modal

  addControlSubCategory() {
      ControlSubcategoryMasterStore.selectedCategoryId=this.categId
    ControlSubcategoryMasterStore.add_conrol_sub_category_modal = true;
    $(this.controlSubCategoryFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.formModal.nativeElement,'z-index','99999');
    this._utilityService.detectChanges(this._cdr);
  }
  closeSubCategoryModal() {
    ControlSubcategoryMasterStore.add_conrol_sub_category_modal = false;
    $(this.controlSubCategoryFormModal.nativeElement).modal('hide');
    if(ControlSubcategoryMasterStore.lastInsertedControlSubCategory) 
      this.controlForm.patchValue({ control_sub_category_id: ControlSubcategoryMasterStore.lastInsertedControlSubCategory });
      this.getControlSubCategories()
    this._utilityService.detectChanges(this._cdr);
  }

  // Open Control Types  Modal

  addControlTypes(){
    ControlTypesMasterStore.add_conrol_type_modal = true;
    $(this.controlTypesFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.formModal.nativeElement,'z-index','99999');
    this._utilityService.detectChanges(this._cdr);
  }
  closeControlTypes() {
    ControlSubcategoryMasterStore.add_conrol_sub_category_modal = false;
    $(this.controlTypesFormModal.nativeElement).modal('hide');
    if(ControlTypesMasterStore.lastInsertedControlTypes) 
      this.controlForm.patchValue({ control_type_id: ControlTypesMasterStore.lastInsertedControlTypes });
    this._utilityService.detectChanges(this._cdr);
  }


  getControlTypes() {
    this._controlTypeService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  saveControl(close:boolean=false){
    this.controlFormErrors=null;
    if (this.controlForm.value) {
    
      let save
      AppStore.enableLoading();

      if (this.controlForm.value.id) {

        
        this.sortedObjectivesData.forEach(title => {
          this.controlObjectives.push({title:title})
        })

         // Setting Control Objectives with FormData
        let updateParam = {
          ...this.controlForm.value,
          control_objectives:this.controlObjectives
        } 

        console.log(updateParam)
        save = this._controlService.updateItem(this.controlForm.value.id, updateParam)
      } else {
   
        
        // Pushing Sorted Objectives 
        this.sortedObjectivesData.forEach(title => {
          this.controlObjectives.push({title:title})
        })

        // Removing ID for POST request.
        delete this.controlForm.value.id

        // Setting Control Objectives with FormData
        let saveParam = {
          ...this.controlForm.value,
          control_objectives:this.controlObjectives
        }

        save = this._controlService.saveItem(saveParam)  
      }
      save.subscribe((res: any) => {
        this.controlId=res.id
        this.resetForm()
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.closemsFormModal('save');
      }, (err: HttpErrorResponse) => {
          console.log(err)
        if (err.status == 422) {
          this.controlFormErrors = err.error.errors;
          this._utilityService.detectChanges(this._cdr);
          AppStore.disableLoading();
        }
      });
    }
  }

  resetForm() {
    this.checkForObjectiveItemsScrollbar();
    ControlSubcategoryMasterStore.selectedCategoryId=null
    this.controlForm.reset();
    this.sortedObjectivesData=[]
    this.controlForm.pristine;
    this.controlFormErrors = null;
  }


  closemsFormModal(type){
    this.resetForm();
    setTimeout(() => {
      this._eventEmitterService.dismissAddNewControl();
      this._eventEmitterService.dismissAddNewControlFocus();
    }, 250);
  }

  checkForObjectiveItemsScrollbar(){
    setTimeout(() => {
      if($(this.objectiveItemsDiv?.nativeElement).height() >= 100){
        $(this.objectiveItemsDiv?.nativeElement).mCustomScrollbar();
      }
      else{
        $(this.objectiveItemsDiv?.nativeElement).mCustomScrollbar("destroy");
      }
    }, 250);
  }
//getting button name by language
getButtonText(text){
  return this._helperService.translateToUserLanguage(text);
}

  ngOnDestroy() {
    this.serviceSubscriptionEvent.unsubscribe()

  }

}
