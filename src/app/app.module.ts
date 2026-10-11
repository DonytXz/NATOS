import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEsMx from '@angular/common/locales/es-MX';
import { provideHttpClient, withInterceptors, withXhr } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { sessionInterceptor } from './servicios/login.service';
registerLocaleData(localeEsMx);
@NgModule({
  declarations: [AppComponent], imports: [BrowserModule, AppRoutingModule],
  providers: [{ provide: LOCALE_ID, useValue: 'es-MX' }, provideHttpClient(withXhr(), withInterceptors([sessionInterceptor]))],
  bootstrap: [AppComponent]
})
export class AppModule {}
