import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { KpiManagementFileService } from 'src/app/core/services/kpi-management/file-service/kpi-management-file.service';
import { KpiScoreService } from 'src/app/core/services/kpi-management/kpi-score/kpi-score.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { KpiScoreStore } from 'src/app/stores/kpi-management/kpi-score/kpi-score-store';
import { KpisStore } from 'src/app/stores/kpi-management/kpi/kpis-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-score-modal',
  templateUrl: './score-modal.component.html',
  styleUrls: ['./score-modal.component.scss']
})
export class ScoreModalComponent implements OnInit, OnDestroy {
  @Input('source') source: any;
  @Input('crubPath') crubPath: any;

  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;//File-Upload
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;//File-Upload
  @ViewChild('previewUploadArea', { static: false }) previewUploadArea: ElementRef;//File-Upload

  form: FormGroup;
  formErrors: any;
  saveData: any = null;
  
  AppStore = AppStore;
  KpiScoreStore = KpiScoreStore;
  KpisStore = KpisStore;
  fileUploadPopupStore = fileUploadPopupStore; //kh-fileUpload
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  // -document
  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
  };

  fileUploadPopupSubscriptionEvent: any = null;

  Formula:string;
  FormulaToCalculationValues:string;
  CalculationResult:number;

  constructor(
    private _router:Router,
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,
    private _kpiScoreService: KpiScoreService,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _documentFileService: DocumentFileService,//File-Upload
    private _fileUploadPopupService: FileUploadPopupService,//File-Upload
    private _kpiManagementFileService: KpiManagementFileService, //File-Upload
    ) { }

  ngOnInit(): void {

    this.form = this._formBuilder.group({
      id:[null],
      year:[null,[Validators.required]],
      month:[null,[Validators.required]],
      justification:[null,[Validators.required]],
      score:[null],
      documents:[[]],
      data_inputs:this._formBuilder.array([]),
    });

    this.resetForm(true);
    
    //File-Upload
    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
      this.closeFileUploadModal();
    })

    if(this.source){
      this.getScoreDetials(this.source?.id);
    }
  }

  getScoreDetials(id){
  this._kpiScoreService.getItemUpdateScoreDate(id).subscribe(res=>{
      if(res){
        this.setValues();
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  //set Values

  setValues(){
    this.clearCommonFilePopupDocuments();
    if ( KpiScoreStore.individualKpiScoreUpdateScoreDate?.documents?.length > 0) {
      this.setDocuments(KpiScoreStore.individualKpiScoreUpdateScoreDate?.documents);
    }

    this.form.patchValue({
      id: KpiScoreStore.individualKpiScoreUpdateScoreDate.id? KpiScoreStore.individualKpiScoreUpdateScoreDate.id :null,
      score: KpiScoreStore.individualKpiScoreUpdateScoreDate.score? KpiScoreStore.individualKpiScoreUpdateScoreDate.score :null,
      year: KpiScoreStore.individualKpiScoreUpdateScoreDate.date? formatDate( KpiScoreStore.individualKpiScoreUpdateScoreDate.date, 'yyyy', 'en-US'): null,
      month: KpiScoreStore.individualKpiScoreUpdateScoreDate.date? formatDate( KpiScoreStore.individualKpiScoreUpdateScoreDate.date, 'MMMM', 'en-US'): null,
      justification: KpiScoreStore.individualKpiScoreUpdateScoreDate.justifications? KpiScoreStore.individualKpiScoreUpdateScoreDate.justifications :null,
    });

    if(KpiScoreStore.individualKpiScoreUpdateScoreDate?.data_inputs?.length>0){
      this.SetValuedataInput();
    }
    //Formula calculation help 
    this.Formula= KpiScoreStore.individualKpiScoreUpdateScoreDate?.kpi_management_kpi_formula;
    
    if(KpiScoreStore.individualKpiScoreUpdateScoreDate?.data_inputs){
      this.dataInputCalculation('');
    }

    if(KpiScoreStore.individualKpiScoreUpdateScoreDate?.kpi_calculation_type=='manual'){
      this.form.controls.score.setValidators([Validators.required]);
      this.form.controls.score.updateValueAndValidity();
    }else{
      this.form.controls.score.setValidators(null);
      this.form.controls.score.updateValueAndValidity();
    }
  }

  SetValuedataInput(){
    this.dataInputs.clear();

    for(let i of KpiScoreStore.individualKpiScoreUpdateScoreDate.data_inputs){
      
      this.dataInputs.push(this._formBuilder.control(i.value,Validators.required));
    }
  }

  get dataInputs() {
    return this.form.get('data_inputs') as FormArray;
  }

  SetValuedataInputFormula(index){
    return `${KpiScoreStore.individualKpiScoreUpdateScoreDate.data_inputs[index].title} - ( ${KpiScoreStore.individualKpiScoreUpdateScoreDate.data_inputs[index].variable} )`;
  }

  valuePlaceeHolder(index){
    return `${this.getButtonText('enter_value_for_input')} ${KpiScoreStore.individualKpiScoreUpdateScoreDate.data_inputs[index].variable}`
  } 

  //**set Values
  

  // formula use caluation
  dataInputCalculation(event:any ){

    let dataInputArray=this.getDataInupt();
  
    let fmulaToFmulaVal = '';
    if(this.Formula){
      for (let letter of this.Formula) {

        const found = dataInputArray.find(element => element.variable==letter);
        if(found){
          fmulaToFmulaVal += `${found.value}`;
        }else{
          fmulaToFmulaVal += letter;
        }
      }
    }

    this.FormulaToCalculationValues=fmulaToFmulaVal;
    this.CalculationResult=eval(fmulaToFmulaVal);
  }

  rount(value){
    return value.toFixed(2) // toFixed  two decimal places expameple:(5.99)
  }
  // **formula use caluation

  // *Common File Upload/Attach Modal Functions Starts Here

  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType)
  }

  clearCommonFilePopupDocuments() {
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
  }

  setDocuments(documents) {
    let khDocuments = [];
    documents.forEach(element => {

      if (element.document_id) {
        element.kh_document.versions.forEach(innerElement => {

          if (innerElement.is_latest) {

            khDocuments.push({
              ...innerElement,
              title:element?.kh_document.title,
              'is_kh_document': true
            })
            fileUploadPopupStore.setUpdateFileArray({
              'updateId': element.id,
              ...innerElement

            })
          }

        });
      }
      else {
        if (element && element.token) {
          var purl = this._kpiManagementFileService.getThumbnailPreview('kpi-score-document', element.token)
          var lDetails = {
            name: element.title,
            ext: element.ext,
            size: element.size,
            url: element.url,
            token: element.token,
            thumbnail_url: element.thumbnail_url,
            preview: purl,
            id: element.id,
            'is_kh_document': false,
          }
        }
        
        this._fileUploadPopupService.setSystemFile(lDetails, purl)

      }

    });

    fileUploadPopupStore.setKHFile(khDocuments)
    let submitedDocuments = [...fileUploadPopupStore.getKHFiles, ...fileUploadPopupStore.getSystemFile]

    fileUploadPopupStore.setFilestoDisplay(submitedDocuments);
  }

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

  enableScrollbar() {
    if (fileUploadPopupStore.displayFiles.length >= 3) {
      $(this.uploadArea.nativeElement).mCustomScrollbar();
    }
    else {
      $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    }
  }

  removeDocument(doc) {

    if (doc.hasOwnProperty('is_kh_document')) {
      if (!doc['is_kh_document']) {
        fileUploadPopupStore.unsetFileDetails('document-file', doc.token);
      }
      else {
        fileUploadPopupStore.unsetFileDetails('kh-file', doc.token);
      }
    }
    else {
      fileUploadPopupStore.unsetFileDetails('document-file', doc.token);
    }
    this._utilityService.detectChanges(this._cdr);
  }

  // **Common File Upload/Attach Modal Functions Ends Here

    // kh-module base document- Returns image url according to type and token-document
  createImageUrl(type, token) {
    return this._documentFileService.getThumbnailPreview(type, token);
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  resetForm(close) {
    if(close){
      this.clearCommonFilePopupDocuments();
      this.dataInputs.clear();
      this.form.reset();
    }
    this.form.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
  }

  cancel() {
    this.closeFormModal();
  }
  
  closeFormModal(close:boolean=false, resId?) {
    this.resetForm(close);
    
    if (resId) {
      this._router.navigateByUrl('kpi-management/kpi-scores/' + resId);
      if(this.crubPath){
        KpiScoreStore.setPath(this.crubPath?.path);
        BreadCrumbMenuItemStore.refreshBreadCrumbMenu=true;
        BreadCrumbMenuItemStore.makeEmpty();
        BreadCrumbMenuItemStore.addBreadCrumbMenu(this.crubPath);
      }
      this._eventEmitterService.dismissKpiUpdateScoreModal(resId);
    } else{
      this._eventEmitterService.dismissKpiUpdateScoreModal(close);
    }
  }

  getDataInupt(){

    let data=[];

    for(let [index,value] of KpiScoreStore.individualKpiScoreUpdateScoreDate.data_inputs.entries()){
      data.push({
        data_input_id: value.data_input_id,
        title: value.title,
        variable: value.variable,
        value_id: value.value_id,
        value: this.dataInputs.controls[index].value?  this.dataInputs.controls[index].value: 0
      })
    }
    return data;
  }

  getSaveData() {

    if(KpiScoreStore.individualKpiScoreUpdateScoreDate?.kpi_calculation_type=='manual'){
      this.saveData = {
        justifications: this.form.value.justification ? this.form.value.justification:null,
        score: this.form.value.score ? this.form.value.score:0,
      }
    }else{
      this.saveData = {
        justifications: this.form.value.justification ? this.form.value.justification:null,
        score: this.form.value.score ? this.form.value.score:0,
        data_inputs: this.dataInputs.controls.length>0? this.getDataInupt():[],
      }
    }


    if (this.source.id) {
			this.saveData['documents'] = this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile);     
		} else{
			this.saveData['documents'] = this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save');
		}
    
  }

  save(close: boolean = false) {
    if (this.form.value) {

      let save;
      AppStore.enableLoading();

      this.getSaveData();

      if (this.form.value) {
        
        save = this._kpiScoreService.updateScore(this.source?.id, this.saveData);
      }
      save.subscribe(
        (res: any) => {
          this.resetForm(close);
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
          if (close) this.closeFormModal(close, res?.id);
        },
        (err: HttpErrorResponse) => {

          AppStore.disableLoading();
          if (err.status == 422) {
            this.formErrors = err.error.errors;
          } else {
            this._utilityService.showErrorMessage('error', 'something_went_wrong_try_again');
          }
          this._utilityService.detectChanges(this._cdr);
        }
      );
    }
  }

  ngOnDestroy(){
    KpisStore.unsetIndividualKpiDetails();
    this.fileUploadPopupSubscriptionEvent.unsubscribe();

    //document clear
		fileUploadPopupStore.clearFilesToDisplay();
		fileUploadPopupStore.clearKHFiles();
		fileUploadPopupStore.clearSystemFiles();
		fileUploadPopupStore.clearUpdateFiles();
    KpiScoreStore.unsetIndividualKpiScoreUpdateScoreDate();
  }
}
