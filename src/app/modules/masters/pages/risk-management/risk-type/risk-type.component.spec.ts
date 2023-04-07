import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskTypeComponent } from './risk-type.component';

describe('RiskTypeComponent', () => {
  let component: RiskTypeComponent;
  let fixture: ComponentFixture<RiskTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
