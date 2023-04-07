import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProgressUpdateComponent } from './add-progress-update.component';

describe('AddProgressUpdateComponent', () => {
  let component: AddProgressUpdateComponent;
  let fixture: ComponentFixture<AddProgressUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProgressUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProgressUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
