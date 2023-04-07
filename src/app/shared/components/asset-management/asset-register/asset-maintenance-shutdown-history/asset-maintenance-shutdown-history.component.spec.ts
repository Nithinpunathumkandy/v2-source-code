import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetMaintenanceShutdownHistoryComponent } from './asset-maintenance-shutdown-history.component';

describe('AssetMaintenanceShutdownHistoryComponent', () => {
  let component: AssetMaintenanceShutdownHistoryComponent;
  let fixture: ComponentFixture<AssetMaintenanceShutdownHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetMaintenanceShutdownHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetMaintenanceShutdownHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
