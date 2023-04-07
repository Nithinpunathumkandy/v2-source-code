import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePercentageComponent } from './update-percentage.component';

describe('UpdatePercentageComponent', () => {
  let component: UpdatePercentageComponent;
  let fixture: ComponentFixture<UpdatePercentageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatePercentageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePercentageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
