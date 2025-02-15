export function formatMoney(amount: number, decimalCount: number = 0, decimal: string = ',', thousands: string = '.') {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? '-' : '';

    let i = parseInt((amount = Math.abs(Number(amount) || 0)).toFixed(decimalCount)).toString();
    let j = i.length > 3 ? i.length % 3 : 0;

    return (
      negativeSign +
      'Rp. ' +
      (j ? i.substr(0, j) + thousands : '') +
      i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) +
      (decimalCount
        ? decimal +
          Math.abs(amount - parseFloat(i))
            .toFixed(decimalCount)
            .slice(2)
        : '')
    );
  } catch (e) {
    console.log(e);
  }
}

export function soldAmount(amount: number): string {
  if (amount > 100) {
    return '100+';
  } else {
    return amount.toString();
  }
}

export function getCarts() {
  const myCarts = localStorage.getItem('DAPUR_NUSANTARA_CART_ALIAS') || '[]';
  return JSON.parse(myCarts);
}

export function saveCarts(cart: object) {
  localStorage.setItem('DAPUR_NUSANTARA_CART_ALIAS', JSON.stringify(cart));
}

export function saveOrders(order: object) {
  localStorage.setItem('DAPUR_NUSANTARA_ORDERS_ALIAS', JSON.stringify(order));
}

export function getOrders() {
  const myOrders = localStorage.getItem('DAPUR_NUSANTARA_ORDER_ALIAS') || '[]';
  return JSON.parse(myOrders);
}
