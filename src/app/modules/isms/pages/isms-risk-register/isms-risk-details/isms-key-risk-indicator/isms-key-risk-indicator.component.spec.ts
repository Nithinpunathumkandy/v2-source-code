import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsKeyRiskIndicatorComponent } from './isms-key-risk-indicator.component';

describe('IsmsKeyRiskIndicatorComponent', () => {
  let component: IsmsKeyRiskIndicatorComponent;
  let fixture: ComponentFixture<IsmsKeyRiskIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsKeyRiskIndicatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsKeyRiskIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
