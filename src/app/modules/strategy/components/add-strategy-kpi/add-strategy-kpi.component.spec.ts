import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStrategyKpiComponent } from './add-strategy-kpi.component';

describe('AddStrategyKpiComponent', () => {
  let component: AddStrategyKpiComponent;
  let fixture: ComponentFixture<AddStrategyKpiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddStrategyKpiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStrategyKpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
