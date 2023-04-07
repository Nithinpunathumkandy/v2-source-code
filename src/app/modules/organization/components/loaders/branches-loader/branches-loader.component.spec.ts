import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchesLoaderComponent } from './branches-loader.component';

describe('BranchesLoaderComponent', () => {
  let component: BranchesLoaderComponent;
  let fixture: ComponentFixture<BranchesLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchesLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchesLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
