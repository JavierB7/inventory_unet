export default function({ store, redirect, route }) {
  !isAccountRoute(route) && route.matched.some(record => record.path == '/') ? redirect('/') : ''
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
  }
}
