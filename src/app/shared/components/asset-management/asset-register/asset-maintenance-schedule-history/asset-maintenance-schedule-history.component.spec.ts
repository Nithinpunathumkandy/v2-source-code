import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetMaintenanceScheduleHistoryComponent } from './asset-maintenance-schedule-history.component';

describe('AssetMaintenanceScheduleHistoryComponent', () => {
  let component: AssetMaintenanceScheduleHistoryComponent;
  let fixture: ComponentFixture<AssetMaintenanceScheduleHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetMaintenanceScheduleHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetMaintenanceScheduleHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
