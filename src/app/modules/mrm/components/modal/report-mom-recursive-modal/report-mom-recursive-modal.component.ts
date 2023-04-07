import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-report-mom-recursive-modal',
  templateUrl: './report-mom-recursive-modal.component.html',
  styleUrls: ['./report-mom-recursive-modal.component.scss']
})
export class ReportMomRecursiveModalComponent implements OnInit {

  @Input('details') items: any;

  constructor() { }

  ngOnInit(): void {
  }

}
