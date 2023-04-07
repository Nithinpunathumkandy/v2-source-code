import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuesModalComponent } from './issues-modal.component';

describe('IssuesModalComponent', () => {
  let component: IssuesModalComponent;
  let fixture: ComponentFixture<IssuesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssuesModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
