import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlEfficiencyMeasuresComponent } from './control-efficiency-measures.component';

describe('ControlEfficiencyMeasuresComponent', () => {
  let component: ControlEfficiencyMeasuresComponent;
  let fixture: ComponentFixture<ControlEfficiencyMeasuresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlEfficiencyMeasuresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlEfficiencyMeasuresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
