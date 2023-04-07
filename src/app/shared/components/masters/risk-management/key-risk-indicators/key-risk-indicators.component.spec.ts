import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyRiskIndicatorsComponent } from './key-risk-indicators.component';

describe('KeyRiskIndicatorsComponent', () => {
  let component: KeyRiskIndicatorsComponent;
  let fixture: ComponentFixture<KeyRiskIndicatorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeyRiskIndicatorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyRiskIndicatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
