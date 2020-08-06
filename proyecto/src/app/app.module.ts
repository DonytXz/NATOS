import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import {FormsModule} from '@angular/forms';


//declaración de servicios
import { EmpleadosService } from './servicios/empleados.service';
import { ClientesService } from './servicios/clientes.service';
import { ProveedoresService } from './servicios/proveedores.service';
import { ArticulosService } from './servicios/articulos.service';
import { TarimasService } from './servicios/tarimas.service';
import { LoginService } from './servicios/login.service';
import { VentasService } from './servicios/ventas.service';
import { ComprasService } from './servicios/compras.service';
import { RegistrarService } from './servicios/registrar.service';

import { LogingGuard } from './loging.guard';

//declaración de componentes
import { AppComponent } from './app.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { InicioComponent } from './inicio/inicio.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { CatalogoComponent } from './catalogo/catalogo.component';
import { SugerenciasComponent } from './sugerencias/sugerencias.component';
import { ContactoComponent } from './contacto/contacto.component';
import { IniciarComponent } from './iniciar/iniciar.component';
import { RegistrarComponent } from './registrar/registrar.component';
import { CopyComponent } from './copy/copy.component';
import { EmpleadosComponent } from './empleados/empleados.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { ArticulosComponent } from './articulos/articulos.component';
import { TarimasComponent } from './tarimas/tarimas.component';
import { ComprasComponent } from './compras/compras.component';
import { VentasComponent } from './ventas/ventas.component';


@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    InicioComponent,
    NosotrosComponent,
    CatalogoComponent,
    SugerenciasComponent,
    ContactoComponent,
    IniciarComponent,
    RegistrarComponent,
    CopyComponent,
    EmpleadosComponent,
    ClientesComponent,
    ProveedoresComponent,
    ArticulosComponent,
    TarimasComponent,
    ComprasComponent,
    VentasComponent,
  ],
  imports: [ 
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers:[ //Aquí van los servicios
    EmpleadosService,
    ClientesService,
    ProveedoresService,
    ArticulosService,
    TarimasService,
    LoginService,
    ComprasService,
    VentasService,
    RegistrarService,
    LogingGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
