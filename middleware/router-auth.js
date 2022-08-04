export default function({ store, redirect, route }) {
  store.state.user && route.name == 'login' ? redirect('/movimientos') : ''
  !store.state.user && isAccountRoute(route) ? redirect('/') : ''
}

function isAccountRoute(route) {
  if (route.matched.some(record => record.path == '/productos')) {
    return true
  } else if (route.matched.some(record => record.path == '/categorias')) {
    return true
  } else if (route.matched.some(record => record.path == '/marcas')) {
    return true
  } else if (route.matched.some(record => record.path == '/contactos')) {
    return true
  } else if (route.matched.some(record => record.path == '/movimientos')) {
    return true
  } else if (route.matched.some(record => record.path == '/usuarios')) {
    return true
  } if (route.matched.some(record => record.name == 'movimiento-id')) {
    return true
  }
}