import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndustryModalComponent } from './industry-modal.component';

describe('IndustryModalComponent', () => {
  let component: IndustryModalComponent;
  let fixture: ComponentFixture<IndustryModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndustryModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndustryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
