import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpClient, HttpErrorResponse,HttpEventType,HttpEvent } from '@angular/common/http';
import { AppStore } from 'src/app/stores/app.store';
import * as myCkEditor from 'src/assets/build/ckeditor';
import { MyUploadAdapter } from "src/app/shared/directives/upload-adapter";

import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { OrganizationfileService } from "src/app/core/services/organization/organization-file/organizationfile.service";
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { CustomersStore } from "src/app/stores/customer-engagement/customers/customers-store";
import { CustomersService } from "src/app/core/services/customer-satisfaction/customers/customers.service";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-customers-component',
  templateUrl: './add-customers-component.component.html',
  styleUrls: ['./add-customers-component.component.scss']
})
export class AddCustomersComponentComponent implements OnInit {

  @Input ('source') CustomersSource:any;
  customersForm:FormGroup;
  customersErrors:any;
  AppStore = AppStore;
  CustomersStore = CustomersStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  logoUploaded = false;
  fileUploadProgress = 0;

  config = {
    toolbar: [
      'undo',
      'redo',
      '|',
      'heading',
      
      '|',
      'bold',
      'italic',
     
      '|',
      'link',
      'imageUpload',
      '|',
      
      'bulletedList',
      'numberedList',
      '|',
      'indent',
      'outdent',
      '|',
      'insertTable',
      'blockQuote',
     
    ],
    language: 'id',
    image: {
      toolbar: [
        'imageTextAlternative',
        'imageStyle:full',
        'imageStyle:side'
      ]
    }
  };
  

  public Editor;
  public Config;
  
  constructor(private _utilityService: UtilityService, 
    private _organizationFileService: OrganizationfileService,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder, public _customersService: CustomersService,
    private _eventEmitterService: EventEmitterService, 
    private _router:Router,
    private _http: HttpClient) { 
      this.Editor = myCkEditor;
     }
    
     public onReady(editor: any) {
      editor.ui.getEditableElement().parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
      );
    }

    ngOnInit(): void {

      this.customersForm=this._formBuilder.group({
        id:'',
        title: ['', [Validators.required, Validators.maxLength(500)]],
        mobile:[''],
        email:['',[Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
        website:['',[Validators.pattern(/^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/)]],
        contact_person: '',
        contact_person_role: '',
        contact_person_number:[''],
        contact_person_email: ['',[Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
        address: ['']
      });
  
      this.resetForm();
  
      // Checking if Source has Values and Setting Form Value

      if (this.CustomersSource) {
        if(this.CustomersSource.hasOwnProperty('values') && this.CustomersSource.values){
  
          let {id,title,mobile,email,website,contact_person,contact_person_role,contact_person_number,contact_person_email,address}=this.CustomersSource.values
    
          this.customersForm.setValue({
            id: id,
            title: title,
            mobile: mobile ? mobile : '',
            email: email? email: '',
            website: website? website: '',
            contact_person: contact_person? contact_person: '',
            contact_person_role: contact_person_role? contact_person_role: '',
            contact_person_number: contact_person_number? contact_person_number: '',
            contact_person_email: contact_person_email? contact_person_email: '',
            address: address? address: '',
          })
        }
      }
  
 
  
  
    }

    MyCustomUploadAdapterPlugin( editor ) {
      editor.plugins.get( 'FileRepository' )
      .createUploadAdapter = ( loader ) => {
          // Configure the URL to the upload script in your back-end here!
          return new MyUploadAdapter( loader, this._http );
      };
  }

    saveCustomers(close: boolean = false) {
      this.customersErrors = null;
    
      if (this.customersForm.value) {
        let save;
        this.customersForm.value.image = this._customersService.getFileDetails('logo');
        AppStore.enableLoading();
    
        if (this.customersForm.value.id) {
         
          save = this._customersService.updateItem(this.customersForm.value.id, this.customersForm.value);
        } else {
    
          delete this.customersForm.value.id
          save = this._customersService.saveItem(this.customersForm.value);
        }
    
        save.subscribe((res: any) => {
          // this.res_id = res.id;// assign id to variable;
          AppStore.disableLoading();
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
          }, 500);
          if (close){
            this.closeFormModal({id: res?.id, title: this.customersForm.get('title')?.value});
            CustomersStore.clearDocumentDetails();
            CustomersStore.clearFileDetails('logo');
            // this._router.navigateByUrl('/customer-engagement/complaint/'+ res.id +'/info');
          } 
          if (!this.customersForm.value.id) {
            this.resetForm();
            CustomersStore.clearDocumentDetails();
            CustomersStore.clearFileDetails('logo');
          }
        }, (err: HttpErrorResponse) => {
          if (err.status == 422) {
            this.customersErrors = err.error.errors;
            // this.processFormErrors();
          } else if(err.status == 500 || err.status == 403){
            this.cancel();
          }
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
    
        });
      }
    }
  
  cancel() {
      
    this.closeFormModal();
    }
  
  
    resetForm(){
      this.customersForm.reset();
      this.customersForm.pristine;
      this.customersErrors = null;
      AppStore.disableLoading();
    }
  
    closeFormModal(data?){
      this.resetForm();
      CustomersStore.clearFileDetails('logo');
      this._eventEmitterService.dismissCustomersModal(data);
      // Emitting Event To set the Style in Parent Component(MODAL)
      // this._eventEmitterService.setModalStyle();
    }
     
    //getting button name by language
  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  onFileChange(event,type:string){
    this.fileUploadProgress = 0;
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if(this._imageService.validateFile(file,type)){
        const formData = new FormData();
        formData.append('file',file);
        if(type == 'logo') CustomersStore.logo_preview_available = true;
        var typeParams  = (type == 'logo')?'?type=logo':'?type=support-file';
        this._imageService.uploadImageWithProgress(formData,typeParams)
        .subscribe((res: HttpEvent<any>) => {
          let uploadEvent: any = res;
          // console.log(uploadEvent.type);
          switch (uploadEvent.type) {
          case HttpEventType.UploadProgress:
            // Compute and show the % done;
            if(uploadEvent.loaded)
              this.fileUploadProgress = Math.round(100 * uploadEvent.loaded / uploadEvent.total);
            this._utilityService.detectChanges(this._cdr);
            break;
          case HttpEventType.Response:
            $("#file").val('');
            let temp: any = uploadEvent['body'];
            temp['is_new'] = true;
            this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew=>{
              if(type == 'logo'){
                this.logoUploaded = true;
                CustomersStore.logo_preview_available = false;
              }
              this.createImageFromBlob(prew,temp,type);
            },(error)=>{
              $("#file").val('');
              CustomersStore.logo_preview_available = false;
              this._utilityService.detectChanges(this._cdr);
            })
          }
        },(error)=>{
          $("#file").val('');
          CustomersStore.logo_preview_available = false;
          this.fileUploadProgress = 0;
          let errorMessage = "";
          if(error.error?.errors?.hasOwnProperty('file'))
            errorMessage = error.error.errors.file;
          else errorMessage = 'file_upload_failed';
          this._utilityService.showErrorMessage('failed', errorMessage);
          this._utilityService.detectChanges(this._cdr);
        })
      }
      else{
        $("#file").val('');
      }
    }
  }
  createImageFromBlob(image: Blob,imageDetails,type) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;
      imageDetails['preview'] = logo_url;
      this._customersService.setFileDetails(imageDetails,logo_url,type);
      this._utilityService.detectChanges(this._cdr);
    }, false);
 
    if (image) {
       reader.readAsDataURL(image);
    }
  }
  checkExtension(ext,extType){
    var res = this._imageService.checkFileExtensions(ext,extType);
    return res;
  }

  getDefaultImage(){
    return this._imageService.getDefaultImageUrl('general');
  }

  checkAcceptFileTypes(type){
    return this._imageService.getAcceptFileTypes(type); 
  }
}
