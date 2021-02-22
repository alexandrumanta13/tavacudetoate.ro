export class Product {
    alias: string;
    num: number;
    id: number;
    product_name: string;
    description: string;
    ingredients: string;
    categories: [];
    images: [];
    information: [];
    availableQuantities: [];
    cart_uuid: string;

    /**
     * Constructor
     *
     * @param product
     */

    constructor(product?) {
        product = product || {};
        this.num = product.num;
        this.alias = product.alias;
        this.id = parseInt(product.id)
        this.product_name = product.product_name || '';
        this.description = product.description || '';
        this.ingredients = product.ingredients || '';
        this.categories = product.categories || [];
        this.images = product.images || [];
        this.information = product.information || [];
        this.availableQuantities = product.availableQuantities || [];
        this.cart_uuid = product.cart_uuid || '';
    }
  }

  