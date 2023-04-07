import { Component, ChangeDetectionStrategy, Input } from "@angular/core";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'assessment-user-box-component',
    templateUrl: './assessment-user-box.component.html',
    styleUrls: ['./assessment-user-box.component.scss'],
})
export class AssessmentUserBoxComponent {
    @Input('title') title: string;
    @Input('subTitle') subTitle: string;
    @Input('imageUrl') imageUrl: string;
    @Input('percentage') percentage: string;
    @Input('date') date: string;
}