import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditProgramAddModalComponent } from './audit-program-add-modal.component';

describe('AuditProgramAddModalComponent', () => {
  let component: AuditProgramAddModalComponent;
  let fixture: ComponentFixture<AuditProgramAddModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditProgramAddModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditProgramAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
