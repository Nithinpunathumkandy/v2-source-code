import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldWorkTestPlanDetailsComponent } from './field-work-test-plan-details.component';

describe('FieldWorkTestPlanDetailsComponent', () => {
  let component: FieldWorkTestPlanDetailsComponent;
  let fixture: ComponentFixture<FieldWorkTestPlanDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldWorkTestPlanDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldWorkTestPlanDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
