import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RisksDashboardComponent } from './risks-dashboard.component';

describe('RisksDashboardComponent', () => {
  let component: RisksDashboardComponent;
  let fixture: ComponentFixture<RisksDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RisksDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RisksDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
