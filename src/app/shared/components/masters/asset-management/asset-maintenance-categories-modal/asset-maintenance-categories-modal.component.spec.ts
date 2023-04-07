import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetMaintenanceCategoriesModalComponent } from './asset-maintenance-categories-modal.component';

describe('AssetMaintenanceCategoriesModalComponent', () => {
  let component: AssetMaintenanceCategoriesModalComponent;
  let fixture: ComponentFixture<AssetMaintenanceCategoriesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetMaintenanceCategoriesModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetMaintenanceCategoriesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
