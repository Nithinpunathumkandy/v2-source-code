import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MrmWorkflowListComponent } from './mrm-workflow-list.component';

describe('MrmWorkflowListComponent', () => {
  let component: MrmWorkflowListComponent;
  let fixture: ComponentFixture<MrmWorkflowListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MrmWorkflowListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MrmWorkflowListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
