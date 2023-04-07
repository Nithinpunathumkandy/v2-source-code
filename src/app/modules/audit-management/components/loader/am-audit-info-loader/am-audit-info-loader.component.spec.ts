import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditInfoLoaderComponent } from './am-audit-info-loader.component';

describe('AmAuditInfoLoaderComponent', () => {
  let component: AmAuditInfoLoaderComponent;
  let fixture: ComponentFixture<AmAuditInfoLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditInfoLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditInfoLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
