import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExternalAuditService } from 'src/app/core/services/external-audit/external-audit/external-audit.service';
import { AppStore } from 'src/app/stores/app.store';
import {ExternalAuditMasterStore} from 'src/app/stores/external-audit/external-audit/external-audit-store';
import { FindingMasterStore } from 'src/app/stores/external-audit/findings/findings-store';
@Component({
  selector: 'app-external-audit-details',
  templateUrl: './external-audit-details.component.html',
  styleUrls: ['./external-audit-details.component.scss']
})
export class ExternalAuditDetailsComponent implements OnInit  {
  ExternalAuditMasterStore = ExternalAuditMasterStore;
  AppStore = AppStore;
  constructor(   private route: ActivatedRoute,
    private _externalAuditService: ExternalAuditService) { }

  ngOnInit(): void {
    // getting individual external audit details with id
    let id: number;
    this.route.params.subscribe(params => {
      id = +params['id']; // (+) converts string 'id' to a number
      this._externalAuditService.saveAuditId(id);
      //this._externalAuditService.getItem(id).subscribe()
    });

   
  }

  // getAuditDetails(){}

  ngOnDestroy(){
    ExternalAuditMasterStore.unsetIndividualExternalAuditItem();
    FindingMasterStore.unsetFindings();
  }

}
