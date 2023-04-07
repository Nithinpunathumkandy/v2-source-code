import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskManagementSettingsComponent } from './risk-management-settings.component';

describe('RiskManagementSettingsComponent', () => {
  let component: RiskManagementSettingsComponent;
  let fixture: ComponentFixture<RiskManagementSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskManagementSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskManagementSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
