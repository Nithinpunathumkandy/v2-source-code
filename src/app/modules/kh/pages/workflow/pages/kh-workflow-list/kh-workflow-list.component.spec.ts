import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhWorkflowListComponent } from './kh-workflow-list.component';

describe('KhWorkflowListComponent', () => {
  let component: KhWorkflowListComponent;
  let fixture: ComponentFixture<KhWorkflowListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KhWorkflowListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KhWorkflowListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
