import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddComplianceRegisterComponent } from './add-compliance-register.component';

describe('AddComplianceRegisterComponent', () => {
  let component: AddComplianceRegisterComponent;
  let fixture: ComponentFixture<AddComplianceRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddComplianceRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddComplianceRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
