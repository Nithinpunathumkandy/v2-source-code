import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsoCountListComponent } from './jso-count-list.component';

describe('JsoCountListComponent', () => {
  let component: JsoCountListComponent;
  let fixture: ComponentFixture<JsoCountListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JsoCountListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JsoCountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
