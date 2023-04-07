import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Input,
  OnDestroy
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UtilityService } from "src/app/shared/services/utility.service";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { AppStore } from "src/app/stores/app.store";
import { ControlCategoryService } from "src/app/core/services/masters/bpm/control-category/control-category.service";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { RisksStore } from "src/app/stores/risk-management/risks/risks.store";
import { RiskStatusMasterStore } from "src/app/stores/masters/risk-management/risk-status-store";
import { UsersService } from "src/app/core/services/human-capital/user/users.service";
import { HumanCapitalService } from "src/app/core/services/human-capital/human-capital-service/human-capital.service";
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { UsersStore } from "src/app/stores/human-capital/users/users.store";
import { ErmDetailsReportsService } from "src/app/core/services/risk-management/reports/erm-deatils-reports/erm-deatils-reports.service";
import { ErmDetailsStore } from "src/app/stores/risk-management/reports/erm-details/erm-details-store";
import { RiskTreatmentStatusesMasterStore } from "src/app/stores/masters/risk-management/risk-treatment-statuses-store";
import { RiskTreatmentStatusesService } from "src/app/core/services/masters/risk-management/risk-treatment-statuses/risk-treatment-statuses.service";
import { RiskTreatmentStatusesPaginationResponse } from "src/app/core/models/masters/risk-management/risk-treatment-statuses";
import * as myCkEditor from 'src/assets/build/ckeditor';
import { MyUploadAdapter } from "src/app/shared/directives/upload-adapter";

@Component({
  selector: "app-edit-erm-detail-risk-treatment",
  templateUrl: "./edit-erm-detail-risk-treatment.component.html",
  styleUrls: ["./edit-erm-detail-risk-treatment.component.scss"],
})
export class EditErmDetailRiskTreatmentComponent implements OnInit, OnDestroy {
  @Input("source") ermdetailRiskRiskSource: any;
  

  ermdetailRiskTreatmentForm: FormGroup;
  ermdetailRiskTreatmentFormError: any;
  AppStore = AppStore;
  ErmDetailRiskStore = ErmDetailsStore;
  RisksStore = RisksStore;

  RiskStatusMasterStore = RiskStatusMasterStore;
  UsersStore = UsersStore
  RiskTreatmentStatusesMasterStore = RiskTreatmentStatusesMasterStore;
  


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
    private _eventEmitterService: EventEmitterService,
    private _usersService: UsersService,
    private _humanCapitalService: HumanCapitalService,
    private _imageService: ImageServiceService,
    private _ermDetailReportService: ErmDetailsReportsService,
    private _riskTreatmentStatusesService: RiskTreatmentStatusesService,
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
   * @dependency
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof EditErmDetailRiskComponent
   */
  ngOnInit(): void {

    // ClassicEditor
    // .create( document.querySelector( '#dependency' ), {
    //     extraPlugins: [ MyUploadAdapter ],

    //     // ...
    // } )
    // .catch( error => {
    //     // console.log( error );
    // } );


    this.ermdetailRiskTreatmentForm = this._formBuilder.group({
      id: [""],
      title: ["", [Validators.maxLength(255)]],
      dependency: ["",],
      responsible_user_id: ["",],
      target_date: ["", ],
      risk_treatment_status_id: ["",],
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
      this.ermdetailRiskRiskSource &&
      this.ermdetailRiskRiskSource.hasOwnProperty("values") &&
      this.ermdetailRiskRiskSource.values &&
      !this.ermdetailRiskTreatmentForm.value.id
    )
      this.setFormValues();
  }

  setFormValues() {
    if (
      this.ermdetailRiskRiskSource.hasOwnProperty("values") &&
      this.ermdetailRiskRiskSource.values
    ) {
      let { id, title, dependency,target_date, responsible_user_id, risk_treatment_status_id  } = this.ermdetailRiskRiskSource.values;
      this.ermdetailRiskTreatmentForm.patchValue({
          id: id,
          title: title ? title : '',
          dependency: dependency ? dependency : '',
          target_date: target_date ? this._helperService.processDate(target_date, 'split') : '',
          responsible_user_id: responsible_user_id ? responsible_user_id : null,
          risk_treatment_status_id:  risk_treatment_status_id ? risk_treatment_status_id : null,
      });
      this.getUsers();
      this.getRiskTreatment();
    }
  }

  

  searchRiskTreatment(e, patchValue: boolean = false) {
    this._riskTreatmentStatusesService.getItems(false, 'q=' + e.term).subscribe((res: RiskTreatmentStatusesPaginationResponse) => {
      if (res.data.length > 0 && patchValue) {
        for (let i of res.data) {
          if (i.id == e.term) {
            this.ermdetailRiskTreatmentForm.patchValue({ risk_rating_id: i });
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }
  getRiskTreatment() {
    this._riskTreatmentStatusesService.getItems(false).subscribe(res => {
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

    createSaveData() {
      let saveData = this.ermdetailRiskTreatmentForm.value;
      saveData['target_date'] = this.ermdetailRiskTreatmentForm.value.target_date ? 
      this._helperService.processDate(this.ermdetailRiskTreatmentForm.value.target_date, 'join') : ''
      saveData['responsible_user_id'] = this.ermdetailRiskTreatmentForm.value.responsible_user_id ?
      this.ermdetailRiskTreatmentForm.value.responsible_user_id.id : null
      return saveData;
    }
    
    saveErmDetailRiskTreatmentSummary(close: boolean = false) {
    this.ermdetailRiskTreatmentFormError = null;
    if (this.ermdetailRiskTreatmentForm.value) {
      let save;
      AppStore.enableLoading();

      if (this.ermdetailRiskTreatmentForm.value.id) {
        // console.log(this.ermdetailRiskTreatmentForm.value);
        save = this._ermDetailReportService.updateErmDetailRiskTreatment(
          this.ErmDetailRiskStore.id,
          this.ermdetailRiskTreatmentForm.value.id,
          this.createSaveData()
        );
      } else {
        delete this.ermdetailRiskTreatmentForm.value.id;
      }
      save.subscribe(
        (res: any) => {
          if (!this.ermdetailRiskTreatmentForm.value.id) {
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
            this.ermdetailRiskTreatmentFormError = err.error.errors;
          } else if (err.status == 500 || err.status == 403) {
            this.closeFormModal();
          }
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
        }
      );
    }
  }

  clear(type) {
    if (type == "target_date") {
      this.ermdetailRiskTreatmentForm.patchValue({
        date: null,
      });
    }
  }



  dependencyValueChange(event) {
    this._utilityService.detectChanges(this._cdr);
  }

  getdependencyLength() {
    var regex = /(<([^>]+)>)/gi;
    var result = this.ermdetailRiskTreatmentForm.value.dependency.replace(regex, "");
    return result.length;
  }

  resetForm() {
    this.ermdetailRiskTreatmentForm.reset();
    this.ermdetailRiskTreatmentForm.pristine;
    this.ermdetailRiskTreatmentFormError = null;
    AppStore.disableLoading();
  }

  closeFormModal() {
    // Emitting Event To set the Style in Parent Component(MODAL)
    this._eventEmitterService.setModalStyle();
    this.resetForm();
    this._eventEmitterService.dissmissEditErmDetailRiskTreatmentModal();
  }

  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }

 
  createImagePreview(type, token) {
    return this._humanCapitalService.getThumbnailPreview(type, token);
  }

  //getting button name by language
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }
  
  /**
   * @dependency
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof EditErmDetailRiskComponent
   */
  ngOnDestroy() {}
}
