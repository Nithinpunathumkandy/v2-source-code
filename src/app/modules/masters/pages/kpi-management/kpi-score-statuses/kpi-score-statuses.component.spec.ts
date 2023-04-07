import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiScoreStatusesComponent } from './kpi-score-statuses.component';

describe('KpiScoreStatusesComponent', () => {
  let component: KpiScoreStatusesComponent;
  let fixture: ComponentFixture<KpiScoreStatusesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiScoreStatusesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiScoreStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
