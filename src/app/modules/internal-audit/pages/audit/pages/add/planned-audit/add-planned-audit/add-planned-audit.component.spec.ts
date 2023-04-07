import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlannedAuditComponent } from './add-planned-audit.component';

describe('AddPlannedAuditComponent', () => {
  let component: AddPlannedAuditComponent;
  let fixture: ComponentFixture<AddPlannedAuditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPlannedAuditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPlannedAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
