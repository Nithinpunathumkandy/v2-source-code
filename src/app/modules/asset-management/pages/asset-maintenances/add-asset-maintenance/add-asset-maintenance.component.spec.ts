import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAssetMaintenanceComponent } from './add-asset-maintenance.component';

describe('AddAssetMaintenanceComponent', () => {
  let component: AddAssetMaintenanceComponent;
  let fixture: ComponentFixture<AddAssetMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAssetMaintenanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAssetMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
