import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditComponent } from './ms-audit.component';

describe('MsAuditComponent', () => {
  let component: MsAuditComponent;
  let fixture: ComponentFixture<MsAuditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
