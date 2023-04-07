import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AppStore } from 'src/app/stores/app.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import { OrganizationSettingsService } from 'src/app/core/services/settings/organization_settings/organization-settings.service';
import { Router } from '@angular/router';
import { TimezonesService } from 'src/app/core/services/settings/timezones/timezones.service';
import { TimezonesStore } from 'src/app/stores/settings/timezones.store';
import { AuthStore } from "src/app/stores/auth.store";
import { CurrencyMasterStore } from 'src/app/stores/masters/general/currency-store';
import { CurrencyService } from 'src/app/core/services/masters/general/currency/currency.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Component({
  selector: 'app-organization-settings',
  templateUrl: './organization-settings.component.html',
  styleUrls: ['./organization-settings.component.scss']
})
export class OrganizationSettingsComponent implements OnInit {
  form: FormGroup;
  AppStore = AppStore;
  TimezonesStore = TimezonesStore;
  AuthStore = AuthStore;
  formErrors: any;
  organization_id = 1;
  CurrencyMasterStore = CurrencyMasterStore;
  // date formate object
  dateFormat = [
    // { title: "short", value: "M/d/yy, h:mm a" },
    // { title: "medium", value: "MMM d, y, h:mm:ss a" },
    // { title: "long", value: "MMMM d, y, h:mm:ss a z" },
    // { title: "full", value: "EEEE, MMMM d, y, h:mm:ss a zzzz" },
    { title: "shortDate", value: "M/d/yy" },
    { title: "mediumDate", value: "MMM d, y" },
    { title: "longDate", value: "MMMM d, y" },
    { title: "dd/MM/yy", value: "dd/MM/yy" },
    { title: "fullDate", value: "EEEE, MMMM d, y" }]

  // time formate object
  timeFormat = [
    // { title: "shortTime", value: "h:mm a" },
    // { title: "mediumTime", value: "h:mm:ss a" },
    // { title: "longTime", value: "h:mm:ss a z" },
    // { title: "fullTime", value: "h:mm:ss a zzzz" }
    { title: "short", value: "M/d/yy, h:mm a" },
    { title: "medium", value: "MMM d, y, h:mm:ss a" },
    { title: "long", value: "MMMM d, y, h:mm:ss a z" },
    { title: "M/d/yy, H:mm", value: "M/d/yy, H:mm" },
    { title: "MMM d, y, H:mm", value: "MMM d, y, H:mm" },
    { title: "MMMM d, y, H:mm", value: "MMMM d, y, H:mm" },
    { title: "dd/MM/yyyy hh:mm:ss", value: "dd/MM/yyyy hh:mm:ss"},
    { title: "full", value: "EEEE, MMMM d, y, h:mm:ss a zzzz" },
  ]


  // currency objects

  currencies = [{ title: "Rupee", value: "₹" },
  { title: "Dollar", value: "$" },
  { title: "Euro", value: "€" },
  { title: "Dirham", value: "د.إ" }]


  // maximum logo size objects

  logoSize = [
    { title: "1MB", value: 1000 },
    { title: "2MB", value: 2000 },
    { title: "5MB", value: 5000 },
    { title: "12MB", value: 12000 },
    { title: "20MB", value: 20000 },
    { title: "50MB", value: 50000 },
    { title: "100MB", value: 100000 }
  ]


  // maximum supported file size objects

  supportedFileSize = [
    { title: "1MB", value: 1000 },
    { title: "2MB", value: 2000 },
    { title: "5MB", value: 5000 },
    { title: "12MB", value: 12000 },
    { title: "20MB", value: 20000 },
    { title: "50MB", value: 50000 },
    { title: "100MB", value: 100000 },
    { title: "200MB", value: 200000 },
    { title: "500MB", value: 500000 },
  ]


  // logo file types objects

  logoFileTypes = [
    { title: "JPEG", value: "JPEG" },
    { title: "PNG", value: "PNG" },
    { title: "BMP", value: "BMP" },
    { title: "SVG", value: "SVG" },
    { title: "GIF", value: "GIF" },
    { title: "JPG", value: "JPG"}
  ];


  // supported file types objects
  // ['jpeg', 'png', 'bmp', 'gif', 'svg', 'jpg', 'pdf', 'xls', 'xlsx', 'docx', 'doc', 'pptx','ppt','mp4','mp3','zip','avi','mov','ogg','wmv','webm','wav']
  supportedFileTypes = [
    { title: "JPEG", value: "JPEG" },
    { title: "JPG", value: "JPG"},
    { title: "PNG", value: "PNG" },
    { title: "BMP", value: "BMP" },
    { title: "SVG", value: "SVG" },
    { title: "GIF", value: "GIF" },
    { title: "PDF", value: "PDF" },
    { title: "XLSX", value: "XLSX" },
    { title: "DOCX", value: "DOCX" },
    { title: "PPTX", value: "PPTX" },
    { title: "PPT", value: "PPT" },
    { title: "MP3", value: "MP3" },
    { title: "MEDIA", value: "MPEG-4 / H.264" },
    { title: "MP4", value: "MP4" },
    { title: "AVI", value: "AVI" },
    { title: "MOV", value: "MOV" },
    { title: "DOC", value: "DOC" },
    { title: "ZIP", value: "ZIP" },
    { title: "DOT", value: "DOT" },
    { title: "DOTX", value: "DOTX" },
  ]

  timeoutTimeList = [
    { title: '1 Min', value: 60 },
    { title: '2 Min', value: 120 },
    { title: '3 Min', value: 180 },
    { title: '5 Min', value: 300 },
    { title: '10 Min', value: 600 },
    { title: '15 Min', value: 900 },
    { title: '30 Min', value: 1800 }
  ]

  clockFormat=[
    {title:'24 Hour Clock',value:"24-hour clock"},
    {title:'12 Hour Clock',value:"12-hour clock"}
  ]

  sliderChanged: boolean = false;


  constructor(private _formBuilder: FormBuilder, private _cdr: ChangeDetectorRef,
    private _organizationSettingsService: OrganizationSettingsService,
    private _router: Router, private _timeZoneService: TimezonesService,
    private _currencyService:CurrencyService,
    private _utilityService: UtilityService,
    private _helperService:HelperServiceService) { }

  ngOnInit(): void {

    this.getTimeZones();

    // Form Object to add Control Category
    this.form = this._formBuilder.group({
      currency: [''],
      date_format: [''],
      date_time_format: [''],
      max_logo_upload_size: [''],
      logo_allowed_types: [],
      support_file_allowed_types: [],
      max_support_file_upload_size: [''],
      timezone_id:[''],
      is_autolock : false,
      autolock_seconds: [''],
      is_chatbot : false,
      is_ms_type: false,
      is_user_reward : false,
      is_feedback:false,
      is_faq:false,
      clock_format :['']
    });

    this.getCurrency();
     // calling organization data
     this.getOrganizationSettings();

     this.resetForm();

  }


  // for resetting the form
  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
  }

  // cancel modal
  cancel() {
    // FormErrorStore.setErrors(null);
    this.resetForm();
    this._router.navigateByUrl('/settings/language');

  }

  getCurrency() {
    this._currencyService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  // getting defualt settings
  getOrganizationSettings(){
    this._organizationSettingsService.getOrganizationSettings(this.organization_id).subscribe(res =>{
      this.form.setValue({
        currency: res.currency,
        date_format: res.date_format,
        date_time_format:res.date_time_format,
        max_logo_upload_size:res.max_logo_upload_size,
        logo_allowed_types:res.logo_allowed_types,
        support_file_allowed_types:res.support_file_allowed_types,
        max_support_file_upload_size:res.max_support_file_upload_size,
        timezone_id: res.timezone ? res.timezone.id : null,
        is_autolock: res.is_autolock > 0 ? true : false,
        autolock_seconds: res.autolock_seconds,
        is_chatbot: res.is_chatbot? true : false,
        is_ms_type : res.is_ms_type? true : false,
        is_user_reward : res.is_user_reward? true : false,
        is_feedback : res.is_feedback ? true : false,
        is_faq :  res.is_faq ? true : false,
        clock_format :res.clock_format?res.clock_format:'12-hour clock'
      })
      this.enableDisable();
      this._utilityService.detectChanges(this._cdr);
    })
  }

  // save button enable/disable function
  enableDisable() {
    // if (this.form.value.max_support_file_upload_size != null  ) {
    //   return true;

    // } else if (this.form.value.support_file_allowed_types != null && this.form.value.support_file_allowed_types.length!=0) {
    //   return true;
    // } else if (this.form.value.logo_allowed_types != null && this.form.value.logo_allowed_types.length!=0) {
    //   return true;
    // } else if (this.form.value.max_logo_upload_size != null) {
    //   return true;
    // } else if (this.form.value.date_time_format != null) {
    //   return true;
    // } else if (this.form.value.date_format != null) {
    //   return true;
    // } else if (this.form.value.currency != null) {
    //   return true;
    // } else if(this.form.value.timezone_id != null) {
    //   return true;
    // } else if (this.form.value.autolock_seconds != null) {
    //   return true;
    // } else if(!this.sliderChanged){
    //   console.log(this.sliderChanged);
    //   return true;
    // }
    // else {
    //   return false;
    // }
    return this.form.dirty;
  }

  getTimeZones(){
    this._timeZoneService.getAllItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
  }

  // function for add & update
  save(close: boolean = false) {

    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();
      this.processSaveData();
      save = this._organizationSettingsService.updateItem(this.organization_id, this.form.value);
      save.subscribe((res: any) => {
        //this.ngOnInit(); // calling to refresh page and disable save button after successfull api call
        this.getOrganizationSettings();
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
        }
      });
    }
  }

  processSaveData(){
    if(this.form.value.autolock_seconds)
      this.form.patchValue({is_autolock: true});
    else
      this.form.patchValue({is_autolock: false});
  }

  checkStatusValue(type){
    return this.form.controls[type].value;
  }

  changeSettings(type,event:boolean){
    this.form.controls[type].setValue(event);
    this.form.markAsDirty();
    this._utilityService.detectChanges(this._cdr);
  }

  //getting button name by language
getButtonText(text){
  return this._helperService.translateToUserLanguage(text);
}

}
