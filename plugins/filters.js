import Vue from 'vue'

Vue.filter('currency', (value) => {
  if (!value || isNaN(value)) { value = 0 }
  const formatter = Intl.NumberFormat('js-JP', {
    style: 'currency',
    currency: 'JPY',
    minimumFranctionDigits: 2
  })
  return formatter.format(value)
})

Vue.filter('nl2br', (value) => {
  if (!value) { return '' }
  return value.replace(/\n/g, '<br>')
})
