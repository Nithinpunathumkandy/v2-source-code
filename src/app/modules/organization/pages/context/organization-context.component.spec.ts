import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationContextComponent } from './organization-context.component';

describe('OrganizationContextComponent', () => {
  let component: OrganizationContextComponent;
  let fixture: ComponentFixture<OrganizationContextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationContextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationContextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
