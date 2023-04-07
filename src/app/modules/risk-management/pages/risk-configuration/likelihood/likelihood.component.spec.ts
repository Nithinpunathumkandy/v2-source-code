import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LikelihoodComponent } from './likelihood.component';

describe('LikelihoodComponent', () => {
  let component: LikelihoodComponent;
  let fixture: ComponentFixture<LikelihoodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LikelihoodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LikelihoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
