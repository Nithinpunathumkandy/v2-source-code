import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueDetailsLoaderComponent } from './issue-details-loader.component';

describe('IssueDetailsLoaderComponent', () => {
  let component: IssueDetailsLoaderComponent;
  let fixture: ComponentFixture<IssueDetailsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssueDetailsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueDetailsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
