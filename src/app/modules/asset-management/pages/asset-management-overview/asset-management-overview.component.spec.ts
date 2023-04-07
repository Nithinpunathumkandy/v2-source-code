import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetManagementOverviewComponent } from './asset-management-overview.component';

describe('AssetManagementOverviewComponent', () => {
  let component: AssetManagementOverviewComponent;
  let fixture: ComponentFixture<AssetManagementOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetManagementOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetManagementOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
