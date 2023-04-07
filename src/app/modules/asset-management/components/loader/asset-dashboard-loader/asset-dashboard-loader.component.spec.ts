import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetDashboardLoaderComponent } from './asset-dashboard-loader.component';

describe('AssetDashboardLoaderComponent', () => {
  let component: AssetDashboardLoaderComponent;
  let fixture: ComponentFixture<AssetDashboardLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetDashboardLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetDashboardLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
