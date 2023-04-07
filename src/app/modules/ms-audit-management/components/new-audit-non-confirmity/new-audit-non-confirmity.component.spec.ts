import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAuditNonConfirmityComponent } from './new-audit-non-confirmity.component';

describe('NewAuditNonConfirmityComponent', () => {
  let component: NewAuditNonConfirmityComponent;
  let fixture: ComponentFixture<NewAuditNonConfirmityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewAuditNonConfirmityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAuditNonConfirmityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
