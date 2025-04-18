import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SearchTractorWithTfCodeComponent } from './search-tractor-with-tf-code.component';

describe('SearchTractorWithTfCodeComponent', () => {
  let component: SearchTractorWithTfCodeComponent;
  let fixture: ComponentFixture<SearchTractorWithTfCodeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchTractorWithTfCodeComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchTractorWithTfCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
