import { Component, OnInit } from '@angular/core';
import { ProjectSettingsModulesStore } from 'src/app/stores/project-management/project-details/project-settings/project-settings-modules/project-settings-modules.store';
import { projectSettingsModulesStatus } from 'src/app/core/models/project-management/project-details/project-settings/project-settings';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ProjectSettingsModulesService } from 'src/app/core/services/project-management/project-details/project-settings/modules-settings/project-settings-modules.service';

@Component({
  selector: 'app-project-settings-modules',
  templateUrl: './project-settings-modules.component.html',
  styleUrls: ['./project-settings-modules.component.scss']
})
export class ProjectSettingsModulesComponent implements OnInit {
  projectSettingsModuleStore = ProjectSettingsModulesStore;

  constructor(private _projectSettingsModuleService: ProjectSettingsModulesService,
    private _utilityService: UtilityService ) { }

  ngOnInit(): void {
  }

  toggleModuleSetting(item, event){
    let status_toggle:projectSettingsModulesStatus = event.target.checked ? 'activate' : 'deactivate';
    
    this._projectSettingsModuleService.toggleSettingsModule(item?.type, status_toggle).subscribe(res=> {
      let text;
      if(item?.type)
      {
        //console.log(item?.type);
       
        if(item?.type=='high-level-plan')
        {
          text='project_management_high_level_plan_updated'
        }
        if(item?.type=='task')
        {
          text='project_management_task_updated'
        }
        if(item?.type=='member')
        {
          text='project_management_member_updated'
        }
        if(item?.type=='document')
        {
          text='project_management_document_updated'
        }
        if(item?.type=='meeting')
        {
          text='project_management_meeting_updated'
        }
        if(item?.type=='risk')
        {
          text='project_management_risk_updated'
        }
        if(item?.type=='scope')
        {
          text='project_management_scope_updated'
        }
        if(item?.type=='deliverable')
        {
          text='project_management_deliverable_updated'
        }
        if(item?.type=='discussion')
        {
          text='project_management_discussion_updated'
        }
        if(item?.type=='cost')
        {
          text='project_management_cost_updated'
        }
        if(item?.type=='payment-milestone')
        {
          text='project_management_payment_milestone_updated'
        }
        if(item?.type=='team')
        {
          text='project_management_payment_team_updated'
        }
        if(item?.type=='project-closure')
        {
          text='project_management_payment_project_closure_updated'
        }
        if(item?.type=='lesson-learned')
        {
          text='project_management_payment_lesson_learned_updated'
        }
      }
      this._utilityService.showSuccessMessage('success', text);
    })
  }

}
