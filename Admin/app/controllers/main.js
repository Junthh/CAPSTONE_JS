import ProductServices from "../services/product-services.js";
import Product from "../models/product.js";
import Validation from "../models/validation.js";

const validation = new Validation();

const services = new ProductServices();

export const getEle = (id) => document.getElementById(id);

const getListProduct = () => {
  getEle("loader").style.display = "block";

  const promise = services.getListProductApi();
  promise
    .then((result) => {
      getEle("loader").style.display = "none";
      renderListProduct(result.data);
    })
    .catch((error) => {
      console.log(error)
    })
}

getListProduct();

const renderListProduct = (data) => {
  let contentHTML = "";
  for (let i = 0; i < data.length; i++) {
    const product = data[i];
    contentHTML += `
    <tr>
      <td>${i + 1}</td>
      <td>${product.name}</td>
      <td>${product.price}</td>
      <td>
        <img src="./../../assets/img/${product.img}" width="50px"/>
      </td>
      <td>${product.screen}</td>
      <td>${product.backCamera}</td>
      <td>${product.frontCamera}</td>
      
      <td>${product.desc}</td>
      <td>${product.type}</td>
      <td>
        <button class="btn btn-info" data-toggle="modal" data-target="#myModal" onclick="onEditProduct(${product.id})">Edit</button>
        <button class="btn btn-danger" onclick="onDeleteProduct(${product.id})">Delete</button>
      </td>
    </tr>
    `
  }

  getEle("tblDanhSachSP").innerHTML = contentHTML;
}

const getValue = () => {
  const name = getEle("TenSP").value;
  const price = getEle("GiaSP").value;
  const img = getEle("HinhSP").value;
  const screen = getEle("ManHinh").value
  const backCamera = getEle("CameraSau").value;
  const frontCamera = getEle("CameraTruoc").value;
  const desc = getEle("MoTa").value;
  const type = getEle("LoaiSP").value;

  const product = new Product("", name, price, img, screen, backCamera, frontCamera, desc, type);

  return product;
}

getEle("btnThemSP").onclick = function () {
  document.getElementsByClassName("modal-title")[0].innerHTML = "Add Product";

  const btnAdd = `<button class="btn btn-success" onclick="onAddProduct()">Add</button>`;
  document.getElementsByClassName("modal-footer")[0].innerHTML = btnAdd;
}

const onAddProduct = () => {
  if (!validateForm()) return;
  const product = getValue();

  const promise = services.addProductApi(product);
  promise
    .then((result) => {
      alert(`Add product success`);
      document.getElementsByClassName("close")[0].click();
      getListProduct();
    })
    .catch((error) => {
      console.log(error)
    });
}

window.onAddProduct = onAddProduct;

const onDeleteProduct = (id) => {
  const promise = services.deleteProductApi(id);
  promise
    .then(() => {
      alert(`Deleted product success`);
      getListProduct();
    })
    .catch((error) => {
      console.log(error)
    })
}

window.onDeleteProduct = onDeleteProduct;

const onEditProduct = (id) => {
  const promise = services.getProductByIdApi(id);
  promise
    .then((result) => {
      const product = result.data;

      getEle("TenSP").value = product.name;
      getEle("GiaSP").value = product.price;
      getEle("HinhSP").value = product.img;
      getEle("ManHinh").value = product.screen;
      getEle("CameraSau").value = product.backCamera;
      getEle("CameraTruoc").value = product.frontCamera;
      getEle("MoTa").value = product.desc;
      getEle("LoaiSP").value = product.type;
    })
    .catch((error) => {
      console.log(error);
    })

  document.getElementsByClassName("modal-title")[0].innerHTML = "Edit Product";
  const btnUpdate = `<button class="btn btn-info" onclick="onUpdateProduct('${id}')">Update</button>`;
  document.getElementsByClassName("modal-footer")[0].innerHTML = btnUpdate;
}

window.onEditProduct = onEditProduct;

const onUpdateProduct = (id) => {
  if (!validateForm()) return;
  const product = getValue();
  product.id = id;

  const promise = services.updateProductApi(product);
  promise
    .then((result) => {
      console.log(result);
      alert(`Update product success`)
      document.getElementsByClassName("close")[0].click();
      getListProduct();
    })
    .catch((error) => {
      console.log(error);
    })
}

window.onUpdateProduct = onUpdateProduct;


const searchProduct = (keyword) => {
  services.getListProductApi()
    .then((result) => {
      let arr = result.data;

      const findProduct = arr.filter(product =>
        product.name.toLowerCase().includes(keyword.toLowerCase())
      );

      renderListProduct(findProduct);
    })
    .catch((error) => {
      console.log(error);
    });
}

getEle("keyword").addEventListener("keyup", () => {
  const keyword = getEle("keyword").value;
  searchProduct(keyword);
});


getEle("sortPrice").addEventListener("change", function () {
  const selected = this.value;

  services.getListProductApi()
    .then((result) => {
      let data = result.data;

      if (selected === "asc") {
        data.sort((a, b) => Number(a.price) - Number(b.price));
      } else if (selected === "desc") {
        data.sort((a, b) => Number(b.price) - Number(a.price));
      }

      renderListProduct(data);
    })
    .catch((error) => {
      console.log(error);
    });
});

const validateForm = () => {
  let isValid = true;

  const name = getEle("TenSP").value;
  const price = getEle("GiaSP").value;
  const img = getEle("HinhSP").value;
  const screen = getEle("ManHinh").value;
  const backCamera = getEle("CameraSau").value;
  const frontCamera = getEle("CameraTruoc").value;
  const desc = getEle("MoTa").value;
  const type = getEle("LoaiSP").value;

  // Tên sản phẩm: không rỗng 
  isValid &= validation.CheckEmpty(name, "tbTenSP", "Tên không được để trống");

  // Giá: không rỗng + là số
  isValid &= validation.CheckEmpty(price, "tbGiaSP", "Giá không được để trống")
    && validation.checkNumber(price, "tbGiaSP", "Giá phải là số hợp lệ");

  // Hình ảnh
  isValid &= validation.CheckEmpty(img, "tbHinhAnh", "Hình không được để trống");

  // Màn hình
  isValid &= validation.CheckEmpty(screen, "tbManHinh", "Thông tin màn hình không được để trống");

  // Camera Sau
  isValid &= validation.CheckEmpty(backCamera, "tbCameraSau", "Camera sau không được để trống");

  // Camera Trước
  isValid &= validation.CheckEmpty(frontCamera, "tbCammeraTruoc", "Camera trước không được để trống");

  // Mô tả
  isValid &= validation.CheckEmpty(desc, "tbMoTa", "Mô tả không được để trống");

  // Loại sản phẩm
  isValid &= validation.checkSelectOption("LoaiSP", "tbLoaiSP", "Vui lòng chọn loại sản phẩm");

  return Boolean(isValid); 
};
