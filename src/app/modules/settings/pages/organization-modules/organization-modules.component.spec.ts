import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationModulesComponent } from './organization-modules.component';

describe('OrganizationModulesComponent', () => {
  let component: OrganizationModulesComponent;
  let fixture: ComponentFixture<OrganizationModulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationModulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationModulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
