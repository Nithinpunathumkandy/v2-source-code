import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiMainDashbordComponent } from './kpi-main-dashbord.component';

describe('KpiMainDashbordComponent', () => {
  let component: KpiMainDashbordComponent;
  let fixture: ComponentFixture<KpiMainDashbordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiMainDashbordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiMainDashbordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
