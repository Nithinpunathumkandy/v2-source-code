import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IncidentService } from 'src/app/core/services/incident-management/incident/incident.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IncidentCorrectiveActionStore } from 'src/app/stores/incident-management/corrective-action/corrective-action-store';
import { IncidentInvestigationWorkflowStore } from 'src/app/stores/incident-management/incident-workflow/incident-investigation-workflow.store';
import { IncidentStore } from 'src/app/stores/incident-management/incident/incident-store';
import { IncidentInvestigationStore } from 'src/app/stores/incident-management/investigation-store';
import { IncidentReportStore } from 'src/app/stores/incident-management/report/incident-report.store';

@Component({
  selector: 'app-incident-details',
  templateUrl: './incident-details.component.html',
  styleUrls: ['./incident-details.component.scss']
})
export class IncidentDetailsComponent implements OnInit {

  AuthStore = AuthStore;
  IncidentStore = IncidentStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  AppStore = AppStore;


  constructor(private _activatedRouter: ActivatedRoute,private _route: Router,
    private _incidentService : IncidentService,private _utilityService: UtilityService,
    private  _cdr: ChangeDetectorRef,) { }

  ngOnInit(): void {
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    IncidentCorrectiveActionStore.unSetIncidentCorrectiveAction();
    IncidentReportStore.unsetAllIncidents();
    let id: number;
    this._activatedRouter.params.subscribe(params => {
      id = +params['id']; 
      //this.getIncidentDetails(id);
      if(id){
        //  
        IncidentStore.setSelectedIncidentId(id);
      }
      else if(!IncidentStore.selectedId)
        this._route.navigateByUrl('/incident-management/incidents');
    });
     
  }

  getIncidentDetails(id){
    this._incidentService.getItem(id).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  ngOnDestroy(){
    IncidentStore.individualLoaded = false;
    IncidentInvestigationStore.individualLoaded = false;
    IncidentInvestigationStore.individualInvestigationItem = null;
    IncidentStore.investigatorsList = null
    IncidentCorrectiveActionStore.unSetIncidentCorrectiveAction()
    IncidentStore.unsetIndividualIncidentItem();
    IncidentStore.unsetIncidentMappingItems();
    IncidentStore.unsetIncidentInvestigators();
    IncidentInvestigationStore.unsetInvestigationDetails();
    IncidentStore.unsetRootCauseAnalysis();
    IncidentReportStore.unsetAllIncidents();
    IncidentInvestigationWorkflowStore.unsetWorkflowDetails();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  }

}
