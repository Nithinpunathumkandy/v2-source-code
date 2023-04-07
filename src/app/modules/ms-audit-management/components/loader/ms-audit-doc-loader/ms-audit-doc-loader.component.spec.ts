import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditDocLoaderComponent } from './ms-audit-doc-loader.component';

describe('MsAuditDocLoaderComponent', () => {
  let component: MsAuditDocLoaderComponent;
  let fixture: ComponentFixture<MsAuditDocLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditDocLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditDocLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
