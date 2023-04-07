import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhWorkflowAddComponent } from './kh-workflow-add.component';

describe('KhWorkflowAddComponent', () => {
  let component: KhWorkflowAddComponent;
  let fixture: ComponentFixture<KhWorkflowAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KhWorkflowAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KhWorkflowAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
