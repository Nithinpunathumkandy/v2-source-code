import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditProgramListLoaderComponent } from './ms-audit-program-list-loader.component';

describe('MsAuditProgramListLoaderComponent', () => {
  let component: MsAuditProgramListLoaderComponent;
  let fixture: ComponentFixture<MsAuditProgramListLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditProgramListLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditProgramListLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
