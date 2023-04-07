import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditProgramAuditableItemLoaderComponent } from './audit-program-auditable-item-loader.component';

describe('AuditProgramAuditableItemLoaderComponent', () => {
  let component: AuditProgramAuditableItemLoaderComponent;
  let fixture: ComponentFixture<AuditProgramAuditableItemLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditProgramAuditableItemLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditProgramAuditableItemLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
