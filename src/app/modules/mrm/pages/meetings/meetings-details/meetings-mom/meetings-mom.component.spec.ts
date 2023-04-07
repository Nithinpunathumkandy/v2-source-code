import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingsMomComponent } from './meetings-mom.component';

describe('MeetingsMomComponent', () => {
  let component: MeetingsMomComponent;
  let fixture: ComponentFixture<MeetingsMomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingsMomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingsMomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
