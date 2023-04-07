import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalAuditSettingsComponent } from './internal-audit-settings.component';

describe('InternalAuditSettingsComponent', () => {
  let component: InternalAuditSettingsComponent;
  let fixture: ComponentFixture<InternalAuditSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternalAuditSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalAuditSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
