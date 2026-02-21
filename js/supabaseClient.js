const SUPABASE_URL = window.__ENV__?.SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = window.__ENV__?.SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  throw new Error(
    'Missing Supabase env config. Generate js/env.js from .env using: node scripts/generate-env.js'
  );
}

const CURRENT_USER_KEY = 'currentUser';

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

function getCurrentUser() {
  return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
}

function setCurrentUser(user) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

function clearCurrentUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

async function registerProfile({ id, name, email, password, createdAt }) {
  const { data, error } = await supabaseClient
    .from('profiles')
    .insert({
      id,
      name,
      email,
      password,
      created_at: createdAt,
    })
    .select('id, name, email, created_at')
    .single();

  if (error) throw error;

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    createdAt: data.created_at,
  };
}

async function findProfileByEmail(email) {
  const { data, error } = await supabaseClient
    .from('profiles')
    .select('id, name, email, created_at')
    .eq('email', email)
    .maybeSingle();

  if (error) throw error;

  if (!data) return null;

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    createdAt: data.created_at,
  };
}

async function loginProfile(email, password) {
  const { data, error } = await supabaseClient
    .from('profiles')
    .select('id, name, email, created_at')
    .eq('email', email)
    .eq('password', password)
    .maybeSingle();

  if (error) throw error;

  if (!data) return null;

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    createdAt: data.created_at,
  };
}

async function updateProfileName(userId, newName) {
  const { data, error } = await supabaseClient
    .from('profiles')
    .update({ name: newName })
    .eq('id', userId)
    .select('id, name, email, created_at')
    .single();

  if (error) throw error;

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    createdAt: data.created_at,
  };
}

async function getCartItems(userId) {
  const { data, error } = await supabaseClient
    .from('cart_items')
    .select('product_id, name, price, image, quantity, stock')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) throw error;

  return (data || []).map((item) => ({
    id: item.product_id,
    name: item.name,
    price: Number(item.price),
    image: item.image,
    quantity: item.quantity,
    stock: item.stock,
  }));
}

async function addOrIncrementCartItem(userId, product) {
  const { data: existing, error: existingError } = await supabaseClient
    .from('cart_items')
    .select('id, quantity, stock')
    .eq('user_id', userId)
    .eq('product_id', product.id)
    .maybeSingle();

  if (existingError) throw existingError;

  if (existing) {
    if (existing.quantity >= existing.stock) {
      return { added: false, reason: 'stock_limit' };
    }

    const { error: updateError } = await supabaseClient
      .from('cart_items')
      .update({ quantity: existing.quantity + 1 })
      .eq('id', existing.id);

    if (updateError) throw updateError;

    return { added: true };
  }

  const { error: insertError } = await supabaseClient
    .from('cart_items')
    .insert({
      user_id: userId,
      product_id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      stock: product.stock,
    });

  if (insertError) throw insertError;

  return { added: true };
}

async function updateCartQuantity(userId, productId, quantity) {
  const { data: item, error: itemError } = await supabaseClient
    .from('cart_items')
    .select('id, stock')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single();

  if (itemError) throw itemError;

  const safeQty = Math.min(Math.max(quantity, 1), item.stock || quantity);

  const { error } = await supabaseClient
    .from('cart_items')
    .update({ quantity: safeQty })
    .eq('id', item.id);

  if (error) throw error;

  return safeQty;
}

async function removeCartItem(userId, productId) {
  const { error } = await supabaseClient
    .from('cart_items')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId);

  if (error) throw error;
}

async function clearCart(userId) {
  const { error } = await supabaseClient
    .from('cart_items')
    .delete()
    .eq('user_id', userId);

  if (error) throw error;
}

async function createOrder({ userId, customer, items, total, totalItems }) {
  const orderId = `ORD-${Date.now()}`;

  const { error: orderError } = await supabaseClient.from('orders').insert({
    id: orderId,
    user_id: userId,
    customer_name: customer.name,
    customer_email: customer.email,
    customer_phone: customer.phone,
    customer_address: customer.address,
    customer_city: customer.city,
    customer_notes: customer.notes,
    total,
    total_items: totalItems,
  });

  if (orderError) throw orderError;

  const orderItems = items.map((item) => ({
    order_id: orderId,
    product_id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    image: item.image,
    stock: item.stock,
  }));

  const { error: orderItemsError } = await supabaseClient
    .from('order_items')
    .insert(orderItems);

  if (orderItemsError) throw orderItemsError;

  await clearCart(userId);

  return orderId;
}

async function getProductsByCategory(category) {
  const { data, error } = await supabaseClient
    .from('products')
    .select('id, title, price, stock, thumbnail, category')
    .eq('category', category)
    .order('id', { ascending: true });

  if (error) throw error;

  return data || [];
}

async function getProductById(productId) {
  const { data, error } = await supabaseClient
    .from('products')
    .select(
      'id, title, description, category, brand, rating, price, stock, thumbnail, images'
    )
    .eq('id', productId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

window.appDb = {
  getCurrentUser,
  setCurrentUser,
  clearCurrentUser,
  registerProfile,
  findProfileByEmail,
  loginProfile,
  updateProfileName,
  getCartItems,
  addOrIncrementCartItem,
  updateCartQuantity,
  removeCartItem,
  clearCart,
  createOrder,
  getProductsByCategory,
  getProductById,
};
