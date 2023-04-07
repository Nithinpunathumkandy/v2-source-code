import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhWorkflowDetailsComponent } from './kh-workflow-details.component';

describe('KhWorkflowDetailsComponent', () => {
  let component: KhWorkflowDetailsComponent;
  let fixture: ComponentFixture<KhWorkflowDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KhWorkflowDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KhWorkflowDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
