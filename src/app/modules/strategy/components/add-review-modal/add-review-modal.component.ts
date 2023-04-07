import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { KpiService } from 'src/app/core/services/strategy-management/kpi/kpi.service';
import { StrategyReviewService } from 'src/app/core/services/strategy-management/review/strategy-review.service';
import { StrategyService } from 'src/app/core/services/strategy-management/strategy/strategy.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;

@Component({
  selector: 'app-add-review-modal',
  templateUrl: './add-review-modal.component.html',
  styleUrls: ['./add-review-modal.component.scss']
})
export class AddReviewModalComponent implements OnInit {
  @Input('source') kpiMesureSource: any;
  @Input('freequency')freequencyData :any
  @ViewChild('uploadArea',{static:false}) uploadArea: ElementRef;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;

  AppStore = AppStore
  form : FormGroup;
  fileUploadPopupStore=fileUploadPopupStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
  fileUploadPopupSubscriptionEvent: any;
  formErrors: any;
  kpiDataArray = []
  dataInputArray = [];
  InputProcessedArray: any = [];
  dummy_array = ['(a)', '(b)', '(c)', '(d)', '(e)', '(f)', '(g)', '(h)', '(i)', '(j)', '(k)', '(l)', '(m)', '(n)', '(o)', '(p)', '(q)', '(r)', '(s)', '(t)', '(u)', '(v)', '(w)', '(x)', '(y)', '(z)'];



  constructor(private _eventEmitterService: EventEmitterService,
              private _reviewService : StrategyReviewService,
              private _utilityService: UtilityService,
              private _formBuilder: FormBuilder,
              private _documentFileService: DocumentFileService,
              private _imageService: ImageServiceService,
              private _renderer2: Renderer2,
              private _cdr: ChangeDetectorRef,
              private _helperService:HelperServiceService,
              private _fileUploadPopupService: FileUploadPopupService,
              private _strategyService : StrategyService,
              private _kpiService : KpiService

              ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      strategy_profile_objective_kpis : [null],
      id : [null],
      kpi_calculation_type_id : [null],
      actual_value :  [null,[Validators.required]],
      review_frequency :  [null],
      justification : '',
      documents : [null]
    })

    this.fileUploadPopupSubscriptionEvent=this._eventEmitterService.fileUploadPopup.subscribe(res=>{
      this.enableScrollbar();
      this.closeFileUploadModal();
    })
    this.createInputs(this.kpiMesureSource.value.strategy_objective_kpi_data_inputs)
    if(this.kpiMesureSource.type == "Edit"){
      this.editData();
      
    }
    this.setData()

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


    setData(){
      var kpiDocumentDetails = this.kpiMesureSource.value.strategy_kpi_review_documents;
            if(kpiDocumentDetails.length > 0){
              this.setDocuments(kpiDocumentDetails)
            }
            this.form.patchValue({
              actual_value : this.kpiMesureSource.value.actual_value ? this.kpiMesureSource.value.actual_value : '',
              justification : this.kpiMesureSource.value.justification ? this.kpiMesureSource.value.justification : '',
              // document :  data.strategy_review_frequency_target_documents ? data.strategy_review_frequency_target_documents : [],
            });
            if( this.kpiMesureSource?.value?.strategy_profile_objectiveKpi.kpi_calculation_type?.type == 'calculate'){
              // this.dataInputArray = [];
              this.form.patchValue({
                actual_value : 0
              })
            }
    }


    editData(){
      // this.form.patchValue({
      //   actual_value : this.kpiMesureSource.value.actual_value ? this.freequencyData.value.actual_value : '',
      //   // review_frequency : this.freequencyData.value.review_frequency ? this.freequencyData.value.review_frequency : [],
      //   justification : this.freequencyData.value.justification ? this.freequencyData.value.justification : '',
      // })
    }

  

    KpiData(){
      let kpiData = {
        // id : this.kpiMesureSource.value.id,
        kpi_calculation_type_id : this.kpiMesureSource.value.strategy_profile_objectiveKpi.kpi_calculation_type.id,
        actual_value : this.form.value.actual_value ? this.form.value.actual_value : 0,
        review_frequency : this.kpiMesureSource.value.review_frequency,
        justification : this.form.value.justification ? this.form.value.justification : null,
        strategy_profile_objective_kpi_data_inputs : this.dataInputArray ? this.dataInputArray : [],
        documents : this.kpiMesureSource.type == "Edit" ? this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray,fileUploadPopupStore.getKHFiles,fileUploadPopupStore.getSystemFile) : this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles,'save') 
      }
      // if(this.kpiMesureSource?.value?.kpi_calculation_type?.type == 'calculate'){
      //   delete kpiData.actual_value;
      // } 
      return kpiData
    } 

    getButtonText(text){
      return this._helperService.translateToUserLanguage(text);
    } 

    proccessData(){
      let saveData =  {
        strategy_profile_objective_kpis : this.kpiDataArray ? this.kpiDataArray :  [],
      }
      return  saveData
    }

    save(close: boolean = false){
      let save 
      this.kpiDataArray.push(this.KpiData())
      AppStore.enableLoading();
     
        save = this._kpiService.addKpiMesure(this.kpiMesureSource.value.strategy_profile_objectiveKpi.id,this.kpiMesureSource.value.id,this.KpiData())
      
      save.subscribe(res=>{
        this.kpiDataArray = [];
        this.dataInputArray = [];
        this.InputProcessedArray =[]
        this.resetForm();
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
          this.formErrors = err.error.errors;
          // this.processFormErrors()
        }
          else if(err.status == 500 || err.status == 403){
            this.kpiDataArray = [];
            this.dataInputArray = [];
            this.InputProcessedArray =[]
           this.cancel();;
          }
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
        
      });
      // if(this.focusForm.valid){
      //   let focusObject = {id: StrategyDemoStore.strategyFocusAreas.length+1, title: this.focusForm.value.focus_area, weightage: this.focusForm.value.weightage };
      //   StrategyDemoStore.strategyFocusAreas.push(focusObject);
       
      // }
    }

  //   changeFrequency(event){
      
  //       this._strategyService.induvalKpi(this.kpiMesureSource.value.id).subscribe(res=>{
  //         for (let data of res['review_frequencies']) {
          
  //           if(data.id == event.id){
  //             var kpiDocumentDetails = data.strategy_review_frequency_target_documents;
  //           if(kpiDocumentDetails.length > 0){
  //             this.setDocuments(kpiDocumentDetails)
  //           }
  //             this.form.patchValue({
  //               actual_value : data.actual_value ? data.actual_value : '',
  //               justification : data.justification ? data.justification : '',
  //               document :  data.strategy_review_frequency_target_documents ? data.strategy_review_frequency_target_documents : [],
  //             });
  //             if(data.strategy_objective_kpi_data_inputs.length > 0 && this.kpiMesureSource?.value?.strategy_profile_objectiveKpi.kpi_calculation_type?.type == 'calculate'){
  //               this.dataInputArray = [];
  //               this.form.patchValue({
  //                 actual_value : 0
  //               })
  //               for (let input of data.strategy_objective_kpi_data_inputs) {
  //                    let inputObj = {
  //                      title : input.strategy_profile_objective_kpi_data_input.title,
  //                      value : input.value,
  //                      strategy_profile_objective_kpi_data_input_id : input.strategy_profile_objective_kpi_data_input.id
  //                    }
  //                    this.dataInputArray.push(inputObj)
  //               }
  //             }else if(this.kpiMesureSource?.value?.strategy_profile_objectiveKpi.kpi_calculation_type?.type == 'calculate'&& data.strategy_objective_kpi_data_inputs.length ==0 ) {
  //               this.dataInputArray = [];
  //               this.createInputs(this.kpiMesureSource.value.strategy_objective_kpi_data_inputs)
  //               this.form.patchValue({
  //                 actual_value : 0
  //               })
  //             }
  //             break;
  //         }else {
  //           this.form.patchValue({
  //             actual_value : '',
  //             justification : '',
  //           })
  //         }
  //         }
  //         this._utilityService.detectChanges(this._cdr);
  //       })
  // }

  processFormErrors(){
    var errors = this.formErrors;
    for (var key in errors) {
      if (errors.hasOwnProperty(key)) {
        if(key.startsWith('review_frequencies.')){
          let keyValueSplit = key.split('.');
          let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['review_frequencies'] = this.formErrors['review_frequencies']? this.formErrors['review_frequencies'] + errors[key] + '('+(errorPosition )+')': errors[key]+ (errorPosition );
        }
      }
    }
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
    fileUploadPopupStore.setFilestoDisplay(submitedDocuments);
  }

    clearFIleUploadPopupData(){
      fileUploadPopupStore.clearFilesToDisplay();
      fileUploadPopupStore.clearKHFiles();
      fileUploadPopupStore.clearSystemFiles();
      fileUploadPopupStore._updateArray=[];
    }
  
    resetForm(){
      this.form.reset();
    }


  cancel(){
    this._eventEmitterService.dismisskpiMesureModal();
    this.resetForm();
  }

  createInputs(data){
    if(data)
    for(let i of data){
      let obj = {
        'title' : i.strategy_profile_objective_kpi_data_input.title,
        'strategy_profile_objective_kpi_data_input_id' : i.strategy_profile_objective_kpi_data_input.id,
        'value' : i.value ? i.value : 0,
        'strategy_review_frequency_target_id': i.strategy_review_frequency_target_id,
        'id': i.id

      }
      this.dataInputArray.push(obj)
    }
  }

  changeData(num,vari,event){

    let array= [{'a' : 0},{'b':0}]
    array[num] = event.target.value
    let a = 10;
    let b= 20

    
  }

  ngOnDestroy(){
    this.fileUploadPopupSubscriptionEvent.unsubscribe();
    this.clearFIleUploadPopupData();
    this.kpiDataArray = [];

  }

}
