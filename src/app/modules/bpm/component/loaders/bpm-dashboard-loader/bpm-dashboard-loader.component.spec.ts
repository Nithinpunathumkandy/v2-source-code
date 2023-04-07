import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmDashboardLoaderComponent } from './bpm-dashboard-loader.component';

describe('BpmDashboardLoaderComponent', () => {
  let component: BpmDashboardLoaderComponent;
  let fixture: ComponentFixture<BpmDashboardLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BpmDashboardLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmDashboardLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
