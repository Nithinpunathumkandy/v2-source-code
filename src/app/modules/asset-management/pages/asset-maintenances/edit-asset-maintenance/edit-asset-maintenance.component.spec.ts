import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAssetMaintenanceComponent } from './edit-asset-maintenance.component';

describe('EditAssetMaintenanceComponent', () => {
  let component: EditAssetMaintenanceComponent;
  let fixture: ComponentFixture<EditAssetMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAssetMaintenanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAssetMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
