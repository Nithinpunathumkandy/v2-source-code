import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';
import { UtilityService } from "src/app/shared/services/utility.service";
import * as myCkEditor from 'src/assets/build/ckeditor';

@Component({
  selector: 'app-bcp-change-request-subcomponent',
  templateUrl: './bcp-change-request-subcomponent.component.html',
  styleUrls: ['./bcp-change-request-subcomponent.component.scss']
})
export class BcpChangeRequestSubcomponentComponent implements OnInit {
  @Input('source') bcpChangeRequestData: any;
  public Editor;
  constructor(private _cdr: ChangeDetectorRef, private _utilityService: UtilityService) {
    this.Editor = myCkEditor;
  }

  public onReady(editor: any) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  ngOnInit(): void {
  }

  descriptionValueChange(event: ChangeEvent,data): void {
    data.description = event.editor.getData();
    this._utilityService.detectChanges(this._cdr);
  }

}
