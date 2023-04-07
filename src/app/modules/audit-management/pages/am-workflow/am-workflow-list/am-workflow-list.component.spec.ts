import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmWorkflowListComponent } from './am-workflow-list.component';

describe('AmWorkflowListComponent', () => {
  let component: AmWorkflowListComponent;
  let fixture: ComponentFixture<AmWorkflowListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmWorkflowListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmWorkflowListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
