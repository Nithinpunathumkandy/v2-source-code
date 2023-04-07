import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCorrectiveactionProgressComponent } from './update-correctiveaction-progress.component';

describe('UpdateCorrectiveactionProgressComponent', () => {
  let component: UpdateCorrectiveactionProgressComponent;
  let fixture: ComponentFixture<UpdateCorrectiveactionProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateCorrectiveactionProgressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCorrectiveactionProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
