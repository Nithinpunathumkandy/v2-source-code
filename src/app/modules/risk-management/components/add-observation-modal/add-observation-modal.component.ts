import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Input,
  OnDestroy,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UtilityService } from "src/app/shared/services/utility.service";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

import { AppStore } from "src/app/stores/app.store";
import { RiskRatingService } from "src/app/core/services/masters/risk-management/risk-rating/risk-rating.service";
import { ControlCategoryMasterStore } from "src/app/stores/masters/bpm/control-category.master.store";
import { ControlCategoryService } from "src/app/core/services/masters/bpm/control-category/control-category.service";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { ExecutiveReportStore } from "src/app/stores/risk-management/reports/executive-summary/executive-summary-store";
import { RiskRatingMasterStore } from "src/app/stores/masters/risk-management/risk-rating-store";
import { UsersService } from "src/app/core/services/human-capital/user/users.service";
import { HumanCapitalService } from "src/app/core/services/human-capital/human-capital-service/human-capital.service";
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { UsersStore } from "src/app/stores/human-capital/users/users.store";
import { RiskRatingPaginationResponse } from "src/app/core/models/masters/risk-management/risk-rating";
import { RisksStore } from "src/app/stores/risk-management/risks/risks.store";
import { RiskStatusMasterStore } from "src/app/stores/masters/risk-management/risk-status-store";
import { LikelihoodService } from "src/app/core/services/risk-management/risk-configuration/likelihood/likelihood.service";
import { LikelihoodStore } from "src/app/stores/risk-management/risk-configuration/likelihood.store";
import { RiskAreaService } from "src/app/core/services/masters/risk-management/risk-area/risk-area.service";
import { RiskAreaPaginationResponse } from "src/app/core/models/masters/risk-management/risk-area";
import { RiskAreaMasterStore } from "src/app/stores/masters/risk-management/risk-area-store";
import { ImpactService } from "src/app/core/services/risk-management/risk-configuration/impact/impact.service";
import { ImpactStore } from "src/app/stores/risk-management/risk-configuration/impact.store";
import { QuickRiskAssessmentReportsService } from "src/app/core/services/risk-management/reports/quick-risk-assessment-reports/quick-risk-assessment-reports.service";
import { QuickRiskAssessmentReportStore } from "src/app/stores/risk-management/reports/quick-risk-assessment-report/quick-risk-assessment-report-store";
import * as myCkEditor from 'src/assets/build/ckeditor';
import { MyUploadAdapter } from "src/app/shared/directives/upload-adapter";

@Component({
  selector: "app-add-observation-modal",
  templateUrl: "./add-observation-modal.component.html",
  styleUrls: ["./add-observation-modal.component.scss"],
})
export class AddObservatioModalComponent implements OnInit, OnDestroy {
  @Input("source") QuickRiskAddSummarySource: any;
  quickRiskObservationForm: FormGroup;
  quickRiskObservationFormError: any;
  AppStore = AppStore;
  ControlCategoryMasterStore = ControlCategoryMasterStore;
  QuickRiskStore = QuickRiskAssessmentReportStore;
  RiskRatingMasterStore = RiskRatingMasterStore;
  UsersStore = UsersStore;
  RisksStore = RisksStore;
  RiskStatusMasterStore = RiskStatusMasterStore;
  LikelihoodStore = LikelihoodStore;
  RiskAreaStore = RiskAreaMasterStore;
  ImpactStore = ImpactStore;
  

  config = {
    // toolbar: [
    //   { name: "document", items: ["Source", "-", "Preview"] },
    //   { name: "clipboard", items: ["Undo", "Redo", "Cut", "Copy", "Paste"] },
    //   {
    //     name: "basicstyles",
    //     items: ["Bold", "Italic", "Strike", "-", "RemoveFormat"],
    //   },
    //   { name: "links", items: ["Link", "Unlink", "Anchor"] },
    //   "/",
    //   {
    //     name: "insert",
    //     items: ["Image", "Table", "HorizontalRule", "SpecialChar"],
    //   },
    //   {
    //     name: "paragraph",
    //     items: [
    //       "NumberedList",
    //       "BulletedList",
    //       "-",
    //       "JustifyLeft",
    //       "JustifyCenter",
    //       "JustifyRight",
    //       "JustifyBlock",
    //       "-",
    //     ],
    //   },
    //   { name: "styles", items: ["Format", "Font", "FontSize"] },
    //   { name: "tools", items: ["Maximize"] },
    //   { name: "about", items: ["About"] },
    // ],
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
  constructor(
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    public _controlCategService: ControlCategoryService,
    private _quickRiskAssessmentReportService: QuickRiskAssessmentReportsService,
    private _eventEmitterService: EventEmitterService,
    private _riskRatingService: RiskRatingService,
    private _usersService: UsersService,
    private _humanCapitalService: HumanCapitalService,
    private _imageService: ImageServiceService,
    private _likelihoodService:LikelihoodService,
    private _riskAreaService: RiskAreaService,
    private _impactService:ImpactService,
    private _http: HttpClient
  ) { 
    this.Editor = myCkEditor;
   }
  
   public onReady(editor: any) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof AddObservatioModalComponent
   */
  ngOnInit(): void {

    // ClassicEditor
    // .create( document.querySelector( '#observation' ), {
    //     extraPlugins: [ MyUploadAdapter ],

    //     // ...
    // } )
    // .catch( error => {
    //     // console.log( error );
    // } );
    // Form Object to add Control Category

    this.quickRiskObservationForm = this._formBuilder.group({
      id: [""],
      observation: [null, [Validators.required]],
      risk_matrix_likelihood_id: [null, [Validators.required]],
      // risk_score: [null, [Validators.required]],
      risk_rating_id: [null, [Validators.required]],
      risk_matrix_impact_id: ['', [Validators.required]], 
      risk_impacts: [''], 
      risk_causes: [''],
      risk_area_ids: ['', [Validators.required]], 
    });

    this.resetForm();
    this.setFormValues();
  }

  MyCustomUploadAdapterPlugin( editor ) {
    editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
        // Configure the URL to the upload script in your back-end here!
        return new MyUploadAdapter( loader, this._http );
    };
}

  ngDoCheck() {
    if (
      this.QuickRiskAddSummarySource &&
      this.QuickRiskAddSummarySource.hasOwnProperty("values") &&
      this.QuickRiskAddSummarySource.values &&
      !this.quickRiskObservationForm.value.id
    ){
      this.setFormValues();
    }
  }

  setFormValues() {
    RisksStore.impactList = [];
    RisksStore.riskCauseList = [];
    if (
      this.QuickRiskAddSummarySource.hasOwnProperty("values") &&
      this.QuickRiskAddSummarySource.values
    ) {
      RisksStore.impactList = [];
      RisksStore.riskCauseList = [];
      let { id, observation, risk_matrix_likelihood_id,
        risk_score, risk_rating_id, risk_matrix_impact_id, risk_impacts, risk_causes,
        risk_area_ids } = this.QuickRiskAddSummarySource.values;
      this.quickRiskObservationForm.setValue({
        id: id,
        observation: observation ? observation : null,
        risk_matrix_likelihood_id: risk_matrix_likelihood_id ? risk_matrix_likelihood_id : null,
        // risk_score: risk_score ? risk_score : null,
        risk_rating_id: risk_rating_id ? risk_rating_id : null,
        risk_matrix_impact_id: risk_matrix_impact_id ? risk_matrix_impact_id : null,
        risk_impacts: '',
        risk_causes: '',
        risk_area_ids: risk_area_ids ? this._helperService.getArrayProcessed(risk_area_ids, null) : []
      });
      for(let i of risk_impacts){
        RisksStore.impactList.push({
          title: i.title
        });
      }
      for(let i of risk_causes){
        RisksStore.riskCauseList.push({
          title: i.title
        });
      }
      this.getRiskArea();
      this.getRiskRating();
      this.getUsers();
      this.getRiskLikelihood();
      this.getRiskMatrixImpact();
    }
  }

  searchRiskRating(e, patchValue: boolean = false) {
    this._riskRatingService.getItems(false, 'q=' + e.term).subscribe((res: RiskRatingPaginationResponse) => {
      if (res.data.length > 0 && patchValue) {
        for (let i of res.data) {
          if (i.id == e.term) {
            this.quickRiskObservationForm.patchValue({ risk_rating_id: i });
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }
  getRiskRating() {
    this._riskRatingService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

  }

  getUsers() {
    this._usersService.getAllItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });

  }

  searchUers(e) {   
    this._usersService.searchUsers('?q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

  }

  createImageUrl(token) {
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  createImagePreview(type, token) {
    return this._humanCapitalService.getThumbnailPreview(type, token);
  }
  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }

  addImpact(){
    if(this.quickRiskObservationForm.value.risk_impacts){
      RisksStore.impactList.push({
        title: this.quickRiskObservationForm.value.risk_impacts
      });
    }
    this.quickRiskObservationForm.patchValue({
      risk_impacts:''
    })
    this._utilityService.detectChanges(this._cdr);
  }

  removeImpact(index){
    RisksStore.impactList.splice(index,1);
  }

  addRiskCause(){
    if(this.quickRiskObservationForm.value.risk_causes){
      RisksStore.riskCauseList.push({title: this.quickRiskObservationForm.value.risk_causes});
    }
    this.quickRiskObservationForm.patchValue({
      risk_causes:''
    })
    this._utilityService.detectChanges(this._cdr);
  }

  removeRiskCause(index){
    RisksStore.riskCauseList.splice(index,1);
  }

  getCauseLength() {
    var regex = /(<([^>]+)>)/ig;
    var result = this.quickRiskObservationForm.value.risk_causes.replace(regex, "");
    return result.length;
  }

  searchRiskArea(e, patchValue: boolean = false) {
    this._riskAreaService.getItems(false, '&q=' + e.term).subscribe((res: RiskAreaPaginationResponse) => {
      if (res.data.length > 0 && patchValue) {
        for (let i of res.data) {
          if (i.id == e.term) {
            let risk_areas = this.quickRiskObservationForm.value.risk_area_ids ? this.quickRiskObservationForm.value.risk_area_ids : [];
            risk_areas.push(i);
            this.quickRiskObservationForm.patchValue({ risk_area_ids: risk_areas });
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getRiskArea() {
    this._riskAreaService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

  }




  createSaveData() {
    let saveData = this.quickRiskObservationForm.value;
    saveData['risk_area_ids'] = this.quickRiskObservationForm.value.risk_area_ids.length > 0 ? this._helperService.getArrayProcessed(this.quickRiskObservationForm.value.risk_area_ids,'id') : []
    saveData['risk_causes'] = RisksStore.riskCauseList;
    saveData['risk_impacts'] = RisksStore.impactList;
    return saveData;
  }

  saveObervation(close: boolean = false) {
    this.quickRiskObservationFormError = null;
    if (this.quickRiskObservationForm.valid) {
      let save;
      AppStore.enableLoading();

      if (this.quickRiskObservationForm.value.id) {
        save = this._quickRiskAssessmentReportService.updateQuickRiskObservationItem(
          this.QuickRiskStore.id,
          this.QuickRiskStore.reportId,
          this.quickRiskObservationForm.value.id,
          this.createSaveData()
        );
      } else {
        delete this.quickRiskObservationForm.value.id;
        // console.log(this.quickRiskObservationForm.value);
        // console.log(this.QuickRiskStore.id);

        save = this._quickRiskAssessmentReportService.saveQuickRiskObservationItem(
          this.QuickRiskStore.id,
          this.QuickRiskStore.reportId,
          this.createSaveData()
        );
      }
      save.subscribe(
        (res: any) => {
          if (!this.quickRiskObservationForm.value.id) {
            this.resetForm();
          }
          AppStore.disableLoading();
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
          }, 500);
          if (close) this.closeFormModal();
        },
        (err: HttpErrorResponse) => {
          if (err.status == 422) {
            this.quickRiskObservationFormError = err.error.errors;
          } else if (err.status == 500 || err.status == 403) {
            this.closeFormModal();
          }
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
        }
      );
    }
  }

cancel() {
    this.closeFormModal();
  }

  descriptionValueChange(event) {
    this._utilityService.detectChanges(this._cdr);
  }

  getDescriptionLength() {
    var regex = /(<([^>]+)>)/gi;
    var result = this.quickRiskObservationForm.value.observation.replace(regex, "");
    return result.length;
  }

  resetForm() {
    this.quickRiskObservationForm.reset();
    this.quickRiskObservationForm.markAsPristine();
    this.quickRiskObservationFormError = null;
    AppStore.disableLoading();
  }

  closeFormModal() {
    let id = ExecutiveReportStore.id;
    // Emitting Event To set the Style in Parent Component(MODAL)
    this._eventEmitterService.setModalStyle();
    this.resetForm();
    this._eventEmitterService.dismissQuickAddObservationRiskAssessmentModal();
  }

  searchRiskLikelihood(e, patchValue: boolean = false) {
    this._likelihoodService.getItems(false, 'q=' + e.term).subscribe((res) => {
      if (res.data.length > 0 && patchValue) {
        for (let i of res.data) {
          if (i.id == e.term) {
            this.quickRiskObservationForm.patchValue({ risk_matrix_likelihood_id: i });
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }
  getRiskLikelihood() {
    this._likelihoodService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

  }

  getRiskMatrixImpact() {
    this._impactService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchRiskMatrixImpact(searchTerm: any) {
    this._impactService.getItems(false,'&q='+searchTerm.term).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
  }); 
  }


  //getting button name by language
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }
  /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof AddObservatioModalComponent
   */
  ngOnDestroy() {}
}
