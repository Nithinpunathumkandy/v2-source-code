import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetMaintenanceScheduleDetailsLoaderComponent } from './asset-maintenance-schedule-details-loader.component';

describe('AssetMaintenanceScheduleDetailsLoaderComponent', () => {
  let component: AssetMaintenanceScheduleDetailsLoaderComponent;
  let fixture: ComponentFixture<AssetMaintenanceScheduleDetailsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetMaintenanceScheduleDetailsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetMaintenanceScheduleDetailsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
