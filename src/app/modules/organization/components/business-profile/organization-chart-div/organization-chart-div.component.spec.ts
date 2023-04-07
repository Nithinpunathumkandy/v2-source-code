import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationChartDivComponent } from './organization-chart-div.component';

describe('OrganizationChartDivComponent', () => {
  let component: OrganizationChartDivComponent;
  let fixture: ComponentFixture<OrganizationChartDivComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationChartDivComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationChartDivComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
