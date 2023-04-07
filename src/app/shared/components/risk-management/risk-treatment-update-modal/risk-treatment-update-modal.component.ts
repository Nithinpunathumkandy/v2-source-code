import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { RiskStatusService } from 'src/app/core/services/masters/risk-management/risk-status/risk-status.service';
import { RiskTreatmentStatusesService } from 'src/app/core/services/masters/risk-management/risk-treatment-statuses/risk-treatment-statuses.service';
import { RiskTreatmentService } from 'src/app/core/services/risk-management/risks/risk-treatment/risk-treatment.service';
import { RiskManagementSettingsService } from 'src/app/core/services/settings/organization_settings/risk-management-settings/risk-management-settings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { RiskTreatmentStatusesMasterStore } from 'src/app/stores/masters/risk-management/risk-treatment-statuses-store';
import { RiskTreatmentStore } from 'src/app/stores/risk-management/risks/risk-treatment.store';
import { RiskManagementSettingStore } from 'src/app/stores/settings/risk-management-settings.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { RisksStore } from 'src/app/stores/risk-management/risks/risks.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';

@Component({
  selector: 'app-risk-treatment-update-modal',
  templateUrl: './risk-treatment-update-modal.component.html',
  styleUrls: ['./risk-treatment-update-modal.component.scss']
})
export class RiskTreatmentUpdateModalComponent implements OnInit {
 
  @Input('source') updateObject: any;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  updateForm :FormGroup;
  AppStore = AppStore;
  RiskTreatmentStore = RiskTreatmentStore;
  RisksStore = RisksStore;
  RiskManagementSettingStore = RiskManagementSettingStore;
  RiskTreatmentStatusStore = RiskTreatmentStatusesMasterStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  OrganizationModulesStore = OrganizationModulesStore;
  formErrors=null;
  statuses:any = [];
  // sliderValue = null;
  fileUploadProgress = 0;
  fileUploadsArray: any = [];
  percentage = [];
  userDetailObject = {
    first_name: '',
    last_name: '',
    designation: '',
    image_token: '',
    mobile: null,
    email: '',
    id: null,
    department: '',
    status_id: null,
  }

  riskDetailObject = {
    first_name: '',
    last_name: '',
    designation: '',
    image_token: '',
    mobile: null,
    email: '',
    id: null,
    department: '',
    status_id: null,
  }

  constructor(private _helperService:HelperServiceService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _eventEmitterService : EventEmitterService,
    private _riskTreatmentService:RiskTreatmentService,
    private _imageService:ImageServiceService,
    private _riskStatusService:RiskStatusService,
    private _riskManagementSettingService:RiskManagementSettingsService,
    private _risktreatmentStatusService:RiskTreatmentStatusesService,
    private _formBuilder:FormBuilder,) { }

  ngOnInit(): void {

    this.updateForm = this._formBuilder.group({
      percentage: [null, Validators.required],
      risk_treatment_status_id: [null, Validators.required],
      amount_used: ['', [Validators.pattern(/^[0-9]\d*(\.\d+)?$/)]],
      comment: [''],
      actual_start_date:[null],
      revised_target_date:[null],
      documents: [[], ''],
    })

    for(let i=0;i<=100;i = i+5){
      this.percentage.push(i);
    }
    // this._riskTreatmentService.getItem(this.Id).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));

    this.getUpdateModalDetails();

    this._riskManagementSettingService.getItems().subscribe(()=>{this._utilityService.detectChanges(this._cdr)})

  }

  ngAfterViewChecked(){
       
// First let's set the colors of our sliders
const settings={
  fill: '#00C73C',
  background: '#fff'
}

// First find all our sliders
const sliders = document.querySelectorAll('.range-slider');

// Iterate through that list of sliders
// ... this call goes through our array of sliders [slider1,slider2,slider3] and inserts them one-by-one into the code block below with the variable name (slider). We can then access each of wthem by calling slider
Array.prototype.forEach.call(sliders,(slider)=>{
  // Look inside our slider for our input add an event listener
//   ... the input inside addEventListener() is looking for the input action, we could change it to something like change
  slider.querySelector('input').addEventListener('input', (event)=>{
    // 1. apply our value to the span
    slider.querySelector('span').innerHTML = event.target.value;
    // 2. apply our fill to the input
    applyFill(event.target);
  });
  // Don't wait for the listener, apply it now!
  applyFill(slider.querySelector('input'));
});

// This function applies the fill to our sliders by using a linear gradient background
function applyFill(slider) {
  // Let's turn our value into a percentage to figure out how far it is in between the min and max of our input
  const percentage = 100*(slider.value-slider.min)/(slider.max-slider.min);
  // now we'll create a linear gradient that separates at the above point
  // Our background color will change here
  const bg = `linear-gradient(90deg, ${settings.fill} ${percentage}%, ${settings.background} ${percentage+0.1}%)`;
  slider.style.background = bg;
}
    // if(this.updateForm!=undefined){
    //   $(document).ready(function() {
    //     $("#master-single").slider({
    //      value: 60,
    //      orientation: "horizontal",
    //      range: "min",
    //      animate: true,
    //    });
    //    $("#eq-multi > span").each(function () {
         
    //      var value = parseInt($(this).text(), 10);
        
    //      $(this).empty().slider({
    //        value: this.sliderValue,
    //        range: "min",
    //        animate: true,
    //        orientation: "vertical",
    //        slide: (event, ui)=> {
    //          $('#slider-input').val(ui);  
    //        },
   
    //      });
    //    });
    //  })
    // }
    // this.setValue();
  
    // if(this.updateForm!=undefined){
    //   $(document).ready(function() {
    //     $("#master-single").slider({
    //      value: 60,
    //      orientation: "horizontal",
    //      range: "min",
    //      animate: true,
    //    });
    //    $("#eq-multi > span").each(function () {
    //      // console.log("slider");
    //      var value = parseInt($(this).text(), 10);
    //      var rangeValue= this.sliderValue/1000;
    //     //  console.log(value);
    //      $(this).empty().slider({
    //        value: rangeValue,
    //        range: "min",
    //        animate: true,
    //        orientation: "vertical",
    //        slide: (event, ui)=> {
    //          $('#slider-input').val(ui);  
    //        },
    //      });
    //    });
    //  })
    // }
    // this.setValue();
  }
  

  // setValue(){
  //   this.sliderValue = $('#slider-input').val();
  //   // this.sliderValue = data;
  //   this.sliderValue = this.sliderValue*1000;
  //   // console.log(this.sliderValue);
  //   this.updateForm.patchValue({
  //     amount_used:this.updateForm.value.amount_used?this.updateForm.value.amount_used.toFixed(2):'',
  //   })
  // }

  saveData(){
    let saveData={
      percentage:this.updateForm.value.percentage,
      risk_treatment_status_id: this.updateForm.value.risk_treatment_status_id,
      amount_used: this.updateForm.value.amount_used?this.updateForm.value.amount_used:'0.00',
      comment: this.updateForm.value.comment,
      actual_start_date:this._helperService.processDate(this.updateForm.value.actual_start_date,'join'),
      revised_target_date:this._helperService.processDate(this.updateForm.value.revised_target_date,'join'),
      documents: this.updateForm.value.documents,
     
    }
    return saveData;
  }

  
  getPopupDetails(user) {
    // $('.modal-backdrop').remove();
    if (user) {
      this.userDetailObject.first_name = user.first_name;
      this.userDetailObject.last_name = user.last_name;
      this.userDetailObject.designation = user.designation;
      this.userDetailObject.image_token = user.image.token;
      this.userDetailObject.email = user.email;
      this.userDetailObject.mobile = user.mobile;
      this.userDetailObject.id = user.id;
      this.userDetailObject.department = user.department ? user.department : null;
      this.userDetailObject.status_id = user.status.id ? user.status.id : 1;
      return this.userDetailObject;
    }
  }


  

  getRiskPopupDetails(user) {
    // $('.modal-backdrop').remove();
    if (user) {
      this.riskDetailObject.first_name = user.first_name;
      this.riskDetailObject.last_name = user.last_name;
      this.riskDetailObject.designation = user.designation;
      this.riskDetailObject.image_token = user.image.token;
      this.riskDetailObject.email = user.email;
      this.riskDetailObject.mobile = user.mobile;
      this.riskDetailObject.id = user.id;
      this.riskDetailObject.department = user.department ? user.department : null;
      this.riskDetailObject.status_id = user.status.id ? user.status.id : 1;
      return this.riskDetailObject;
    }
  }


  
  getArrayFormatedString(type, items, languageSupport?) {
    let item = [];
    if (languageSupport) {
      for (let i of items) {
        for (let j of i.language) {
          item.push(j.pivot);
        }
      }
      items = item;
    }
    return this._helperService.getArraySeperatedString(',', type, items);
  }

  updateTreatment(close:boolean=false){
    this.updateForm.patchValue({
      documents: this._riskTreatmentService.getDocuments(),
      // amount_used:this.updateForm.value.amount_used?this.updateForm.value.amount_used.toFixed(2):''
      amount_used:this.updateForm.value.amount_used?parseInt(this.updateForm.value.amount_used).toFixed(2):'',
    })
    this.formErrors=null;
    AppStore.enableLoading();
    this._riskTreatmentService.updateTreatmentStatus(RiskTreatmentStore.riskTreatmentDetails.id,this.saveData()).subscribe(res=>{
      this._riskTreatmentService.getItem(this.updateObject?.id,'?risk_id='+this.updateObject?.risk_id).subscribe();
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
      if(close){
        this.closeUpdateModal();
      }
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
      }
      else if(err.status == 500 || err.status==404){
        this.closeUpdateModal();
        AppStore.disableLoading();
      }
      else {
        this._utilityService.showErrorMessage('Error', 'Something Went Wrong Try Again Later');
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
    });
  }

  clear(type){
    if(type=='start_date'){
      this.updateForm.patchValue({
        actual_start_date:null
      })
    }
    else{
      this.updateForm.patchValue({
        revised_target_date:null
      })
    }
  }

  closeUpdateModal(){
    this.fileUploadsArray = [];
    this.RiskTreatmentStore.clearDocumentDetails();
    // this.updateForm.reset();
    this._eventEmitterService.dismissRiskTreatmentUpdateModal();
  }

  onFileChange(event, type: string) {
    //this.fileUploadProgress = 0;
    var selectedFiles: any[] = event.target.files;
    if (selectedFiles.length > 0) {
      var temporaryFiles = this.addItemsToFileUploadProgressArray(selectedFiles, type);
      // this.checkForFileUploadsScrollbar();
      Array.prototype.forEach.call(temporaryFiles, elem => {


        const file = elem;
        if (this._imageService.validateFile(file, type)) {
          const formData = new FormData();
          formData.append('file', file);
          RiskTreatmentStore.document_preview_available = true;
          var typeParams = (type == 'logo') ? '?type=logo' : '?type=support-file';
          this._imageService.uploadImageWithProgress(formData, typeParams).subscribe((res: HttpEvent<any>) => {
            let uploadEvent: any = res;
            switch (uploadEvent.type) {
              case HttpEventType.UploadProgress:
                // Compute and show the % done;
                if (uploadEvent.loaded) {
                  let upProgress = Math.round(100 * uploadEvent.loaded / uploadEvent.total);
                  this.assignFileUploadProgress(upProgress, file);
                }


                this._utilityService.detectChanges(this._cdr);
                break;
              case HttpEventType.Response:
                //return event;
                let temp: any = uploadEvent['body'];

                temp['is_new'] = true;
                this.assignFileUploadProgress(null, file, true);
                this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew => {

                  RiskTreatmentStore.document_preview_available = false;


                  this.createImageFromBlob(prew, temp, type);

                }, (error) => {
                  RiskTreatmentStore.document_preview_available = false;
                  this.assignFileUploadProgress(null, file, true);
                  this._utilityService.detectChanges(this._cdr);
                })
            }
          }, (error) => {
            this._utilityService.showErrorMessage('Failed', 'Sorry file upload failed');
            RiskTreatmentStore.document_preview_available = false;
            this.assignFileUploadProgress(null, file, true);
            this._utilityService.detectChanges(this._cdr);
          })
        }
        else{
          this.assignFileUploadProgress(null,file,true);
        }
      });
    }

  }

  addItemsToFileUploadProgressArray(files, type) {
    var result = this._helperService.addItemsToFileUploadProgressArray(files, type, this.fileUploadsArray);
    this.fileUploadsArray = result.fileUploadsArray;
    return result.files;
  }

  // checkForFileUploadsScrollbar() {
  //   if (RiskTreatmentStore.getDocumentDetails.length >= 5 || this.fileUploadsArray.length > 5) {
  //     $(this.uploadArea.nativeElement).mCustomScrollbar();
  //   }
  //   else {
  //     $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
  //   }
  // }

  assignFileUploadProgress(progress, file, success = false) {

    let temporaryFileUploadsArray = this.fileUploadsArray;
    this.fileUploadsArray = this._helperService.assignFileUploadProgress(progress, file, success, temporaryFileUploadsArray);
  }

  createImageFromBlob(image: Blob, imageDetails, type) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;
  
      imageDetails['preview'] = logo_url;
      if (imageDetails != null)
        this._riskTreatmentService.setImageDetails(imageDetails, logo_url, type);
      else
        this._riskTreatmentService.setSelectedImageDetails(logo_url, type);
      // this.checkForFileUploadsScrollbar();
      this._utilityService.detectChanges(this._cdr);
    }, false);
  
    if (image) {
      reader.readAsDataURL(image);
    }
  }

  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }

  removeDocument(token) {
    RiskTreatmentStore.unsetProductImageDetails('support-file', token);
    // this.checkForFileUploadsScrollbar();
    this._utilityService.detectChanges(this._cdr);
  }

  getStatus(){
    this.statuses = [];
    this._risktreatmentStatusService.getItems().subscribe(res=>{
      for(let i of res['data']){
        if(i.type=='new' || i.type=='wip' || i.type=='resolved'){
          this.statuses.push(i);
        }
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchStatus(event){
    this.statuses = [];
    this._risktreatmentStatusService.getItems(false,'?q='+event.term).subscribe(res=>{
      for(let i of res['data']){
        if(i.type=='new' || i.type=='wip' || i.type=='resolved'){
          this.statuses.push(i);
        }
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  checkForPercentage(percentage){
    if(percentage==0){
      this.updateForm.patchValue({
        risk_treatment_status_id:1
      })
     
    }
    else if(percentage==100){
      this.updateForm.patchValue({
        risk_treatment_status_id:3
      })
     
    }
  }

    convertToNumber(data){
    return parseInt(data);
  }

  checkForStatus(status){
    if(status==1){
      this.updateForm.patchValue({
        percentage:0
      })
    }
    else if(status==3){
      this.updateForm.patchValue({
        percentage:100
      })

    }
    else{
      this.updateForm.patchValue({
        percentage: null
      })
    }
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  getUpdateModalDetails() {
    this.RiskTreatmentStore.clearDocumentDetails();
    this.getStatus();
    this.historyPageChange(1);
    this._riskTreatmentService.getItem(this.updateObject.id,'?risk_id='+this.updateObject.risk_id).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
    this.updateForm.patchValue({
      percentage: RiskTreatmentStore?.riskTreatmentDetails?.percentage ? RiskTreatmentStore?.riskTreatmentDetails?.percentage : 0,
      risk_treatment_status_id: RiskTreatmentStore?.riskTreatmentDetails?.risk_treatment_status.id ? RiskTreatmentStore?.riskTreatmentDetails?.risk_treatment_status.id : null,
      amount_used: RiskTreatmentStore?.riskTreatmentDetails?.amount_used ? RiskTreatmentStore?.riskTreatmentDetails?.amount_used : '0.00',
      })
    this._utilityService.detectChanges(this._cdr);
  }

  
  historyPageChange(newPage: number = null) {
    if (newPage) RiskTreatmentStore.setHistoryCurrentPage(newPage);
    this._riskTreatmentService.getUpdateData(RiskTreatmentStore.riskTreatmentDetails.id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      
    })
  }

  getValue(e){
    // console.log(e);
    this.updateForm.patchValue({
      amount_used:e.target.value
    })
  }
}
