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
import { ControlCategoryService } from "src/app/core/services/masters/bpm/control-category/control-category.service";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { QuickRiskAssessmentReportStore } from "src/app/stores/risk-management/reports/quick-risk-assessment-report/quick-risk-assessment-report-store";
import { QuickRiskAssessmentReportsService } from "src/app/core/services/risk-management/reports/quick-risk-assessment-reports/quick-risk-assessment-reports.service";
import * as myCkEditor from 'src/assets/build/ckeditor';
import { MyUploadAdapter } from "src/app/shared/directives/upload-adapter";

@Component({
  selector: "app-add-quick-assesment-report",
  templateUrl: "./add-quick-assesment-report.component.html",
  styleUrls: ["./add-quick-assesment-report.component.scss"],
})
export class AddQuickAssesmentReportComponent implements OnInit, OnDestroy {
  @Input("source") QuickRiskAssessmentSource: any;
  quickRiskForm: FormGroup;
  quickRiskFormErros: any;
  AppStore = AppStore;
  QuickRiskStore = QuickRiskAssessmentReportStore;
  

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
    private _quickRiskAssesmentReportService: QuickRiskAssessmentReportsService,
    private _eventEmitterService: EventEmitterService,
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
   * @memberof AddQuickAssesmentReportComponent
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

    this.quickRiskForm = this._formBuilder.group({
      id: [""],
      title: ["", Validators.maxLength(255)],
      description: [""],
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
      this.QuickRiskAssessmentSource &&
      this.QuickRiskAssessmentSource.hasOwnProperty("values") &&
      this.QuickRiskAssessmentSource.values &&
      !this.quickRiskForm.value.id
    ){
      this.setFormValues();
    }
    // if(this.QuickRiskAssessmentSource.type == 'Add' && !this.quickRiskForm.pristine && !this.orderChanged){
    //   this.quickRiskForm.patchValue({order: this.QuickRiskStore
    //     ?.quickAssessmentDetailsReports.quick_risk_assessment_report_details.length + 1});
    // }
  }

  setFormValues() {
    if (
      this.QuickRiskAssessmentSource.hasOwnProperty("values") &&
      this.QuickRiskAssessmentSource.values
    ) {
      let { id, title, description } = this.QuickRiskAssessmentSource.values;
      this.quickRiskForm.setValue({
        id: id,
        title: title ? title : '',
        description: description ? description : '',
      });
    }
  }


  saveExecuteSummary(close: boolean = false) {
    this.quickRiskFormErros = null;
    if (this.quickRiskForm.value) {
      let save;
      AppStore.enableLoading();

      if (this.quickRiskForm.value.id) {
        save = this._quickRiskAssesmentReportService.updateQuickRiskItem(
          this.QuickRiskStore.id,
          this.quickRiskForm.value.id,
          this.quickRiskForm.value
        );
      } else {
        delete this.quickRiskForm.value.id;
        // console.log(this.quickRiskForm.value);
        // console.log(this.QuickRiskStore.id);

        // save = this._quickRiskAssesmentReportService.saveQuickRisktem(
        //   this.QuickRiskStore.id,
        //   this.quickRiskForm.value
        // );
      }
      save.subscribe(
        (res: any) => {
          if (!this.quickRiskForm.value.id) {
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
            this.quickRiskFormErros = err.error.errors;
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
    var result = this.quickRiskForm.value.description.replace(regex, "");
    return result.length;
  }

  resetForm() {
    this.quickRiskForm.reset();
    this.quickRiskForm.pristine;
    this.quickRiskFormErros = null;
    AppStore.disableLoading();
  }

  closeFormModal() {
    // Emitting Event To set the Style in Parent Component(MODAL)
    this._eventEmitterService.setModalStyle();
    this.resetForm();
    this._eventEmitterService.dismissQuickRiskAssessmentModal();
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
   * @memberof AddQuickAssesmentReportComponent
   */
  ngOnDestroy() {}
}
