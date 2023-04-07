import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsTreatmentDetailsComponent } from './isms-treatment-details.component';

describe('IsmsTreatmentDetailsComponent', () => {
  let component: IsmsTreatmentDetailsComponent;
  let fixture: ComponentFixture<IsmsTreatmentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsTreatmentDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsTreatmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
