import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetManagementMasterComponent } from './asset-management-master.component';

describe('AssetManagementMasterComponent', () => {
  let component: AssetManagementMasterComponent;
  let fixture: ComponentFixture<AssetManagementMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetManagementMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetManagementMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
