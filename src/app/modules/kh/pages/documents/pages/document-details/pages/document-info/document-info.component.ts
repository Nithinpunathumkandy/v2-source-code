import {Component, OnInit } from '@angular/core';
import { KHSettingStore } from 'src/app/stores/settings/kh-settings.store';

@Component({
  selector: 'app-document-info',
  templateUrl: './document-info.component.html',
  styleUrls: ['./document-info.component.scss']
})
export class DocumentInfoComponent implements OnInit {

  KHSettingStore=KHSettingStore;

  constructor(
  
  ) { }

  ngOnInit(): void {
    

  }


  



}
