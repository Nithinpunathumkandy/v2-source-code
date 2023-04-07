import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseRelatedProcessComponent } from './choose-related-process.component';

describe('ChooseRelatedProcessComponent', () => {
  let component: ChooseRelatedProcessComponent;
  let fixture: ComponentFixture<ChooseRelatedProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChooseRelatedProcessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseRelatedProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
