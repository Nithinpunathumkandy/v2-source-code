import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsRiskSettingsComponent } from './isms-risk-settings.component';

describe('IsmsRiskSettingsComponent', () => {
  let component: IsmsRiskSettingsComponent;
  let fixture: ComponentFixture<IsmsRiskSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsRiskSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsRiskSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
