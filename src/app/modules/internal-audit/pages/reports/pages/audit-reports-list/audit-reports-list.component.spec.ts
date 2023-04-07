import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditReportsListComponent } from './audit-reports-list.component';

describe('AuditReportsListComponent', () => {
  let component: AuditReportsListComponent;
  let fixture: ComponentFixture<AuditReportsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditReportsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditReportsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
