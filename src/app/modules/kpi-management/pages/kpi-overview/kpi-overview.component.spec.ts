import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiOverviewComponent } from './kpi-overview.component';

describe('KpiOverviewComponent', () => {
  let component: KpiOverviewComponent;
  let fixture: ComponentFixture<KpiOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
