import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationChartViewComponent } from './organization-chart-view.component';

describe('OrganizationChartViewComponent', () => {
  let component: OrganizationChartViewComponent;
  let fixture: ComponentFixture<OrganizationChartViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationChartViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationChartViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
