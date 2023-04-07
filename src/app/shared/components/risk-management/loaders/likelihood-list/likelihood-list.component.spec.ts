import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LikelihoodListComponent } from './likelihood-list.component';

describe('LikelihoodListComponent', () => {
  let component: LikelihoodListComponent;
  let fixture: ComponentFixture<LikelihoodListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LikelihoodListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LikelihoodListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
