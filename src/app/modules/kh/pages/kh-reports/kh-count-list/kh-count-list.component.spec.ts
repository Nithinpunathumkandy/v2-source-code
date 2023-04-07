import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhCountListComponent } from './kh-count-list.component';

describe('KhCountListComponent', () => {
  let component: KhCountListComponent;
  let fixture: ComponentFixture<KhCountListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KhCountListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KhCountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
