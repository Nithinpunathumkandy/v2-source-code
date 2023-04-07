import { resolve } from '@angular/compiler-cli/src/ngtsc/file_system';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ProjectBudgetService } from 'src/app/core/services/project-monitoring/project-budget/project-budget.service';
import { ProjectMilestoneService } from 'src/app/core/services/project-monitoring/project-milestone.service';
import { ProjectMonitoringService } from 'src/app/core/services/project-monitoring/project-monitoring/project-monitoring.service';
import { ProjectRiskService } from 'src/app/core/services/project-monitoring/project-risk/project-risk.service';
import { ExternalUsersService } from 'src/app/core/services/project-monitoring/project-team/external-users.service';
import { ProjectTeamService } from 'src/app/core/services/project-monitoring/project-team/project-team.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ExternalUsersStore } from 'src/app/stores/project-monitoring/external-users-store';
import { BudgetStore } from 'src/app/stores/project-monitoring/project-budget-store';
import { ProjectMilestoneStore } from 'src/app/stores/project-monitoring/project-milestone-store';
import { ProjectMonitoringStore } from 'src/app/stores/project-monitoring/project-monitoring.store';
import { RiskStore } from 'src/app/stores/project-monitoring/project-risk-store';
import { StakeholderStore } from 'src/app/stores/project-monitoring/project-stakeholder-store';
import { ProjectTeamStore } from 'src/app/stores/project-monitoring/project-team-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

@Component({
  selector: 'app-projecct-monitoring-preview',
  templateUrl: './projecct-monitoring-preview.component.html',
  styleUrls: ['./projecct-monitoring-preview.component.scss']
})
export class ProjecctMonitoringPreviewComponent implements OnInit {
  @Input('source') previewSource: any;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
  ProjectMonitoringStore = ProjectMonitoringStore
  RiskStore = RiskStore;
  ExternalUsersStore = ExternalUsersStore;
  ProjectTeamStore = ProjectTeamStore
  BudgetStore = BudgetStore;
  StakeholderStore = StakeholderStore
  ProjectMilestoneStore = ProjectMilestoneStore
  AuthStore = AuthStore
  AppStore = AppStore
  selectedThemeId: any;
  selectedThemePos: any = 0;
  selectedObjectiveIndex: any = 0;
  selectedSection = 'in_scope';
  mileStoneNodata = "No milestone added"
  stakeholderNodata = "No stakeholder added"
  noInscope ="No inscope added"
  noOutscope = "No outscope added"
  noAssumption = "No assumption added"
  themeNodata = "No themes added"
  riskNodata ="No risk added"
  paymentNodata ="No payment added"
  noDataSource = "look_like_we_dont_have_any_external_users_data_to_display_here"
  noDataSourceTeam ="Look like we dont have any project team data to display here"

  noDataSourceOutcome = {
    noData: "No outcomes added", border: false
  }
  noDataSourceDeli = {
    noData: "No deliverables added", border: false
  }



  constructor(private _eventEmitterService: EventEmitterService,
    private _projectService : ProjectMonitoringService,
    private _cdr: ChangeDetectorRef,private _utilityService: UtilityService,
    private _projectRiskService : ProjectRiskService,
    private _projectBudgetService : ProjectBudgetService,
    private _projectMilestoneService : ProjectMilestoneService,
    private _externalUsersService: ExternalUsersService,
    private _projectTeamService : ProjectTeamService,
    ) { }

  ngOnInit(): void {
    this.gotoSection(this.selectedSection);
    this.getStrategicList();
    this.getScopes()
    this.getRisk()
    this.getPaymentsList();
    this.getExternalUsers();
    this.getProjectManagers();
    this.getProjectAssistantManagers();
    this.getProjectMembers();
    this.newActio()

    // this.getStakeholder()
  }

  cancel(){
   this._eventEmitterService.dissmissPreviewModal()
  }

  selectTheme(pos,id){
    this.selectedThemeId = id
    this.selectedThemePos = pos;
  }

  getGrandTotal(){
    let total  = 0
    if(BudgetStore.payment.length > 0){
      BudgetStore.payment.map(data=>{
        total = Number(total) + Number(data.payment_total)
      })
    }
    return total.toFixed(2)
  }

  selectObjectiveIndexChange(index,id){

    if(this.selectedObjectiveIndex == index){
      this.selectedObjectiveIndex = null;
    }else{
      this.selectedObjectiveIndex = index
    }
  }

  newActio(){
    const promise = new Promise((resolve,reject)=>{
      console.log('Before')
      resolve('Helo world')
    })
    console.log('Before calling then method on Promise');
    promise.then(message => {console.log(message)})
  }

  getPaymentsList(){
    this._projectBudgetService.getPaymentList().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getMileStoneList(){
    this._projectMilestoneService.getMilestons().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getStakeholder() {
    this._projectService.getStakeholder().subscribe(res=>{
     this._utilityService.detectChanges(this._cdr);
    })
   }

  getStrategicList(){
    this._projectService.getStrategicAlignments().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getScopes(){
    this._projectService.getScopes().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getRisk(){
    this._projectRiskService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }
  gotoSection(type) {
    this.selectedSection = type;
    switch (type) {
      case 'in_scope':
        NoDataItemStore.setNoDataItems({ title: "Looks like Project is not mapped with any item here", subtitle: "common_nodata_subtitle", buttonText: "choose_in_scope" });
        break;
      case 'out_scope':
        
          NoDataItemStore.setNoDataItems({ title: "Looks like Project is not mapped with any item here", subtitle: "common_nodata_subtitle", buttonText: "choose_out_scope" });
  
        break;
      case 'assumption':
        NoDataItemStore.setNoDataItems({ title: "Looks like Project is not mapped with any item here", subtitle: "common_nodata_subtitle", buttonText: "choose_assumption" });
        break;
      
    } 
  }

  getExternalUsers(){
    this._externalUsersService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getProjectManagers(){
    this._projectTeamService.getProjectManagers(ProjectMonitoringStore.selectedProjectId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getProjectAssistantManagers(){
    this._projectTeamService.getProjectAssistantManagers(ProjectMonitoringStore.selectedProjectId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getProjectMembers(){
    this._projectTeamService.getProjectMembers(ProjectMonitoringStore.selectedProjectId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getPopupDetails(user,is_created_by:boolean = false){
    let userDetailObject: any = {};
    if(user){
      userDetailObject['first_name'] = user.first_name ? user.first_name : user.name ? user.name : '';
      userDetailObject['last_name'] = user.last_name;
      userDetailObject['designation'] = user.designation_title? user.designation_title: user.designation ? user.designation.title : null;
      userDetailObject['image_token'] = user.image_token ? user.image_token : user.image?.token ? user.image?.token : null;
      userDetailObject['email'] = user.email ? user.email: null;
      userDetailObject['mobile'] = user.mobile ? user.mobile: null;
      userDetailObject['id'] = user.id;
      userDetailObject['department'] = typeof(user.department) == 'string' ? user.department : user.designation ? user.designation.title : null;
      userDetailObject['status_id'] = user.status_id ? user.status_id : 1;
      if(is_created_by) userDetailObject['created_at'] = new Date();
      return userDetailObject;
    }
  }

}
