import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationMastersComponent } from './organization-masters.component';

describe('OrganizationMastersComponent', () => {
  let component: OrganizationMastersComponent;
  let fixture: ComponentFixture<OrganizationMastersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationMastersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationMastersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
