import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcmDashboardLoaderComponent } from './bcm-dashboard-loader.component';

describe('BcmDashboardLoaderComponent', () => {
  let component: BcmDashboardLoaderComponent;
  let fixture: ComponentFixture<BcmDashboardLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcmDashboardLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcmDashboardLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
