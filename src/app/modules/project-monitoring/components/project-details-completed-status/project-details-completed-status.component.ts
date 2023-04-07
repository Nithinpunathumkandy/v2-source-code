import { Component, Input, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ProjectMonitoringStore } from 'src/app/stores/project-monitoring/project-monitoring.store';
import { StakeholderStore } from 'src/app/stores/project-monitoring/project-stakeholder-store';

@Component({
  selector: 'app-project-details-completed-status',
  templateUrl: './project-details-completed-status.component.html',
  styleUrls: ['./project-details-completed-status.component.scss']
})
export class ProjectDetailsCompletedStatusComponent implements OnInit {
  @Input('source') validationSource: any;
  ProjectMonitoringStore = ProjectMonitoringStore;
  StakeholderStore = StakeholderStore
  validationCheckEventSubscription: any;
  is_scopeValidation: boolean = false;
  out_scopeValidation: boolean = false;
  assumption_scopeValidation: boolean =false;
  constructor(private _eventEmitterService: EventEmitterService,) { }

  ngOnInit(): void {
    this.scopeOfWorkValiation()
  }

  cancel(){
    this._eventEmitterService.dismissprojectmonitoringValidationModal()
  }

  scopeOfWorkValiation(){
    if(ProjectMonitoringStore.individualDetails?.project_scopes.length > 0){
      for(let data of ProjectMonitoringStore.individualDetails?.project_scopes){
        if(data.type == 'in_scope'){
          this.is_scopeValidation = true
        }
        if(data.type == 'out_scope'){
          this.out_scopeValidation = true
        }
        if(data.type == 'assumption'){
          this.assumption_scopeValidation = true
        }
      }
      
    }
  }

}
