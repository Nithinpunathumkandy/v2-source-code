import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityLogLoaderComponent } from './activity-log-loader.component';

describe('ActivityLogLoaderComponent', () => {
  let component: ActivityLogLoaderComponent;
  let fixture: ComponentFixture<ActivityLogLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivityLogLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityLogLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
