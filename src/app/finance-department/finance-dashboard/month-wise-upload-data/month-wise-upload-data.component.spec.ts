import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MonthWiseUploadDataComponent } from './month-wise-upload-data.component';

describe('MonthWiseUploadDataComponent', () => {
  let component: MonthWiseUploadDataComponent;
  let fixture: ComponentFixture<MonthWiseUploadDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthWiseUploadDataComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MonthWiseUploadDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
