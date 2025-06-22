class ProductServices {
  getListProductApi = () => {
    /**
     * Promise (Lời hứa)
     *    - Pending: Thời gian chờ thực hiện lời hứa 
     *    - Resolve: Thành công 
     *    - Reject: Thất bại 
     */
    const promise = axios({
      url: "https://6846687f7dbda7ee7aaef2e1.mockapi.io/api/Products",
      method: "GET",
    });

    return promise;
  };

  deleteProductApi(id){
    const promise = axios({
      url: `https://6846687f7dbda7ee7aaef2e1.mockapi.io/api/Products/${id}`,
      method: "DELETE",
    });

    return promise;
  }

  addProductApi(product){
    const promise = axios({
      url: `https://6846687f7dbda7ee7aaef2e1.mockapi.io/api/Products`,
      method: "POST",
      data: product,
    })

    return promise;
  }

  getProductByIdApi(id){
    const promise = axios({
      url: `https://6846687f7dbda7ee7aaef2e1.mockapi.io/api/Products/${id}`,
      method: "GET",
    })

    return promise;
  }

  updateProductApi(product){
    const promise = axios({
      url: `https://6846687f7dbda7ee7aaef2e1.mockapi.io/api/Products/${product.id}`,
      method: "PUT",
      data: product,
    })

    return promise;
  }
}

export default ProductServices;