import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPlannedAuditComponent } from './edit-planned-audit.component';

describe('EditPlannedAuditComponent', () => {
  let component: EditPlannedAuditComponent;
  let fixture: ComponentFixture<EditPlannedAuditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPlannedAuditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPlannedAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
