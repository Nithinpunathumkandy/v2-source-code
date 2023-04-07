import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectPaymentAddComponent } from './project-payment-add.component';

describe('ProjectPaymentAddComponent', () => {
  let component: ProjectPaymentAddComponent;
  let fixture: ComponentFixture<ProjectPaymentAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectPaymentAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectPaymentAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
