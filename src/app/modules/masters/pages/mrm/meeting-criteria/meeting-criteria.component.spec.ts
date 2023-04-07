import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingCriteriaComponent } from './meeting-criteria.component';

describe('MeetingCriteriaComponent', () => {
  let component: MeetingCriteriaComponent;
  let fixture: ComponentFixture<MeetingCriteriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingCriteriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
