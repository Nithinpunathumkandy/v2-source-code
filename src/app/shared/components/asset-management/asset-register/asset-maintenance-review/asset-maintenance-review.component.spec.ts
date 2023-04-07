import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetMaintenanceReviewComponent } from './asset-maintenance-review.component';

describe('AssetMaintenanceReviewComponent', () => {
  let component: AssetMaintenanceReviewComponent;
  let fixture: ComponentFixture<AssetMaintenanceReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetMaintenanceReviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetMaintenanceReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
