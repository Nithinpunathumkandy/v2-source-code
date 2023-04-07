import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationReportsComponent } from './organization-reports.component';

describe('OrganizationReportsComponent', () => {
  let component: OrganizationReportsComponent;
  let fixture: ComponentFixture<OrganizationReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
