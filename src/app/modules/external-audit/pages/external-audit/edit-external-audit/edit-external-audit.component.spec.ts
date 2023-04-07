import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditExternalAuditComponent } from './edit-external-audit.component';

describe('EditExternalAuditComponent', () => {
  let component: EditExternalAuditComponent;
  let fixture: ComponentFixture<EditExternalAuditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditExternalAuditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditExternalAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
