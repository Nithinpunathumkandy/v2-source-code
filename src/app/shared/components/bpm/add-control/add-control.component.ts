import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from "src/app/stores/auth.store";
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
import { ControlEfficiencyMeasuresService } from "src/app/core/services/masters/risk-management/control-efficiency-measures/control-efficiency-measures.service";
import { ControlEfficiencyMeasuresMasterStore } from "src/app/stores/masters/risk-management/control-efficiency-measures-store";
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ControlModeMasterStore } from 'src/app/stores/masters/bpm/control-mode.store';
import { ControlModeService } from 'src/app/core/services/masters/bpm/control-mode/control-mode.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { Controls } from 'src/app/core/models/bpm/controls/controls';
declare var $: any;

@Component({
  selector: 'app-add-control',
  templateUrl: './add-control.component.html',
  styleUrls: ['./add-control.component.scss']
})
export class AddControlComponent implements OnInit {
  
  
  @ViewChild('controlTypesFormModal') controlTypesFormModal: ElementRef;
  @ViewChild('controlCategoryFormModal') controlCategoryFormModal: ElementRef;
  @ViewChild('controlSubCategoryFormModal') controlSubCategoryFormModal: ElementRef;
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('controlEfficiencyModal', { static: true }) controlEfficiencyModal: ElementRef;
  @Input('source') ControlSource: any;
  @ViewChild('objectiveItemsDiv',{static:false}) objectiveItemsDiv: ElementRef;
  @ViewChild('remarksItemsDiv',{static:false}) remarksItemsDiv: ElementRef;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  @ViewChild('uploadArea',{static:false}) uploadArea: ElementRef;

  controlForm:FormGroup;
  controlFormErrors:any;
  AppStore = AppStore;
  AuthStore = AuthStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  ControlStore = ControlStore;
  ControlTypesMasterStore = ControlTypesMasterStore;
  ControlCategoryMasterStore = ControlCategoryMasterStore;
  ControlSubcategoryMasterStore=ControlSubcategoryMasterStore;
  ControlEfficiencyMeasuresMasterStore = ControlEfficiencyMeasuresMasterStore;
  ControlModeMasterStore = ControlModeMasterStore;
  controlObjectives = []
  sortedObjectivesData = []
  efficiencyRemarks = [];
  categId: any;
  controlId: number;
  controlEfficiencyMeasuresObject = {
    component: 'BPM',
    values: null,
    type: null
  };
  selectedControls = [];
  serviceSubscriptionEvent: any = null;
  idleTimeoutSubscription: any;
  controlEfficiencyMeasuresSubscriptionEvent: any = null;
  fileUploadPopupSubscriptionEvent:any=null;
  fileUploadPopupStore=fileUploadPopupStore;
  objectiveError= null;
  remarksError = null;

  constructor(private _utilityService: UtilityService, private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder, public _controlService: ControlsService,
    private _renderer2: Renderer2,
    private _documentFileService: DocumentFileService,
    private _imageService: ImageServiceService,
    private _router: Router, private _controlEfficiencyMeasureService: ControlEfficiencyMeasuresService,
    private _controlCategoryService:ControlCategoryService,
    private _controlSubCategoryService:ControlSubcategoryService,
    private _controlTypeService:ControlTypesService,
    private _eventEmitterService: EventEmitterService,
    private _helperService:HelperServiceService,
    private controlModeService: ControlModeService,
    ) { }

  ngOnInit(): void {
    this.selectedControls = JSON.parse(JSON.stringify(ControlStore.selectedControlsList));
    setTimeout(() => {
      this.checkForObjectiveItemsScrollbar();
      this.enableScrollbar();
      this._utilityService.detectChanges(this._cdr);
    }, 50);

    // this.checkForObjectiveItemsScrollbar();

    this.getControlCategories();
    // this.getControlSubCategories();
    this.getControlTypes();
    this.getControlModes();
    // Control Add Form
    this.getControlEfficiencyMeasures();
    // this.setMode(1);
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
     this.fileUploadPopupSubscriptionEvent=this._eventEmitterService.fileUploadPopup.subscribe(res=>{
       this.enableScrollbar();
       this.closeFileUploadModal();
     })

     this.controlEfficiencyMeasuresSubscriptionEvent = this._eventEmitterService.controlEfficienyMeasures.subscribe(res => {
      this.closeControlEfficiencyModal();
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
        if($(this.controlEfficiencyModal.nativeElement).hasClass('show')){
          this._renderer2.setStyle(this.controlEfficiencyModal.nativeElement,'z-index',999999);
          this._renderer2.setStyle(this.controlEfficiencyModal.nativeElement,'overflow','auto');
        }
      }
    })

    
    this.serviceSubscriptionEvent = this._eventEmitterService.commonModal.subscribe((res:any) => {
  
      if (res == 'save' && (!this.ControlSource?.page||this.ControlSource?.page!='add-risk')) {
         this._router.navigateByUrl("/bpm/controls/"+this.controlId);
      }
     
    })
    

    this.controlForm = this._formBuilder.group({
      id: [''],
      // reference_code:['',[Validators.required,Validators.maxLength(10)]],
      title: ['',[Validators.required, Validators.maxLength(255)]],
      description: [''],
      control_type_id: ['',[Validators.required]],
      control_category_id: [''],
      control_sub_category_id:[''],
      control_objectives: [this.controlObjectives],
      control_efficiency_measure_id: [null],
      control_control_efficiency_remarks: [''],
      control_mode_id:['',[Validators.required]],
    })

    this.resetForm();

    if (this.ControlSource) {
      
  
    if (this.ControlSource.hasOwnProperty('values') && this.ControlSource.values) {
      let {id,reference_code,title,description,control_type_id,control_category_id,control_sub_category_id,control_objectives, control_efficiency_measure,
      control_efficiency_remarks}=this.ControlSource.values
      // To Set SubCategory By Cateogory ID While Edit.
      this.categId = control_category_id
      this.getControlSubCategories()
      
      // To Set the Objectives While on Update.
      control_objectives.forEach(element => {
        this.sortedObjectivesData.push(element.title)
      })
      control_efficiency_remarks.forEach(element => {
        this.efficiencyRemarks.push(element.title);
      });
      this.controlForm.setValue({
        id: id,
        // reference_code:reference_code?reference_code:'',
        title: title?title:'',
        description: description?description:'',
        control_type_id: control_type_id?control_type_id:'',
        control_category_id: control_category_id?control_category_id:null,
        control_sub_category_id: control_sub_category_id ? control_sub_category_id : null,
        control_objectives:'',
        control_efficiency_measure_id: control_efficiency_measure,
        control_control_efficiency_remarks: '',
        control_mode_id:this.ControlSource.values.control_mode_id?this.ControlSource.values.control_mode_id:null
      })
      this.checkForObjectiveItemsScrollbar();
      this.checkFormRemarksScrollbar()
      this.searchControlEfficiencyMeasures({term:control_efficiency_measure});
      }else{
        this.setMode(1);
      }
    }
      


  }

  getControlEfficiencyMeasures(){
    this._controlEfficiencyMeasureService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchControlEfficiencyMeasures(e,patchValue:boolean = false){
    this._controlEfficiencyMeasureService.getItems(false,'&q='+e.term).subscribe(res=>{
      if(patchValue){
        this.controlForm.patchValue({control_efficiency_measure_id: JSON.parse(JSON.stringify(ControlEfficiencyMeasuresMasterStore.lastInsertedId))});
      }
      ControlEfficiencyMeasuresMasterStore.lastInsertedId = null;
      this._utilityService.detectChanges(this._cdr);
    }) 
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

  addRemarks() {
    if (this.controlForm.value.control_control_efficiency_remarks) {
      if(this.efficiencyRemarks.length == 0) {
        this.efficiencyRemarks.push(this.controlForm.value.control_control_efficiency_remarks);
      }
      else{
        let pos = this.efficiencyRemarks.findIndex(e=>e == this.controlForm.value.control_control_efficiency_remarks);
        if(pos == -1) this.efficiencyRemarks.push(this.controlForm.value.control_control_efficiency_remarks);
        else {
          this.remarksError = 'remark_already_added';
          setTimeout(() => {
            this.remarksError = null;;
          }, 1000);
        }
        this.checkFormRemarksScrollbar();
      }
      this.checkFormRemarksScrollbar();
    }
    this.controlForm.controls['control_control_efficiency_remarks'].reset()
  }

  // Removing Objectives by Position
  removeObjectives(position){
    this.sortedObjectivesData.splice(position, 1);
    this.checkForObjectiveItemsScrollbar();
  }

  removeRemarks(position){
    this.efficiencyRemarks.splice(position, 1);
    this.checkFormRemarksScrollbar();
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

  searchControlCategory(e, patchValue: boolean = false) {
		this._controlCategoryService.getItems(false, '&q=' + e.term).subscribe((res) => {
			if (patchValue) {
				for (let i of res.data) {
					if (i.id == e.term) {
						this.controlForm.patchValue({ control_category_id: i.id });
						break;
					}
				}
				ControlCategoryMasterStore.lastInsertedControlCategory = null;
			}
			this._utilityService.detectChanges(this._cdr);
		});
  }

  closeCategoryModal() {
    // ControlCategoryMasterStore.add_conrol_category_modal = false;
		$(this.controlCategoryFormModal.nativeElement).modal('hide');

		if (ControlCategoryMasterStore.lastInsertedControlCategory) {
			this.searchControlCategory({ term: ControlCategoryMasterStore.lastInsertedControlCategory }, true);
      this.categId = ControlCategoryMasterStore.lastInsertedControlCategory
      this.getControlSubCategories()
		}
	}
  
  // closeCategoryModal() {
  //   ControlCategoryMasterStore.add_conrol_category_modal = false;
  //   $(this.controlCategoryFormModal.nativeElement).modal('hide');
  //   if (ControlCategoryMasterStore.lastInsertedControlCategory) {
  //     // this.controlForm.controls['control_sub_category_id'].reset()
  //     this.controlForm.patchValue({ control_category_id: ControlCategoryMasterStore.lastInsertedControlCategory });
  //     this.categId = ControlCategoryMasterStore.lastInsertedControlCategory
  //     this.getControlCategories()
  //   }
    
  //   this._utilityService.detectChanges(this._cdr);
  // }

  // Open Control Category  Modal

  addControlSubCategory() {
    ControlSubcategoryMasterStore.selectedCategoryId=this.categId
    this.searchControlCategory({ term: ControlSubcategoryMasterStore.selectedCategoryId })
    ControlSubcategoryMasterStore.add_conrol_sub_category_modal = true;
    $(this.controlSubCategoryFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.formModal.nativeElement,'z-index','99999');
    this._utilityService.detectChanges(this._cdr);
  }

  searchControlSubCategory(e, patchValue: boolean = false) {
		this._controlSubCategoryService.getItems(false, '&q=' + e.term).subscribe((res) => {
			if (patchValue) {
				for (let i of res.data) {
					if (i.id == e.term) {
						this.controlForm.patchValue({ control_sub_category_id: i.id });
						break;
					}
				}
				ControlSubcategoryMasterStore.lastInsertedControlSubCategory = null;
			}
			this._utilityService.detectChanges(this._cdr);
		});
  }

  closeSubCategoryModal() {
    // ControlCategoryMasterStore.add_conrol_sub_category_modal = false;
		$(this.controlSubCategoryFormModal.nativeElement).modal('hide');

		if (ControlSubcategoryMasterStore.lastInsertedControlSubCategory) {
			this.searchControlSubCategory({ term: ControlSubcategoryMasterStore.lastInsertedControlSubCategory }, true);
      this.getControlSubCategories()
		}
	}

  // closeSubCategoryModal() {
  //   ControlSubcategoryMasterStore.add_conrol_sub_category_modal = false;
  //   $(this.controlSubCategoryFormModal.nativeElement).modal('hide');
  //   if(ControlSubcategoryMasterStore.lastInsertedControlSubCategory) 
  //     this.controlForm.patchValue({ control_sub_category_id: ControlSubcategoryMasterStore.lastInsertedControlSubCategory });
  //     this.getControlSubCategories()
  //   this._utilityService.detectChanges(this._cdr);
  // }

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

  searchControlType(e) {
    this._controlTypeService.getItems(false,'&q='+e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  saveControl(close:boolean=false){
    this.controlFormErrors=null;
    if (this.controlForm.value) {
    
      let save
      AppStore.enableLoading();
      let remarksProcessed = [];
      this.efficiencyRemarks.forEach(title=>{
        remarksProcessed.push({title: title});
      })
      if (this.controlForm.value.id) {

        this.sortedObjectivesData.forEach(title => {
          this.controlObjectives.push({title:title})
        })

         // Setting Control Objectives with FormData
        let updateParam = {
          ...this.controlForm.value,
          control_objectives:this.controlObjectives,
          control_control_efficiency_remarks: remarksProcessed,
          documents:this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray,fileUploadPopupStore.getKHFiles,fileUploadPopupStore.getSystemFile)
        } 

        save = this._controlService.updateItem(this.controlForm.value.id, updateParam)
      } else {
        
        // Sorting KH Files and Document Files
        // this.sortDocumentData()
        
        // Pushing Sorted Objectives 
        this.sortedObjectivesData.forEach(title => {
          this.controlObjectives.push({title:title})
        })

        // Removing ID for POST request.
        delete this.controlForm.value.id

        // Setting Control Objectives with FormData
        let saveParam = {
          ...this.controlForm.value,
          control_objectives:this.controlObjectives,
          control_control_efficiency_remarks: remarksProcessed,
          documents: this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles,'save')
        }
        save = this._controlService.saveItem(saveParam)  
      }
      save.subscribe((res: any) => {
        this.controlId=res.id;
        this._controlService.getItemById(this.controlId).subscribe(res=>{
          this.setSelectedControl(res);
          this._utilityService.detectChanges(this._cdr)
        });
        ControlStore.setLastInsertedId(res.id);
        if(!this.controlForm.value.id){
          this.resetForm()
          this.clearFIleUploadPopupData()
        }
        
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.closemsFormModal('save');
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.controlFormErrors = err.error.errors;
          this._utilityService.detectChanges(this._cdr);
          AppStore.disableLoading();
        }
      });
    }
  }

  // sortDocumentData(){
  //   this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles)
  // }

  setSelectedControl(item){
    let obj = {
      title: item.title,
      reference_code : item.reference_code,
      id:item.id,
      control_category_title:item.control_category?.title,
      control_type_title:item.control_type?.title,
      control_efficiency_measure_language_title: item.control_efficiency_measure?.language[0]?.pivot?.title,
      control_efficiency_measure_label : item.control_efficiency_measure?.label
    }
    this.selectedControls.push(obj);
    this._controlService.selectRequiredControls(this.selectedControls);
  }

  resetForm() {
    this.checkForObjectiveItemsScrollbar();
    this.clearFIleUploadPopupData()
    ControlSubcategoryMasterStore.selectedCategoryId=null
    this.controlForm.reset();
    this.sortedObjectivesData=[];
    this.efficiencyRemarks=[];
    this.controlForm.pristine;
    this.controlFormErrors = null;
  }
  clearFIleUploadPopupData(){
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore._updateArray=[];
  }


  closemsFormModal(type){
    this.resetForm();
    setTimeout(() => {
      this._eventEmitterService.dismissAddNewControl();
      this._eventEmitterService.dismissAddNewControlFocus();
      this._eventEmitterService.dismissCommonModal(type)
    }, 250);
  }

  addControlEfficiencyMeasure(){
    this.controlEfficiencyMeasuresObject.type = 'Add';
    this.controlEfficiencyMeasuresObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openControlEfficienyModal();
  }

  openControlEfficienyModal(){
    setTimeout(() => {
      $(this.controlEfficiencyModal.nativeElement).modal('show');
    }, 50);
  }

  closeControlEfficiencyModal(){
    $(this.controlEfficiencyModal.nativeElement).modal('hide');
    this.controlEfficiencyMeasuresObject.type = null;
    if(ControlEfficiencyMeasuresMasterStore.lastInsertedId)
      this.searchControlEfficiencyMeasures({term: ControlEfficiencyMeasuresMasterStore.lastInsertedId},true);
  }

  checkForObjectiveItemsScrollbar(){
    setTimeout(() => {
      if(this.sortedObjectivesData.length > 0 && $(this.objectiveItemsDiv?.nativeElement).height() >= 100){
        $(this.objectiveItemsDiv?.nativeElement).mCustomScrollbar();
      }
      else{
        if(this.sortedObjectivesData.length > 0) $(this.objectiveItemsDiv?.nativeElement).mCustomScrollbar("destroy");
      }
    }, 250);
  }

  checkFormRemarksScrollbar(){
    setTimeout(() => {
      if(this.efficiencyRemarks.length > 0 && $(this.remarksItemsDiv?.nativeElement).height() >= 100){
        $(this.remarksItemsDiv?.nativeElement).mCustomScrollbar();
      }
      else{
        if(this.efficiencyRemarks.length > 0) $(this.remarksItemsDiv?.nativeElement).mCustomScrollbar("destroy");
      }
    }, 250);
  }

  // * File Upload/Attach Modal

  openFileUploadModal() {
    setTimeout(() => {
      fileUploadPopupStore.openPopup = true;
      $('.modal-backdrop').add();
      document.body.classList.add('modal-open')
      this._renderer2.setStyle(this.fileUploadModal.nativeElement, 'display', 'block');
      this._renderer2.removeAttribute(this.fileUploadModal.nativeElement, 'aria-hidden');
      setTimeout(() => {
        this._renderer2.addClass(this.fileUploadModal.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 100);
    }, 250);
  }
  closeFileUploadModal() {
    setTimeout(() => {
      fileUploadPopupStore.openPopup = false;
      document.body.classList.remove('modal-open')
      this._renderer2.setStyle(this.fileUploadModal.nativeElement, 'display', 'none');
      this._renderer2.setAttribute(this.fileUploadModal.nativeElement, 'aria-hidden', 'true');
      $('.modal-backdrop').remove();
    setTimeout(() => {
      this._renderer2.removeClass(this.fileUploadModal.nativeElement, 'show')
      this._utilityService.detectChanges(this._cdr)
    }, 200);
    }, 100);
  }

  enableScrollbar(){
    if(fileUploadPopupStore.displayFiles.length >= 3 ){
      $(this.uploadArea.nativeElement).mCustomScrollbar();
    }
    else{
      $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    }
  }

  createImageUrl(type,token) {
    return this._documentFileService.getThumbnailPreview(type, token);
  }
  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }

  setMode(id) {
    this.controlForm.patchValue({
      control_mode_id: id
    })
  }
  getControlModes(){
    this.controlModeService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  removeDocument(doc) {
    if(doc.hasOwnProperty('is_kh_document')){
      if(!doc['is_kh_document']){
        fileUploadPopupStore.unsetFileDetails('document-file', doc.token);
      }
      else{
        fileUploadPopupStore.unsetFileDetails('kh-file', doc.token);
      }
    }
    else{
      fileUploadPopupStore.unsetFileDetails('document-file', doc.token);
    }
    // this.checkForFileUploadsScrollbar();
    this._utilityService.detectChanges(this._cdr);
  }

  ngOnDestroy() {
    this.serviceSubscriptionEvent.unsubscribe()
    this.controlEfficiencyMeasuresSubscriptionEvent.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.fileUploadPopupSubscriptionEvent.unsubscribe();
    this.clearFIleUploadPopupData()

    //documents
    fileUploadPopupStore.clearFilesToDisplay()
    fileUploadPopupStore.clearKHFiles()
    fileUploadPopupStore.clearSystemFiles()
    fileUploadPopupStore.clearUpdateFiles()
  }

}
