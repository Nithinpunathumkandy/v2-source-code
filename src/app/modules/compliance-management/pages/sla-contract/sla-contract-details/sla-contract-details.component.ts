import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppStore } from 'src/app/stores/app.store';
import { SLAContractStore } from 'src/app/stores/compliance-management/sla-contract/sla-contract-store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
declare var $: any

@Component({
  selector: 'app-sla-contract-details',
  templateUrl: './sla-contract-details.component.html',
  styleUrls: ['./sla-contract-details.component.scss']
})
export class SlaContractDetailsComponent implements OnInit {

  SLAContractStore = SLAContractStore;
  AppStore = AppStore;
  constructor(
    private _route: ActivatedRoute) { 
      
    }

  ngOnInit(): void {
    SLAContractStore.sla_contract_id = null;
    AppStore.showDiscussion = false;
    this._route.params.subscribe(params => {
      let id = params.id;
      SLAContractStore.sla_contract_id = id
    });

  }

  ngOnDestroy(){
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    SLAContractStore.sla_contract_id = null;
    SLAContractStore.unsetIndividualSLAContracts();
  }
}
