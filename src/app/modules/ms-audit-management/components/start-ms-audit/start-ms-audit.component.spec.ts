import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartMsAuditComponent } from './start-ms-audit.component';

describe('StartMsAuditComponent', () => {
  let component: StartMsAuditComponent;
  let fixture: ComponentFixture<StartMsAuditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartMsAuditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StartMsAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
