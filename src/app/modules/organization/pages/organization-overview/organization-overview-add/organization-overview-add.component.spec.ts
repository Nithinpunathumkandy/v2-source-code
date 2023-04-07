import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationOverviewAddComponent } from './organization-overview-add.component';

describe('OrganizationOverviewAddComponent', () => {
  let component: OrganizationOverviewAddComponent;
  let fixture: ComponentFixture<OrganizationOverviewAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationOverviewAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationOverviewAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
