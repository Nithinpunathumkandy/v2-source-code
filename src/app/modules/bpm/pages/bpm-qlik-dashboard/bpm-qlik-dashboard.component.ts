import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { QlikService } from "src/app/core/services/general/qlik/qlik.service";
import { UtilityService } from "src/app/shared/services/utility.service";

@Component({
  selector: 'app-bpm-qlik-dashboard',
  templateUrl: './bpm-qlik-dashboard.component.html',
  styleUrls: ['./bpm-qlik-dashboard.component.scss']
})
export class BpmQlikDashboardComponent implements OnInit {

  ticket: string = '';
  qlikUrl = 'https://qlik.ceoanalytix.com/excelledia/single/?appid=dcaf7a7d-f42a-437c-9ae8-072244faefc9&sheet=4c71f69f-dc93-46fb-a35c-d4a5f356bf71&opt=currsel&select=clearall&qlikTicket=';
  generatedUrl:any;
  constructor(private _qlikService: QlikService,private _sanitizer:DomSanitizer,
    private _cdr: ChangeDetectorRef, private _utilityService: UtilityService) { }

  ngOnInit(): void {
    this.generateQlikTicket()
  }

  generateQlikTicket(){
    this._qlikService.getQlikTicketAuth().subscribe(res=>{
      this.ticket = res.ticket;
      var url = this.qlikUrl+this.ticket;
      setTimeout(() => {
        this.generatedUrl = this.getSafeUrl(url)
        this._utilityService.detectChanges(this._cdr);
      }, 5000);
    })
  }

  getSafeUrl(url) {
    return this._sanitizer.bypassSecurityTrustResourceUrl(url);     
  }

}
