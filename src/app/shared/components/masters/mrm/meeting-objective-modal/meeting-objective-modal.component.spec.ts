import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingObjectiveModalComponent } from './meeting-objective-modal.component';

describe('MeetingObjectiveModalComponent', () => {
  let component: MeetingObjectiveModalComponent;
  let fixture: ComponentFixture<MeetingObjectiveModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingObjectiveModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingObjectiveModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
