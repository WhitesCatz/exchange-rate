const CURRENCIES = [
    { code: "USD", name: "US Dollar" },
    { code: "EUR", name: "Euro" },
    { code: "THB", name: "Thai Baht" },
    { code: "CNY", name: "Chinese Yuan" },
    { code: "JPY", name: "Japanese Yen" },
    { code: "KHR", name: "Cambodian Riel" },
    { code: "INR", name: "Indian Rupee" },

]
function populateSelect(selectEl, items, opts) {
    const selected = opts?.selected ?? null
    const sortBy = opts?.sortBy ?? "code"
    const labelFn = opts?.label ?? ((i) => `${i.code}-${i.name}`)

    const list = sortBy
    ? [...items].sort((a,b) =>
        String(a[sortBy]).localeCompare(String(b[sortBy]))
    )
  : items
  
 const frag = document.createDocumentFragment()
 for (const item of list) {
    const opt = new Option(
        labelFn(item),
        item.code,
        false,
        item.code === selected
    ) 
    frag.appendChild(opt)
 }
 selectEl.innerHTML = ""
 selectEl.appendChild(frag)
}
const currencyEl_one = document.getElementById("currency-one")
const currencyEl_two = document.getElementById("currency-two")
populateSelect(currencyEl_one, CURRENCIES, { selected: "USD"})
populateSelect(currencyEl_two, CURRENCIES, { selected: "EUR"})

function calculate() {
  const currency_one = currencyEl_one.value
  const currency_two = currencyEl_two.value

  fetch(`https://api.exchangerate-api.com/v4/latest/${currency_one}`)
    .then((res) => res.json())
    .then((data) => {
      const rate = data.rates[currency_two]
      document.getElementById(
        "rate"
    ).innerText = `1 ${currency_one} = ${rate} ${currency_two}`
      document.getElementById("amount-two").value =
        (document.getElementById("amount-one").value * rate
    ).toFixed(2);
    })
}
document.getElementById("amount-one").addEventListener("input", calculate)
document.getElementById("amount-two").addEventListener("input", calculate)
currencyEl_one.addEventListener("change", calculate)
currencyEl_two.addEventListener("change", calculate)

document.getElementById("swap").addEventListener("click", () => {
  const t = currencyEl_one.value
  currencyEl_one.value = currencyEl_two.value
  currencyEl_two.value = t
  calculate()
})

calculate()
