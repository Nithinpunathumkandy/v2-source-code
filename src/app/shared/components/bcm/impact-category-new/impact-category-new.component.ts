import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BiaCategoryService } from 'src/app/core/services/bcm/bia-category/bia-category.service';
import { BiaRatingService } from 'src/app/core/services/bcm/bia-rating/bia-rating.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { BiaCategoryStore } from 'src/app/stores/bcm/configuration/bia-category/bia-category-store';
import { BiaMatrixStore } from 'src/app/stores/bcm/configuration/bia-matrix.store';
import { BiaRatingStore } from 'src/app/stores/bcm/configuration/bia-rating/bia-rating-store';

@Component({
  selector: 'app-impact-category-new',
  templateUrl: './impact-category-new.component.html',
  styleUrls: ['./impact-category-new.component.scss']
})
export class ImpactCategoryNewComponent implements OnInit {
  @Input('source') source: any;

  BiaMatrixStore = BiaMatrixStore;
  BiaCategoryStore = BiaCategoryStore;
  BiaRatingStore = BiaRatingStore;
  AppStore = AppStore;
  form: FormGroup;
  formErrors: any;
  impactCategoryArray=[]
  sampleArray = [
    {"id":2,"title":"Finding","type":"finding","status_id":1,"status_label":"green-dot","status":"Active","created_by":1,"created_by_first_name":"Super","created_by_last_name":"Admin","created_by_image_token":null,"created_by_designation":"Admin","created_by_department":"Demo Department","created_by_status":"Active","created_at":"2021-03-21 07:55:24","updated_by":null,"updated_by_first_name":null,"updated_by_last_name":null,"updated_by_image_token":null,"updated_by_designation":null,"updated_by_department":null,"updated_by_status":null,"updated_at":"2021-03-21 07:55:24"},
    {"id":4,"title":"General","type":"general","status_id":1,"status_label":"green-dot","status":"Active","created_by":1,"created_by_first_name":"Super","created_by_last_name":"Admin","created_by_image_token":null,"created_by_designation":"Admin","created_by_department":"Demo Department","created_by_status":"Active","created_at":"2021-03-21 07:55:24","updated_by":null,"updated_by_first_name":null,"updated_by_last_name":null,"updated_by_image_token":null,"updated_by_designation":null,"updated_by_department":null,"updated_by_status":null,"updated_at":"2021-03-21 07:55:24"},
    {"id":3,"title":"Process","type":"process","status_id":1,"status_label":"green-dot","status":"Active","created_by":1,"created_by_first_name":"Super","created_by_last_name":"Admin","created_by_image_token":null,"created_by_designation":"Admin","created_by_department":"Demo Department","created_by_status":"Active","created_at":"2021-03-21 07:55:24","updated_by":null,"updated_by_first_name":null,"updated_by_last_name":null,"updated_by_image_token":null,"updated_by_designation":null,"updated_by_department":null,"updated_by_status":null,"updated_at":"2021-03-21 07:55:24"},
    {"id":1,"title":"Risk","type":"risk","status_id":1,"status_label":"green-dot","status":"Active","created_by":1,"created_by_first_name":"Super","created_by_last_name":"Admin","created_by_image_token":null,"created_by_designation":"Admin","created_by_department":"Demo Department","created_by_status":"Active","created_at":"2021-03-21 07:55:24","updated_by":null,"updated_by_first_name":null,"updated_by_last_name":null,"updated_by_image_token":null,"updated_by_designation":null,"updated_by_department":null,"updated_by_status":null,"updated_at":"2021-03-21 07:55:24"}]
  is_English: boolean = true;
  titleArray: any;
  tableData=[]
  sample1
  newTableData = [];
  titlesArray = [];
  tableInputValue='' // Adding value 

  constructor(
    private _formBuilder: FormBuilder,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _biaCategoryService: BiaCategoryService,
    private _biaRatingService: BiaRatingService
  ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id:[''],
      eng_impact_category:['',[Validators.required]],
      eng_title:[''],
      eng_impact_level:['',[Validators.required]],
    })
    this.resetForm();
    this.getBiaRating();
    if (this.source)
    this.setValue();
  }

  tabChange(status:boolean){
    this.is_English = status;
    this.resetForm()
    this.impactCategoryArray = []
  }

  modelChange(event){
    // if(this.tableInputValue==''){
    //   this.tableInputValue = event.data
    // }else{
    //   this.tableInputValue = this.tableInputValue+event.data
    // }
    // var object={
    //   rowIndex:rowIndex,
    //   colIndex:columnIndex,
    //   value:this.tableInputValue
    // }
    // console.log("valu",object)
    console.log(event)
  }


  ngDoCheck(){
    if (this.source && this.source.hasOwnProperty('values') && this.source.values && !this.form.value.id)
      this.setValue();
  }

  setValue(){
    if (this.source.hasOwnProperty('values') && this.source.values) {
      let {title,bia_impact_rating_id,id } = this.source.values
      console.log(this.source.values);
      
      this.form.patchValue({
        id: id,
        eng_impact_category: title,
        eng_impact_level:bia_impact_rating_id
      })
    }
  }

  searchBiaRating(e) {
    this._biaRatingService.getItems(false,'&q='+e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getBiaRating() {
    this._biaRatingService.getItems(false).subscribe(res => {
    this._utilityService.detectChanges(this._cdr);
  })
  }

  // saveImpactCategory(close:boolean=false){
  //   BiaMatrixStore.set_impactCategory(this.form.value)
  //   this.resetForm()
  //   if (close) this.closemsModal();
  // }

  // function for add & update
  saveImpactCategory(close: boolean = false) {
  BiaMatrixStore.set_impactCategory(this.form.value)
  this.formErrors = null;

  if (this.form.value) {
    let save;
    AppStore.enableLoading();

    if (this.form.value.id) {
      save = this._biaCategoryService.updateItem(this.form.value.id, this.processDataForSave());
    } else {

      delete this.form.value.id
      save = this._biaCategoryService.saveItem(this.processDataForSave());
    }

    save.subscribe((res: any) => {
      // this.res_id = res.id;// assign id to variable;
      // if (!this.form.value.id) {
      //   this.resetForm();
      // }
     
      AppStore.disableLoading();
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      if (close){
        this.closemsModal();
      } else{
        this.form.patchValue({
          eng_impact_category:''
        })
      }
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;        
      } else if(err.status == 500 || err.status == 403){
        this.closemsModal();
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);

    });
  }
}

processDataForSave(){
  let saveData = {
    bia_impact_rating_id:this.form.value.eng_impact_level,
    // level:this.form.value.eng_impact_level,
    title:this.form.value.eng_impact_category
    
  }
  return saveData
}

  addImpactCategory(){
   var columnObj = {}
   this.tableData = [];
    this.newTableData = [];
   var titles = this.form.value.eng_title
   this.titleArray = titles.split(',')
    columnObj = this.titleArray.reduce(function (accumulator, currentValue) {
      accumulator[currentValue] = "";
      return accumulator;
    }, {})
    let pthis = this;
    setTimeout(() => {
      // for (let i = 0; i < this.form.value.eng_impact_level; i++) {
      //   for(let j = 0; j < this.titleArray.length; j++){
      //     let obj = { value: '' };
      //     obj['key'+i.toString()+j.toString()] = this.titleArray[j];
      //     this.newTableData.push(obj);
      //   }
      //   // this.tableData.push(columnObj)
      // }
      for (let i = 0; i < this.form.value.eng_impact_level; i++) {
        this.tableData.push(columnObj)
      }

      for (let i = 0; i < this.form.value.eng_impact_level; i++) {
        let obj = {};
        for(let j = 0; j < this.titleArray.length; j++){
          // obj = { value: '' };
          obj['key'+i.toString()+j.toString()] = this.titleArray[j];
          obj['value'+i.toString()+j.toString()] = '';
        }
        this.newTableData.push(obj);
        // this.tableData.push(columnObj)
      }

      console.log(this.newTableData);
      console.log("column",columnObj)
      console.log("table",this.tableData)
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  createValueArray(){
    console.log(this.newTableData);
  }

  returnKey(ois){
    return 'key'+ois.toString();
  }

  deleteTableData(index) {
    this.tableData.splice(index, 1);
  }

  closemsModal(){
      this._utilityService.detectChanges(this._cdr);
    this.resetForm();
    setTimeout(() => {
      this._eventEmitterService.dismissImpactCategoryModal()
    }, 250);
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {

    if(event.key == 'Escape' || event.code == 'Escape'){     

        this.cancel();

    }

  }

   // cancel modal
   cancel() {
   
    this.closemsModal();
  }

}
