import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { QlikService } from "src/app/core/services/general/qlik/qlik.service";
import { UtilityService } from "src/app/shared/services/utility.service";

@Component({
  selector: 'app-hc-qlik-dashboard',
  templateUrl: './hc-qlik-dashboard.component.html',
  styleUrls: ['./hc-qlik-dashboard.component.scss']
})
export class HcQlikDashboardComponent implements OnInit {

  ticket: string = '';
  qlikUrl = 'https://qlik.ceoanalytix.com/excelledia/single/?appid=dcaf7a7d-f42a-437c-9ae8-072244faefc9&sheet=054d9c9b-c4d2-429f-9562-d1b1240c1cec&opt=currsel&select=clearall&qlikTicket=';
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
