import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiScoreComponent } from './kpi-score.component';

describe('KpiScoreComponent', () => {
  let component: KpiScoreComponent;
  let fixture: ComponentFixture<KpiScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiScoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
