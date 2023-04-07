import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditAddComponent } from './ms-audit-add.component';

describe('MsAuditAddComponent', () => {
  let component: MsAuditAddComponent;
  let fixture: ComponentFixture<MsAuditAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
