import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingCriteriaModalComponent } from './meeting-criteria-modal.component';

describe('MeetingCriteriaModalComponent', () => {
  let component: MeetingCriteriaModalComponent;
  let fixture: ComponentFixture<MeetingCriteriaModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingCriteriaModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingCriteriaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
