import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditProgramInfoLoaderComponent } from './audit-program-info-loader.component';

describe('AuditProgramInfoLoaderComponent', () => {
  let component: AuditProgramInfoLoaderComponent;
  let fixture: ComponentFixture<AuditProgramInfoLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditProgramInfoLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditProgramInfoLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
