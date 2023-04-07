import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiMesureHistorySingleComponent } from './kpi-mesure-history-single.component';

describe('KpiMesureHistorySingleComponent', () => {
  let component: KpiMesureHistorySingleComponent;
  let fixture: ComponentFixture<KpiMesureHistorySingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiMesureHistorySingleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiMesureHistorySingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
