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
import { ExecutiveSummaryReportsService } from "src/app/core/services/risk-management/reports/executive-summary-reports/executive-summary-reports.service";
import { ExecutiveReportStore } from "src/app/stores/risk-management/reports/executive-summary/executive-summary-store";
import * as myCkEditor from 'src/assets/build/ckeditor';
import { MyUploadAdapter } from "src/app/shared/directives/upload-adapter";

@Component({
  selector: "app-add-executive-summary",
  templateUrl: "./add-executive-summary.component.html",
  styleUrls: ["./add-executive-summary.component.scss"],
})
export class AddExecutiveSummaryComponent implements OnInit, OnDestroy {
  @Input("source") ExecutiveSummarySource: any;
  exeutiveForm: FormGroup;
  exeutiveFormErros: any;
  AppStore = AppStore;
  ControlCategoryMasterStore = ControlCategoryMasterStore;
  ExecutiveStore = ExecutiveReportStore;

  

  isFirst: boolean = false;
  orderChanged: boolean = false;

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
    private _executiveSummaryReportService: ExecutiveSummaryReportsService,
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
   * @memberof AddExecutiveSummaryComponent
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

    this.exeutiveForm = this._formBuilder.group({
      id: [""],
      title: ["", [Validators.required, Validators.maxLength(255)]],
      description: ["", [Validators.required]],
      order: [null, [Validators.required]]
    });

    this.resetForm();
    this.setFormValues();
  }

  ngDoCheck() {
    if (
      this.ExecutiveSummarySource &&
      this.ExecutiveSummarySource.hasOwnProperty("values") &&
      this.ExecutiveSummarySource.values &&
      !this.exeutiveForm.value.id
    ){
      this.setFormValues();
    }
    if(this.ExecutiveSummarySource.type == 'Add' && !this.exeutiveForm.pristine && !this.orderChanged){
      this.exeutiveForm.patchValue({order: this.ExecutiveStore?.executiveDetailsReports?.executive_summary_report_details.length + 1});
    }
  }

  setFormValues() {
    if (
      this.ExecutiveSummarySource.hasOwnProperty("values") &&
      this.ExecutiveSummarySource.values
    ) {
      let { id, title, description, order } = this.ExecutiveSummarySource.values;
      this.exeutiveForm.setValue({
        id: id,
        title: title,
        description: description,
        order: order ? order : null 
      });
    }
  }
  saveExecuteSummary(close: boolean = false) {
    this.exeutiveFormErros = null;
    if (this.exeutiveForm.value) {
      let save;
      AppStore.enableLoading();

      if (this.exeutiveForm.value.id) {
        save = this._executiveSummaryReportService.updateExecutiveItem(
          this.ExecutiveStore.id,
          this.exeutiveForm.value.id,
          this.exeutiveForm.value
        );
      } else {
        delete this.exeutiveForm.value.id;
        // console.log(this.exeutiveForm.value);
        // console.log(this.ExecutiveStore.id);

        save = this._executiveSummaryReportService.saveExecutiveItem(
          this.ExecutiveStore.id,
          this.exeutiveForm.value
        );
      }
      save.subscribe(
        (res: any) => {
          if (!this.exeutiveForm.value.id) {
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
            this.exeutiveFormErros = err.error.errors;
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

  MyCustomUploadAdapterPlugin( editor ) {
    editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
        // Configure the URL to the upload script in your back-end here!
        return new MyUploadAdapter( loader, this._http );
    };
}

  getExecutiveTitle() {
    this._executiveSummaryReportService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
}

searchExecutiveTitle(e) {
  this._executiveSummaryReportService.getItems(false, "&q=" + e.term).subscribe((res) => {
    this._utilityService.detectChanges(this._cdr);
  });
}

  descriptionValueChange(event) {
    this._utilityService.detectChanges(this._cdr);
  }

  getDescriptionLength() {
    var regex = /(<([^>]+)>)/gi;
    var result = this.exeutiveForm.value.description.replace(regex, "");
    return result.length;
  }

  resetForm() {
    this.exeutiveForm.reset();
    this.exeutiveForm.markAsPristine();
    this.exeutiveFormErros = null;
    AppStore.disableLoading();
  }

  closeFormModal() {
    let id = ExecutiveReportStore.id;
    // Emitting Event To set the Style in Parent Component(MODAL)
    this._eventEmitterService.setModalStyle();
    this.resetForm();
    this._eventEmitterService.dismissExecutiveSummaryModal();
    // this._executiveSummaryReportService.getItem(id);
  }

  setIsFirst(event) {
    if (event.target.checked) {
      this.isFirst = true;
      let order  = this.exeutiveForm.value.order;
      this.exeutiveForm.patchValue({
        order: order = 0
      }
      )
      this.orderChanged = true;
    }
    else
      this.isFirst = false;
      this.orderChanged = false;
  }

  titlePositionChange(e) {
    // console.log(e)
    let order = e.order;
    this.exeutiveForm.patchValue({
      order: order+1
    })
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
   * @memberof AddExecutiveSummaryComponent
   */
  ngOnDestroy() {}
}
