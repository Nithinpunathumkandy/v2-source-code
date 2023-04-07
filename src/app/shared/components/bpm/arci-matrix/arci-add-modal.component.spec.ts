import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArciAddModalComponent } from './arci-add-modal.component';

describe('ArciAddModalComponent', () => {
  let component: ArciAddModalComponent;
  let fixture: ComponentFixture<ArciAddModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArciAddModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArciAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
