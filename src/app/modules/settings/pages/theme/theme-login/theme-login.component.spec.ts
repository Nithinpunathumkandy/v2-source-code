import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeLoginComponent } from './theme-login.component';

describe('ThemeLoginComponent', () => {
  let component: ThemeLoginComponent;
  let fixture: ComponentFixture<ThemeLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemeLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
