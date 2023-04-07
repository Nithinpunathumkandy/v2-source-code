
import {  Component, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { KHSettingStore } from 'src/app/stores/settings/kh-settings.store';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
@Component({
  selector: 'app-reference-code-modal',
  templateUrl: './reference-code-modal.component.html',
  styleUrls: ['./reference-code-modal.component.scss']
})
export class ReferenceCodeModalComponent implements OnInit {

  KHSettingStore = KHSettingStore;
  sampleCheck: string = ' '
  preFix: string = ' '
  codeDivider: string = '/'
  companyCode: string = ' '

  referenceCodeArray = [
    {
      "type": "prefix",
      "title": "2022",
      "order": 1,
      "is_enable": 0,
      "disabled": true,
    },
    {
      "type": "department",
      "title": "DEMO",
       "order": 2,
      "is_enable": 0,
    },
    {
      "type": "document-type",
      "title": "PDF",
       "order": 3,
      "is_enable": 0
    },
    {
      "type": "company-code",
      "title": "CHEM",
      "order": 4,
      "is_enable": 0,
    },
    {
      "type": "document-category",
      "title": "STAR",
      "order": 5,
      "is_enable": 0
    },
    {
      "type": "level",
      "title": "01",
      "order": 6,
      "is_enable": 0
    },
    {
      "type": "year",
      "title": 2022,
      "order": 7,
      "is_enable": 0
    },
    {
      "type": "code-divider",
      "title": "/",
      "is_enable": 1,
      "disabled": true,
    }
  ]
  constructor(
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService
  ) { }

  ngOnInit(): void {





  }


  save() {

    KHSettingStore.referenceCodeArray.forEach(e=>{
        if(e.type=='prefix')
        e.title=KHSettingStore.preFix
        if(e.type=='code-divider')
        e.title=KHSettingStore.codeDivider
        if(e.type=='company-code')
        e.title=KHSettingStore.companyCode
      })
     setTimeout(() => {
      KHSettingStore.setREFSettings(KHSettingStore.referenceCodeArray)
      this.closeFormModal()
     }, 200); 
  }


  // setReferenceCodeItems(){
    

  //   KHSettingStore?.khSettingsItems?.customized_reference_code.forEach(e=>{
  //     if(e.reference_type=='prefix')
  //     this.preFix=e.title
  //     if(e.reference_type=='code-divider')
  //     this.codeDivider=e.title
  //     if(e.reference_type=='company-code')
  //     this.companyCode=e.title
  //     let pos = KHSettingStore.referenceCodeArray.findIndex(element=>element.type==e.reference_type)
  //     if(pos !=-1)
  //     {
  //       KHSettingStore.referenceCodeArray[pos]['is_enable']=1
  //       KHSettingStore.referenceCodeArray[pos]['order']=e.order
  //     }
  //     })
    
  //     setTimeout(() => {
  //     }, 350);
  //     KHSettingStore.referenceCodeArray.sort((firstItem, secondItem) => firstItem.order - secondItem.order)
  // }

  cancel() {
    this.closeFormModal()
  }

  closeFormModal() {
    this._eventEmitterService.dismissRefCodeModal();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(KHSettingStore.referenceCodeArray, event.previousIndex, event.currentIndex);


    KHSettingStore.referenceCodeArray.forEach((items, idx) => {
      items['order'] = idx + 1;
    });
  }


  getArrayFormatedString(type, items) {

    let joinedString = this._helperService.getArraySeperatedString(KHSettingStore.codeDivider, type, items.filter(e => e.type != 'code-divider' && e.is_enable));

    const wordsToProcess = joinedString.split(KHSettingStore.codeDivider);
    for (let i = 0; i < wordsToProcess.length; i++) {
      wordsToProcess[i] = wordsToProcess[i][0].toUpperCase() + wordsToProcess[i].substr(1);
    }

    let formattedWords = wordsToProcess.join(KHSettingStore.codeDivider);
    return formattedWords;


  }

  enableReferenceCodeItems(event,type,index) {
    if (event.target.checked == true) {
      KHSettingStore.referenceCodeArray[index]['is_enable'] = 1;
      if(type=='company-code')
      KHSettingStore.referenceCodeArray[index]['title']=KHSettingStore.companyCode
      if(type=='prefix')
      KHSettingStore.referenceCodeArray[index]['title']=KHSettingStore.preFix
      if(type=='codeDivider')
      KHSettingStore.referenceCodeArray[index]['title']=KHSettingStore.codeDivider
    }
    else{
      KHSettingStore.referenceCodeArray[index]['is_enable'] = 0;
    }

    console.log(KHSettingStore.referenceCodeArray)
  }


}
