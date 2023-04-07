import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditChecklistLoaderComponent } from './ms-audit-checklist-loader.component';

describe('MsAuditChecklistLoaderComponent', () => {
  let component: MsAuditChecklistLoaderComponent;
  let fixture: ComponentFixture<MsAuditChecklistLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditChecklistLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditChecklistLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
