import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseCheckListComponent } from './choose-check-list.component';

describe('ChooseCheckListComponent', () => {
  let component: ChooseCheckListComponent;
  let fixture: ComponentFixture<ChooseCheckListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChooseCheckListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseCheckListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
