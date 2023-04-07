import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AppStore } from 'src/app/stores/app.store';
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { ArciStore } from "src/app/stores/bpm/arci/arci.store";
import { ArciService } from "src/app/core/services/bpm/arci-matrix/arci.service";
import {ProcessStore} from 'src/app/stores/bpm/process/processes.store'
import { ProcessService } from 'src/app/core/services/bpm/process/process.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import {UsersStore} from 'src/app/stores/human-capital/users/users.store'
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { BpmFileService } from 'src/app/core/services/bpm/bpm-file/bpm-file.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import {ControlsService } from 'src/app/core/services/bpm/controls/controls.service';
import { ControlArciService } from 'src/app/core/services/bpm/controls/control-arci.service';
import { ControlStore } from 'src/app/stores/bpm/controls/controls.store';

@Component({
  selector: 'app-control-arci-add',
  templateUrl: './control-arci-add.component.html',
  styleUrls: ['./control-arci-add.component.scss']
})
export class ControlArciAddComponent implements OnInit {

 
  @Input ('source') arciMatrixSource:any;
  arciMatrixForm:FormGroup;
  arciMatrixFormErrors:any;
  AppStore = AppStore;
  ArciStore = ArciStore;
  ControlStore = ControlStore;
  UsersStore = UsersStore
  
  responsible_users: any = [];
  accountable_users: any = [];
  informed_users: any = [];
  consulted_users: any = [];

  updateStatus: boolean = false;
  dataParams: any

  constructor(private _utilityService: UtilityService, 
    private _helperService: HelperServiceService,private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder, public _arciService: ControlArciService,private _controlService:ControlsService,
    private _eventEmitterService: EventEmitterService,private _userService:UsersService,private _imageService:ImageServiceService,private _bpmFileService:BpmFileService) { }

    ngOnInit(): void {
     
  
      // Form Object to add Control Category
  
      this.arciMatrixForm=this._formBuilder.group({
        control_id: ['',Validators.required],
        accountable_user_ids: [''],
        responsible_user_ids: [''],
        consulted_user_ids: [''],
        informed_user_ids:['']
      })
  
      this.resetForm();
      this.getControl();
      this.getUsers();
      // Checking if Source has Values and Setting Form Value
  
      if (this.arciMatrixSource.hasOwnProperty('values') && this.arciMatrixSource.values) {
        
        this.updateStatus = true;

        if (this.updateStatus)
        this.arciMatrixForm.controls["control_id"].disable()
        
        this.arciMatrixForm.setValue({
          control_id: this.arciMatrixSource.values.control_id,
          accountable_user_ids:this.arciMatrixSource.values.accountable_user,
          responsible_user_ids:this.arciMatrixSource.values.responsible_user,
          consulted_user_ids: this.arciMatrixSource.values.consulted_user,
          informed_user_ids: this.arciMatrixSource.values.informed_user,
          
        })

   this.searchControl({term: this.arciMatrixSource.values.control_id});
      }
  }

  searchControl(e){
    this._controlService.getAllItems(false, '&q=' + e.term).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    // }
  }
  
  searchUers(e) {
    this._userService.searchUsers('?q=' + e.term ).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }
  
  
    customSearchFn(term: string, item: any) {
      term = term.toLowerCase();
      // Creating and array of space saperated term and removinf the empty values using filter
      let splitTerm = term.split(' ').filter(t => t);
      let isWordThere = [];
      // Pushing True/False if match is found
      splitTerm.forEach(arr_term => {
        item['searchLabel'] = item['first_name']+''+item['last_name']+''+item['email']+''+item['designation_title'];
        let search = item['searchLabel'].toLowerCase();
        if(search) isWordThere.push(search.indexOf(arr_term) != -1);
      });
  
      const all_words = (this_word) => this_word;
      // Every method will return true if all values are true in isWordThere.
      return isWordThere.every(all_words);
    }

  getControl() {
    this._controlService
    .getAllItems(false)
    .subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  
  getUsers() {
    this._userService
    .getAllItems()
    .subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

   // Returns image url according to type and token
   createImageUrl(type, token) {
    return this._bpmFileService.getThumbnailPreview(type, token);
  }

   // Returns default image url
   getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }
  
  
  saveARCI(close: boolean = false) {

    this.responsible_users = [];
    this.accountable_users= [];
    this.informed_users = [];
    this.consulted_users = [];
    
    if (this.arciMatrixForm.value.responsible_user_ids) {

      for (let i of this.arciMatrixForm.value.responsible_user_ids) {
        this.responsible_users.push(i.id);
      }
    }

    if (this.arciMatrixForm.value.accountable_user_ids) {

      for (let i of this.arciMatrixForm.value.accountable_user_ids) {
        this.accountable_users.push(i.id);
      }
    }
    
    if (this.arciMatrixForm.value.consulted_user_ids) {

      for (let i of this.arciMatrixForm.value.consulted_user_ids) {
        this.consulted_users.push(i.id);
      }
    }
    
    if (this.arciMatrixForm.value.informed_user_ids) {

      for (let i of this.arciMatrixForm.value.informed_user_ids) {
        this.informed_users.push(i.id);
      }
    }  

    this.arciMatrixFormErrors = null;
    
      if(this.arciMatrixForm.value){
        let save
        AppStore.enableLoading();
  
        if (this.updateStatus) {

          this.sortData('update')
          save = this._arciService.saveItem(this.dataParams,'update');
        } else {
          this.sortData('save',this.arciMatrixForm.value)
          save = this._arciService.saveItem(this.dataParams,'save')
        }
        save.subscribe((res: any) => {
          AppStore.disableLoading();
          this.resetForm()
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
          }, 500);
          if (close) this.closeFormModal();
        }, (err: HttpErrorResponse) => {
          AppStore.disableLoading();
          if (err.status == 422) {
            this.arciMatrixFormErrors = err.error.errors;
            AppStore.disableLoading();
          }
          else if(err.status == 500 || err.status == 403){
            this.closeFormModal();
          }
          this._utilityService.detectChanges(this._cdr);
        });
      }
    }
  
  cancel() {
    this.resetForm()  
    this.closeFormModal();
  }

  controlChange(id) {

    // To Set Accountable,Responsible,Consulted & Informed User  Selected Based on Process 

    this._controlService.getItemById(id).subscribe(res => {
      let ARCIDetails = res;

      this.arciMatrixForm.patchValue({
        // accountable_user_ids:ARCIDetails.process_accountable_users,
        // responsible_user_ids:ARCIDetails.process_responsible_users,
        // consulted_user_ids: ARCIDetails.process_consulted_users,
        // informed_user_ids: ARCIDetails.process_informed_users,
      
      })

    })
  }

  validityCheck() {
    
    let values = this.arciMatrixForm.value
    if (values.accountable_user_ids && values.accountable_user_ids.length >0 || values.responsible_user_ids && values.responsible_user_ids.length > 0 || values.consulted_user_ids && values.consulted_user_ids.length > 0 || values.informed_user_ids && values.informed_user_ids.length > 0)
      return false
    else
      return true

  }
  
  sortData(type,data?) {
    
    if (type == 'update') {
      
      this.dataParams = {
        informed_user_ids: this.informed_users,
        consulted_user_ids: this.consulted_users,
        accountable_user_ids: this.accountable_users,
        responsible_user_ids:this.responsible_users,
        control_id:this.arciMatrixSource.values.control_id,
      }
    }
    else {

      this.dataParams = {
        ...data,
        informed_user_ids: this.informed_users,
        consulted_user_ids: this.consulted_users,
        accountable_user_ids: this.accountable_users,
        responsible_user_ids:this.responsible_users,
      }

    }

  }
  
    resetForm(){
      this.arciMatrixForm.reset();
      this.arciMatrixForm.pristine;
      this.arciMatrixFormErrors = null;
    }
  
    closeFormModal(){
      this.resetForm();
      this._eventEmitterService.dismissarciMatrixModal()
      // Emitting Event To set the Style in Parent Component(MODAL)
      this._eventEmitterService.setModalStyle();
    }

//getting button name by language
  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }
}
