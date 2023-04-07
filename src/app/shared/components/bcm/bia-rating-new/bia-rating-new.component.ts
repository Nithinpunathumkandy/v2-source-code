import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BiaRatingService } from 'src/app/core/services/bcm/bia-rating/bia-rating.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { BiaMatrixStore } from 'src/app/stores/bcm/configuration/bia-matrix.store';
import { BiaRatingStore } from 'src/app/stores/bcm/configuration/bia-rating/bia-rating-store';

declare var $: any;
@Component({
  selector: 'app-bia-rating-new',
  templateUrl: './bia-rating-new.component.html',
  styleUrls: ['./bia-rating-new.component.scss']
})
export class BiaRatingNewComponent implements OnInit {

  @Input('source') source: any;

  AppStore = AppStore;
  BiaMatrixStore = BiaMatrixStore
  BiaRatingStore = BiaRatingStore;
  form: FormGroup;
  formErrors: any;
  is_English: boolean=true;
  color: string;

  constructor(
    private _formBuilder: FormBuilder,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _biaRatingService: BiaRatingService,
  ) { }

  ngOnInit(): void {
    this.color = ''
    this.form = this._formBuilder.group({
      id:[''],
      eng_rating:['',[Validators.required]],
      eng_impact_level:['',[Validators.required]],
      color_code:['',[Validators.required]],
    })
    this.resetForm();

    if (this.source) {
      this.setFormValues();
    }
    console.log("colorrr",this.color)
  }

  tabChange(status:boolean){
    this.is_English = status
    this.resetForm()
  }

  ngDoCheck(){
    if (this.source && this.source.hasOwnProperty('values') && this.source.values && !this.form.value.id)
      this.setFormValues();
  }
  
  setFormValues(){
    if (this.source.hasOwnProperty('values') && this.source.values) {
      let {rating,level,id,color_code} = this.source.values
      this.form.setValue({
        id: id,
        eng_rating: rating,
        eng_impact_level:level,
        color_code:color_code,
      })
      this.color = color_code;
    }
  }

  colorPickerChange(event){
    this.form.patchValue({
      color_code:event
    })
  }

    // function for add & update
    saveRating(close: boolean = false) {
      BiaMatrixStore.setBiaRating(this.processDataForSave())
      this.formErrors = null;
      if (this.form.value) {
        let save;
        AppStore.enableLoading();
        this.form.patchValue({
          color_code:this.color ? this.color : ''
        })
        if (this.form.value.id) {
          save = this._biaRatingService.updateItem(this.form.value.id, this.processDataForSave());
        } else {
          delete this.form.value.id
          save = this._biaRatingService.saveItem(this.processDataForSave());
        }
    
        save.subscribe((res: any) => {
          // this.BiaRatingStore.lastInsertedId = res.id
          if(!this.form.value.id) {
          this.resetForm();
        }
          AppStore.disableLoading();
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
          }, 500);
          // this.resetForm();
          if (close) {
            this.closemsModal();
          }
        }, (err: HttpErrorResponse) => {
          if (err.status == 422) {
            this.formErrors = err.error.errors;
            console.log(this.formErrors);
          }
            else if(err.status == 500 || err.status == 403){
              this.closemsModal();
            }
            AppStore.disableLoading();
            this._utilityService.detectChanges(this._cdr);
          
        });
      }
    }

    //  // for closing the modal
    //  closeFormModal() {
    //   this.resetForm();

    // }

  processDataForSave(){
    let saveData = {
      rating:this.form.value.eng_rating,
      level:this.form.value.eng_impact_level,
      color_code:this.form.value.color_code
    }
    return saveData
  }

   // cancel modal
   cancel() {
    this.closemsModal(); 
  }

  closemsModal(){
    this.resetForm();
    setTimeout(() => {
      this._eventEmitterService.dismissBiaRatingModal()
    }, 250);
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  resetForm() {
    this.color = null
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

  ngOnDestroy(){
    this.resetForm;
    this.color = null;
  }
}
