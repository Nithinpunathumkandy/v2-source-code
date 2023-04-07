import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiScoreListComponent } from './kpi-score-list.component';

describe('KpiScoreListComponent', () => {
  let component: KpiScoreListComponent;
  let fixture: ComponentFixture<KpiScoreListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiScoreListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiScoreListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
