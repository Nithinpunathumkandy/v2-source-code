import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsRiskRegisterComponent } from './isms-risk-register.component';

describe('IsmsRiskRegisterComponent', () => {
  let component: IsmsRiskRegisterComponent;
  let fixture: ComponentFixture<IsmsRiskRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsRiskRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsRiskRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
