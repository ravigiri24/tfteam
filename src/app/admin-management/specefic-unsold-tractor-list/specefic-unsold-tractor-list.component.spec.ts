import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SpeceficUnsoldTractorListComponent } from './specefic-unsold-tractor-list.component';

describe('SpeceficUnsoldTractorListComponent', () => {
  let component: SpeceficUnsoldTractorListComponent;
  let fixture: ComponentFixture<SpeceficUnsoldTractorListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeceficUnsoldTractorListComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SpeceficUnsoldTractorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
