import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingPlanDocumentsComponent } from './meeting-plan-documents.component';

describe('MeetingPlanDocumentsComponent', () => {
  let component: MeetingPlanDocumentsComponent;
  let fixture: ComponentFixture<MeetingPlanDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingPlanDocumentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingPlanDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
