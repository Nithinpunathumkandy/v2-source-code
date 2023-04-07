import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceShutdownReviewComponent } from './maintenance-shutdown-review.component';

describe('MaintenanceShutdownReviewComponent', () => {
  let component: MaintenanceShutdownReviewComponent;
  let fixture: ComponentFixture<MaintenanceShutdownReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintenanceShutdownReviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceShutdownReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
