const translators = require('./translators')

const getScopeString = ({ nameSpace }) => {
  if(nameSpace) {
    return `${nameSpace}.`
  }

  return ''
}

const entriesToQuery = opts => (acc, next, index) => {
  const [
    key,
  ] = next

  const optsForKey = opts[key] || {}

  const scopeString = getScopeString(optsForKey)
  const type = opts[key] && opts[key].type
  const createClause = translators[type] || translators.string

  //Use null to start a new query chain.
  if(acc === null) {
    const {
      clause,
      value,
    } = createClause(next, index)

    const text = `WHERE ${scopeString}${clause}`
    const values = [ value ]

    return {
      text,
      values,
    }
  }

  const {
    clause,
    value,
  } = createClause(next, index)

  const text = `${acc.text} AND ${scopeString}${clause}`
  const values = [
    ...acc.values,
    value
  ]

  return {
    text,
    values,
  }
}

const createQuery = (query = {}, opts = {}) => {
  const entries = Object.entries(query)
  const {
    previusQuery = null,
  } = opts

  return entries.reduce(entriesToQuery(opts), previusQuery)
}

module.exports = createQuery
