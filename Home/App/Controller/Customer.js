import ProductServices from "../Services/product-services.js"
// Khởi tạo service
const service = new ProductServices();

// Gọi API khi trang load
document.addEventListener("DOMContentLoaded", () => {
  service.getListProductApi()
    .then(res => {
      renderProductCards(res.data);
       loadCartFromStorage();
    })
    .catch(err => console.log(err));
});
const renderProductCards = (list) => {
  let html = "";

  list.forEach((product) => {
    html += `
  <div class="w-60 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
    <img src="../../assets/${product.img}" alt="${product.name}" class="rounded-t-lg w-full h-[200px] object-cover" />
    <div class="p-4">
      <h5 class="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">
        ${product.name}
      </h5>
      <p class="mb-2 text-sm font-semibold text-green-600 dark:text-green-400">Giá: ${product.price.toLocaleString()}₫</p>
      <p class="mb-3 text-sm text-gray-700 dark:text-gray-400">${product.desc}</p>
      <button data-id="${product.id}"
              class="btn-add-to-cart inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800">
        Thêm vào giỏ hàng
      </button>
    </div>
  </div>
`;
  });

  // Gắn vào .card-item
 const container = document.getElementById("card-item");
  container.innerHTML = html;

  // Gắn sự kiện click cho nút
  addCartEvent();
};
let cart = [];
const renderCart = () => {
  const cartContainer = document.getElementById("cart");

  if (cart.length === 0) {
    cartContainer.innerHTML = `<p class="text-center text-gray-500">Giỏ hàng trống </p>`;
    return;
  }

  let html = `<table class="w-full text-left border-collapse">
    <thead>
      <tr class="bg-gray-100">
        <th class="p-2">Tên SP</th>
        <th class="p-2">Giá</th>
        <th class="p-2">SL</th>
        <th class="p-2">Tổng</th>
        <th class="p-2">Thao tác</th>
      </tr>
    </thead>
    <tbody>`;

  let total = 0;

  cart.forEach(item => {
    const itemTotal = Number(item.price) * item.quantity;
    total += itemTotal;

    html += `
      <tr>
        <td class="p-2">${item.name}</td>
        <td class="p-2">${item.price}</td>
        <td class="p-2">
          <button class="btn-decrease bg-red-200 px-2 rounded" data-id="${item.id}">-</button>
          <span class="mx-2">${item.quantity}</span>
          <button class="btn-increase bg-green-200 px-2 rounded" data-id="${item.id}">+</button>
        </td>
        <td class="p-2">${itemTotal}</td>
        <td class="p-2">
          <button class="btn-remove bg-red-500 text-white px-3 py-1 rounded" data-id="${item.id}">❌</button>
        </td>
      </tr>`;
  });

  html += `</tbody>
    <tfoot>
      <tr class="font-bold">
        <td colspan="3" class="p-2 text-right">Tổng cộng</td>
        <td class="p-2">${total}</td>
        <td></td>
      </tr>
    </tfoot>
  </table>`;

  cartContainer.innerHTML = html;

  bindCartEvents(); //  xử lý tăng/giảm/xóa
};
const bindCartEvents = () => {
  // Xử lý nút xóa
  document.querySelectorAll(".btn-remove").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      cart = cart.filter(item => item.id !== id);
      renderCart();
    });
  });

  // Xử lý tăng số lượng
  document.querySelectorAll(".btn-increase").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const item = cart.find(p => p.id === id);
      if (item) {
        item.quantity++;
        renderCart();
      }
    });
  });

  // Xử lý giảm số lượng
  document.querySelectorAll(".btn-decrease").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const item = cart.find(p => p.id === id);
      if (item && item.quantity > 1) {
        item.quantity--;
      } else {
        cart = cart.filter(p => p.id !== id);
      }
      renderCart();
    });
  });
};

const addCartEvent = () => {
  const buttons = document.querySelectorAll(".btn-add-to-cart");

  buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      addToCart(id);
    });
  });
};

const addToCart = (id) => {
  service.getProductByIdApi(id)
    .then(res => {
      const product = res.data;

      const found = cart.find(item => item.id === product.id);
      if (found) {
        found.quantity++;
      } else {
        cart.push({ ...product, quantity: 1 });
      }

    //   alert("Đã thêm vào giỏ hàng ");
      saveCartToStorage(); //lưu local storage
      console.log(cart);
      renderCart();
    })
    .catch(err => console.log(err));
};
//tìm kiếm
document.getElementById("search-input").addEventListener("input", (event) => {
  const keyword = event.target.value.trim().toLowerCase();

  const filtered = productList.filter((product) =>
    product.name.toLowerCase().includes(keyword)
  );

  renderProductCards(filtered);
});
let productList = []; 

document.addEventListener("DOMContentLoaded", () => {
  service.getListProductApi()
    .then(res => {
      productList = res.data;
      renderProductCards(productList);
    })
    .catch(err => console.log(err));
});

// Lưu giỏ hàng vào localStorage
const saveCartToStorage = () => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// Load giỏ hàng từ localStorage
const loadCartFromStorage = () => {
  const data = localStorage.getItem("cart");
  if (data) {
    cart = JSON.parse(data);
    renderCart();
  }
};
// Gắn sự kiện cho select
const sortSelect = document.getElementById("sortSelect");
sortSelect.addEventListener("change", () => {
  const selected = sortSelect.value;

  service.getListProductApi()
    .then(res => {
      let list = res.data;

      if (selected === "asc") {
        list.sort((a, b) => Number(a.price) - Number(b.price));
      } else if (selected === "desc") {
        list.sort((a, b) => Number(b.price) - Number(a.price));
      }

      renderProductCards(list);
    })
    .catch(err => console.log(err));
});