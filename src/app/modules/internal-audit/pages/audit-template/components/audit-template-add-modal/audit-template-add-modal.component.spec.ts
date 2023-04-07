import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditTemplateAddModalComponent } from './audit-template-add-modal.component';

describe('AuditTemplateAddModalComponent', () => {
  let component: AuditTemplateAddModalComponent;
  let fixture: ComponentFixture<AuditTemplateAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditTemplateAddModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditTemplateAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
