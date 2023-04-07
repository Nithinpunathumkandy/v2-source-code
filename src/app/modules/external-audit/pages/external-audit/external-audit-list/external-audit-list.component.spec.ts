import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalAuditListComponent } from './external-audit-list.component';

describe('ExternalAuditListComponent', () => {
  let component: ExternalAuditListComponent;
  let fixture: ComponentFixture<ExternalAuditListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalAuditListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalAuditListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
