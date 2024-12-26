import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepHolderComponent } from './rep-holder.component';

describe('RepHolderComponent', () => {
  let component: RepHolderComponent;
  let fixture: ComponentFixture<RepHolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepHolderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
