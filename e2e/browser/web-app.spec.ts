import { test, expect, Page, Route } from '@playwright/test';

const api = 'https://natos-mean-eight.vercel.app';
const client = { id: 'C1', empresa: 'Empresa de prueba', nombre: 'Ana', apellido_paterno: 'Pérez', apellido_materno: '', puesto: 'Compras', rfc: 'PRUEBA', direccion: 'Dirección de prueba', telefono: '3312345678', correo: 'prueba@example.test', _id: 'existing-record-id' };

test.beforeEach(async ({ context }) => {
  // Every external request is intercepted: browser tests never mutate production.
  await context.route('**/*', route => {
    const url = new URL(route.request().url());
    if (url.hostname === '127.0.0.1') return route.continue();
    if (url.origin === api) return route.fulfill({ status: 200, json: url.pathname === '/user/login' ? { jwtoken: 'test-session' } : url.pathname === '/cliente/consultar' ? [client] : [] });
    return route.fulfill({ status: 200, contentType: 'text/html', body: '<p>Contenido externo de prueba</p>' });
  });
});

async function openCart(page: Page, two = false) {
  await page.goto('catalogo');
  await expect(page.locator('.product-card')).toHaveCount(8);
  await page.getByRole('button', { name: 'Agregar un paquete de Chep + tacón', exact: true }).click();
  if (two) await page.getByRole('button', { name: 'Agregar un paquete de Plástico · 100 piezas', exact: true }).click();
  await page.getByRole('link', { name: /Ver carrito/ }).click();
}

test('public catalog remains usable without fetching staff records; legacy paths and 404 work', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => { if (request.url().startsWith(api)) requests.push(request.url()); });
  await page.goto('Inicio');
  await expect(page).toHaveURL(/\/NATOS\/inicio$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Una base sólida/);
  await page.getByRole('link', { name: /Explorar catálogo/ }).click();
  await expect(page.locator('.product-card')).toHaveCount(8);
  await page.getByRole('searchbox').fill('medidas especiales');
  await expect(page.locator('.product-card')).toHaveCount(1);
  await expect(page.getByRole('main')).toHaveCount(1);
  expect(requests).toEqual([]);
  await page.goto('no-existe');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('No encontramos esta página.');
});

test('cart persists and submits the currently displayed quantity exactly once', async ({ page }) => {
  const submissions: Record<string, unknown>[] = [];
  await page.route(`${api}/carrito/insertar`, async route => { submissions.push(route.request().postDataJSON()); await route.fulfill({ json: { ok: true } }); });
  await openCart(page);
  await page.getByRole('spinbutton', { name: 'Paquetes de Chep + tacón' }).fill('3');
  await page.reload();
  await expect(page.getByRole('spinbutton', { name: 'Paquetes de Chep + tacón' })).toHaveValue('3');
  await page.screenshot({ path: 'test-results/cart-desktop.png', fullPage: true });
  await page.getByLabel('Correo de contacto', { exact: true }).fill('compras@example.test');
  await page.getByRole('button', { name: /Enviar solicitud de pedido/ }).click();
  await expect(page.getByText('Solicitud enviada.', { exact: false }).first()).toBeVisible();
  expect(submissions).toHaveLength(1);
  expect(submissions[0]).toMatchObject({ id: 1, name: 'x20 Chep + x30 Tacon  -40%', quantity: 3, price: 3960, correo: 'compras@example.test', status: 'En proceso' });
  await page.reload();
  await expect(page.getByRole('button', { name: /Enviar solicitud de pedido/ })).toHaveCount(0);
  expect(submissions).toHaveLength(1);
  const storage = await page.evaluate(() => localStorage.getItem('natos.cart.v2'));
  expect(storage).not.toContain('compras@example.test');
});

test('cart blocks invalid quantities and preserves uncertain line outcomes after mixed results', async ({ page }) => {
  const submitted: number[] = [];
  await page.route(`${api}/carrito/insertar`, route => {
    const data = route.request().postDataJSON(); submitted.push(data.id);
    return route.fulfill({ status: data.id === 1 ? 200 : 503, json: data.id === 1 ? { ok: true } : { error: 'Unavailable' } });
  });
  await openCart(page, true);
  await page.getByRole('spinbutton', { name: 'Paquetes de Chep + tacón' }).fill('0');
  await expect(page.getByRole('button', { name: /Enviar solicitud de pedido/ })).toBeDisabled();
  await page.getByRole('spinbutton', { name: 'Paquetes de Chep + tacón' }).fill('2');
  await page.getByLabel('Correo de contacto', { exact: true }).fill('compras@example.test');
  await page.getByRole('button', { name: /Enviar solicitud de pedido/ }).click();
  await expect(page.getByText('No pudimos confirmar la recepción', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText('No pudimos confirmar la recepción', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: /Enviar solicitud de pedido/ })).toHaveCount(0);
  expect(submitted).toEqual([1, 2]);
});

test('guard preserves the destination, staff edit cancel leaves data intact, logout exits staff area', async ({ page }) => {
  await page.goto('Clientes');
  await expect(page).toHaveURL(/acceso\?returnUrl=/);
  await page.getByLabel('Usuario', { exact: true }).fill('personal');
  await page.getByLabel('Contraseña', { exact: true }).fill('test-password');
  await page.getByRole('button', { name: 'Ingresar al espacio de trabajo' }).click();
  await expect(page).toHaveURL(/admin\/clientes$/);
  await page.getByRole('button', { name: 'Editar Empresa de prueba', exact: true }).click();
  await page.getByLabel('Empresa *', { exact: true }).fill('Borrador sin guardar');
  await page.screenshot({ path: 'test-results/staff-edit-desktop.png', fullPage: true });
  await expect(page.getByRole('cell', { name: 'Empresa de prueba', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Cancelar', exact: true }).click();
  await expect(page.getByRole('cell', { name: 'Empresa de prueba', exact: true })).toBeVisible();
  await page.getByRole('button', { name: /Cerrar sesión/ }).click();
  await expect(page).toHaveURL(/acceso$/);
  await page.goto('admin/clientes');
  await expect(page).toHaveURL(/acceso\?returnUrl=/);
});

test('failed staff save keeps draft; named deletion can be cancelled without a request', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('token', 'test-session'));
  let deletes = 0;
  await page.route(`${api}/cliente/modificar`, route => route.fulfill({ status: 422, json: { error: 'Invalid' } }));
  await page.route(`${api}/cliente/eliminar`, route => { deletes++; return route.fulfill({ json: {} }); });
  await page.goto('admin/clientes');
  await page.getByRole('button', { name: 'Editar Empresa de prueba', exact: true }).click();
  await page.getByLabel('Empresa *', { exact: true }).fill('Borrador conservado');
  await page.getByRole('button', { name: 'Guardar cambios' }).click();
  await expect(page.getByRole('alert')).toBeVisible();
  await expect(page.getByLabel('Empresa *', { exact: true })).toHaveValue('Borrador conservado');
  await page.getByRole('button', { name: 'Cancelar', exact: true }).click();
  await page.getByRole('button', { name: 'Eliminar Empresa de prueba', exact: true }).click();
  await expect(page.getByRole('alertdialog')).toContainText('Empresa de prueba');
  await page.getByRole('button', { name: 'Conservar registro' }).click();
  expect(deletes).toBe(0);
});

test('mobile navigation, page layouts and local images work at 360px', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('inicio');
  const menu = page.getByRole('button', { name: 'Menú', exact: true });
  await menu.click();
  await expect(page.getByRole('navigation', { name: 'Navegación principal' })).toBeVisible();
  await page.getByRole('button', { name: 'Cerrar', exact: true }).press('Escape');
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  for (const path of ['inicio', 'catalogo', 'carrito', 'acceso', 'registro', 'contacto', 'nosotros']) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
    expect(overflow, `${path} must fit viewport`).toBe(false);
  }
  await page.goto('inicio');
  await page.screenshot({ path: 'test-results/home-mobile.png', fullPage: true });
});

test('desktop storefront loads static images without legacy UI CDNs or browser errors', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const errors: string[] = []; const requests: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => requests.push(request.url()));
  await page.goto('inicio');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  const hero = page.locator('img[fetchpriority="high"]');
  await expect(hero).toBeVisible();
  await expect.poll(() => hero.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  await page.screenshot({ path: 'test-results/home-desktop.png', fullPage: true });
  expect(requests.filter(url => /\.gif|jquery|bootstrap|materialize|fontawesome/.test(url))).toEqual([]);
  expect(errors).toEqual([]);
  await page.goto('catalogo');
  await expect(page.locator('.product-card')).toHaveCount(8);
  await page.screenshot({ path: 'test-results/catalog-desktop.png', fullPage: true });
});

test('all staff lists settle after asynchronous responses and mobile navigation moves focus', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('token', 'test-session'));
  await page.setViewportSize({ width: 360, height: 800 });
  for (const path of ['pedidos', 'tarimas', 'articulos', 'compras', 'ventas', 'clientes', 'proveedores', 'empleados']) {
    await page.goto(`admin/${path}`);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('table').or(page.getByRole('heading', { name: /Todavía no hay registros|Aquí aparecerán/ }))).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), path).toBe(false);
  }
  const menu = page.getByRole('button', { name: 'Menú', exact: true });
  await menu.click();
  const firstLink = page.getByRole('navigation', { name: 'Administración', exact: true }).getByRole('link', { name: 'Pedidos', exact: true });
  await expect(firstLink).toBeFocused();
  await firstLink.press('Escape');
  await expect(menu).toBeFocused();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
});

test('logging out also exits the staff area in another open tab', async ({ page, context }) => {
  await page.goto('acceso');
  await page.getByLabel('Usuario', { exact: true }).fill('personal');
  await page.getByLabel('Contraseña', { exact: true }).fill('test-password');
  await page.getByRole('button', { name: 'Ingresar al espacio de trabajo' }).click();
  await expect(page).toHaveURL(/admin\/pedidos$/);
  const other = await context.newPage();
  await other.goto('admin/clientes');
  await expect(other.getByRole('heading', { name: 'Clientes', exact: true })).toBeVisible();
  await page.getByRole('button', { name: /Cerrar sesión/ }).click();
  await expect(other).toHaveURL(/acceso\?returnUrl=/);
  await other.close();
});

test('tablet layouts, keyboard entry and desktop 200 percent reflow remain usable', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  for (const path of ['inicio', 'catalogo', 'contacto', 'acceso', 'registro']) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), path).toBe(false);
  }
  await page.goto('inicio');
  // A 720 CSS-pixel viewport checks the reflow space of a 1440px desktop at 200% zoom.
  await page.setViewportSize({ width: 720, height: 500 });
  await page.reload();
  const skip = page.getByRole('link', { name: 'Saltar al contenido' });
  // Route changes focus main; verify the skip link is reachable with the keyboard.
  for (let index = 0; index < 15 && !await skip.evaluate(el => el === document.activeElement); index++) {
    await page.keyboard.press('Shift+Tab');
  }
  await expect(skip).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.collection-image img').first()).toHaveCSS('transition-duration', '0s');
});

test('two tabs share cart outcomes and cannot submit concurrently', async ({ page, context }) => {
  const submitted: number[] = [];
  let firstRequest: Route | undefined;
  await context.route(`${api}/carrito/insertar`, async route => {
    const data = route.request().postDataJSON();
    submitted.push(data.id);
    if (data.id === 1) firstRequest = route;
    else await route.fulfill({ json: { ok: true } });
  });
  await openCart(page);
  const other = await context.newPage();
  await other.goto('carrito');
  await expect(other.getByRole('spinbutton', { name: 'Paquetes de Chep + tacón' })).toHaveValue('1');
  await page.getByLabel('Correo de contacto', { exact: true }).fill('compras@example.test');
  await page.getByRole('button', { name: /Enviar solicitud de pedido/ }).click();
  await expect.poll(() => firstRequest !== undefined).toBe(true);
  await expect(other.getByText('No pudimos confirmar la recepción', { exact: true })).toBeVisible();
  await other.goto('catalogo');
  await other.getByRole('button', { name: 'Agregar un paquete de Plástico · 100 piezas', exact: true }).click();
  await other.getByRole('link', { name: /Ver carrito/ }).click();
  await other.getByLabel('Correo de contacto', { exact: true }).fill('compras@example.test');
  await other.getByRole('button', { name: /Enviar solicitud de pedido/ }).click();
  await expect(other.getByRole('button', { name: /Enviar solicitud de pedido/ })).toBeEnabled();
  expect(submitted).toEqual([1]);
  await firstRequest!.fulfill({ json: { ok: true } });
  await expect(page.getByText('Solicitud enviada.', { exact: false }).first()).toBeVisible();
  await expect(other.getByText('Solicitud enviada.', { exact: false }).first()).toBeVisible();
  await expect(page.getByRole('spinbutton', { name: 'Paquetes de Plástico · 100 piezas' })).toHaveValue('1');
  await other.getByRole('button', { name: /Enviar solicitud de pedido/ }).click();
  await expect(other.getByRole('button', { name: /Enviar solicitud de pedido/ })).toHaveCount(0);
  expect(submitted).toEqual([1, 2]);
  await other.close();
});
