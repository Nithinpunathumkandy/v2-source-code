import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationChartLoaderComponent } from './organization-chart-loader.component';

describe('OrganizationChartLoaderComponent', () => {
  let component: OrganizationChartLoaderComponent;
  let fixture: ComponentFixture<OrganizationChartLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationChartLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationChartLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
