import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CommonOptionsPlatformComponent } from './common-options-platform.component';

describe('CommonOptionsPlatformComponent', () => {
  let component: CommonOptionsPlatformComponent;
  let fixture: ComponentFixture<CommonOptionsPlatformComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonOptionsPlatformComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CommonOptionsPlatformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
