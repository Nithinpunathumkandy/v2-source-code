import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcpSearchComponent } from './bcp-search.component';

describe('BcpSearchComponent', () => {
  let component: BcpSearchComponent;
  let fixture: ComponentFixture<BcpSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcpSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcpSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
