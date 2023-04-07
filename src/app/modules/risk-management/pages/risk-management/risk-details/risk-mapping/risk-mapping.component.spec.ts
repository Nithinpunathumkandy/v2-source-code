import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskMappingComponent } from './risk-mapping.component';

describe('RiskMappingComponent', () => {
  let component: RiskMappingComponent;
  let fixture: ComponentFixture<RiskMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
