import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlEfficiencyMeasuresModalComponent } from './control-efficiency-measures-modal.component';

describe('ControlEfficiencyMeasuresModalComponent', () => {
  let component: ControlEfficiencyMeasuresModalComponent;
  let fixture: ComponentFixture<ControlEfficiencyMeasuresModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlEfficiencyMeasuresModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlEfficiencyMeasuresModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
