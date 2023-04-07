import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-summary-report',
  templateUrl: './summary-report.component.html',
  styleUrls: ['./summary-report.component.scss']
})
export class SummaryReportComponent implements OnInit {

  leftSideMenuOpen = [
    {
    id: 1,
    section : '1',
    title : 'Audit program 1',
    ms_audit_program_report_content_childrens : [
      {
      section : 'children 1',
      title : 'children1'
    },
    {
      section : 'children 2',
      title : 'children 2'
    },
    {
      id: 3,
      section : 'children 3',
      title : 'children 3'
    }
  ]
    
   },
   {
    id: 2,
    section : 'test 2',
    title : 'Audit program 12',
    ms_audit_program_report_content_childrens : [
      {
      section : 'children 1',
      title : 'children1'
    },
    {
      section : 'children 2',
      title : 'children 2'
    },
    {
      id: 3,
      section : 'children 3',
      title : 'children 3'
    }
  ]
   },
   {
    section : 'test 3',
    title : 'Audit program 1 3',
    ms_audit_program_report_content_childrens : [
      {
      section : 'children 1',
      title : 'children1'
    },
    {
      section : 'children 2',
      title : 'children 2'
    },
    {
      id: 3,
      section : 'children 3',
      title : 'children 3'
    }
  ]
   }
]
  rightSidebarOpen = []
  selectedItemId: any;
  selectedIndex: number;
 
  constructor() { }

  ngOnInit(): void {
  }

  setSelectedReportItem(reportItemData){

    if (reportItemData.id == this.selectedItemId)
    this.selectedItemId = null;
  else {
    this.selectedItemId = reportItemData.id;
    // AssessmentsStore.currentAssessment = docId;
  }
  this.scrollbyIndex(reportItemData.type)

  }

  scrollbyIndex(index) {

    document.getElementById(index).scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  }

  selectedIndexChange(index:number,id:number) {
    if(this.selectedIndex == index){
      this.selectedIndex = null;
    } else{
      this.selectedIndex = index;
      // this._utilityService.detectChanges(this._cdr);
    }  }
 
}
