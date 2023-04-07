import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MstypeChecklistModalComponent } from './mstype-checklist-modal.component';

describe('MstypeChecklistModalComponent', () => {
  let component: MstypeChecklistModalComponent;
  let fixture: ComponentFixture<MstypeChecklistModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MstypeChecklistModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MstypeChecklistModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
