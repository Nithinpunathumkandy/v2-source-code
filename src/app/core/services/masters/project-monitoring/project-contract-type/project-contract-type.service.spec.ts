import { TestBed } from '@angular/core/testing';
import { ProjectContractTypeService } from './project-contract-type.service';

// import { ProjectContractTypeService } from '../project-contract-type.service';

describe('ProjectContractTypeService', () => {
  let service: ProjectContractTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectContractTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
