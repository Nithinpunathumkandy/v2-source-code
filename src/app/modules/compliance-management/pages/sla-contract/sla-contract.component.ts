import { Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { SLAContractStore } from 'src/app/stores/compliance-management/sla-contract/sla-contract-store';

@Component({
  selector: 'app-sla-contract',
  templateUrl: './sla-contract.component.html',
  styleUrls: ['./sla-contract.component.scss']
})
export class SlaContractComponent implements OnInit {
  SLAContractStore = SLAContractStore;
  constructor(private _renderer2: Renderer2) { }

  ngOnInit(): void {
  }

  

}
