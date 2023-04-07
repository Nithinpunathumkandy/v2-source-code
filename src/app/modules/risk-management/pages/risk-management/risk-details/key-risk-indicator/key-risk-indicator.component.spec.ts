import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyRiskIndicatorComponent } from './key-risk-indicator.component';

describe('KeyRiskIndicatorComponent', () => {
  let component: KeyRiskIndicatorComponent;
  let fixture: ComponentFixture<KeyRiskIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeyRiskIndicatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyRiskIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
