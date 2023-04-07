import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditProgramDetialsLoaderComponent } from './ms-audit-program-detials-loader.component';

describe('MsAuditProgramDetialsLoaderComponent', () => {
  let component: MsAuditProgramDetialsLoaderComponent;
  let fixture: ComponentFixture<MsAuditProgramDetialsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditProgramDetialsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditProgramDetialsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
