import { NgModule, inject } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogingGuard } from './loging.guard';
import { LoginService } from './servicios/login.service';
export const routes: Routes = [
  { path: 'Inicio', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'Nosotros', redirectTo: 'nosotros', pathMatch: 'full' },
  { path: 'Catalogo', redirectTo: 'catalogo', pathMatch: 'full' },
  { path: 'Contacto', redirectTo: 'contacto', pathMatch: 'full' },
  { path: 'Sugerencias', redirectTo: 'sugerencias', pathMatch: 'full' },
  { path: 'Iniciar', redirectTo: 'acceso', pathMatch: 'full' },
  { path: 'Registrar', redirectTo: 'registro', pathMatch: 'full' },
  { path: 'Copy', redirectTo: 'creditos', pathMatch: 'full' },
  { path: 'Empleados', redirectTo: 'admin/empleados', pathMatch: 'full' },
  { path: 'Clientes', redirectTo: 'admin/clientes', pathMatch: 'full' },
  { path: 'Proveedores', redirectTo: 'admin/proveedores', pathMatch: 'full' },
  { path: 'Tarimas', redirectTo: 'admin/tarimas', pathMatch: 'full' },
  { path: 'Articulos', redirectTo: 'admin/articulos', pathMatch: 'full' },
  { path: 'Compras', redirectTo: 'admin/compras', pathMatch: 'full' },
  { path: 'Ventas', redirectTo: 'admin/ventas', pathMatch: 'full' },
  { path: 'temp', redirectTo: 'admin/temperatura', pathMatch: 'full' },
  { path: 'shop', pathMatch: 'full', redirectTo: () => inject(LoginService).eslogueado() ? '/admin/pedidos' : '/catalogo' },
  { path: 'admin', canActivate: [LogingGuard], loadComponent: () => import('./layouts/staff-shell.component').then(m => m.StaffShellComponent), children: [
    { path: '', pathMatch: 'full', redirectTo: 'pedidos' },
    { path: 'pedidos', title: 'Pedidos | NATOS', canActivate: [LogingGuard], loadComponent: () => import('./features/orders/orders.component').then(m => m.OrdersComponent) },
    { path: 'clientes', title: 'Clientes | NATOS', canActivate: [LogingGuard], loadComponent: () => import('./clientes/clientes.component').then(m => m.ClientesComponent) },
    { path: 'proveedores', title: 'Proveedores | NATOS', canActivate: [LogingGuard], loadComponent: () => import('./proveedores/proveedores.component').then(m => m.ProveedoresComponent) },
    { path: 'empleados', title: 'Empleados | NATOS', canActivate: [LogingGuard], loadComponent: () => import('./empleados/empleados.component').then(m => m.EmpleadosComponent) },
    { path: 'tarimas', title: 'Tarimas | NATOS', canActivate: [LogingGuard], loadComponent: () => import('./tarimas/tarimas.component').then(m => m.TarimasComponent) },
    { path: 'articulos', title: 'Artículos | NATOS', canActivate: [LogingGuard], loadComponent: () => import('./articulos/articulos.component').then(m => m.ArticulosComponent) },
    { path: 'compras', title: 'Compras | NATOS', canActivate: [LogingGuard], loadComponent: () => import('./compras/compras.component').then(m => m.ComprasComponent) },
    { path: 'ventas', title: 'Ventas | NATOS', canActivate: [LogingGuard], loadComponent: () => import('./ventas/ventas.component').then(m => m.VentasComponent) },
    { path: 'sugerencias', title: 'Sugerencias | NATOS', canActivate: [LogingGuard], loadComponent: () => import('./sugerencias/sugerencias.component').then(m => m.SugerenciasComponent) },
    { path: 'temperatura', title: 'Temperatura | NATOS', canActivate: [LogingGuard], loadComponent: () => import('./temp/temp.component').then(m => m.TempComponent) },
  ] },
  { path: '', loadComponent: () => import('./layouts/public-shell.component').then(m => m.PublicShellComponent), children: [
    { path: '', pathMatch: 'full', redirectTo: 'inicio' },
    { path: 'inicio', title: 'Tarimas para tu operación | NATOS', loadComponent: () => import('./inicio/inicio.component').then(m => m.InicioComponent) },
    { path: 'catalogo', title: 'Catálogo | NATOS', loadComponent: () => import('./catalogo/catalogo.component').then(m => m.CatalogoComponent) },
    { path: 'carrito', title: 'Carrito | NATOS', loadComponent: () => import('./cart/cart.component').then(m => m.CartComponent) },
    { path: 'nosotros', title: 'Nosotros | NATOS', loadComponent: () => import('./nosotros/nosotros.component').then(m => m.NosotrosComponent) },
    { path: 'contacto', title: 'Contacto | NATOS', loadComponent: () => import('./contacto/contacto.component').then(m => m.ContactoComponent) },
    { path: 'sugerencias', title: 'Sugerencias | NATOS', loadComponent: () => import('./sugerencias/sugerencias.component').then(m => m.SugerenciasComponent) },
    { path: 'acceso', title: 'Acceso del personal | NATOS', loadComponent: () => import('./iniciar/iniciar.component').then(m => m.IniciarComponent) },
    { path: 'registro', title: 'Registro del personal | NATOS', loadComponent: () => import('./registrar/registrar.component').then(m => m.RegistrarComponent) },
    { path: 'creditos', title: 'Créditos | NATOS', loadComponent: () => import('./copy/copy.component').then(m => m.CopyComponent) },
    { path: '**', title: 'Página no encontrada | NATOS', loadComponent: () => import('./shared/not-found.component').then(m => m.NotFoundComponent) }
  ] }
];
@NgModule({ imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })], exports: [RouterModule] })
export class AppRoutingModule {}
