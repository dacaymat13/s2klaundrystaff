import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpPageComponent } from './exp-page.component';

describe('ExpPageComponent', () => {
  let component: ExpPageComponent;
  let fixture: ComponentFixture<ExpPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
