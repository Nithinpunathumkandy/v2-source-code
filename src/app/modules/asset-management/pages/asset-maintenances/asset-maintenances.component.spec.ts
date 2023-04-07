import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetMaintenancesComponent } from './asset-maintenances.component';

describe('AssetMaintenancesComponent', () => {
  let component: AssetMaintenancesComponent;
  let fixture: ComponentFixture<AssetMaintenancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetMaintenancesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetMaintenancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
