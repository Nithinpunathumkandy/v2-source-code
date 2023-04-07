import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetMaintenanceCategoriesComponent } from './asset-maintenance-categories.component';

describe('AssetMaintenanceCategoriesComponent', () => {
  let component: AssetMaintenanceCategoriesComponent;
  let fixture: ComponentFixture<AssetMaintenanceCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetMaintenanceCategoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetMaintenanceCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
