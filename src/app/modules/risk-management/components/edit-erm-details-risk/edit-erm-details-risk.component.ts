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
import { RisksStore } from "src/app/stores/risk-management/risks/risks.store";
import { RiskAreaMasterStore } from "src/app/stores/masters/risk-management/risk-area-store";
import { RiskAreaService } from "src/app/core/services/masters/risk-management/risk-area/risk-area.service";
import { RiskAreaPaginationResponse } from "src/app/core/models/masters/risk-management/risk-area";
import { RiskCategoryMasterStore } from "src/app/stores/masters/risk-management/risk-category-store";
import { RiskCategoryService } from "src/app/core/services/masters/risk-management/risk-category/risk-category.service";
import { RiskCategoryPaginationResponse } from "src/app/core/models/masters/risk-management/risk-category";
import { RiskRatingMasterStore } from "src/app/stores/masters/risk-management/risk-rating-store";
import { RiskRatingService } from "src/app/core/services/masters/risk-management/risk-rating/risk-rating.service";
import { RiskRatingPaginationResponse } from "src/app/core/models/masters/risk-management/risk-rating";
import { RiskStatusMasterStore } from "src/app/stores/masters/risk-management/risk-status-store";
import { RiskStatusService } from "src/app/core/services/masters/risk-management/risk-status/risk-status.service";
import { RiskStatusPaginationResponse } from "src/app/core/models/masters/risk-management/risk-status";
import { UsersService } from "src/app/core/services/human-capital/user/users.service";
import { HumanCapitalService } from "src/app/core/services/human-capital/human-capital-service/human-capital.service";
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { UsersStore } from "src/app/stores/human-capital/users/users.store";
import { LikelihoodStore } from "src/app/stores/risk-management/risk-configuration/likelihood.store";
import { LikelihoodService } from "src/app/core/services/risk-management/risk-configuration/likelihood/likelihood.service";
import { ErmDetailsReportsService } from "src/app/core/services/risk-management/reports/erm-deatils-reports/erm-deatils-reports.service";
import { ErmDetailsStore } from "src/app/stores/risk-management/reports/erm-details/erm-details-store";
import { ImpactService } from "src/app/core/services/risk-management/risk-configuration/impact/impact.service";
import { ImpactStore } from "src/app/stores/risk-management/risk-configuration/impact.store";
import * as myCkEditor from 'src/assets/build/ckeditor';
import { MyUploadAdapter } from "src/app/shared/directives/upload-adapter";

@Component({
  selector: "app-edit-erm-details-risk",
  templateUrl: "./edit-erm-details-risk.component.html",
  styleUrls: ["./edit-erm-details-risk.component.scss"],
})
export class EditErmDetailRiskComponent implements OnInit, OnDestroy {
  @Input("source") ermdetailRiskSource: any;
  

  ermdetailRiskForm: FormGroup;
  ermdetailRiskFormError: any;
  AppStore = AppStore;
  ErmDetailRiskStore = ErmDetailsStore;
  RisksStore = RisksStore;
  RiskCategoryStore = RiskCategoryMasterStore;
  RiskAreaStore = RiskAreaMasterStore;
  RiskRatingMasterStore = RiskRatingMasterStore;
  RiskStatusMasterStore = RiskStatusMasterStore;
  UsersStore = UsersStore
  LikelihoodStore = LikelihoodStore;
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
    private _eventEmitterService: EventEmitterService,
    private _riskAreaService: RiskAreaService,
    private _riskCategoryService: RiskCategoryService,
    private _riskRatingService: RiskRatingService,
    private _riskStatusService: RiskStatusService,
    private _usersService: UsersService,
    private _humanCapitalService: HumanCapitalService,
    private _imageService: ImageServiceService,
    private _likelihoodService:LikelihoodService,
    private _ermDetailReportService: ErmDetailsReportsService,
    private _impactService:ImpactService,
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
   * @memberof EditErmDetailRiskComponent
   */
  ngOnInit(): void {

    // ClassicEditor
    // .create( document.querySelector( '#description' ), {
    //     extraPlugins: [ MyUploadAdapter ],

    // } )
    // .catch( error => {
    //     // console.log( error );
    // } );

    // ClassicEditor
    // .create( document.querySelector( '#observation' ), {
    //     extraPlugins: [ MyUploadAdapter ],

    //     // ...
    // } )
    // .catch( error => {
    //     // console.log( error );
    // } );

    this.ermdetailRiskForm = this._formBuilder.group({
      id: [""],
      title: ["", [Validators.maxLength(255)]],
      description: ["",],
      observation: ["",],
      risk_matrix_likelihood_id: ["", ],
      score: ["", ],
      risk_rating_id: ["", ],
      risk_status_id: ["", ],
      risk_owner_id: ["", ],
      risk_category_id: ["", ],
      risk_impacts: [""],
      risk_causes: [""],
      risk_area_ids: ["", ],
      risk_matrix_impact_id: ["",]
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
      this.ermdetailRiskSource &&
      this.ermdetailRiskSource.hasOwnProperty("values") &&
      this.ermdetailRiskSource.values &&
      !this.ermdetailRiskForm.value.id
    )
      this.setFormValues();
  }


  // editRisk() {
  //   for(let impact of RisksStore.individualRiskDetails.risk_impacts){
  //     RisksStore.impactList.push(impact.title)
  //   }
  //   for(let cause of RisksStore.individualRiskDetails.risk_causes){
  //     RisksStore.riskCauseList.push(cause.title)
  //   } 
  // }

  setFormValues() {
    if (
      this.ermdetailRiskSource.hasOwnProperty("values") &&
      this.ermdetailRiskSource.values
    ) {
      RisksStore.impactList = [];
      RisksStore.riskCauseList = [];
      let { id, title, description, observation, risk_matrix_likelihood_id, score, risk_rating_id,
        risk_status_id, risk_owner_id, risk_category_id, risk_impacts, risk_causes, risk_area_ids,
        risk_matrix_impact_id } = this.ermdetailRiskSource.values;
      this.ermdetailRiskForm.patchValue({
        id: id,
          title: title ? title : '',
          description: description ? description : '',
          observation: observation ? observation : '',
          risk_matrix_likelihood_id: risk_matrix_likelihood_id ? risk_matrix_likelihood_id : null,
          score:  score ? score : null,
          risk_rating_id: risk_rating_id ? risk_rating_id : null,
          risk_status_id: risk_status_id ? risk_status_id : null,
          risk_owner_id: risk_owner_id ? risk_owner_id : null,
          risk_category_id: risk_category_id ? risk_category_id : null,
          risk_impacts: '',
          risk_causes: '',
          risk_area_ids: risk_area_ids ? this._helperService.getArrayProcessed(risk_area_ids, null) : [],
          risk_matrix_impact_id: risk_matrix_impact_id ? risk_matrix_impact_id : null
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
      // console.log(this.ermdetailRiskForm.value);
      this.getRiskArea();
      this.getRiskCategory();
      this.getRiskRating();
      this.getRiskStatus();
      this.getUsers();
      this.getRiskLikelihood();
      this.getRiskMatrixImpact();
    }
  }

  addImpact(){
    if(this.ermdetailRiskForm.value.risk_impacts){
      RisksStore.impactList.push({
        title: this.ermdetailRiskForm.value.risk_impacts
      });
    }
    this.ermdetailRiskForm.patchValue({
      risk_impacts:''
    })
    this._utilityService.detectChanges(this._cdr);
  }

  removeImpact(index){
    RisksStore.impactList.splice(index,1);
  }

  addRiskCause(){
    if(this.ermdetailRiskForm.value.risk_causes){
      RisksStore.riskCauseList.push({title: this.ermdetailRiskForm.value.risk_causes});
    }
    this.ermdetailRiskForm.patchValue({
      risk_causes:''
    })
    this._utilityService.detectChanges(this._cdr);
  }

  removeRiskCause(index){
    RisksStore.riskCauseList.splice(index,1);
  }

  getCauseLength() {
    var regex = /(<([^>]+)>)/ig;
    var result = this.ermdetailRiskForm.value.risk_causes.replace(regex, "");
    return result.length;
  }

  searchRiskArea(e, patchValue: boolean = false) {
    this._riskAreaService.getItems(false, '&q=' + e.term).subscribe((res: RiskAreaPaginationResponse) => {
      if (res.data.length > 0 && patchValue) {
        for (let i of res.data) {
          if (i.id == e.term) {
            let risk_areas = this.ermdetailRiskForm.value.risk_area_ids ? this.ermdetailRiskForm.value.risk_area_ids : [];
            risk_areas.push(i);
            this.ermdetailRiskForm.patchValue({ risk_area_ids: risk_areas });
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


  searchRiskCategory(e, patchValue: boolean = false) {
    this._riskCategoryService.getItems(false, 'q=' + e.term).subscribe((res: RiskCategoryPaginationResponse) => {
      if (res.data.length > 0 && patchValue) {
        for (let i of res.data) {
          if (i.id == e.term) {
            this.ermdetailRiskForm.patchValue({ risk_category_id: i });
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

  searchRiskRating(e, patchValue: boolean = false) {
    this._riskRatingService.getItems(false, 'q=' + e.term).subscribe((res: RiskRatingPaginationResponse) => {
      if (res.data.length > 0 && patchValue) {
        for (let i of res.data) {
          if (i.id == e.term) {
            this.ermdetailRiskForm.patchValue({ risk_rating_id: i });
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

 
  searchRiskStatus(e, patchValue: boolean = false) {
    this._riskStatusService.getItems(false, 'q=' + e.term).subscribe((res: RiskStatusPaginationResponse) => {
      if (res.data.length > 0 && patchValue) {
        for (let i of res.data) {
          if (i.id == e.term) {
            this.ermdetailRiskForm.patchValue({ risk_status_id: i });
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }


  getRiskStatus() {
    this._riskStatusService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

  }


  
  searchRiskLikelihood(e, patchValue: boolean = false) {
    this._likelihoodService.getItems(false, 'q=' + e.term).subscribe((res) => {
      if (res.data.length > 0 && patchValue) {
        for (let i of res.data) {
          if (i.id == e.term) {
            this.ermdetailRiskForm.patchValue({ risk_matrix_likelihood_id: i });
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

    getTypes(types) {
      let type = [];
      for (let i of types) {
        type.push(i.id);
      }
      return type;
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
      let saveData = this.ermdetailRiskForm.value;
      saveData['risk_owner_id'] = this.ermdetailRiskForm.value.risk_owner_id ?
      this.ermdetailRiskForm.value.risk_owner_id.id : null;
      saveData['risk_area_ids'] = this.ermdetailRiskForm.value.risk_area_ids.length > 0 ? this._helperService.getArrayProcessed(this.ermdetailRiskForm.value.risk_area_ids,'id') : []
      saveData['risk_causes'] = RisksStore.riskCauseList;
      saveData['risk_impacts'] = RisksStore.impactList;
      return saveData;
    }

    
    saveErmDetailRiskSummary(close: boolean = false) {
    this.ermdetailRiskFormError = null;
    if (this.ermdetailRiskForm.value) {
      let save;
      AppStore.enableLoading();

      if (this.ermdetailRiskForm.value.id) {
        // console.log(this.ermdetailRiskForm.value);
        save = this._ermDetailReportService.updateErmDetailRisk(
          this.ErmDetailRiskStore.id,
          this.ermdetailRiskForm.value.id,
          this.createSaveData()
        );
      } else {
        delete this.ermdetailRiskForm.value.id;
      }
      save.subscribe(
        (res: any) => {
          if (!this.ermdetailRiskForm.value.id) {
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
            this.ermdetailRiskFormError = err.error.errors;
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
    var result = this.ermdetailRiskForm.value.description.replace(regex, "");
    return result.length;
  }

  resetForm() {
    this.ermdetailRiskForm.reset();
    this.ermdetailRiskForm.pristine;
    this.ermdetailRiskFormError = null;
    AppStore.disableLoading();
  }

  closeFormModal() {
    // Emitting Event To set the Style in Parent Component(MODAL)
    this._eventEmitterService.setModalStyle();
    this.resetForm();
    this._eventEmitterService.dissmissEditErmDetailRiskModal();
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
   * @memberof EditErmDetailRiskComponent
   */
  ngOnDestroy() {}
}
