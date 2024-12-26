import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepExpenseComponent } from './rep-expense.component';

describe('RepExpenseComponent', () => {
  let component: RepExpenseComponent;
  let fixture: ComponentFixture<RepExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepExpenseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
