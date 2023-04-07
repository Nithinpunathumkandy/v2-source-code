import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditInfoRequestLoaderComponent } from './am-audit-info-request-loader.component';

describe('AmAuditInfoRequestLoaderComponent', () => {
  let component: AmAuditInfoRequestLoaderComponent;
  let fixture: ComponentFixture<AmAuditInfoRequestLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditInfoRequestLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditInfoRequestLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
