import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectContractTypeModalComponent } from './project-contract-type-modal.component';

describe('ProjectContractTypeModalComponent', () => {
  let component: ProjectContractTypeModalComponent;
  let fixture: ComponentFixture<ProjectContractTypeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectContractTypeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectContractTypeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
