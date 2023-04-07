import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditCheckListLoaderComponent } from './ms-audit-check-list-loader.component';

describe('MsAuditCheckListLoaderComponent', () => {
  let component: MsAuditCheckListLoaderComponent;
  let fixture: ComponentFixture<MsAuditCheckListLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditCheckListLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditCheckListLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
