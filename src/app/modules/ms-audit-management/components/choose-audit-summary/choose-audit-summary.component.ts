import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { MsAuditProgramsService } from 'src/app/core/services/ms-audit-management/ms-audit-programs/ms-audit-programs.service';
import { AuditProgramSummaryReportService } from 'src/app/core/services/ms-audit-management/program-summary-report/audit-program-summary-report.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { MsAuditProgramsStore } from 'src/app/stores/ms-audit-management/ms-audit-programs/ms-audit-programs-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

@Component({
  selector: 'app-choose-audit-summary',
  templateUrl: './choose-audit-summary.component.html',
  styleUrls: ['./choose-audit-summary.component.scss']
})
export class ChooseAuditSummaryComponent implements OnInit {
  @Input('source') programSource : any;
  AppStore = AppStore;
  AuthStore = AuthStore
  form: FormGroup;
  formErrors: any;
  MsAuditProgramsStore = MsAuditProgramsStore
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
  selectedProgramIds: any = [];

  constructor(
    private _reportService : AuditProgramSummaryReportService,
    private _msAuditProgramsService : MsAuditProgramsService,
    private  _eventEmitterService : EventEmitterService,
    private _humanCapitalService: HumanCapitalService,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef, 
    
    ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group ({
      title : [null,[Validators.required]],
   })
    this.pageChange(1);
  }

  sortTitle(type: string) {
    this._msAuditProgramsService.sortList(type, null);
    this.pageChange();
  }

  pageChange(newPage: number = null) {
    if (newPage) MsAuditProgramsStore.setCurrentPage(newPage);
    this._msAuditProgramsService.getItems(false,null).subscribe(() => {;
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100)
    });
  }

  createImageUrl(token) {
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  changeCheckList(list,index){
    if(this.selectedProgramIds.length > 0){
      let pos = this.selectedProgramIds.findIndex(e => e == list.id)
      if(pos != -1){
        this.selectedProgramIds.splice(pos,1)
        // MsAuditCheckListStore.msAuditChecckLists[index].is_selected = 0
 
      }else {
        this.selectedProgramIds.push(list.id)
        // MsAuditCheckListStore.msAuditChecckLists[index].is_selected = 1
      }
    }else {
      this.selectedProgramIds.push(list.id)
      // MsAuditCheckListStore.msAuditChecckLists[index].is_selected = 1
 
    }
   }

   checkedItems(id:number){
    if(MsAuditProgramsStore?.allItems.length > 0){
      // for(let data of MsAuditCheckListStore.msAuditChecckLists){
        let pos = this.selectedProgramIds?.findIndex(e=>e == id)
        if(pos != -1)
          return true;
        else 
          return false;
      // }
    }
  }

  checkAll(event){
    if(MsAuditProgramsStore?.allItems.length > 0){
      for(let data of MsAuditProgramsStore?.allItems){
        if(event.target.checked){
          this.selectedProgramIds.push(data.id)
          // data.is_selected = 1
        }else {
          this.selectedProgramIds = [];
          // data.is_selected = 0
        }
      }
    }
  }

  save(close: boolean = false) {
    let saveData = {
      audit_program_ids : this.selectedProgramIds,
      title : this.form.value.title 
    }
    let save;
    AppStore.enableLoading();
  
    if (this.programSource.type == 'Edit') {
      //  save = this._reportService.generateReport(saveData,this.programSource.values.id);
    } else {
      // delete this.form.value.id
      save = this._reportService.generateReport(saveData);
    }
  
    save.subscribe((res: any) => {
      if (this.programSource.type != 'Edit') {
        // this.resetForm();
      }
      this.selectedProgramIds =  []
      AppStore.disableLoading();
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      if (close) this.cancel();
    }, (err: HttpErrorResponse) => {
      this.selectedProgramIds =  []
      if (err.status == 422) {
        // this.formErrors = err.error.errors;
      }
      else if (err.status == 500 || err.status == 403) {
        this.cancel();
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
  
    });
  
  }
  cancel(){
    // this.resetForm()
    this._eventEmitterService.dismissAuditProgramModal()
  }





}
