import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditNonConformityDetailsComponent } from './audit-non-conformity-details.component';

describe('AuditNonConformityDetailsComponent', () => {
  let component: AuditNonConformityDetailsComponent;
  let fixture: ComponentFixture<AuditNonConformityDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditNonConformityDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditNonConformityDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
