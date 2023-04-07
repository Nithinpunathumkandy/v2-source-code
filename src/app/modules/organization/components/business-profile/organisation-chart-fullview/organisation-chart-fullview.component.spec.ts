import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationChartFullviewComponent } from './organisation-chart-fullview.component';

describe('OrganisationChartFullviewComponent', () => {
  let component: OrganisationChartFullviewComponent;
  let fixture: ComponentFixture<OrganisationChartFullviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganisationChartFullviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationChartFullviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
