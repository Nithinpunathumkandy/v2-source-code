import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhWorkflowComponent } from './kh-workflow.component';

describe('KhWorkflowComponent', () => {
  let component: KhWorkflowComponent;
  let fixture: ComponentFixture<KhWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KhWorkflowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KhWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
