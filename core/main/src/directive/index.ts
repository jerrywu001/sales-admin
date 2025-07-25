import permission from './permission';

export function directive(app: any) {
  if (!app || !app.directive) return;

  app.directive('permission', permission);
}
