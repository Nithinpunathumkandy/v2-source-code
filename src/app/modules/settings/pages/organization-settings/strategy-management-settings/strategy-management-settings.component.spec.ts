import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyManagementSettingsComponent } from './strategy-management-settings.component';

describe('StrategyManagementSettingsComponent', () => {
  let component: StrategyManagementSettingsComponent;
  let fixture: ComponentFixture<StrategyManagementSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyManagementSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyManagementSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
