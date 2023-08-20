const settings_fields = ["SHEET_ID",
                          "CONSUMER_KEY", 
                          "CONSUMER_SECRET", 
                          "DOMAIN", 
                          "ITEMS_PER_PAGE",
                          "MAX_PAGES"
                          ];

function checkSettings(settings) {

  if (typeof settings === 'object') {
    for (var j = 0; j < settings_fields.length; j++) {
      if (settings[settings_fields[j]] == null) {
          throw Error("Missing setting: " + settings_fields[j])
      }
    }
  }
  else {
    throw Error("Settings are not properly defined")
  }

}

const EXECUTION_TYPES = {
  "orders": 1,
  "products": 2
}

const DATE_FIELD_ORDERS = "date_modified_gmt";

const ORDER_FIELDS = ['id', 'parent_id', 'status', 'currency', 'version', 'prices_include_tax', 'date_created', 'date_modified', 'discount_total', 'discount_tax', 'shipping_total', 'shipping_tax', 'cart_tax', 'total', 'total_tax', 'customer_id', 'order_key', 'billing.first_name', 'billing.last_name', 'billing.company', 'billing.address_1', 'billing.address_2', 'billing.city', 'billing.state', 'billing.postcode', 'billing.country', 'billing.email', 'billing.phone', 'shipping.first_name', 'shipping.last_name', 'shipping.company', 'shipping.address_1', 'shipping.address_2', 'shipping.city', 'shipping.state', 'shipping.postcode', 'shipping.country', 'shipping.phone', 'payment_method', 'payment_method_title', 'transaction_id', 'customer_ip_address', 'customer_user_agent', 'created_via', 'customer_note', 'date_paid', 'cart_hash', 'number', 'line_items', 'tax_lines', 'shipping_lines', 'fee_lines', 'coupon_lines', 'refunds', 'payment_url', 'is_editable', 'needs_payment', 'needs_processing', 'date_created_gmt', 'date_modified_gmt', 'date_paid_gmt', 'currency_symbol'];

const LINE_ITEMS_FIELDS = [ "id", "name", "product_id", "variation_id", "quantity", "tax_class", "subtotal", "subtotal_tax", "total", "total_tax", "sku", "price", "image.id", "image.src", "parent_name", "order_id" ]

const CUSTOMER_FIELDS = ["id", "date_created", "date_created_gmt", "date_modified", "date_modified_gmt", "email", "first_name", "last_name", "role", "username", "billing.first_name", "billing.last_name", "billing.company", "billing.address_1", "billing.address_2", "billing.city", "billing.postcode", "billing.country", "billing.state", "billing.email", "billing.phone", "shipping.first_name", "shipping.last_name", "shipping.company", "shipping.address_1", "shipping.address_2", "shipping.city", "shipping.postcode", "shipping.country", "shipping.state", "shipping.phone", "is_paying_customer", "avatar_url"]

const PRODUCT_FIELDS = ["id", "name", "slug", "permalink", "date_created", "date_created_gmt", "date_modified", "date_modified_gmt", "type", "status", "featured", "catalog_visibility", "short_description", "sku", "price", "regular_price", "sale_price", "date_on_sale_from", "date_on_sale_from_gmt", "date_on_sale_to", "date_on_sale_to_gmt", "on_sale", "purchasable", "total_sales", "virtual", "downloadable", "downloads", "download_limit", "download_expiry", "external_url", "tax_status", "tax_class", "manage_stock", "stock_quantity", "backorders", "backorders_allowed", "backordered", "low_stock_amount", "sold_individually", "weight", "dimensions", "shipping_required", "shipping_taxable", "shipping_class", "shipping_class_id", "reviews_allowed", "average_rating", "rating_count", "upsell_ids", "cross_sell_ids", "parent_id", "purchase_note", , "tags", "images", "attributes", "default_attributes", "variations", "grouped_products", "menu_order", "related_ids", "stock_status", "has_options", "lang"]


const CATEGORIES_FIELDS = ["id", "name", "slug", "parent", "display", "image.id", "image.date_created", "image.date_created_gmt", "image.date_modified", "image.date_modified_gmt", "image.src", "image.name", "image.alt", "menu_order", "count", "lang"];


const PRODUCT_CATEGORIES_FIELDS = ["id","name","slug","product_id"]

