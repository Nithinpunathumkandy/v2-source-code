import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from "src/app/shared/services/utility.service";
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AppStore } from 'src/app/stores/app.store';
import { HttpErrorResponse } from '@angular/common/http';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import {MaturityMatrixService} from 'src/app/core/services/event-monitoring/event-maturity-matrix/maturity-matrix.service';
import { UsersService } from "src/app/core/services/human-capital/user/users.service";
import { UsersStore } from "src/app/stores/human-capital/users/users.store";
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-matrix-plan',
  templateUrl: './add-matrix-plan.component.html',
  styleUrls: ['./add-matrix-plan.component.scss']
})
export class AddMatrixPlanComponent implements OnInit {

  @Input('source') matrixPlanSource: any;
  planForm: FormGroup;
  formErrors: any;
  AppStore = AppStore;
  UsersStore = UsersStore;
  constructor(private _formBuilder: FormBuilder,private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, private _maturityMatrixService: MaturityMatrixService,
    private _eventEmitterService: EventEmitterService, private _helperService: HelperServiceService,
    private _userService: UsersService,private _imageService: ImageServiceService,
    private route: Router
   ) { }

   ngOnInit(): void {
    this.planForm = this._formBuilder.group({
      title: [null,[Validators.required]],
      description: [null],
      start_date: [null,[Validators.required]],
      end_date: [null,[Validators.required]],
      responsible_user_ids: [[],[Validators.required]],
      id:null
    });
    if (this.matrixPlanSource.type == 'Edit') {
      //this.setFormValues();
      if(this.matrixPlanSource.hasOwnProperty('values') && this.matrixPlanSource.values)
      {
        this.getMatrixPlanDetails(this.matrixPlanSource.values.id)
      }
    }
  }

  getMatrixPlanDetails(id)
  {
    this._maturityMatrixService.getPlanItem(id).subscribe(res => {
      this.setFormValues(res);
      this._utilityService.detectChanges(this._cdr)
    })
  }

  setFormValues(value){
    if (this.matrixPlanSource.hasOwnProperty('values') && this.matrixPlanSource.values) {
      this.planForm.patchValue({
        title:value.title,
        description:value.description,
        start_date:value.start_date ? this._helperService.processDate(value.start_date,'split') : null,
        end_date:value.end_date ? this._helperService.processDate(value.end_date,'split') : null,
        responsible_user_ids:value.responsible_users,
        id:value.id,
      })
      this._utilityService.detectChanges(this._cdr);
    }
  }
  closeFormModal(){
    this._eventEmitterService.dismissMatrixPlanModal();
    this.formErrors = null;
    this.planForm.reset();
  }
   //getting button name by language
   getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }
  searchUers(e){
    var params = '';
    this._userService.searchUsers('?q='+e.term+params).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }
  getUsers(){
    var params = '';
    this._userService.getAllItems(params).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }

  createImagePreview(type,token){
    return this._imageService.getThumbnailPreview(type,token)
  }

  // Returns default image
  getDefaultImage(type){
    return this._imageService.getDefaultImageUrl('user-logo');
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
  processData()
  {
    const data={
      "title": this.planForm.value.title,
      "description": this.planForm.value.description,
      "start_date":this.planForm.value.start_date?this._helperService.processDate(this.planForm.value.start_date,'join') : null,
      "end_date": this.planForm.value.end_date?this._helperService.processDate(this.planForm.value.end_date,'join') : null,
      "responsible_user_ids":this.planForm.value.responsible_user_ids ? this._helperService.getArrayProcessed(this.planForm.value.responsible_user_ids,'id') : []
    }
    return data;
  }

  save(close?)
  {
    let save: any;
    this.formErrors = null;
    AppStore.enableLoading();
    if (this.matrixPlanSource.type=='Edit') {
      save = this._maturityMatrixService.updatePlanItem(this.processData(),this.planForm.value.id);
    }
    else
    {
      save = this._maturityMatrixService.savePlanItem( this.processData());
    }
    
    // }
    save.subscribe(res=>{
      AppStore.disableLoading();
      this.planForm.reset();
      this.route.navigateByUrl('event-monitoring/maturity-matrix/maturity-matrix-plan/'+res.id)
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      if(close) this.closeFormModal();
      
    }, (err: HttpErrorResponse) => {
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
      if (err.status == 422) {
        this.formErrors = err.error.errors;
        this._utilityService.detectChanges(this._cdr);
      }
    })
  }

}
