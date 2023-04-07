import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhOverviewComponent } from './kh-overview.component';

describe('KhOverviewComponent', () => {
  let component: KhOverviewComponent;
  let fixture: ComponentFixture<KhOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KhOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KhOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
