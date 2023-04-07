import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MomRecursiveModalComponent } from './mom-recursive-modal.component';

describe('MomRecursiveModalComponent', () => {
  let component: MomRecursiveModalComponent;
  let fixture: ComponentFixture<MomRecursiveModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MomRecursiveModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MomRecursiveModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
