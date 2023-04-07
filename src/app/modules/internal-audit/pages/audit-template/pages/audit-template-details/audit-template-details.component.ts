import { HttpEvent, HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { AuditTemplateService } from 'src/app/core/services/internal-audit/audit-template/audit-template.service';
import { AuditFindingCategoriesService } from 'src/app/core/services/masters/internal-audit/audit-finding-categories/audit-finding-categories.service';
import { InternalAuditFileService } from 'src/app/core/services/masters/internal-audit/file-service/internal-audit-file.service';
import { RiskRatingService } from 'src/app/core/services/masters/risk-management/risk-rating/risk-rating.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuditTemplateStore } from 'src/app/stores/internal-audit/audit-template/audit-template-store';
import { AuditFindingCategoryMasterStore } from 'src/app/stores/masters/internal-audit/audit-finding-categories-store';
import { RiskRatingMasterStore } from 'src/app/stores/masters/risk-management/risk-rating-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;
@Component({
  selector: 'app-audit-template-details',
  templateUrl: './audit-template-details.component.html',
  styleUrls: ['./audit-template-details.component.scss']
})
export class AuditTemplateDetailsComponent implements OnInit {

  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @ViewChild('uploadLogoArea', { static: false }) uploadLogoArea: ElementRef;
  @ViewChild('uploadConclusionArea', { static: false }) uploadConclusionArea: ElementRef;

  AuditTemplateStore = AuditTemplateStore;
  RiskRatingMasterStore = RiskRatingMasterStore;
  AuditFindingCategoryStore = AuditFindingCategoryMasterStore;
  enableCoverPage: boolean;
  coverPagedate: boolean;
  msTypesCoverPage: boolean;
  auditLeader: boolean;
  showIsoRobotLogo: boolean;
  auditProgramTitle: boolean;
  descriptionAuditProgram: boolean;
  type: boolean;
  titleAuditDetails: boolean;
  descriptionAuditDetails: boolean;
  auditLeaderAuditDetails: boolean;
  auditeeLeaderAuditDetails: boolean;
  objecticeAuditDetails: boolean;
  criteriaAuditDetails: boolean;
  auditorsSchedule: boolean;
  auditableItemSchedule: boolean;
  checklistSchedule: boolean;
  checklistAnswersSchedule: boolean;
  riskRatingFindings: boolean;
  referCodeSummary: boolean;
  riskRatingSummary: boolean;
  templateId: number;
  enableIntroduction: boolean;
  enableAuditProgram: boolean;
  introductionText: string;
  enableAuditSection: boolean;
  auditReferanceNumber: boolean;
  departmentAuditDetails: boolean;
  divisionsAuditDetails: boolean;
  sectionsAuditDetails: boolean;
  subSectionsAuditDetails: boolean;
  subSidiariesAuditDetails: boolean;
  categoryAuditDetails: boolean;
  startDateAuditDetails: boolean;
  endDateAuditDetails: boolean;
  fileUploadsArray = []; // for multiple file uploads
  checkListArray = [];
  logoFileUploadsArray = []; // for multiple file uploads
  logoCheckListArray = [];
  conclusionFileUploadsArray = []; // for multiple file uploads
  conclusionCheckListArray = [];
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  enableAuditScheduleSection: boolean;
  auditeeScheduleSection: boolean;
  auditScheduleAuditorAttendance: boolean;
  auditScheduleDepartment: boolean;
  auditScheduleDivision: boolean;
  auditScheduleEndTime: boolean;
  auditScheduleReferenceNumber: boolean;
  auditScheduleSection: boolean;
  auditScheduleStartTime: boolean;
  auditScheduleSubSections: boolean;
  auditScheduleSubsidiary: boolean;
  enableAuditFindings: boolean;
  auditFindingsAttachment: boolean;
  auditFindingsAuditableItems: boolean;
  auditFindingBarChartByDepartments: boolean;
  auditFindingCaategory: boolean;
  auditFindingChecklistAnswers: boolean;
  auditFindingDepartment: boolean;
  auditFindingDescription: boolean;
  auditFindingDivision: boolean;
  auditFindingEvidence: boolean;
  auditFindingPiChartByFindingCategory: boolean;
  auditFindingPiChartByRiskRating: boolean;
  auditFindingRecommendation: boolean;
  auditFindingReferenceNumber: boolean;
  auditFindingSections: boolean;
  auditFindingSubSection: boolean;
  auditFindingSubsidiary: boolean;
  auditFindingTitle: boolean;
  auditExecutiveSummary: boolean;
  auditSummaryFindingCategory: boolean;
  auditSummaryFindingDepartment: boolean;
  auditSummaryFindingDivision: boolean;
  auditSummaryFindingRecommendation: boolean;
  auditSummaryFindingSection: boolean;
  auditSummaryFindingSubSection: boolean;
  auditsummaryFindinfSubSidiary: boolean;
  auditSummaryFindingTitle: boolean;
  enableConclusion: boolean;
  auditTempleConclusionDescription: string;
  auditTemplateCoverpageCompanyLogo: boolean;
  auditTemplateAuditProgramStartDate: boolean;
  auditTemplateAuditProgramEndDate: boolean;
  auditProgramReferenceNumber: boolean;
  selectedIndex=0;
  selectedFindingId;
  AppStore = AppStore;
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  constructor(
    private route: ActivatedRoute,
    private _auditTemplateService: AuditTemplateService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _imageService: ImageServiceService,
    private _internalAuditFileService: InternalAuditFileService,
    private _riskRatingService: RiskRatingService,
    private _auditFindingCategoryService: AuditFindingCategoriesService,
    private _router: Router,
  ) { }

  ngOnInit(): void {
    AppStore.showDiscussion = false;
    SubMenuItemStore.setSubMenuItems([
      { type: 'close', path: '../' }
    ]);
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    this._utilityService.detectChanges(this._cdr);

    let id: number;
    this.route.params.subscribe(params => {
      id = +params['id']; // (+) converts string 'id' to a number
      this.templateId = id
      this.getAuditTemplate(id);
    });
    
  }

  enableDisableAuditTemplateCheckboxes(section:number){

    if(section==1){//coverpage

      if(this.enableCoverPage){
        this.coverPagedate = this.msTypesCoverPage = this.auditLeader = this.auditTemplateCoverpageCompanyLogo = this.showIsoRobotLogo = false;
        this.removeDocument('logo');
        this.removeLogoDocument('logo');
      }

    }
    if(section==2){//Introduction

      if(this.enableIntroduction){
        this.introductionText = "";
      }
      
    }
    if(section==3){//audit program

      if(this.enableAuditProgram){
        this.auditProgramTitle = this.auditTemplateAuditProgramStartDate = this.auditTemplateAuditProgramEndDate = this.auditProgramReferenceNumber = this.descriptionAuditProgram = false;
      }

    }
    if(section==4){//audit
      
      if(this.enableAuditSection){
        this.titleAuditDetails = this.startDateAuditDetails = this.endDateAuditDetails = this.descriptionAuditDetails = this.categoryAuditDetails = this.objecticeAuditDetails = this.auditLeaderAuditDetails = this.auditeeLeaderAuditDetails = this.auditReferanceNumber= this.criteriaAuditDetails= this.departmentAuditDetails= this.divisionsAuditDetails= this.sectionsAuditDetails = this.subSectionsAuditDetails = this.subSidiariesAuditDetails = false;
      }

    }
    if(section==5){//schedule

      if(this.enableAuditScheduleSection){
        this.auditableItemSchedule = this.auditeeScheduleSection = this.auditorsSchedule = this.auditScheduleAuditorAttendance = this.checklistSchedule = this.checklistAnswersSchedule = this.auditScheduleDepartment = this.auditScheduleDivision = this.auditScheduleEndTime= this.auditScheduleReferenceNumber= this.auditScheduleStartTime= this.auditScheduleSubSections= this.auditScheduleSubsidiary = false;
      }
      
    }
    if(section==6){//finding
      
    }
    if(section==7){//Executive summary

      if(this.auditExecutiveSummary){
        this.auditSummaryFindingCategory = this.auditSummaryFindingDepartment = this.auditSummaryFindingDivision = this.auditSummaryFindingRecommendation = this.referCodeSummary = this.riskRatingSummary = this.auditSummaryFindingSection = this.auditSummaryFindingSubSection = this.auditsummaryFindinfSubSidiary= this.auditSummaryFindingTitle = false;
      }
      
    }
    if(section==8){//conclusion

      if(this.enableConclusion){
        this.auditTempleConclusionDescription = "";
        this.removeConclusionDocument('logo');
      }
      
    }

  }

  enableDisableOfAuditDetails(){
    
  }

  selectFindingCategory(row){
    AuditTemplateStore.selectCategory(row)
  }

  categoryButtonClickFunction(row){
    return this.AuditTemplateStore.findSelectedCategory(row.id);
  }

  selectRiskRating(row){
    AuditTemplateStore.selecRiskType(row)
  }

  reskRatingButtonClickFunction(row){
    return this.AuditTemplateStore.findSelectedRiskTypes(row.id);
  }

  findingCatgory(newPage: number = null) {
    if (newPage) AuditFindingCategoryMasterStore.setCurrentPage(newPage);
    this._auditFindingCategoryService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  riskkRating(newPage: number = null) {
    if (newPage) RiskRatingMasterStore.setCurrentPage(newPage);
    this._riskRatingService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

   // =================BACKGROUN FILE UPLOAD=====================//
   setAuditTemplateConclusionBackgroundForEdit() {
    this.conclusionCheckListArray = [];

    var auditTemplateConclusion = AuditTemplateStore.auditTemplateConclusion;

    if (auditTemplateConclusion.conclusion_bg) {
      let docurl = this._internalAuditFileService.getThumbnailPreview('conclusion-bg', auditTemplateConclusion.conclusion_bg.token);
      let docDetails = {
        created_at: auditTemplateConclusion.conclusion_bg.created_at,
        created_by: auditTemplateConclusion.conclusion_bg.created_by,
        updated_at: auditTemplateConclusion.conclusion_bg.updated_at,
        updated_by: auditTemplateConclusion.conclusion_bg.updated_by,
        name: auditTemplateConclusion.conclusion_bg.title,
        ext: auditTemplateConclusion.conclusion_bg.ext,
        size: auditTemplateConclusion.conclusion_bg.size,
        url: auditTemplateConclusion.conclusion_bg.url,
        thumbnail_url: auditTemplateConclusion.conclusion_bg.url,
        token: auditTemplateConclusion.conclusion_bg.token,
        preview: docurl,
        id: auditTemplateConclusion.conclusion_bg.id

      };
      this._auditTemplateService.setConclusionDocumentDetails(docDetails, docurl);
    }
  }

  /**
   * removing document file from the selected list
   * @param conclusiontoken -image token
   */
  removeConclusionDocument(conclusiontoken) {
    AuditTemplateStore.unsetConclusionDocumentDetails(conclusiontoken);
    this._utilityService.detectChanges(this._cdr);
  }

  /**
* 
* @param conclusionprogress File Upload Progress
* @param conclusionfile Selected File
* @param conclusionsuccess Boolean value whether file upload success 
*/
  assignConclusionFileUploadProgress(conclusionprogress, conclusionfile, conclusionsuccess = false) {

    let temporaryFileUploadsArray = this.conclusionFileUploadsArray;
    this.conclusionFileUploadsArray = this._helperService.assignFileUploadProgress(conclusionprogress, conclusionfile, conclusionsuccess, temporaryFileUploadsArray);
  }

  /**
   * 
   * @param conclusionfiles Selected files array
   * @param conclusiontype type of selected files - logo or brochure
   */
  addItemsToConclusionFileUploadProgressArray(conclusionfiles, conclusiontype) {
    var result = this._helperService.addItemsToFileUploadProgressArray(conclusionfiles, conclusiontype, this.fileUploadsArray);
    this.conclusionFileUploadsArray = result.fileUploadsArray;
    return result.files;
  }

  createConclusionImageFromBlob(image: Blob, imageDetails, type) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;

      imageDetails['preview'] = logo_url;
      if (imageDetails != null)
        this._auditTemplateService.setConclusionDocumentDetails(imageDetails, type);
      this._utilityService.detectChanges(this._cdr);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }
  checkConclusionAcceptFileTypes(type) {
    return this._imageService.getAcceptFileTypes(type);
  }

  checkConclusionExtension(ext, extType) {

    return this._imageService.checkFileExtensions(ext, extType)

  }
  // ========================End============================//


  getAuditTemplateConclusion() {
    this._auditTemplateService.getAuditTemplateConslusion(this.templateId).subscribe(res => {
      this.manageAuditTemplateConclusion();
    })
  }

  manageAuditTemplateConclusion() {
    let data = AuditTemplateStore.auditTemplateConclusion
    if (data.is_conclusion == 1) {
      this.enableConclusion = true;
    } else {
      this.enableConclusion = false;
    }
    this.auditTempleConclusionDescription = AuditTemplateStore.auditTemplateConclusion.conclusion;
    this.setAuditTemplateConclusionBackgroundForEdit()
    this._utilityService.detectChanges(this._cdr);
  }

  saveAuditTemplateConclusion(close:Boolean) {
    if(AuditTemplateStore.conclusionDocumentDetails.token)AuditTemplateStore.conclusionDocumentDetails["type"] = "conclusion-bg"
    AppStore.enableLoading();
    var obj = new Object;
    obj["id"] = this.templateId;
    obj["is_conclusion"] = this.enableConclusion == true ? 1 : 0;
    obj["conclusion"] = this.auditTempleConclusionDescription ? this.auditTempleConclusionDescription : "";
    obj["conclusion_bg"] = AuditTemplateStore.conclusionDocumentDetails.token&&this.enableConclusion?AuditTemplateStore.conclusionDocumentDetails:[];
    this._auditTemplateService.saveAuditTemplateConclusion(this.templateId, obj).subscribe(res => {
      if(close){
        this.closePage()
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getAuditTemplateExecutiveSummary() {
    this._auditTemplateService.getAuditTemplateFindingsExecutiveSummary(this.templateId).subscribe(res => {
      this.manageAuditTemplateExecutiveSummary()
    })
  }

  manageAuditTemplateExecutiveSummary() {
    let data = AuditTemplateStore.auditTemplateExecutiveSummary;
    this.auditExecutiveSummary = data.is_excecutive_summary==1?true:false;
    this.auditSummaryFindingCategory = data.is_excecutive_summary_finding_category==1?true:false;
    this.auditSummaryFindingDepartment = data.is_excecutive_summary_finding_department==1?true:false;
    this.auditSummaryFindingDivision = data.is_excecutive_summary_finding_division==1?true:false;
    this.auditSummaryFindingRecommendation = data.is_excecutive_summary_finding_recommendation==1?true:false;
    this.referCodeSummary = data.is_excecutive_summary_finding_reference_number==1?true:false;
    this.riskRatingSummary = data.is_excecutive_summary_finding_risk_rating==1?true:false;
    this.auditSummaryFindingSection = data.is_excecutive_summary_finding_section==1?true:false;
    this.auditSummaryFindingSubSection = data.is_excecutive_summary_finding_sub_section==1?true:false;
    this.auditsummaryFindinfSubSidiary = data.is_excecutive_summary_finding_subsidiary==1?true:false;
    this.auditSummaryFindingTitle = data.is_excecutive_summary_finding_title==1?true:false;
    this._utilityService.detectChanges(this._cdr);
  }

  saveTemplateAuditExecutiveSummary(close:Boolean) {
    AppStore.enableLoading();
    var obj = new Object;
    obj["id"] = this.templateId;
    obj["is_excecutive_summary"] = this.auditExecutiveSummary == true ? 1 : 0;
    obj["is_excecutive_summary_finding_category"] = this.auditSummaryFindingCategory == true ? 1 : 0;
    obj["is_excecutive_summary_finding_department"] = this.auditSummaryFindingDepartment == true ? 1 : 0;
    obj["is_excecutive_summary_finding_division"] = this.auditSummaryFindingDivision == true ? 1 : 0;
    obj["is_excecutive_summary_finding_recommendation"] = this.auditSummaryFindingRecommendation == true ? 1 : 0;
    obj["is_excecutive_summary_finding_reference_number"] = this.referCodeSummary == true ? 1 : 0;
    obj["is_excecutive_summary_finding_risk_rating"] = this.riskRatingSummary == true ? 1 : 0;
    obj["is_excecutive_summary_finding_section"] = this.auditSummaryFindingSection == true ? 1 : 0;
    obj["is_excecutive_summary_finding_sub_section"] = this.auditSummaryFindingSubSection == true ? 1 : 0;
    obj["is_excecutive_summary_finding_subsidiary"] = this.auditsummaryFindinfSubSidiary == true ? 1 : 0;
    obj["is_excecutive_summary_finding_title"] = this.auditSummaryFindingTitle == true ? 1 : 0;
    this._auditTemplateService.saveAuditExectiveSummary(this.templateId, obj).subscribe(res => {
      if(close){
        this.closePage()
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getAuditTemplateFindings() {
    this._auditTemplateService.getAuditTemplateFindings(this.templateId).subscribe(res => {
      this.manageAuditTemplateFindings();
        this.findingCatgory();
        this.riskkRating();
      if(res){
        this.manageRiskRatingAndFindings()
      }
    })
  }

  manageRiskRatingAndFindings(){
    AuditTemplateStore.auditTemplateFindings.risk_rating.forEach(element => {
      AuditTemplateStore.selecRiskType(element)
    });

    AuditTemplateStore.auditTemplateFindings.finding_category.forEach(item => {
      AuditTemplateStore.selectCategory(item)
    });
  }

  manageAuditTemplateFindings() {
    let data = AuditTemplateStore.auditTemplateFindings
    this.enableAuditFindings = data.is_findings == 1?true:false;
    this.auditFindingsAttachment = data.is_finding_attachments == 1?true:false;
    this.auditFindingsAuditableItems = data.is_finding_auditable_items == 1?true:false;
    this.auditFindingBarChartByDepartments = data.is_finding_bar_chart_by_departments == 1?true:false;
    this.auditFindingCaategory = data.is_finding_category == 1?true:false;
    this.auditFindingChecklistAnswers = data.is_finding_checklist_answers == 1?true:false;
    this.auditFindingDepartment = data.is_finding_department == 1?true:false;
    this.auditFindingDescription = data.is_finding_description == 1?true:false;
    this.auditFindingDivision = data.is_finding_division == 1?true:false;
    this.auditFindingEvidence = data.is_finding_evidence == 1?true:false;
    this.auditFindingPiChartByFindingCategory = data.is_finding_pi_chart_by_finding_category == 1?true:false;
    this.auditFindingPiChartByRiskRating = data.is_finding_pi_chart_by_risk_rating == 1?true:false;
    this.auditFindingRecommendation = data.is_finding_recommendation == 1?true:false;
    this.auditFindingReferenceNumber = data.is_finding_reference_number == 1?true:false;
    this.riskRatingFindings = data.is_finding_risk_rating == 1?true:false;
    this.auditFindingSections = data.is_finding_section == 1?true:false;
    this.auditFindingSubSection = data.is_finding_sub_section == 1?true:false;
    this.auditFindingSubsidiary = data.is_finding_subsdiary == 1?true:false;
    this.auditFindingTitle = data.is_finding_title == 1?true:false;

    this._utilityService.detectChanges(this._cdr);
  }

  saveTemplateAuditfindings(close:Boolean) {
    AppStore.enableLoading();
    var selectedRiskEmptyArray = [];
    var selectedCategoryEmptyArray = [];
    AuditTemplateStore.selectedRiskRatingTypes.forEach(element => {
      selectedRiskEmptyArray.push(element.id)
    });
    AuditTemplateStore.selectedFindingCategory.forEach(element=>{
      selectedCategoryEmptyArray.push(element.id)
    })
    var obj = new Object;
    obj["id"] = this.templateId;
    obj["is_finding_attachments"] = this.auditFindingsAttachment == true ? 1 : 0;
    obj["is_finding_auditable_items"] = this.auditFindingsAuditableItems == true ? 1 : 0;
    obj["is_finding_bar_chart_by_departments"] = this.auditFindingsAttachment == true ? 1 : 0;
    obj["is_finding_category"] = this.auditFindingCaategory == true ? 1 : 0;
    obj["is_finding_checklist_answers"] = this.auditFindingChecklistAnswers == true ? 1 : 0;
    obj["is_finding_department"] = this.auditFindingDepartment == true ? 1 : 0;
    obj["is_finding_description"] = this.auditFindingDescription == true ? 1 : 0;
    obj["is_finding_division"] = this.auditFindingDivision == true ? 1 : 0;
    obj["is_finding_evidence"] = this.auditFindingEvidence == true ? 1 : 0;
    obj["is_finding_pi_chart_by_finding_category"] = this.auditFindingsAttachment == true ? 1 : 0;
    obj["is_finding_pi_chart_by_risk_rating"] = this.auditFindingsAttachment == true ? 1 : 0;
    obj["is_finding_recommendation"] = this.auditFindingRecommendation == true ? 1 : 0;
    obj["is_finding_reference_number"] = this.auditFindingReferenceNumber == true ? 1 : 0;
    obj["is_finding_risk_rating"] = this.auditFindingsAttachment == true ? 1 : 0;
    obj["is_finding_section"] = this.auditFindingSections == true ? 1 : 0;
    obj["is_finding_sub_section"] = this.auditFindingSubSection == true ? 1 : 0;
    obj["is_finding_subsdiary"] = this.auditFindingSubsidiary == true ? 1 : 0;
    obj["is_finding_title"] = this.auditFindingTitle == true ? 1 : 0;
    obj["is_findings"] = this.enableAuditFindings == true ? 1 : 0;
    obj["risk_rating_ids"] = selectedRiskEmptyArray;
    obj["finding_category_ids"] = selectedCategoryEmptyArray;
    this._auditTemplateService.saveAuditFindings(this.templateId, obj).subscribe(res => {
      if(close){
        this.closePage()
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getAuditTemplateSchedule() {
    this._auditTemplateService.getAuditTemplateSchedule(this.templateId).subscribe(res => {
      this.manageAuditTemplateSchedule()
    })
  }

  manageAuditTemplateSchedule() {
    let data = AuditTemplateStore.auditTemplateSchedule
    this.enableAuditScheduleSection = data.is_audit_schedules == 1?true:false;
    this.auditableItemSchedule = data.is_audit_schedule_auditable_items == 1?true:false;
    this.auditeeScheduleSection = data.is_audit_schedule_auditees == 1?true:false;
    this.auditScheduleAuditorAttendance = data.is_audit_schedule_auditor_attendance == 1?true:false;
    this.auditorsSchedule = data.is_audit_schedule_auditors == 1?true:false;
    this.checklistSchedule = data.is_audit_schedule_checklist == 1?true:false;
    this.checklistAnswersSchedule = data.is_audit_schedule_checklist_answers == 1?true:false;
    this.auditScheduleDepartment = data.is_audit_schedule_department == 1?true:false;
    this.auditScheduleDivision = data.is_audit_schedule_division == 1?true:false;
    this.auditScheduleEndTime = data.is_audit_schedule_end_date_time == 1?true:false;
    this.auditScheduleReferenceNumber = data.is_audit_schedule_reference_number == 1?true:false;
    this.auditScheduleSection = data.is_audit_schedule_section == 1?true:false;
    this.auditScheduleStartTime = data.is_audit_schedule_start_date_time == 1?true:false;
    this.auditScheduleSubSections = data.is_audit_schedule_sub_section == 1?true:false;
    this.auditScheduleSubsidiary = data.is_audit_schedule_subsidiary == 1?true:false;
    
    this._utilityService.detectChanges(this._cdr);
  }

  saveTemplateAuditSchedule(close:Boolean) {
    AppStore.enableLoading();
    var obj = new Object;
    obj["id"] = this.templateId;
    obj["is_audit_schedules"] = this.enableAuditScheduleSection == true ? 1 : 0;
    obj["is_audit_schedule_auditable_items"] = this.auditableItemSchedule == true ? 1 : 0;
    obj["is_audit_schedule_auditees"] = this.auditeeScheduleSection == true ? 1 : 0;
    obj["is_audit_schedule_auditor_attendance"] = this.auditScheduleAuditorAttendance == true ? 1 : 0;
    obj["is_audit_schedule_auditors"] = this.auditorsSchedule == true ? 1 : 0;
    obj["is_audit_schedule_checklist"] = this.checklistSchedule == true ? 1 : 0;
    obj["is_audit_schedule_checklist_answers"] = this.checklistAnswersSchedule == true ? 1 : 0;
    obj["is_audit_schedule_department"] = this.auditScheduleDepartment == true ? 1 : 0;
    obj["is_audit_schedule_division"] = this.auditScheduleDivision == true ? 1 : 0;
    obj["is_audit_schedule_end_date_time"] = this.auditScheduleEndTime == true ? 1 : 0;
    obj["is_audit_schedule_reference_number"] = this.auditScheduleReferenceNumber == true ? 1 : 0;
    obj["is_audit_schedule_section"] = this.auditScheduleStartTime == true ? 1 : 0;
    obj["is_audit_schedule_start_date_time"] = this.auditScheduleStartTime == true ? 1 : 0;
    obj["is_audit_schedule_sub_section"] = this.auditScheduleSubSections == true ? 1 : 0;
    obj["is_audit_schedule_subsidiary"] = this.auditScheduleSubsidiary == true ? 1 : 0;
    this._auditTemplateService.saveAuditSchedule(this.templateId, obj).subscribe(res => {
      if(close){
        this.closePage()
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
    })
  }
  
  /**
   * removing document file from the selected list
   * @param logotoken -image token
   */
  removeLogoDocument(logotoken) {
    AuditTemplateStore.unsetLogoDocumentDetails(logotoken);
    this._utilityService.detectChanges(this._cdr);
  }

  /**
* 
* @param logoprogress File Upload Progress
* @param logofile Selected File
* @param logosuccess Boolean value whether file upload success 
*/
  assignLogoFileUploadProgress(logoprogress, logofile, logosuccess = false) {

    let temporaryFileUploadsArray = this.logoFileUploadsArray;
    this.logoFileUploadsArray = this._helperService.assignFileUploadProgress(logoprogress, logofile, logosuccess, temporaryFileUploadsArray);
  }

  /**
   * 
   * @param logofiles Selected files array
   * @param logotype type of selected files - logo or brochure
   */
  addItemsToLogoFileUploadProgressArray(logofiles, logotype) {
    var result = this._helperService.addItemsToFileUploadProgressArray(logofiles, logotype, this.logoFileUploadsArray);
    this.logoFileUploadsArray = result.fileUploadsArray;
    return result.files;
  }

  createLogoImageFromBlob(image: Blob, imageDetails, type) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;

      imageDetails['preview'] = logo_url;
      if (imageDetails != null)
        this._auditTemplateService.setLogoDocumentDetails(imageDetails, type);
      this._utilityService.detectChanges(this._cdr);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }
  checkLogoAcceptFileTypes(type) {
    return this._imageService.getAcceptFileTypes(type);
  }

  checkLogoExtension(ext, extType) {

    return this._imageService.checkFileExtensions(ext, extType)

  }


    // =================BACKGROUN FILE UPLOAD=====================//
    setAuditTemplateBackgroundForEdit() {
      this.checkListArray = [];
      this.logoCheckListArray = [];
  
      var auditableItem = AuditTemplateStore.auditTemplateCoverPage;
  
      if (auditableItem.cover_bg) {
        let docurl = this._internalAuditFileService.getThumbnailPreview('cover-bg', auditableItem.cover_bg.token);
        let docDetails = {
          created_at: auditableItem.cover_bg.created_at,
          created_by: auditableItem.cover_bg.created_by,
          updated_at: auditableItem.cover_bg.updated_at,
          updated_by: auditableItem.cover_bg.updated_by,
          name: auditableItem.cover_bg.title,
          ext: auditableItem.cover_bg.ext,
          size: auditableItem.cover_bg.size,
          url: auditableItem.cover_bg.url,
          thumbnail_url: auditableItem.cover_bg.url,
          token: auditableItem.cover_bg.token,
          preview: docurl,
          id: auditableItem.cover_bg.id
  
        };
        this._auditTemplateService.setDocumentDetails(docDetails, docurl);
      }
      if (auditableItem.cover_logo) {
        let docurl = this._internalAuditFileService.getThumbnailPreview('cover-logo', auditableItem.cover_logo.token);
        let docDetails = {
          created_at: auditableItem.cover_logo.created_at,
          created_by: auditableItem.cover_logo.created_by,
          updated_at: auditableItem.cover_logo.updated_at,
          updated_by: auditableItem.cover_logo.updated_by,
          name: auditableItem.cover_logo.title,
          ext: auditableItem.cover_logo.ext,
          size: auditableItem.cover_logo.size,
          url: auditableItem.cover_logo.url,
          thumbnail_url: auditableItem.cover_logo.url,
          token: auditableItem.cover_logo.token,
          preview: docurl,
          id: auditableItem.cover_logo.id
  
        };
        this._auditTemplateService.setLogoDocumentDetails(docDetails, docurl);
      }
    }
  
    /**
     * removing document file from the selected list
     * @param token -image token
     */
    removeDocument(token) {
      AuditTemplateStore.unsetDocumentDetails(token);
      this.checkForFileUploadsScrollbar();
      this._utilityService.detectChanges(this._cdr);
    }
  
    checkForFileUploadsScrollbar() {
  
      if (AuditTemplateStore.docDetails.length >= 7 || this.fileUploadsArray.length > 7) {
        $(this.uploadArea.nativeElement).mCustomScrollbar();
      }
      else {
        $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
      }
    }
  
    /**
  * 
  * @param progress File Upload Progress
  * @param file Selected File
  * @param success Boolean value whether file upload success 
  */
    assignFileUploadProgress(progress, file, success = false) {
      let temporaryFileUploadsArray = this.fileUploadsArray;
      this.fileUploadsArray = this._helperService.assignFileUploadProgress(progress, file, success, temporaryFileUploadsArray);
  }

  /**
   * 
   * @param files Selected files array
   * @param type type of selected files - logo or brochure
   */
  addItemsToFileUploadProgressArray(files, type) {
      var result = this._helperService.addItemsToFileUploadProgressArray(files, type, this.fileUploadsArray);
      this.fileUploadsArray = result.fileUploadsArray;
    return result.files;
  }

  createImageFromBlob(image: Blob, imageDetails, type) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;

      imageDetails['preview'] = logo_url;
      if (imageDetails != null)
      this._auditTemplateService.setDocumentDetails(imageDetails, type);
      this.checkForFileUploadsScrollbar();
      this._utilityService.detectChanges(this._cdr);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }


  onFileChange(event, type: string, fileSection) {
    var selectedFiles: any[] = event.target.files;
    if (selectedFiles.length > 0) {
      if(fileSection == 'background'){
        var temporaryFiles = this.addItemsToFileUploadProgressArray(selectedFiles, type); // Assign Files to Multiple File Uploads Array
        this.checkForFileUploadsScrollbar();
      }
      if(fileSection == 'logo'){
        var temporaryFiles = this.addItemsToLogoFileUploadProgressArray(selectedFiles, type); // Assign Files to Multiple File Uploads Array
        this.checkForFileUploadsScrollbar();
      }
      if(fileSection == 'conclusion'){
        var temporaryFiles = this.addItemsToConclusionFileUploadProgressArray(selectedFiles, type); // Assign Files to Multiple File Uploads Array
        this.checkForFileUploadsScrollbar();
      }
      
      Array.prototype.forEach.call(temporaryFiles, elem => {
        const file = elem;
        if (this._imageService.validateFile(file, type)) {
          const formData = new FormData();
          formData.append('file', file);
          var typeParams = (type == 'logo') ? '?type=logo' : '?type=support-file';
          this._imageService.uploadImageWithProgress(formData, typeParams) // Upload file to temporary storage
            .subscribe((res: HttpEvent<any>) => {
              let uploadEvent: any = res;
              switch (uploadEvent.type) {
                case HttpEventType.UploadProgress:
                  // Compute and show the % done;
                  if (uploadEvent.loaded) {
                    let upProgress = Math.round(100 * uploadEvent.loaded / uploadEvent.total);
                    if(fileSection == 'background'){
                      this.assignFileUploadProgress(upProgress, file);
                    }
                    if(fileSection == 'logo'){
                      this.assignLogoFileUploadProgress(upProgress, file);
                    }
                    if(fileSection == 'conclusion'){
                      this.assignConclusionFileUploadProgress(upProgress, file);
                    }
                    
                  }
                  this._utilityService.detectChanges(this._cdr);
                  break;
                case HttpEventType.Response:
                  //return event;
                  let temp: any = uploadEvent['body'];
                  temp['is_new'] = true;
                  
                  if(fileSection == 'background'){
                    temp['type'] = "cover-bg";
                    this.assignFileUploadProgress(null, file, true);
                  }
                  if(fileSection == 'logo'){
                    temp['type'] = "cover-logo";
                    this.assignLogoFileUploadProgress(null, file, true);
                  }
                  if(fileSection == 'conclusion'){
                    temp['type'] = "conclusion-bg";
                    this.assignConclusionFileUploadProgress(null, file, true);
                  }
                  
                  this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew => { //Generate preview url using thumbnail url returns blob
                    
                    if(fileSection == 'background'){
                      this.createImageFromBlob(prew, temp, type); // Convert blob to base64 string
                    }
                    if(fileSection == 'logo'){
                      this.createLogoImageFromBlob(prew, temp, type); // Convert blob to base64 string
                    }
                    if(fileSection == 'conclusion'){
                      this.createConclusionImageFromBlob(prew, temp, type); // Convert blob to base64 string
                    }
                  }, (error) => {
                    if(fileSection == 'background'){
                      this.assignFileUploadProgress(null, file, true);
                    }
                    if(fileSection == 'logo'){
                      this.assignLogoFileUploadProgress(null, file, true);
                    }
                    if(fileSection == 'conclusion'){
                      this.assignConclusionFileUploadProgress(null, file, true);
                    }
                    this._utilityService.detectChanges(this._cdr);
                  })
              }
            }, (error) => {
              this._utilityService.showErrorMessage('Failed', 'Sorry file upload failed');
              if(fileSection == 'background'){
                this.assignFileUploadProgress(null, file, true);
              }
              if(fileSection == 'logo'){
                this.assignLogoFileUploadProgress(null, file, true);
              }
              if(fileSection == 'conclusion'){
                this.assignConclusionFileUploadProgress(null, file, true);
              }
              this._utilityService.detectChanges(this._cdr);
            })
        }
        else {
          if(fileSection == 'background'){
            this.assignFileUploadProgress(null, file, true);
          }
          if(fileSection == 'logo'){
            this.assignLogoFileUploadProgress(null, file, true);
          }
          if(fileSection == 'conclusion'){
            this.assignConclusionFileUploadProgress(null, file, true);
          }
        }
      });
    }
  }

  checkAcceptFileTypes(type) {
    return this._imageService.getAcceptFileTypes(type);
  }

  checkExtension(ext, extType) {

    return this._imageService.checkFileExtensions(ext, extType)

  }
  // ========================End============================//
  getAuditDetails() {
    this._auditTemplateService.getTemplateAuditDetails(this.templateId).subscribe(res => {
      this.manageTemplateAudit();
    })
  }

  manageTemplateAudit() {
    let data = AuditTemplateStore.auditTemplateAudit;
    this.enableAuditSection = data.is_audit == 1?true:false;
    this.categoryAuditDetails = data.is_audit_category == 1?true:false;
    this.criteriaAuditDetails = data.is_audit_criteria == 1?true:false;
    this.descriptionAuditDetails = data.is_audit_description == 1?true:false;
    this.auditLeaderAuditDetails = data.is_audit_leader == 1?true:false;
    this.objecticeAuditDetails = data.is_audit_objectives == 1?true:false;
    this.auditReferanceNumber = data.is_audit_reference_number == 1?true:false;
    this.startDateAuditDetails = data.is_audit_start_date == 1?true:false;
    this.endDateAuditDetails = data.is_audit_end_date == 1?true:false;
    this.titleAuditDetails = data.is_audit_title == 1?true:false;
    this.auditeeLeaderAuditDetails = data.is_auditee_leader == 1?true:false;
    this.departmentAuditDetails = data.is_departments == 1?true:false;
    this.divisionsAuditDetails = data.is_divisions == 1?true:false;
    this.sectionsAuditDetails = data.is_sections == 1?true:false;
    this.subSectionsAuditDetails = data.is_sub_sections == 1?true:false;
    this.subSidiariesAuditDetails = data.is_subsidiaries == 1?true:false;

    this._utilityService.detectChanges(this._cdr);
  }

  saveTemplateAuditDetails(close:Boolean) {
    AppStore.enableLoading();
    var obj = new Object;
    obj["id"] = this.templateId;
    obj["is_audit"] = this.enableAuditSection == true ? 1 : 0;
    obj["is_audit_category"] = this.categoryAuditDetails == true ? 1 : 0;
    obj["is_audit_criteria"] = this.criteriaAuditDetails == true ? 1 : 0;
    obj["is_audit_description"] = this.descriptionAuditDetails == true ? 1 : 0;
    obj["is_audit_end_date"] = this.endDateAuditDetails == true ? 1 : 0;
    obj["is_audit_leader"] = this.auditLeaderAuditDetails == true ? 1 : 0;
    obj["is_audit_objectives"] = this.objecticeAuditDetails == true ? 1 : 0;
    obj["is_audit_reference_number"] = this.auditReferanceNumber == true ? 1 : 0;
    obj["is_audit_start_date"] = this.startDateAuditDetails == true ? 1 : 0;
    obj["is_audit_title"] = this.titleAuditDetails == true ? 1 : 0;
    obj["is_auditee_leader"] = this.auditeeLeaderAuditDetails == true ? 1 : 0;
    obj["is_departments"] = this.departmentAuditDetails == true ? 1 : 0;
    obj["is_divisions"] = this.divisionsAuditDetails == true ? 1 : 0;
    obj["is_sections"] = this.sectionsAuditDetails == true ? 1 : 0;
    obj["is_sub_sections"] = this.subSectionsAuditDetails == true ? 1 : 0;
    obj["is_subsidiaries"] = this.subSidiariesAuditDetails == true ? 1 : 0;
    this._auditTemplateService.saveAuditDetails(this.templateId, obj).subscribe(res => {
      if(close){
        this.closePage()
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getAuditProgramDetails() {
    this._auditTemplateService.getTemplateAuditProgram(this.templateId).subscribe(res => {
      this.manageAuditProgramSection()
    })
  }

  manageAuditProgramSection() {
    let data = AuditTemplateStore.auditTemplateAuditProgram
    this.enableAuditProgram = data.is_audit_program == 1?true:false;
    this.descriptionAuditProgram = data.is_audit_program_description == 1?true:false;
    this.auditProgramTitle = data.is_audit_program_title == 1?true:false;
    this.auditTemplateAuditProgramStartDate = data.is_audit_program_start_date == 1?true:false;
    this.auditTemplateAuditProgramEndDate = data.is_audit_program_end_date == 1?true:false;
    this.auditProgramReferenceNumber = data.is_audit_program_reference_number == 1?true:false;
    this._utilityService.detectChanges(this._cdr);
  }

  saveAuditProgram(close:Boolean) {
    AppStore.enableLoading();
    var obj = new Object;
    obj["id"] = this.templateId;
    obj["is_audit_program"] = this.enableAuditProgram == true ? 1 : 0;
    obj["is_audit_program_reference_number"] = this.auditProgramReferenceNumber ==true ? 1 :0;
    obj["is_audit_program_title"] = this.auditProgramTitle == true ? 1 : 0;
    obj["is_audit_program_start_date"] = this.auditTemplateAuditProgramStartDate ==true ? 1 :0;
    obj["is_audit_program_end_date"] = this.auditTemplateAuditProgramEndDate ==true ? 1 :0;
    obj["is_audit_program_description"] = this.descriptionAuditProgram == true ? 1 : 0;
    obj["program_bg"] = [];
    this._auditTemplateService.saveAuditProgram(this.templateId, obj).subscribe(res => {
      if(close){
        this.closePage()
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getAuditTemplate(id) {
      this._auditTemplateService.getItem(id).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
        this.getCoverPageDetails()
      });
  }

  getCoverPageDetails() {
    this._auditTemplateService.getCoverPageDetails(this.templateId).subscribe(res => {

      this.controlCoverPageDetails()

    });
  }

  controlCoverPageDetails() {
    let data = AuditTemplateStore.auditTemplateCoverPage
    this.enableCoverPage = data.is_cover_page == 1?true:false;
    this.coverPagedate = data.is_audit_date_in_cover_page == 1?true:false;
    this.auditLeader = data.is_audit_leader_in_cover_page == 1?true:false;
    this.showIsoRobotLogo = data.is_isorobot_logo_in_cover_page == 1?true:false;
    this.msTypesCoverPage = data.is_ms_type_in_cover_page == 1?true:false;
    this.auditTemplateCoverpageCompanyLogo = data.is_company_logo_in_cover_page == 1?true:false;
    this.enableCoverPage = data.is_cover_page == 1?true:false;

    if (AuditTemplateStore.auditTemplateCoverPage) {
      this.setAuditTemplateBackgroundForEdit();
    }
    if (AuditTemplateStore.auditTemplateCoverPage) {
      this.setAuditTemplateBackgroundForEdit();
    }
    this._utilityService.detectChanges(this._cdr);
  }

  saveCoverPageDetails(close:Boolean) {
    AppStore.enableLoading();
    if(AuditTemplateStore.documentDetails.token)AuditTemplateStore.documentDetails["type"]="cover-bg";
    if(AuditTemplateStore.logoDocumentDetails.token)AuditTemplateStore.logoDocumentDetails["type"]="cover-logo"
    var obj = new Object;
    obj["id"] = this.templateId;
    obj["audit_report_template_id"] = AuditTemplateStore.auditTemplateCoverPage.id;
    obj["is_cover_page"] = this.enableCoverPage == true ? 1 : 0;
    obj["is_audit_date_in_cover_page"] = this.coverPagedate == true ? 1 : 0;
    obj["is_company_logo_in_cover_page"] = this.showIsoRobotLogo == true ? 1 : 0;
    obj["is_isorobot_logo_in_cover_page"] = this.showIsoRobotLogo == true ? 1 : 0;
    obj["is_audit_leader_in_cover_page"] = this.auditLeader == true ? 1 : 0;
    obj["is_ms_type_in_cover_page"] = this.msTypesCoverPage == true ? 1 : 0;
    obj["cover_bg"] = AuditTemplateStore.documentDetails.token&&this.enableCoverPage?AuditTemplateStore.documentDetails:[];
    obj["cover_logo"] = AuditTemplateStore.logoDocumentDetails.token&&this.enableCoverPage?AuditTemplateStore.logoDocumentDetails:[];
    this._auditTemplateService.saveCoverPageDetails(this.templateId, obj).subscribe(res => {
      if(close){
        this.closePage()
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
    })
  }

  closePage(){
    this._router.navigateByUrl('/internal-audit/audit-report-template')
  }

  getAuditTemplateIntroduction() {
    this._auditTemplateService.getIntroduction(this.templateId).subscribe(res => {

      this.manageAuditTemplateIntroduction()
    })
  }

  manageAuditTemplateIntroduction() {
    this.enableIntroduction = AuditTemplateStore.auditTemplateIntroduction.is_introduction == 1? true:false;
    this.introductionText = AuditTemplateStore.auditTemplateIntroduction.introduction;
    this._utilityService.detectChanges(this._cdr);
  }

  saveIntroductionDetails(close:Boolean) {
    AppStore.enableLoading();
    var obj = new Object;
    obj["id"] = this.templateId;
    obj["is_introduction"] = this.enableIntroduction == true ? 1 : 0;
    obj["introduction"] = this.introductionText ? this.introductionText : "";
    this._auditTemplateService.saveIntroductionDetails(this.templateId, obj).subscribe(res => {
      if(close){
        this.closePage()
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }
  
  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  }

}
