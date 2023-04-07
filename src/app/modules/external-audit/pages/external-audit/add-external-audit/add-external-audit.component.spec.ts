import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExternalAuditComponent } from './add-external-audit.component';

describe('AddExternalAuditComponent', () => {
  let component: AddExternalAuditComponent;
  let fixture: ComponentFixture<AddExternalAuditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddExternalAuditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddExternalAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
