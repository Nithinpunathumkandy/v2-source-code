import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetMaintenanceScheduleHistoryPreviewComponent } from './asset-maintenance-schedule-history-preview.component';

describe('AssetMaintenanceScheduleHistoryPreviewComponent', () => {
  let component: AssetMaintenanceScheduleHistoryPreviewComponent;
  let fixture: ComponentFixture<AssetMaintenanceScheduleHistoryPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetMaintenanceScheduleHistoryPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetMaintenanceScheduleHistoryPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
