import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QlikDashboardsComponent } from './qlik-dashboards.component';

describe('QlikDashboardsComponent', () => {
  let component: QlikDashboardsComponent;
  let fixture: ComponentFixture<QlikDashboardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QlikDashboardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QlikDashboardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
