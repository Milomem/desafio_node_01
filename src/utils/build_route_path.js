export function buildRoutePath(path) {
    const routeParameterRegex = /:([a-zA-Z]+)/g
    const paramsWithParameters = path.replaceAll(routeParameterRegex,'(?<$1>[a-z0-9\-+]+)')

    const pathRegex = new RegExp(`${paramsWithParameters}(?<query>\\?(.*))?$`)

    return pathRegex
}