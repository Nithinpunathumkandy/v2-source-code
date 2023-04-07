import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditInfoLoaderComponent } from './audit-info-loader.component';

describe('AuditInfoLoaderComponent', () => {
  let component: AuditInfoLoaderComponent;
  let fixture: ComponentFixture<AuditInfoLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditInfoLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditInfoLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
