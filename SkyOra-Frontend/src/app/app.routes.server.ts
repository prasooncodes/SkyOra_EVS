import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'editflight/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'users',
    renderMode: RenderMode.Server
  },
  {
    path: 'flights',
    renderMode: RenderMode.Server
  },
  {
    path: 'bookings',
    renderMode: RenderMode.Server
  },
  {
    path: 'bookflight/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'cancel-booking/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'offers/:category',
    renderMode: RenderMode.Server
  },
  {
    path: 'passengerdetails/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'edit-booking/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'addflight',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
