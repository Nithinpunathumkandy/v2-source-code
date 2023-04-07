import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { StrategyReviewService } from 'src/app/core/services/strategy-management/review/strategy-review.service';
import { StrategyService } from 'src/app/core/services/strategy-management/strategy/strategy.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { StrategyStore } from 'src/app/stores/strategy-management/strategy.store';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';

declare var $: any;

@Component({
  selector: 'app-add-all-review-modal',
  templateUrl: './add-all-review-modal.component.html',
  styleUrls: ['./add-all-review-modal.component.scss']
})
export class AddAllReviewModalComponent implements OnInit {
  @Input('source') allKpiMeasureData: any;
  @ViewChild('uploadArea',{static:false}) uploadArea: ElementRef;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  StrategyStore = StrategyStore
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  fileUploadPopupStore = fileUploadPopupStore;
  AppStore = AppStore
  formErrors : any;
  dataInputArray: any = [];
  kpiDataArray = [];
  kpiMeasureOnj = {
    'id' : null,
    'kpi_title' :null,
    'kpi_calculation_type' : null,
    'kpi_calculation_type_id' : null,
    'maximum' : null,
    'minimum' : null,
    'target':null,
     'selected_frequency' : null,
    'frequency' : {
      'review_frequency': null,
      'id':null
    },
    'actual_value': null,
    'justification' : null,
    'strategy_profile_objective_kpi_data_inputs' : {
      'strategy_review_frequency_target_id':null,
      'value':null,
      'strategy_profile_objective_kpi_data_input':null
    } ,
     'documents':[]
  }
  proccesedArray: any = [];
  fileUploadPopupSubscriptionEvent: any;
  selectedIndex: any;


  constructor(private _eventEmitterService: EventEmitterService, private _strategyService : StrategyService,
    private _utilityService: UtilityService, private _cdr: ChangeDetectorRef,private _reviewService : StrategyReviewService,
    private _helperService:HelperServiceService, private _renderer2: Renderer2,private _imageService: ImageServiceService,
    private _documentFileService: DocumentFileService, private _fileUploadPopupService: FileUploadPopupService,



    ) { }

  ngOnInit(): void {

    this.setKpiMeasureData(StrategyStore.kpis);
    this.fileUploadPopupSubscriptionEvent=this._eventEmitterService.fileUploadPopup.subscribe(res=>{
      this.enableScrollbar();
      this.closeFileUploadModal();
    })
  }

  
  enableScrollbar(){
    if(fileUploadPopupStore.displayFiles.length >= 3 ){
      $(this.uploadArea.nativeElement).mCustomScrollbar();
    }
    else{
      $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    }
  }

  setKpiMeasureData(data){
   for(let i of data){
    this.kpiMeasureOnj = {
       id : i.id,
      kpi_title : i.kpi_title,
      kpi_calculation_type : i.kpi_calculation_type,
      kpi_calculation_type_id : i.kpi_calculation_type_id,
      minimum : i.minimum,
      maximum : i.maximum,
      target : i.target,
      selected_frequency : null,
      frequency : i.strategy_review_frequency_targets,
      actual_value: null,
      justification : null,
       strategy_profile_objective_kpi_data_inputs : i.strategy_profile_objective_kpi_data_inputs ,
       documents:[]
    }
    this.kpiDataArray.push(this.kpiMeasureOnj)
   }

  }

  cancel(){
    this._eventEmitterService.dismissAddAllReviewModal();
    // this.focusAreaMasterSubscription.unsubscribe();
  }

  createInputs(data){
    if(data)
    for(let i of data){
      let obj = {
        'title' : i.title,
        'strategy_profile_objective_kpi_data_input_id' : i.id,
        'value' : i.value ? i.value : 0

      }
      this.dataInputArray.push(obj)
    }
  }

  changeFrequency(event,kpi,index){
    if(kpi.selected_frequency.strategy_review_frequency_target_documents){
      this.setDocuments(kpi.selected_frequency.strategy_review_frequency_target_documents)
    }
    this.kpiDataArray[index].justification =  kpi.selected_frequency.justification;
    this.kpiDataArray[index].actual_value = kpi.selected_frequency.actual_value
    this.kpiDataArray[index].kpi_calculation_type = kpi.kpi_calculation_type
    this.kpiDataArray[index].strategy_profile_objective_kpi_data_inputs = kpi.selected_frequency.strategy_review_frequency_target_inputs.length > 0 ? kpi.selected_frequency.strategy_review_frequency_target_inputs : kpi.strategy_profile_objective_kpi_data_inputs;
    this.kpiDataArray[index].documents = fileUploadPopupStore.displayFiles
    this.clearFIleUploadPopupData();

    this._utilityService.detectChanges(this._cdr);
    
}


setDocuments(documents){
  let khDocuments = [];
  documents.forEach(element => {

    if(element.document_id){
      element.kh_document.versions.forEach(innerElement => {

        if(innerElement.is_latest){
          khDocuments.push({
            ...innerElement,
            'is_kh_document':true
          })
          fileUploadPopupStore.setUpdateFileArray({
            'updateId':element.id,
            ...innerElement
            
          })
        }

      });
    }
    else
    {
      if (element && element.token) {
        var purl = this._reviewService.getThumbnailPreview('kpi-measure', element.token)
        var lDetails = {
          name: element.title,
          ext: element.ext,
          size: element.size,
          url: element.url,
          token: element.token,
          thumbnail_url: element.thumbnail_url,
          preview: purl,
          id: element.id,
          'is_kh_document':false,
        }
      }
      this._fileUploadPopupService.setSystemFile(lDetails, purl)

    }

  });
  fileUploadPopupStore.setKHFile(khDocuments)
  let submitedDocuments=[...fileUploadPopupStore.getKHFiles,...fileUploadPopupStore.getSystemFile]
  console.log(submitedDocuments)
  fileUploadPopupStore.setFilestoDisplay(submitedDocuments);
}

processData(){
  for(let data of this.kpiDataArray){
    let obj = {
      id : data.id,
      kpi_calculation_type_id : data.kpi_calculation_type_id,
      actual_value : data.actual_value ? data.actual_value : 0,
      review_frequency : data.selected_frequency.review_frequency,
      justification : data.justification,
      strategy_profile_objective_kpi_data_inputs : [],
      documents :  this._helperService.sortFileuploadData(data.documents,'save'),
    }
    if(data.strategy_profile_objective_kpi_data_inputs){
      for(let inputs of data.strategy_profile_objective_kpi_data_inputs ){
        let inputObj = {
          strategy_profile_objective_kpi_data_input_id : inputs.id,
          value : inputs.value
        }
        obj.strategy_profile_objective_kpi_data_inputs.push(inputObj)
      }
    }
   this.proccesedArray.push(obj)
   
  }
}

save(close: boolean = false){
  let save 
  this.processData()
  let mainObj ={
    strategy_profile_objective_kpis : this.proccesedArray
  }
  AppStore.enableLoading();
     
  save = this._reviewService.addKpiMesure(mainObj)
  save.subscribe(res=>{
    this.kpiDataArray = []

    this.setKpiMeasureData(StrategyStore.kpis);
    this.dataInputArray = [];
     this.proccesedArray =[]
    // this.resetForm();
    this.clearFIleUploadPopupData()
    AppStore.disableLoading();
    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr);
    }, 500);
    if(close) this.cancel();
  }, (err: HttpErrorResponse) => {
    if (err.status == 422) {
      this.kpiDataArray = [];
      this.dataInputArray = []
      this.formErrors = err.error.errors;}
      else if(err.status == 500 || err.status == 403){
        this.kpiDataArray = [];
        this.dataInputArray = [];
         this.proccesedArray =[]
       this.cancel();;
      }
      AppStore.disableLoading
      this._utilityService.detectChanges(this._cdr);
    
  });
}

getButtonText(text){
  return this._helperService.translateToUserLanguage(text);
} 4

openFileUploadModal(index) {
  this.selectedIndex = index
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
  this.kpiDataArray[this.selectedIndex].documents = fileUploadPopupStore.displayFiles
  this.clearFIleUploadPopupData()
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
checkExtension(ext, extType) {
  var res = this._imageService.checkFileExtensions(ext, extType);
  return res;
}

createImageUrl(type,token) {
  return this._documentFileService.getThumbnailPreview(type, token);
}

clearFIleUploadPopupData(){
  fileUploadPopupStore.clearFilesToDisplay();
  fileUploadPopupStore.clearKHFiles();
  fileUploadPopupStore.clearSystemFiles();
  fileUploadPopupStore._updateArray=[];
}
}
