import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  popular?: boolean;
  similar?: number[];
}

interface CartItem extends Product {
  quantity: number;
}

interface Review {
  id: number;
  author: string;
  rating: number;
  text: string;
  date: string;
}

const products: Product[] = [
  { id: 1, name: 'Cosmic Blaster', price: 2999, category: 'weapons', image: '🔫', rating: 5, popular: true, similar: [2, 3] },
  { id: 2, name: 'Neon Armor Pro', price: 4499, category: 'armor', image: '🛡️', rating: 5, popular: true, similar: [1, 4] },
  { id: 3, name: 'Cyber Sword X', price: 3499, category: 'weapons', image: '⚔️', rating: 4, similar: [1, 5] },
  { id: 4, name: 'Power Helmet', price: 1999, category: 'armor', image: '🪖', rating: 4, popular: true, similar: [2, 6] },
  { id: 5, name: 'Plasma Rifle', price: 3999, category: 'weapons', image: '🔫', rating: 5, similar: [1, 3] },
  { id: 6, name: 'Shield Gen', price: 2499, category: 'armor', image: '🛡️', rating: 4, similar: [2, 4] },
];

const reviews: Review[] = [
  { id: 1, author: 'ProGamer2077', rating: 5, text: 'Невероятное качество! Cosmic Blaster просто бомба!', date: '2 дня назад' },
  { id: 2, author: 'CyberNinja', rating: 5, text: 'Neon Armor спас меня в рейде, рекомендую всем!', date: '5 дней назад' },
  { id: 3, author: 'PixelWarrior', rating: 4, text: 'Отличный магазин, быстрая доставка', date: '1 неделю назад' },
];

export default function Index() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeSection, setActiveSection] = useState<string>('home');

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const getSimilarProducts = (productId: number): Product[] => {
    const product = products.find(p => p.id === productId);
    if (!product?.similar) return [];
    return products.filter(p => product.similar?.includes(p.id)).slice(0, 3);
  };

  const popularProducts = products.filter(p => p.popular);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-4xl animate-float">🎮</div>
              <h1 className="text-2xl md:text-3xl font-montserrat font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                GAME SHOP
              </h1>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              {['home', 'catalog', 'reviews', 'contacts'].map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`font-medium transition-all hover:text-primary ${
                    activeSection === section ? 'text-primary text-glow' : 'text-foreground/70'
                  }`}
                >
                  {section === 'home' ? 'Главная' : section === 'catalog' ? 'Каталог' : section === 'reviews' ? 'Отзывы' : 'Контакты'}
                </button>
              ))}
            </nav>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative glow-purple">
                  <Icon name="ShoppingCart" size={20} />
                  {cart.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-secondary">
                      {cart.length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader>
                  <SheetTitle className="font-montserrat text-2xl">Корзина</SheetTitle>
                </SheetHeader>
                <div className="mt-8 space-y-4">
                  {cart.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Корзина пуста</p>
                  ) : (
                    <>
                      {cart.map((item) => (
                        <Card key={item.id} className="glow-purple">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              <div className="text-4xl">{item.image}</div>
                              <div className="flex-1">
                                <h3 className="font-semibold">{item.name}</h3>
                                <p className="text-sm text-muted-foreground">{item.price} ₽</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button size="icon" variant="outline" onClick={() => updateQuantity(item.id, -1)}>
                                  <Icon name="Minus" size={16} />
                                </Button>
                                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                                <Button size="icon" variant="outline" onClick={() => updateQuantity(item.id, 1)}>
                                  <Icon name="Plus" size={16} />
                                </Button>
                              </div>
                              <Button size="icon" variant="destructive" onClick={() => removeFromCart(item.id)}>
                                <Icon name="Trash2" size={16} />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      <div className="border-t pt-4 space-y-4">
                        <div className="flex justify-between text-xl font-bold">
                          <span>Итого:</span>
                          <span className="text-primary">{totalPrice} ₽</span>
                        </div>
                        <Button className="w-full glow-pink" size="lg">
                          Оформить заказ
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {activeSection === 'home' && (
          <div className="space-y-16 animate-fade-in">
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 p-8 md:p-16 border border-primary/30 glow-purple">
              <div className="relative z-10 max-w-2xl">
                <h2 className="text-4xl md:text-6xl font-montserrat font-black mb-4 text-glow">
                  Топовая экипировка для победы
                </h2>
                <p className="text-lg md:text-xl text-foreground/80 mb-8">
                  Самое мощное оружие и броня для настоящих геймеров
                </p>
                <Button size="lg" className="glow-pink" onClick={() => setActiveSection('catalog')}>
                  <Icon name="Zap" className="mr-2" size={20} />
                  Смотреть каталог
                </Button>
              </div>
              <div className="absolute right-8 top-1/2 -translate-y-1/2 text-9xl opacity-20 animate-float">
                🎮
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-montserrat font-bold mb-8 flex items-center gap-3">
                <Icon name="Flame" className="text-secondary" size={32} />
                Популярные товары
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularProducts.map((product) => (
                  <Card key={product.id} className="group hover:scale-105 transition-all duration-300 glow-purple cursor-pointer">
                    <CardContent className="p-6">
                      <div className="text-6xl mb-4 text-center animate-float">{product.image}</div>
                      <Badge className="mb-2 bg-secondary">Популярное</Badge>
                      <h3 className="font-bold text-xl mb-2">{product.name}</h3>
                      <div className="flex items-center gap-1 mb-4">
                        {Array.from({ length: product.rating }).map((_, i) => (
                          <Icon key={i} name="Star" size={16} className="text-yellow-500 fill-yellow-500" />
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">{product.price} ₽</span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-6 pt-0">
                      <Button className="w-full glow-pink group-hover:scale-105 transition-transform" onClick={() => addToCart(product)}>
                        <Icon name="ShoppingCart" className="mr-2" size={16} />
                        В корзину
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeSection === 'catalog' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-montserrat font-bold">Каталог товаров</h2>
            </div>

            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="grid w-full md:w-auto grid-cols-3 glow-purple">
                <TabsTrigger value="all">Все</TabsTrigger>
                <TabsTrigger value="weapons">Оружие</TabsTrigger>
                <TabsTrigger value="armor">Броня</TabsTrigger>
              </TabsList>

              <TabsContent value={selectedCategory} className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="group hover:scale-105 transition-all duration-300 glow-blue">
                      <CardContent className="p-6">
                        <div className="text-6xl mb-4 text-center animate-float">{product.image}</div>
                        {product.popular && <Badge className="mb-2 bg-secondary">Популярное</Badge>}
                        <h3 className="font-bold text-xl mb-2">{product.name}</h3>
                        <div className="flex items-center gap-1 mb-4">
                          {Array.from({ length: product.rating }).map((_, i) => (
                            <Icon key={i} name="Star" size={16} className="text-yellow-500 fill-yellow-500" />
                          ))}
                        </div>
                        <div className="text-2xl font-bold text-primary mb-4">{product.price} ₽</div>
                        
                        {getSimilarProducts(product.id).length > 0 && (
                          <div className="mt-4 pt-4 border-t border-border">
                            <p className="text-xs text-muted-foreground mb-2">Похожие товары:</p>
                            <div className="flex gap-2">
                              {getSimilarProducts(product.id).map((similar) => (
                                <div key={similar.id} className="text-2xl opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                                  {similar.image}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="p-6 pt-0">
                        <Button className="w-full glow-pink group-hover:scale-105 transition-transform" onClick={() => addToCart(product)}>
                          <Icon name="ShoppingCart" className="mr-2" size={16} />
                          В корзину
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {activeSection === 'reviews' && (
          <div className="space-y-8 animate-fade-in">
            <h2 className="text-3xl font-montserrat font-bold">Отзывы игроков</h2>
            <div className="grid gap-6">
              {reviews.map((review) => (
                <Card key={review.id} className="glow-purple">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg">{review.author}</h3>
                        <p className="text-sm text-muted-foreground">{review.date}</p>
                      </div>
                      <div className="flex gap-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Icon key={i} name="Star" size={16} className="text-yellow-500 fill-yellow-500" />
                        ))}
                      </div>
                    </div>
                    <p className="text-foreground/90">{review.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'contacts' && (
          <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
            <h2 className="text-3xl font-montserrat font-bold">Контакты</h2>
            <Card className="glow-purple">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <Icon name="Mail" size={24} className="text-primary" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-muted-foreground">support@gameshop.ru</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Icon name="Phone" size={24} className="text-primary" />
                  <div>
                    <p className="font-semibold">Телефон</p>
                    <p className="text-muted-foreground">+7 (999) 123-45-67</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Icon name="MapPin" size={24} className="text-primary" />
                  <div>
                    <p className="font-semibold">Адрес</p>
                    <p className="text-muted-foreground">г. Москва, ул. Геймерская, д. 1</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glow-blue">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-4">Написать нам</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Имя</label>
                    <input type="text" className="w-full p-3 rounded-lg bg-input border border-border focus:border-primary outline-none transition-colors" placeholder="Ваше имя" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input type="email" className="w-full p-3 rounded-lg bg-input border border-border focus:border-primary outline-none transition-colors" placeholder="your@email.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Сообщение</label>
                    <textarea rows={4} className="w-full p-3 rounded-lg bg-input border border-border focus:border-primary outline-none transition-colors" placeholder="Ваше сообщение" />
                  </div>
                  <Button type="submit" className="w-full glow-pink" size="lg">
                    <Icon name="Send" className="mr-2" size={16} />
                    Отправить
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <footer className="border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="font-montserrat">© 2024 GAME SHOP. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}