 "use client";

import { useMemo, useState } from "react";
import { ArrowDownRight, ArrowRight, Check, Globe2, ShoppingBag, X } from "lucide-react";
import { categories, demoProducts, type Product } from "@/lib/products";

type Lang = "en" | "ar";
type CartLine = { product: Product; sizeId: string; qty: number };

const copy = {
  en: {
    announcement: "Small stickers. Big personality. ✳",
    shop: "Shop all", categories: "Categories", about: "Our vibe",
    heroKicker: "A LITTLE STICKER, A LOT OF PERSONALITY",
    heroTitleA: "STICK YOUR", heroTitleB: "STYLE.",
    heroText: "Tiny details. Big energy. Find the stickers that make your everyday things feel like you.",
    explore: "Explore the collection", viewCategories: "View categories",
    categoriesKicker: "FIND YOUR STICK", categoriesTitle: "Shop by category", allCategories: "All categories ↗",
    productsKicker: "THE STARTING LINEUP", productsTitle: "Made for your kind of mood",
    demo: "DEMO CONTENT", choose: "Choose options", pricePending: "Price to be confirmed",
    add: "Add to bag", added: "Added to bag", moreTitle: "Your style, your rules.",
    moreText: "New drops and new categories can join the collection as Sticky Ticky grows.",
    contact: "Chat with us", bag: "Bag", yourBag: "Your bag", empty: "Your bag is empty for now.",
    remove: "Remove", checkout: "Continue to checkout", whatsapp: "Order via WhatsApp",
    demoNotice: "Demo only — product prices and artwork are not final.",
    size: "Size", quantity: "Qty", checkoutTitle: "Checkout preview",
    customerName: "Your name", phone: "Phone number", address: "Delivery address",
    sendOrder: "Prepare order", checkoutNote: "This starter version prepares an order summary; payment and order storage must be configured before launch.",
    orderReady: "Order summary ready. Choose WhatsApp to send it to the store.",
    missingWhatsApp: "Add NEXT_PUBLIC_WHATSAPP_NUMBER in .env.local to enable direct WhatsApp ordering.",
    currency: "EGP", footer: "Made for sticker people.", footerNote: "A custom-built storefront starter.",
  },
  ar: {
    announcement: "ستيكرز صغيرة، شخصية كبيرة ✳",
    shop: "كل المنتجات", categories: "الأقسام", about: "عن البراند",
    heroKicker: "ستيكر صغير، شخصية كبيرة",
    heroTitleA: "خلي ستايلك", heroTitleB: "يلزق.",
    heroText: "تفاصيل صغيرة بطاقة كبيرة. اكتشف الاستيكرز اللي تخلي حاجاتك اليومية شبهك.",
    explore: "اكتشف المجموعة", viewCategories: "شوف الأقسام",
    categoriesKicker: "اختار الاستيكر بتاعك", categoriesTitle: "تسوق حسب القسم", allCategories: "كل الأقسام ↗",
    productsKicker: "بداية المجموعة", productsTitle: "اختار اللي شبه مودك",
    demo: "محتوى تجريبي", choose: "اختار التفاصيل", pricePending: "السعر هيتحدد",
    add: "أضف للسلة", added: "اتضاف للسلة", moreTitle: "ستايلك، وقواعدك.",
    moreText: "هنقدر نضيف منتجات وأقسام جديدة كل ما Sticky Ticky يكبر.",
    contact: "كلمنا", bag: "السلة", yourBag: "سلتك", empty: "السلة فاضية حاليًا.",
    remove: "حذف", checkout: "كمّل بيانات الطلب", whatsapp: "اطلب عن طريق واتساب",
    demoNotice: "نسخة تجريبية — الأسعار والصور النهائية لسه مش مضافة.",
    size: "المقاس", quantity: "الكمية", checkoutTitle: "معاينة الطلب",
    customerName: "اسمك", phone: "رقم الموبايل", address: "عنوان التوصيل",
    sendOrder: "جهّز الطلب", checkoutNote: "النسخة دي بتجهز ملخص الطلب؛ لازم نضبط الدفع وحفظ الطلبات قبل الإطلاق.",
    orderReady: "ملخص الطلب جاهز. استخدم واتساب لإرساله للمتجر.",
    missingWhatsApp: "أضف NEXT_PUBLIC_WHATSAPP_NUMBER في ملف .env.local لتفعيل الطلب عبر واتساب.",
    currency: "ج.م", footer: "متعمل بحب لمحبي الاستيكرز.", footerNote: "بداية متجر مخصص بالكود.",
  },
};

function categoryArtwork(visual: string) {
  if (visual === "sheet") return <><span className="art-sticker">✳<br/>FUN</span><span className="art-sticker">STICK<br/>WITH IT</span></>;
  if (visual === "card") return <><span className="art-sticker">TICKY</span><span className="art-sticker">✦</span></>;
  return <><span className="art-sticker">STAY<br/>STICKY</span><span className="art-sticker">✳</span></>;
}

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "" });
  const [notice, setNotice] = useState("");
  const [orderSummary, setOrderSummary] = useState("");
  const t = copy[lang];
  const isAr = lang === "ar";
  const cartCount = cart.reduce((sum, line) => sum + line.qty, 0);
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

  const orderText = useMemo(() => {
    const lines = cart.map((line) => {
      const size = line.product.sizes.find((s) => s.id === line.sizeId);
      return `${line.product.name[lang]} — ${size?.label[lang] ?? ""} × ${line.qty}`;
    });
    return `Sticky Ticky order\n${lines.join("\n")}\n\nName: ${customer.name}\nPhone: ${customer.phone}\nAddress: ${customer.address}\n\nPrices to be confirmed by the store.`;
  }, [cart, customer, lang]);

  function addToCart(product: Product) {
    const sizeId = selectedSizes[product.id] || product.sizes[0]?.id;
    if (!sizeId) return;
    setCart((current) => {
      const existing = current.find((line) => line.product.id === product.id && line.sizeId === sizeId);
      if (existing) return current.map((line) => line === existing ? { ...line, qty: line.qty + 1 } : line);
      return [...current, { product, sizeId, qty: 1 }];
    });
    setCartOpen(true);
    setNotice(t.added);
  }

  function removeLine(productId: string, sizeId: string) {
    setCart((current) => current.filter((line) => !(line.product.id === productId && line.sizeId === sizeId)));
  }

  function prepareOrder() {
    if (!customer.name.trim() || !customer.phone.trim() || !customer.address.trim()) {
      setNotice(isAr ? "من فضلك كمّل الاسم والموبايل والعنوان." : "Please complete your name, phone, and delivery address.");
      return;
    }
    setOrderSummary(orderText);
    setNotice(t.orderReady);
  }

  function openWhatsApp() {
    if (!whatsappNumber) {
      setNotice(t.missingWhatsApp);
      return;
    }
    const message = encodeURIComponent(orderText);
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank", "noopener,noreferrer");
  }

  return (
    <main className="site-shell" dir={isAr ? "rtl" : "ltr"}>
      <div className="top-note">{t.announcement}</div>
      <header className="header">
        <a className="logo" href="#" aria-label="Sticky Ticky home">STICKY TICKY<span>.</span></a>
        <nav className="nav" aria-label="Main navigation">
          <a href="#shop">{t.shop}</a><a href="#categories">{t.categories}</a><a href="#about">{t.about}</a>
        </nav>
        <div className="header-actions">
          <button className="pill-btn" onClick={() => setLang(isAr ? "en" : "ar")} aria-label="Switch language"><Globe2 size={14} style={{ verticalAlign: "middle", marginInlineEnd: 5 }}/>{isAr ? "EN" : "عربي"}</button>
          <button className="cart-btn" onClick={() => { setCartOpen(true); setCheckoutOpen(false); }}><ShoppingBag size={14} style={{ verticalAlign: "middle", marginInlineEnd: 6 }}/>{t.bag} ({cartCount})</button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-panel">
          <div>
            <div className="eyebrow">{t.heroKicker}</div>
            <h1>{t.heroTitleA}<br/><em>{t.heroTitleB}</em></h1>
            <p className="hero-copy">{t.heroText}</p>
            <div className="hero-buttons">
              <a className="primary-btn" href="#shop">{t.explore} <ArrowRight size={15} style={{ marginInlineStart: 9 }}/></a>
              <a className="secondary-btn" href="#categories">{t.viewCategories}</a>
            </div>
          </div>
          <div className="hero-art" aria-label="Decorative sticker illustration">
            <div className="sticker-stack">
              <div className="sticker-shape shape-one">STAY<br/>STICKY</div>
              <div className="sticker-shape shape-two">✳<br/>GOOD<br/>VIBES</div>
              <div className="sticker-shape shape-three">STICK<br/>TO IT.</div>
              <div className="sticker-shape shape-four">✦</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="categories">
        <div className="section-head">
          <div><div className="section-kicker">{t.categoriesKicker}</div><h2>{t.categoriesTitle}</h2></div>
          <a className="text-link" href="#shop">{t.allCategories}</a>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <a className="category-card" href="#shop" key={category.slug}>
              <div><div className="category-title">{category.name[lang]}</div><p className="category-desc">{category.description[lang]}</p></div>
              <div className="category-art">{categoryArtwork(category.visual)}</div>
              <ArrowDownRight className="category-arrow" size={22}/>
            </a>
          ))}
        </div>
      </section>

      <section className="section" id="shop">
        <div className="section-head">
          <div><div className="section-kicker">{t.productsKicker}</div><h2>{t.productsTitle}</h2></div>
          <span className="demo-label">{t.demo}</span>
        </div>
        <p style={{ color: "var(--muted)", fontSize: 12, marginTop: -10, marginBottom: 20 }}>{t.demoNotice}</p>
        <div className="product-grid">
          {demoProducts.map((product, index) => {
            const sizeId = selectedSizes[product.id] || product.sizes[0]?.id || "";
            return (
              <article className="product-card" key={product.id}>
                <div className={`product-visual ${index === 1 ? "pink" : index === 2 ? "blue" : ""}`}>
                  <div className="product-mock">{index === 0 ? "STAY STICKY ✳" : index === 1 ? "GOOD VIBES ONLY" : "STICK TO IT."}</div>
                </div>
                <div className="product-info">
                  <span className="demo-label">{t.demo}</span>
                  <div className="product-name">{product.name[lang]}</div>
                  <div className="product-description">{product.description[lang]}</div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 800, marginTop: 12 }} htmlFor={`size-${product.id}`}>{t.size}</label>
                  <select id={`size-${product.id}`} className="form-field" value={sizeId} onChange={(event) => setSelectedSizes((current) => ({ ...current, [product.id]: event.target.value }))}>
                    {product.sizes.map((size) => <option key={size.id} value={size.id}>{size.label[lang]}</option>)}
                  </select>
                  <div className="product-bottom">
                    <span className="price-note">{t.pricePending}</span>
                    <button className="small-add" onClick={() => addToCart(product)}>{t.add} +</button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="banner" id="about">
        <div><h2>{t.moreTitle}</h2><p>{t.moreText}</p></div>
        <a className="primary-btn" href="#categories">{t.viewCategories} <ArrowRight size={15} style={{ marginInlineStart: 8 }}/></a>
      </section>

      <footer className="footer">
        <div><strong>STICKY TICKY.</strong><div style={{ marginTop: 6 }}>{t.footer}</div></div>
        <div>{t.footerNote} © {new Date().getFullYear()}</div>
      </footer>

      {cartOpen && (
        <aside className="cart-panel" aria-label={t.yourBag}>
          <div className="cart-head"><h3>{checkoutOpen ? t.checkoutTitle : t.yourBag}</h3><button className="cart-close" onClick={() => { setCartOpen(false); setCheckoutOpen(false); }} aria-label="Close"><X size={16}/></button></div>
          {!checkoutOpen ? (
            <>
              {cart.length === 0 ? <div className="cart-empty">{t.empty}</div> : cart.map((line) => {
                const size = line.product.sizes.find((s) => s.id === line.sizeId);
                return <div className="cart-line" key={`${line.product.id}-${line.sizeId}`}>
                  <div><strong>{line.product.name[lang]}</strong><div style={{ color: "var(--muted)", marginTop: 4 }}>{size?.label[lang]} · {t.quantity}: {line.qty}</div></div>
                  <button className="pill-btn" onClick={() => removeLine(line.product.id, line.sizeId)}>{t.remove}</button>
                </div>;
              })}
              {cart.length > 0 && <div className="cart-actions">
                <button className="primary-btn" onClick={() => setCheckoutOpen(true)}>{t.checkout}</button>
                <button className="secondary-cart" onClick={openWhatsApp}>{t.whatsapp}</button>
              </div>}
            </>
          ) : (
            <>
              <label style={{ display: "block", fontSize: 11, fontWeight: 800, marginTop: 12 }}>{t.customerName}<input className="form-field" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })}/></label>
              <label style={{ display: "block", fontSize: 11, fontWeight: 800, marginTop: 12 }}>{t.phone}<input className="form-field" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} inputMode="tel"/></label>
              <label style={{ display: "block", fontSize: 11, fontWeight: 800, marginTop: 12 }}>{t.address}<input className="form-field" value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })}/></label>
              <div className="cart-actions"><button className="primary-btn" onClick={prepareOrder}>{t.sendOrder} <Check size={14} style={{ marginInlineStart: 6 }}/></button><button className="secondary-cart" onClick={openWhatsApp}>{t.whatsapp}</button></div>
              <p style={{ color: "var(--muted)", fontSize: 10, lineHeight: 1.6 }}>{t.checkoutNote}</p>
              {orderSummary && <textarea className="form-field" rows={5} readOnly value={orderSummary} aria-label="Order summary"/>}
            </>
          )}
          {notice && <div className="toast" role="status">{notice}</div>}
        </aside>
      )}
    </main>
  );
}
