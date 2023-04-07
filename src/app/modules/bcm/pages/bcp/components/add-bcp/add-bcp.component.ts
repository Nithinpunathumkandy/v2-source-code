import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import * as myCkEditor from 'src/assets/build/ckeditor';
import { MyUploadAdapter } from "src/app/shared/directives/upload-adapter";
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { BcpService } from "src/app/core/services/bcm/bcp/bcp.service";
import { Router } from "@angular/router";
import { toJS } from 'mobx';
import { BcmStrategiesService } from "src/app/core/services/bcm/bcm-strategies/bcm-strategies.service";
import { BcmStrategyStore } from "src/app/stores/bcm/strategy/bcm-strategy-store";
import { BcmTemplateService } from 'src/app/core/services/bcm/bcm-template/bcm-template.service';
import { BcmTemplateStore } from 'src/app/stores/bcm/bcm-template/bcm-template';

@Component({
  selector: 'app-add-bcp',
  templateUrl: './add-bcp.component.html',
  styleUrls: ['./add-bcp.component.scss']
})
export class AddBcpComponent implements OnInit {

  @Input('source') bcpSource: any;
  @ViewChild('organisationChangeFormModal') organisationChangeFormModal: ElementRef;
  AppStore = AppStore;
  AuthStore = AuthStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  BcmStrategyStore = BcmStrategyStore;
  BcmTemplateStore = BcmTemplateStore;
  form: FormGroup;
  formErrors: any;
  
  organisationChangesModalSubscription: any = null;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  openModelPopup: boolean = false;
  selectedStrategyId: number = null;
  approvedSolutions: any = [];
  public Editor;
  public Config;
  constructor(private _formBuilder: FormBuilder, private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _bcmTemplateService: BcmTemplateService,
    private _utilityService: UtilityService, private _http: HttpClient,
    private _bcpService: BcpService, private _renderer2: Renderer2, private _router: Router,
    private _bcStrategyService: BcmStrategiesService) { 
      this.Editor = myCkEditor;
     }
    
     public onReady(editor: any) {
      editor.ui.getEditableElement().parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
      );
    }

  ngOnInit(): void {

    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required]],
      description: [''],
      version: [null,[Validators.required]],
      organization_ids: [[]],
      division_ids: [[]],
      department_ids: [[], [Validators.required]],
      section_ids: [[]],
      sub_section_ids: [[]],
      document_no: ['',[Validators.required]],
      solution_ids: [[]],
      strategy_ids: [[]],
      template_id:[null]
    });
    
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_division)
      this.form.controls['division_ids'].setValidators(Validators.required);
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_section)
      this.form.controls['section_ids'].setValidators(Validators.required);
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section)
      this.form.controls['sub_section_ids'].setValidators(Validators.required);

    this.organisationChangesModalSubscription = this._eventEmitterService.organisationChanges.subscribe(
      (res) => {
        this.closeModal();
      }
    );
    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
      if (!status && $(this.organisationChangeFormModal.nativeElement).hasClass('show')) {
        this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'z-index', 999999);
        this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'overflow', 'auto');
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
      if (!status && $(this.organisationChangeFormModal.nativeElement).hasClass('show')) {
        this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'z-index', 999999);
        this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'overflow', 'auto');
      }
    })
    BcmStrategyStore.unsetDetails();
    if(this.bcpSource.type == 'Add')
      this.setInitialOrganizationLevels();
    else
    {
      this.getBcStrategies();
      this.getBCPTemplate();
      this.setFormValues();
    }
  }

  MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository')
      .createUploadAdapter = (loader) => {
        // Configure the URL to the upload script in your back-end here!
        return new MyUploadAdapter(loader, this._http);
      };
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  descriptionValueChange(event) {
    this._utilityService.detectChanges(this._cdr);
  }

  getDescriptionLength() {
    var regex = /(<([^>]+)>)/ig;
    var result = this.form.value.description.replace(regex, "");
    return result.length;
  }
  
  setInitialOrganizationLevels(){
    this.form.patchValue({
      section_ids:AuthStore.user.section ? [AuthStore.user.section] : [],
      organization_ids: AuthStore?.user?.organization ? [AuthStore?.user?.organization] : [],
      division_ids: AuthStore?.user?.division ? [AuthStore?.user?.division] : [],
      department_ids: AuthStore?.user?.department ? [AuthStore?.user?.department] : [],
      sub_section_ids: AuthStore?.user?.sub_section ? [AuthStore?.user?.sub_section] : [],
    });
  }

  organisationChanges() {
    this.openModelPopup = true;
    this._renderer2.addClass(this.organisationChangeFormModal.nativeElement,'show');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement,'z-index','99999');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement,'display','block');
    this._utilityService.detectChanges(this._cdr);
  }

  closeModal(data?) {
    if(data){
      this.form.patchValue({
        division_ids: data.division_ids ? data.division_ids : [],
        department_ids:data.department_ids ? data.department_ids : [],
        section_ids:data.section_ids ? data.section_ids : [],
        sub_section_ids: data.sub_section_ids ? data.sub_section_ids : [],
        organization_ids: data.organization_ids ? data.organization_ids : []
      })
    }
    this._renderer2.removeClass(this.organisationChangeFormModal.nativeElement,'show');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement,'z-index','9999');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement,'display','none');
    this.openModelPopup = false;
    this._utilityService.detectChanges(this._cdr);
  }

  setFormValues(){
    if(this.bcpSource.values){
      let pos = this.bcpSource.values.versions.findIndex(e=>e.is_latest == 1);
      // if(this.bcpSource.values.solutions.length > 0){
      //   this.selectedStrategyId = typeof(this.bcpSource.values.solutions[0].business_continuity_strategy_id) == "string" ? parseInt(this.bcpSource.values.solutions[0].business_continuity_strategy_id) : this.bcpSource.values.solutions[0].business_continuity_strategy_id;
      //   this.searchBcStrategies({term: this.selectedStrategyId});
      //   this.getBcStrategy(this.selectedStrategyId,false);
      // }
      this.form.patchValue({
        'organization_ids': toJS(this.bcpSource.values.organizations),
        'division_ids': toJS(this.bcpSource.values.divisions),
        'department_ids': toJS(this.bcpSource.values.departments),
        'section_ids': toJS(this.bcpSource.values.sections),
        'sub_section_ids': toJS(this.bcpSource.values.sub_sections),
        'id':this.bcpSource.values.id,
        'title': this.bcpSource.values.title,
        'description': this.bcpSource.values.description,
        'version':this.bcpSource.values.versions[pos].title,
        'document_no': this.bcpSource.values.document_no,
        'solution_ids': toJS(this.bcpSource.values.solutions),
        'strategy_ids': this._helperService.getArrayProcessed(this.bcpSource.values.strategys,'id'),
        'template_id':this.bcpSource.values?.template?.id
      });
      if(this.bcpSource.values.strategys.length > 0){
        this.searchBcStrategies({term:this.form.value.strategy_ids.toString()});
        this.getBcStrategy(this.form.value.strategy_ids,false);
      }
      this._utilityService.detectChanges(this._cdr);
    }
  }

  getBCPTemplate(){
    this._bcmTemplateService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  searchBCPTemplate(e){
    this._bcmTemplateService.getItems(false,'&q='+e.term).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getBcStrategies(){
    this._bcStrategyService.getItems(false).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchBcStrategies(e){
    this._bcStrategyService.getItems(false,'&q='+e.term).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getBcStrategy(id,unsetValue:boolean = true){
    BcmStrategyStore.unsetDetails();
    this.approvedSolutions = [];
    if(unsetValue){
      this.form.controls['solution_ids'].reset();
    } 
    if(id){
      this._bcStrategyService.getBcStrategySolutions(id).subscribe(res=>{
        // console.log();
        this.selectApprovedSolutions(res['data']);
        this._utilityService.detectChanges(this._cdr);
      })
    }
  }

  selectApprovedSolutions(solutions){
    this.approvedSolutions = [];
    if(solutions.length > 0){
      for(let i of solutions){
        if(i.business_continuity_strategy_solution_status_type == 'approved'){
          this.approvedSolutions.push(i);
          if(this.bcpSource.type != 'Add'){
            // this.form.patchValue({
            //   'solution_ids': this.bcpSource.values.solutions
            // })
            
          }
        }
      }
    }
  }

    processSaveData(){
      let saveData = this.form.value;
      saveData['solution_ids'] = this.form.value.solution_ids ? this._helperService.getArrayProcessed(this.form.value.solution_ids,'id') :[]
      saveData['organization_ids'] = this.form.value.organization_ids ? this._helperService.getArrayProcessed(this.form.value.organization_ids,'id') : [AuthStore.user?.organization.id];
      saveData['division_ids'] =  this.form.value.division_ids ? this._helperService.getArrayProcessed(this.form.value.division_ids,'id') : [AuthStore.user?.division.id];
      saveData['department_ids'] = this.form.value.department_ids ? this._helperService.getArrayProcessed(this.form.value.department_ids,'id') : [AuthStore.user?.department.id];
      saveData['section_ids'] = this.form.value.section_ids ? this._helperService.getArrayProcessed(this.form.value.section_ids,'id') : [AuthStore.user?.section.id];
      saveData['sub_section_ids'] = this.form.value.sub_section_ids ? this._helperService.getArrayProcessed(this.form.value.sub_section_ids,'id') : [AuthStore.user?.sub_section.id];
      return saveData;
    }
    
    save(close:boolean=false){
      this.formErrors = null;
      if (this.form.valid) {
        let save;
        AppStore.enableLoading();
        if (this.form.value.id) {
          save = this._bcpService.updateItem(this.form.value.id, this.processSaveData());
        } else {
          delete this.form.value.id
          save = this._bcpService.saveItem(this.processSaveData());
        }
        save.subscribe((res: any) => {
          if(!this.form.value.id){
            this.resetForm();
            // this.cancel();
            // this._router.navigateByUrl('bcm/business-continuity-plan/'+res.id)
          }
          AppStore.disableLoading();
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
          }, 500);
          if (close){
            this.cancel();
            this._router.navigateByUrl('bcm/business-continuity-plan/'+res.id)
          }
        }, (err: HttpErrorResponse) => {
          if (err.status == 422) {
            this.formErrors = err.error.errors;}
            else if(err.status == 500 || err.status == 403){
              this.cancel();
            }
            AppStore.disableLoading();
            this._utilityService.detectChanges(this._cdr);
          
        });
      }
    }

    resetForm(){
      this.form.reset();
      this.formErrors = null;
    }

    cancel(){
      this.resetForm();
      this._eventEmitterService.dismissAddBcpModal();
      this.idleTimeoutSubscription.unsubscribe();
      this.networkFailureSubscription.unsubscribe();
    }
}
