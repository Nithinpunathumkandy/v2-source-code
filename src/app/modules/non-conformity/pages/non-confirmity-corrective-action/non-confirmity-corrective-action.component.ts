import { Component, OnInit } from '@angular/core';
import { FindingCorrectiveActionStore } from 'src/app/stores/non-conformity/findings/finding-corrective-action-store';

@Component({
  selector: 'app-non-confirmity-corrective-action',
  templateUrl: './non-confirmity-corrective-action.component.html',
  styleUrls: ['./non-confirmity-corrective-action.component.scss']
})
export class NonConfirmityCorrectiveActionComponent implements OnInit {

  FindingCorrectiveActionStore = FindingCorrectiveActionStore;
  constructor() { }

  ngOnInit(): void {
  }

}
