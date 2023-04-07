import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { from } from 'rxjs';
import { BiaScalePaginationResponse } from 'src/app/core/models/bcm/bia-scale/bia-scale';
import { BiaScaleService } from 'src/app/core/services/bcm/bia-scale/bia-scale.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { BiaTireService } from 'src/app/core/services/masters/bcm/bia-tire/bia-tire.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { BiaScaleStore } from 'src/app/stores/bcm/configuration/bia-scale/bia-scale-store';
import { BiaTireMasterStore } from 'src/app/stores/masters/bcm/bia-tire';

@Component({
  selector: 'app-bia-tire-modal',
  templateUrl: './bia-tire-modal.component.html',
  styleUrls: ['./bia-tire-modal.component.scss']
})
export class BiaTireModalComponent implements OnInit {

  @Input('source') BiaTireSource: any;

  BiaTireMasterStore = BiaTireMasterStore;
  BiaScaleStore = BiaScaleStore;
  AppStore = AppStore;
  form: FormGroup;
  formErrors: any;
  scaleId: any;
  color: string=null;

  constructor(
    private _biaTireService: BiaTireService,
    private _biaScaleService: BiaScaleService,
    private _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
  ) { }

  ngOnInit(): void {
    // Form Object to add Control Category

    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      scale_ids: [[], [Validators.required]],
      color_code:[''],
      order: ['', [Validators.required]]
      // description: ['']
    });

    // restingForm on initial load
    this.resetForm();
    this.getBiaScaleList();
    // Checking if Source has Values and Setting Form Value

    if (this.BiaTireSource) {
      this.setFormValues();
    }
  }

  ngDoCheck() {
    if (this.BiaTireSource && this.BiaTireSource.hasOwnProperty('values') && this.BiaTireSource.values && !this.form.value.id)
      this.setFormValues();
  }

  setFormValues() {
    if (this.BiaTireSource.hasOwnProperty('values') && this.BiaTireSource.values) {
      let { id, title, bia_scale_ids, order, bia_scale_category,color_code } = this.BiaTireSource.values
      this.form.patchValue({
        id: id,
        title: title,
        scale_ids: bia_scale_ids,
        order: order,
        color_code:color_code,
      })
      this.color = color_code;
      // this.searchBiaScale({ term: bia_scale_ids })
    }
  }

  // for resetting the form
  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
  }

  //biaScale dropdown--start
  getBiaScaleList() {
    this._biaScaleService.getAllItems().subscribe((res) =>{
      console.log(res);
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100)
    });
  }
  searchBiaScale(e, patchValue: boolean = false) {
    this._biaScaleService.getItems(false, 'q=' + e.term).subscribe((res: BiaScalePaginationResponse) => {
      if (res.data.length > 0 && patchValue) {
        for (let i of res.data) {
          if (i.id == e.term) {
            this.form.patchValue({ scale_id: i.id });
            this.scaleId = i.id;
            this._utilityService.detectChanges(this._cdr);
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }
  // supplier dropdown--close



  // cancel modal
  cancel() {
    // FormErrorStore.setErrors(null);
    this.closeFormModal();
  }

  // getting description count
  getDescriptionLength() {
    var regex = /(<([^>]+)>)/ig;
    var result = this.form.value.description.replace(regex, "");
    return result.length;
  }

  // for closing the modal
  closeFormModal() {
    this.resetForm();
    this._eventEmitterService.dismissBiaTireModal();
  }


  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();
      this.form.patchValue({
        color_code:this.color ? this.color : ''
      })
      if (this.form.value.id) {
        save = this._biaTireService.updateItem(this.form.value.id, this.form.value);
      } else {
        delete this.form.value.id
        save = this._biaTireService.saveItem(this.form.value);
      }

      save.subscribe((res: any) => {
        this.BiaTireMasterStore.lastInsertedId = res.id
        // if (!this.form.value.id) {
        //   this.resetForm();
        // }
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close){ this.closeFormModal();}
        else{
          this.form.patchValue({
            title:'',
            color_code:'',
            order:'',
            scale_ids:[]
          })
        }
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
        }
        else if (err.status == 500 || err.status == 403) {
          this.closeFormModal();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);

      });
    }
  }

  //getting button name by language
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {

    if(event.key == 'Escape' || event.code == 'Escape'){     

        this.cancel();

    }

  }

  ngOnDestroy(){
    this.color = '';
  }

}
