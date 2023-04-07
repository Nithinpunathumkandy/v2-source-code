import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditTemplateDetailsComponent } from './audit-template-details.component';

describe('AuditTemplateDetailsComponent', () => {
  let component: AuditTemplateDetailsComponent;
  let fixture: ComponentFixture<AuditTemplateDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditTemplateDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditTemplateDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
