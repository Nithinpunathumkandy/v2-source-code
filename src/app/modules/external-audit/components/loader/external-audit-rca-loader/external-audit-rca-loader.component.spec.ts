import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalAuditLoaderComponent } from './external-audit-loader.component';

describe('ExternalAuditLoaderComponent', () => {
  let component: ExternalAuditLoaderComponent;
  let fixture: ComponentFixture<ExternalAuditLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalAuditLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalAuditLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
