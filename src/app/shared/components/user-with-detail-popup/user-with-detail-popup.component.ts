import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from "@angular/core";
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'user-with-detail-popup-component',
    templateUrl: './user-with-detail-popup.component.html',
    styleUrls: ['./user-with-detail-popup.component.scss'],
})
export class UserWithDetailPopupComponent {
    @Input('imageUrl') imageUrl: string;
    @Input('name') name: string;
    @Input('title') title: string;
    @Input('designation') designation: string;
    @Input('phone') phone: string;
    @Input('email') email: string;
    @Input('isOnline') isOnline: boolean = false;
    @Output('viewDetail') viewDetail: EventEmitter<any> = new EventEmitter();
    @Output('sendEmail') sendEmail: EventEmitter<any> = new EventEmitter();
}