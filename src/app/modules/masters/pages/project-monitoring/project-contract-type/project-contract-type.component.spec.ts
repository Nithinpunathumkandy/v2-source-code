import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectContractTypeComponent } from './project-contract-type.component';

describe('ProjectContractTypeComponent', () => {
  let component: ProjectContractTypeComponent;
  let fixture: ComponentFixture<ProjectContractTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectContractTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectContractTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
