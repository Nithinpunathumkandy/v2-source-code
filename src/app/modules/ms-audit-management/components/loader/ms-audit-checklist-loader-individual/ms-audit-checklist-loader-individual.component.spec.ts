import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditChecklistLoaderIndividualComponent } from './ms-audit-checklist-loader-individual.component';

describe('MsAuditChecklistLoaderIndividualComponent', () => {
  let component: MsAuditChecklistLoaderIndividualComponent;
  let fixture: ComponentFixture<MsAuditChecklistLoaderIndividualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditChecklistLoaderIndividualComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditChecklistLoaderIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
