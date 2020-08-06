import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { CatalogoComponent } from './catalogo/catalogo.component';
import { SugerenciasComponent } from './sugerencias/sugerencias.component';
import { ContactoComponent } from './contacto/contacto.component';
import { IniciarComponent } from './iniciar/iniciar.component';
import { RegistrarComponent } from './registrar/registrar.component';
import { CopyComponent } from './copy/copy.component';
import { EmpleadosComponent } from './empleados/empleados.component';
import { TarimasComponent } from './tarimas/tarimas.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { ArticulosComponent } from './articulos/articulos.component';
import { ComprasComponent } from './compras/compras.component';
import { VentasComponent } from './ventas/ventas.component';
import { LogingGuard } from './loging.guard'; 


const routes: Routes = [
  {path: 'Inicio', component:InicioComponent},
  {path: 'Nosotros', component: NosotrosComponent},
  {path: 'Catalogo', component:CatalogoComponent},
  {path: 'Sugerencias', component:SugerenciasComponent},
  {path: 'Contacto', component:ContactoComponent},
  {path: 'Iniciar', component:IniciarComponent},
  {path: 'Registrar', component:RegistrarComponent},
  {path: 'Copy', component:CopyComponent},
  {path: 'Empleados', component:EmpleadosComponent, canActivate:[LogingGuard]},
  {path: 'Tarimas', component:TarimasComponent, canActivate:[LogingGuard]},
  {path: 'Clientes', component: ClientesComponent, canActivate:[LogingGuard]},
  {path: 'Proveedores', component:ProveedoresComponent, canActivate:[LogingGuard]},
  {path: 'Articulos', component: ArticulosComponent, canActivate:[LogingGuard]},
  {path: 'Compras', component: ComprasComponent, canActivate:[LogingGuard]},
  {path: 'Ventas', component: VentasComponent, canActivate:[LogingGuard]} ,
  
  






  //Comodines de redireccionamiento
  {path: '', redirectTo:'Inicio' , pathMatch:'full'},
  {path: '**', redirectTo:'Inicio' , pathMatch: 'full'},
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
