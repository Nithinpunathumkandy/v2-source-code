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
import { RiskCategoryPaginationResponse } from "src/app/core/models/masters/risk-management/risk-category";
import { RiskCategoryService } from "src/app/core/services/masters/risk-management/risk-category/risk-category.service";
import { RiskCategoryMasterStore } from "src/app/stores/masters/risk-management/risk-category-store";
import { QuickRiskAssessmentReportsService } from "src/app/core/services/risk-management/reports/quick-risk-assessment-reports/quick-risk-assessment-reports.service";
import { QuickRiskAssessmentReportStore } from "src/app/stores/risk-management/reports/quick-risk-assessment-report/quick-risk-assessment-report-store";
import * as myCkEditor from 'src/assets/build/ckeditor';
import { MyUploadAdapter } from "src/app/shared/directives/upload-adapter";

@Component({
  selector: "app-add-summary-modal",
  templateUrl: "./add-summary-modal.component.html",
  styleUrls: ["./add-summary-modal.component.scss"],
})
export class AddSummaryModalComponent implements OnInit, OnDestroy {
  @Input("source") ExecutiveAddSummarySource: any;
  quickSummaryForm: FormGroup;
  quickSummaryFormErros: any;
  AppStore = AppStore;
  ControlCategoryMasterStore = ControlCategoryMasterStore;
  QuickRiskStore = QuickRiskAssessmentReportStore;
  RiskRatingMasterStore = RiskRatingMasterStore;
  UsersStore = UsersStore;
  RiskCategoryStore = RiskCategoryMasterStore;
  

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
    private _usersService: UsersService,
    private _humanCapitalService: HumanCapitalService,
    private _imageService: ImageServiceService,
    private _riskCategoryService: RiskCategoryService,
    private _http: HttpClient,
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
   * @memberof AddSummaryModalComponent
   */
  ngOnInit(): void {

    // ClassicEditor
    // .create( document.querySelector( '#description' ), {
    //     extraPlugins: [ MyUploadAdapter ],

    //     // ...
    // } )
    // .catch( error => {
    //     // console.log( error );
    // } );
    // Form Object to add Control Category

    this.quickSummaryForm = this._formBuilder.group({
      id: [""],
      title: ["", [Validators.required, Validators.maxLength(255)]],
      description: ["", [Validators.required]],
      risk_score: [null, [Validators.required]],
      risk_category_id: ["", [Validators.required]],
      risk_owner_id: [null, [Validators.required]],
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
      this.ExecutiveAddSummarySource &&
      this.ExecutiveAddSummarySource.hasOwnProperty("values") &&
      this.ExecutiveAddSummarySource.values &&
      !this.quickSummaryForm.value.id
    ){
      this.setFormValues();
    }
  }

  setFormValues() {
    if (
      this.ExecutiveAddSummarySource.hasOwnProperty("values") &&
      this.ExecutiveAddSummarySource.values
    ) {
      let { id, title, description,risk_category_id, risk_score , risk_owner_id } = this.ExecutiveAddSummarySource.values;
      this.quickSummaryForm.setValue({
        id: id,
        title: title,
        description: description,
        risk_category_id: risk_category_id ? risk_category_id : null,
        risk_score: risk_score,
        risk_owner_id: risk_owner_id
      });
      this.getRiskCategory();
    }
  }

  searchRiskCategory(e, patchValue: boolean = false) {
    this._riskCategoryService.getItems(false, 'q=' + e.term).subscribe((res: RiskCategoryPaginationResponse) => {
      if (res.data.length > 0 && patchValue) {
        for (let i of res.data) {
          if (i.id == e.term) {
            this.quickSummaryForm.patchValue({ risk_category_id: i });
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getRiskCategory() {
    this._riskCategoryService.getItems(false).subscribe(res => {
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

  createSaveData() {
    let saveData = this.quickSummaryForm.value;
    saveData['risk_owner_id'] = this.quickSummaryForm.value.risk_owner_id ?
    this.quickSummaryForm.value.risk_owner_id.id : null;
    return saveData;
  }

  saveExecuteSummary(close: boolean = false) {
    this.quickSummaryFormErros = null;
    if (this.quickSummaryForm.value) {
      let save;
      AppStore.enableLoading();

      if (this.quickSummaryForm.value.id) {
        save = this._quickRiskAssessmentReportService.updateQuickRiskSummaryItem(
          this.QuickRiskStore.id,
          this.quickSummaryForm.value.id,
          this.createSaveData()
        );
      } else {
        delete this.quickSummaryForm.value.id;
        // console.log(this.quickSummaryForm.value);
        // console.log(this.QuickRiskStore.id);

        save = this._quickRiskAssessmentReportService.saveQuickRiskSummaryItem(
          this.QuickRiskStore.id,
          this.createSaveData()
        );
      }

      save.subscribe(
        (res: any) => {
          if (!this.quickSummaryForm.value.id) {
            // console.log(res)
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
            this.quickSummaryFormErros = err.error.errors;
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
    var result = this.quickSummaryForm.value.description.replace(regex, "");
    return result.length;
  }

  resetForm() {
    this.quickSummaryForm.reset();
    this.quickSummaryForm.markAsPristine();
    this.quickSummaryFormErros = null;
    AppStore.disableLoading();
  }

  closeFormModal() {
    this._eventEmitterService.setModalStyle();
    this.resetForm();
    this._eventEmitterService.dismissQuickAddProcessRiskAssessmentModal();
    // this._executiveSummaryReportService.getItem(id);
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
   * @memberof AddSummaryModalComponent
   */
  ngOnDestroy() {}
}
