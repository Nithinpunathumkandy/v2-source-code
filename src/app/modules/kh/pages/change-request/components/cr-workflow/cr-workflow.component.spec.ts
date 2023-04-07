import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrWorkflowComponent } from './cr-workflow.component';

describe('CrWorkflowComponent', () => {
  let component: CrWorkflowComponent;
  let fixture: ComponentFixture<CrWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrWorkflowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
