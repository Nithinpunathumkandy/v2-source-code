import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiScoreDetialsComponent } from './kpi-score-detials.component';

describe('KpiScoreDetialsComponent', () => {
  let component: KpiScoreDetialsComponent;
  let fixture: ComponentFixture<KpiScoreDetialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiScoreDetialsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiScoreDetialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
