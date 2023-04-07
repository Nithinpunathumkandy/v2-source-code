import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContrlDetailsModalComponent } from './contrl-details-modal.component';

describe('ContrlDetailsModalComponent', () => {
  let component: ContrlDetailsModalComponent;
  let fixture: ComponentFixture<ContrlDetailsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContrlDetailsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContrlDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
