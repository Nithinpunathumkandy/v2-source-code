import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetMaintenanceScheduleLoaderComponent } from './asset-maintenance-schedule-loader.component';

describe('AssetMaintenanceScheduleLoaderComponent', () => {
  let component: AssetMaintenanceScheduleLoaderComponent;
  let fixture: ComponentFixture<AssetMaintenanceScheduleLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetMaintenanceScheduleLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetMaintenanceScheduleLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
