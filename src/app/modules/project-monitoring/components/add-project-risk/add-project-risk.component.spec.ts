import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProjectRiskComponent } from './add-project-risk.component';

describe('AddProjectRiskComponent', () => {
  let component: AddProjectRiskComponent;
  let fixture: ComponentFixture<AddProjectRiskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProjectRiskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProjectRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
