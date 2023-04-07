import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRecommentionsComponent } from './add-recommentions.component';

describe('AddRecommentionsComponent', () => {
  let component: AddRecommentionsComponent;
  let fixture: ComponentFixture<AddRecommentionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRecommentionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRecommentionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
