import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingsInfoComponent } from './meetings-info.component';

describe('MeetingsInfoComponent', () => {
  let component: MeetingsInfoComponent;
  let fixture: ComponentFixture<MeetingsInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingsInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
