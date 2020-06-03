module.exports = () => {
  const env = process.env.NODE_ENV || 'devlopment'
  return require(`./${env}.js`)
}
