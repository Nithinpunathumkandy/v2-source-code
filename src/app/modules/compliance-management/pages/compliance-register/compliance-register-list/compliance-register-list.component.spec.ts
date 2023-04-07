import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceRegisterListComponent } from './compliance-register-list.component';

describe('ComplianceRegisterListComponent', () => {
  let component: ComplianceRegisterListComponent;
  let fixture: ComponentFixture<ComplianceRegisterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplianceRegisterListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceRegisterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
