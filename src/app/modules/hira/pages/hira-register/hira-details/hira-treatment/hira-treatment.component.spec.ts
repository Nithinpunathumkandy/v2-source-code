import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiraTreatmentComponent } from './hira-treatment.component';

describe('HiraTreatmentComponent', () => {
  let component: HiraTreatmentComponent;
  let fixture: ComponentFixture<HiraTreatmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HiraTreatmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HiraTreatmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
