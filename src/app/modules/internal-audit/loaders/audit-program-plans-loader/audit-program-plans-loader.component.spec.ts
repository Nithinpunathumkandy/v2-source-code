import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditProgramPlansLoaderComponent } from './audit-program-plans-loader.component';

describe('AuditProgramPlansLoaderComponent', () => {
  let component: AuditProgramPlansLoaderComponent;
  let fixture: ComponentFixture<AuditProgramPlansLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditProgramPlansLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditProgramPlansLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
