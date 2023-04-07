import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsLikelihoodComponent } from './isms-likelihood.component';

describe('IsmsLikelihoodComponent', () => {
  let component: IsmsLikelihoodComponent;
  let fixture: ComponentFixture<IsmsLikelihoodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsLikelihoodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsLikelihoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
