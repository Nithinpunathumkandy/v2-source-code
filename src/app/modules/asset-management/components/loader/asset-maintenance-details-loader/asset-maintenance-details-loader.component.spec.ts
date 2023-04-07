import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetMaintenanceDetailsLoaderComponent } from './asset-maintenance-details-loader.component';

describe('AssetMaintenanceDetailsLoaderComponent', () => {
  let component: AssetMaintenanceDetailsLoaderComponent;
  let fixture: ComponentFixture<AssetMaintenanceDetailsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetMaintenanceDetailsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetMaintenanceDetailsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
