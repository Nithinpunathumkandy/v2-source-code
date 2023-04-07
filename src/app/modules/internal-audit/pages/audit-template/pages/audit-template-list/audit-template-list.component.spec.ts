import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditTemplateListComponent } from './audit-template-list.component';

describe('AuditTemplateListComponent', () => {
  let component: AuditTemplateListComponent;
  let fixture: ComponentFixture<AuditTemplateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditTemplateListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditTemplateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
