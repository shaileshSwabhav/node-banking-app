const paginate = (queryparams) => {
  const offset = queryparams?.offset && queryparams?.limit ? queryparams?.limit * queryparams?.offset : 0
  const limit = queryparams?.limit ? queryparams.limit : 10

  if (queryparams.limit) {
    delete queryparams.limit
  }

  if (queryparams.offset != null) {
    delete queryparams.offset
  }

  return {
    offset: parseInt(offset),
    limit: parseInt(limit),
  }
}

module.exports = { paginate }