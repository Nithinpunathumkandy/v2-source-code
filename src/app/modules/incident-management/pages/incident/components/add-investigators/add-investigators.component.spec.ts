import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInvestigatorsComponent } from './add-investigators.component';

describe('AddInvestigatorsComponent', () => {
  let component: AddInvestigatorsComponent;
  let fixture: ComponentFixture<AddInvestigatorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddInvestigatorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInvestigatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
