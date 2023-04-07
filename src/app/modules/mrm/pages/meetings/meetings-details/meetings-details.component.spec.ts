import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingsDetailsComponent } from './meetings-details.component';

describe('MeetingsDetailsComponent', () => {
  let component: MeetingsDetailsComponent;
  let fixture: ComponentFixture<MeetingsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingsDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
