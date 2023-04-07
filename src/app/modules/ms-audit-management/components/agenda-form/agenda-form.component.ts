import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { MsTypeService } from 'src/app/core/services/masters/organization/ms-type/ms-type.service';
import { AuditProgramReportService } from 'src/app/core/services/ms-audit-management/audit-program-report/audit-program-report.service';
import { MsAuditTeamService } from 'src/app/core/services/ms-audit-management/ms-audit-team/ms-audit-team.service';
import { AuditReportService } from 'src/app/core/services/ms-audit-management/ms-audit/ms-audit-details/audit-report/audit-report.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { MsTypeMasterStore } from 'src/app/stores/masters/organization/ms-type-master.store';
import { MsAuditTeamStore } from 'src/app/stores/ms-audit-management/ms-audit-team/ms-audit-team-store';
import { MsTypeStore } from 'src/app/stores/organization/business_profile/ms-type/ms-type.store';

@Component({
  selector: 'app-agenda-form',
  templateUrl: './agenda-form.component.html',
  styleUrls: ['./agenda-form.component.scss']
})
export class AgendaFormComponent implements OnInit {

  @Input('source')agendaData

  MsAuditTeamStore=MsAuditTeamStore;
  MsTypeMasterStore=MsTypeMasterStore;
  MsTypeStore=MsTypeStore;
  AppStore=AppStore;

  todayDate: any = new Date();
  agendaForm:FormGroup;
  agendaFormErrors:any;


  constructor(
    private _msAuditTeamService:MsAuditTeamService,
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    public _msService: MsTypeService,
    private _formBuilder: FormBuilder,
    private _auditReportService:AuditProgramReportService
  ) { }

  ngOnInit(): void {

    this.agendaForm = this._formBuilder.group({
      id: [''],
      title: ['',[Validators.required, Validators.maxLength(255)]],
      team_id:[null,[Validators.required]],
      start_time:[null,[Validators.required]],
      ms_type_id:[null,[Validators.required]]
    })

    this.resetForm()
    
    if (this.agendaData.hasOwnProperty('values') && this.agendaData.values  && this.agendaData.type=='edit') 
    this.setAgendaData()

    this.getAuditTeams()
    this.getAvailableMsTypes()
  }

  setAgendaData(){
    this.agendaForm.patchValue({
      id:this.agendaData.values?.id?this.agendaData.values.id:null,
      title:this.agendaData.values?.title?this.agendaData.values.title:'',
      start_time:this.agendaData.values?.start_time?new Date(this.agendaData.values.start_time) :'',
      team_id:this.agendaData.values?.team_id?this.agendaData.values.team_id:'',
      ms_type_id:this.agendaData.values?.ms_type_id?this.agendaData.values.ms_type_id:'',
    })
  }


  getAuditTeams(searchItem?){
    this._msAuditTeamService.getItems(false, searchItem?'&q='+searchItem:null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }
  getAvailableMsTypes(){
    let params = '';
    this._msService.getItems(false,params).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr)
    });
  }
  searchAvailableMsType(event){
    MsTypeMasterStore.setCurrentPage(1);
    this._msService.getItems(false,'&q='+event.term).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
  }

  save(close:boolean=false){
     this.agendaFormErrors=null;
    if (this.agendaForm.value) {

      let save
      AppStore.enableLoading();

      if (this.agendaForm.value.id) {
        save = this._auditReportService.updateReportAgenda(this.agendaForm.value.id, this.processData('update'))
      } 
      else
      save = this._auditReportService.saveReportAgenda(this.processData('save'))
      save.subscribe((res: any) => {
         this.resetForm()
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.closeAuditReportAgenda();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.agendaForm = err.error.errors;
          this._utilityService.detectChanges(this._cdr);
          AppStore.disableLoading();
        }
      });
    }
  }

  processData(type){

    let params: any = {};

    if(type=='save')
    {
      params['title'] = this.agendaForm.value.title;
      params['team_id'] = this.agendaForm.value.team_id;
      params['start_time'] = this._helperService.passSaveFormatDate(this.agendaForm.value.start_time);
      params['ms_type_id'] = this.agendaForm.value.ms_type_id;
    }
    else{

      params['id']=this.agendaForm.value.id
      params['title'] = this.agendaForm.value.title;
      params['team_id'] = this.agendaForm.value.team_id;
      params['start_time'] = this._helperService.passSaveFormatDate(this.agendaForm.value.start_time);
      params['ms_type_id'] = this.agendaForm.value.ms_type_id;

    }

    return params

  }

  closeAuditReportAgenda(){
    this._eventEmitterService.dismissAuditReportAgendaForm()
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }


  resetForm() {

    this.agendaForm.reset();
    this.agendaForm.pristine;
    this.agendaFormErrors = null;
  }
ng
}
