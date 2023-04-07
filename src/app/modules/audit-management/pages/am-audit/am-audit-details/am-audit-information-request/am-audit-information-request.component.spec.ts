import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditInformationRequestComponent } from './am-audit-information-request.component';

describe('AmAuditInformationRequestComponent', () => {
  let component: AmAuditInformationRequestComponent;
  let fixture: ComponentFixture<AmAuditInformationRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditInformationRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditInformationRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
