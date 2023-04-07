import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhWorkflowDetailsLoaderComponent } from './kh-workflow-details-loader.component';

describe('KhWorkflowDetailsLoaderComponent', () => {
  let component: KhWorkflowDetailsLoaderComponent;
  let fixture: ComponentFixture<KhWorkflowDetailsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KhWorkflowDetailsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KhWorkflowDetailsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
