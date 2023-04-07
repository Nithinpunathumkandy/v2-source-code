import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskStatusComponent } from './risk-status.component';

describe('RiskStatusComponent', () => {
  let component: RiskStatusComponent;
  let fixture: ComponentFixture<RiskStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
