import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsRiskConfigurationComponent } from './isms-risk-configuration.component';

describe('IsmsRiskConfigurationComponent', () => {
  let component: IsmsRiskConfigurationComponent;
  let fixture: ComponentFixture<IsmsRiskConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsRiskConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsRiskConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
