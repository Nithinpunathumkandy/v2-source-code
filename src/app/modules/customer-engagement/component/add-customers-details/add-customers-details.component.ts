import { Component, OnInit, Input, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpClient, HttpErrorResponse,HttpEventType,HttpEvent } from '@angular/common/http';
import { AppStore } from 'src/app/stores/app.store';
import * as myCkEditor from 'src/assets/build/ckeditor';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { CustomersStore } from "src/app/stores/customer-engagement/customers/customers-store";
import { CustomersService } from "src/app/core/services/customer-satisfaction/customers/customers.service";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-customers-details',
  templateUrl: './add-customers-details.component.html',
  styleUrls: ['./add-customers-details.component.scss']
})
export class AddCustomersDetailsComponent implements OnInit {
  @ViewChild ('formModal',{static:true}) formModal: ElementRef;
  // @Input('source') customersObject: any;
  customersForm:FormGroup;
  customersErrors:any;
  AppStore = AppStore;
  CustomersStore = CustomersStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  @Input('source') customersObject = {
    type: null,
    values: null
  }
  public Editor;
  
  constructor(private _utilityService: UtilityService, 
    private _helperService: HelperServiceService,private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder, public _customersService: CustomersService,
    private _eventEmitterService: EventEmitterService, 
    private _router: Router,
    private _http: HttpClient) { 
      this.Editor = myCkEditor;
     }
    

  ngOnInit(): void {

    this.customersForm=this._formBuilder.group({
      contact_person: '',
      contact_person_role: '',
      contact_person_number:[''],
      contact_person_email: ['',[Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
      address: ['']
    });

    this.resetForm();

    if (this.customersObject) {
      if(this.customersObject.hasOwnProperty('values') && this.customersObject.values){

        let {id,title,mobile,email,website,contact_person,contact_person_role,contact_person_number,contact_person_email,address}=this.customersObject.values
  
        this.customersForm.setValue({
          contact_person: contact_person? contact_person: '',
          contact_person_role: contact_person_role? contact_person_role: '',
          contact_person_number: contact_person_number? contact_person_number: '',
          contact_person_email: contact_person_email? contact_person_email: '',
          address: address? address: '',
        })
      }
    }
  }
  // saveCustomers(close:boolean=false){
  //   this.customersErrors=null;
  //   if(this.customersForm.value){
  //     let save;
  //     AppStore.enableLoading();

  //     if (this.customersForm.value.id) {
  //       save = this._customersService.updateItem(this.customersForm.value.id, this.customersForm.value);
  //     } else {
  //       // Deleting ID before POST
  //       delete this.customersForm.value.id
  //       save = this._customersService.saveItem(this.customersForm.value);
  //     }
  //     save.subscribe((res: any) => {
  //       if(!this.customersForm.value.id){
  //         this.resetForm();}
  //       AppStore.disableLoading();
  //       setTimeout(() => {
  //         this._utilityService.detectChanges(this._cdr);
  //       }, 500);
  //       if (close) this.closeFormModal();
  //     }, (err: HttpErrorResponse) => {
  //       if (err.status == 422) {
  //         this.customersErrors = err.error.errors;}
  //         else if(err.status == 500 || err.status == 403){
  //           this.closeFormModal();
  //         }
  //         AppStore.disableLoading();
  //         this._utilityService.detectChanges(this._cdr);
        
  //     });
  //   }
  // }
  // function for add & update
save(close: boolean = false) {
  this.customersErrors = null;

  if (this.customersForm.value) {
    let save;
    AppStore.enableLoading();

    if (this.customersForm.value.id) {
     
      save = this._customersService.updateItem(this.customersForm.value.id, this.customersForm.value);
    } else {

      delete this.customersForm.value.id
      save = this._customersService.saveItem(this.customersForm.value);
    }

    save.subscribe((res: any) => {
      if (!this.customersForm.value.id) {
        this.resetForm();
      }
     
      AppStore.disableLoading();
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      if (close){
        this.closeFormModal();
        this._router.navigateByUrl('/customer-engagement/customer/'+ CustomersStore.customersId);
      } 
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.customersErrors = err.error.errors;
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
  

  closeFormModal(){
    this.resetForm();
    this._eventEmitterService.dismissCustomersModal();
    // Emitting Event To set the Style in Parent Component(MODAL)
    // this._eventEmitterService.setModalStyle();
  }
   
  //getting button name by language
getButtonText(text){
  return this._helperService.translateToUserLanguage(text);
}

}
