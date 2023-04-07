import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditInfoLoaderComponent } from './ms-audit-info-loader.component';

describe('MsAuditInfoLoaderComponent', () => {
  let component: MsAuditInfoLoaderComponent;
  let fixture: ComponentFixture<MsAuditInfoLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditInfoLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditInfoLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
