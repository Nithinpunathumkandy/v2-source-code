import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityLogDetailsComponent } from './activity-log-details.component';

describe('ActivityLogDetailsComponent', () => {
  let component: ActivityLogDetailsComponent;
  let fixture: ComponentFixture<ActivityLogDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivityLogDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityLogDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
