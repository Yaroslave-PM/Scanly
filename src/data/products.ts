export interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  userBadge?: string;
  userReputation?: number;
  isVerifiedBuyer: boolean;
  date: string;
  rating: number;
  pricePaid: number;
  store: string;
  text: string;
  photos?: string[];
  likes: number;
  hasLiked?: boolean;
  commentsCount: number;
}

export interface StorePrice {
  store: 'Пятёрочка' | 'Магнит' | 'Лента' | 'Перекрёсток' | 'ВкусВилл';
  price: number;
  oldPrice?: number;
  distance: string;
  inStock: boolean;
  address: string;
  isCurrent?: boolean;
  isCheapest?: boolean;
  mapCoords: { x: number; y: number }; // Percentage in relative map coordinates
}

export interface Product {
  id: string;
  barcode: string;
  name: string;
  brand: string;
  category: 'Молочка' | 'Снеки' | 'Напитки' | 'Бакалея' | 'Фрукты' | 'Сладости';
  volumeWeight: string;
  image: string;
  rating: number;
  reviewCount: number;
  currentStore: {
    name: 'Пятёрочка' | 'Магнит' | 'Лента' | 'Перекрёсток' | 'ВкусВилл';
    price: number;
    distance: string;
    inStock: boolean;
    timestamp: string;
  };
  averagePrice: number;
  priceDifferencePercent: number; // e.g. -8 for -8% vs average
  cheapestStore: {
    name: string;
    price: number;
    savings: number;
  };
  aiSummary: {
    summary: string;
    pros: string[];
    cons: string[];
    decisionTip: string;
  };
  storePrices: StorePrice[];
  nutrition: {
    serving: string;
    calories: number;
    proteins: number;
    fats: number;
    carbs: number;
  };
  ingredients: string;
  badges: string[];
  reviews: Review[];
  isFavorite?: boolean;
  isPopular?: boolean;
  isDiscount?: boolean;
  isNew?: boolean;
}

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'moloko-domik',
    barcode: '4607025140019',
    name: 'Молоко Домик в деревне 3,2%',
    brand: 'Домик в деревне',
    category: 'Молочка',
    volumeWeight: '3,2% · 1 л · пастеризованное',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    reviewCount: 1245,
    currentStore: {
      name: 'Пятёрочка',
      price: 89,
      distance: '200 м',
      inStock: true,
      timestamp: 'сейчас',
    },
    averagePrice: 94,
    priceDifferencePercent: -8,
    cheapestStore: {
      name: 'Пятёрочка',
      price: 89,
      savings: 10,
    },
    aiSummary: {
      summary:
        'Большинство покупателей отмечают натуральный сливочный вкус и хорошую цену. Основная претензия связана с неудобной винтовой крышкой на обновлённой упаковке.',
      pros: [
        'Настоящий сливочный вкус без привкуса сухого молока',
        'Отлично взбивается в плотную пенку для капучино',
        'Честный литр (1000 мл, а не 900 мл)',
        'Выгодная цена по акции в Пятёрочке',
      ],
      cons: ['Крышка иногда прокручивается при первом вскрытии'],
      decisionTip: 'Однозначно брать: здесь лучшая цена среди всех соседних сетей.',
    },
    storePrices: [
      {
        store: 'Пятёрочка',
        price: 89,
        oldPrice: 97,
        distance: '200 м',
        inStock: true,
        address: 'ул. Большая Садовая, 42',
        isCurrent: true,
        isCheapest: true,
        mapCoords: { x: 38, y: 44 },
      },
      {
        store: 'Магнит',
        price: 92,
        distance: '450 м',
        inStock: true,
        address: 'пр. Ворошиловский, 18',
        mapCoords: { x: 55, y: 35 },
      },
      {
        store: 'Перекрёсток',
        price: 94,
        distance: '1,1 км',
        inStock: true,
        address: 'пр. Будённовский, 49',
        mapCoords: { x: 25, y: 62 },
      },
      {
        store: 'ВкусВилл',
        price: 96,
        distance: '800 м',
        inStock: true,
        address: 'ул. Пушкинская, 112',
        mapCoords: { x: 68, y: 50 },
      },
      {
        store: 'Лента',
        price: 99,
        distance: '1,8 км',
        inStock: true,
        address: 'ул. Красноармейская, 157',
        mapCoords: { x: 80, y: 22 },
      },
    ],
    nutrition: {
      serving: 'На 100 мл',
      calories: 60,
      proteins: 3.0,
      fats: 3.2,
      carbs: 4.7,
    },
    ingredients:
      'Молоко нормализованное цельное и молоко обезжиренное. Высший сорт по ГОСТ 31450-2013.',
    badges: ['Без ГМО', 'Натуральный состав', 'Источник кальция', 'Содержит лактозу', 'ГОСТ'],
    reviews: [
      {
        id: 'rev-1',
        userName: 'Елена Васильева',
        userBadge: 'Топ-покупатель',
        userReputation: 4.9,
        isVerifiedBuyer: true,
        date: '2 дня назад',
        rating: 5,
        pricePaid: 89,
        store: 'Пятёрочка',
        text: 'Отличное молоко, беру постоянно. Вкус натуральный, без синтетического привкуса. Пенка для утреннего латте получается густой и держится долго.',
        photos: [
          'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=400&q=80',
        ],
        likes: 128,
        commentsCount: 12,
      },
      {
        id: 'rev-2',
        userName: 'Артём Кузнецов',
        userReputation: 4.7,
        isVerifiedBuyer: true,
        date: 'Неделю назад',
        rating: 4,
        pricePaid: 92,
        store: 'Магнит',
        text: 'Молоко отличное, но пластиковая крышка с каждым разом всё туже. Приходится открывать полотенцем. По самому вкусу претензий ноль.',
        likes: 45,
        commentsCount: 4,
      },
      {
        id: 'rev-3',
        userName: 'Марина С.',
        userBadge: 'Эксперт ПП',
        userReputation: 5.0,
        isVerifiedBuyer: true,
        date: '2 недели назад',
        rating: 5,
        pricePaid: 89,
        store: 'Пятёрочка',
        text: 'Радует честный 1 литр в пакете, а не 930 мл как у конкурентов. Каши варятся замечательно, не сворачивается.',
        photos: [
          'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=400&q=80',
        ],
        likes: 83,
        commentsCount: 9,
      },
    ],
    isFavorite: true,
    isPopular: true,
    isDiscount: true,
  },
  {
    id: 'banany-ekvador',
    barcode: '4600123004512',
    name: 'Бананы фасованные Эквадор',
    brand: 'Global Village',
    category: 'Фрукты',
    volumeWeight: '1 кг · отборные',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviewCount: 892,
    currentStore: {
      name: 'Пятёрочка',
      price: 129,
      distance: '200 м',
      inStock: true,
      timestamp: 'сейчас',
    },
    averagePrice: 132,
    priceDifferencePercent: -2,
    cheapestStore: {
      name: 'Магнит',
      price: 119,
      savings: 10,
    },
    aiSummary: {
      summary:
        'Покупатели хвалят спелость, плотную мякоть и отсутствие черных пятен. В Магните через дорогу дешевле на 10 ₽.',
      pros: ['Сладкие, плотные', 'Долго не темнеют при комнатной температуре', 'Отборная калибровка'],
      cons: ['В Пятёрочке чуть дороже, чем в Магните'],
      decisionTip: 'Если рядом есть Магнит (450 м) — можно сэкономить 10 ₽ за килограмм.',
    },
    storePrices: [
      {
        store: 'Магнит',
        price: 119,
        distance: '450 м',
        inStock: true,
        address: 'пр. Ворошиловский, 18',
        isCheapest: true,
        mapCoords: { x: 55, y: 35 },
      },
      {
        store: 'Лента',
        price: 125,
        distance: '1,8 км',
        inStock: true,
        address: 'ул. Красноармейская, 157',
        mapCoords: { x: 80, y: 22 },
      },
      {
        store: 'Пятёрочка',
        price: 129,
        distance: '200 м',
        inStock: true,
        address: 'ул. Большая Садовая, 42',
        isCurrent: true,
        mapCoords: { x: 38, y: 44 },
      },
      {
        store: 'Перекрёсток',
        price: 139,
        distance: '1,1 км',
        inStock: true,
        address: 'пр. Будённовский, 49',
        mapCoords: { x: 25, y: 62 },
      },
      {
        store: 'ВкусВилл',
        price: 145,
        distance: '800 м',
        inStock: true,
        address: 'ул. Пушкинская, 112',
        mapCoords: { x: 68, y: 50 },
      },
    ],
    nutrition: {
      serving: 'На 100 г',
      calories: 89,
      proteins: 1.1,
      fats: 0.3,
      carbs: 22.8,
    },
    ingredients: 'Бананы свежие сорт Кавендиш, происхождение Эквадор.',
    badges: ['Свежий урожай', 'Калий и магний', 'Без обработки газом'],
    reviews: [
      {
        id: 'rev-b1',
        userName: 'Максим Громов',
        userReputation: 4.8,
        isVerifiedBuyer: true,
        date: 'Вчера',
        rating: 5,
        pricePaid: 129,
        store: 'Пятёрочка',
        text: 'Крепкие, желтые с легкой зеленцой у черенка. Вкус медовый, мякоть бархатная. Для перекуса перед тренировкой супер.',
        likes: 34,
        commentsCount: 2,
      },
    ],
    isFavorite: false,
    isPopular: true,
    isDiscount: false,
  },
  {
    id: 'yogurt-teos',
    barcode: '4810268032744',
    name: 'Йогурт греческий Teos 2%',
    brand: 'Савушкин',
    category: 'Молочка',
    volumeWeight: '140 г · без сахара',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewCount: 2130,
    currentStore: {
      name: 'Пятёрочка',
      price: 54,
      distance: '200 м',
      inStock: true,
      timestamp: 'сейчас',
    },
    averagePrice: 56,
    priceDifferencePercent: -4,
    cheapestStore: {
      name: 'Магнит',
      price: 49,
      savings: 5,
    },
    aiSummary: {
      summary:
        'Один из самых популярных ЗОЖ-продуктов. Покупатели ценят чистый состав (8 г белка на баночку), густую кремовую текстуру и отсутствие кислого привкуса.',
      pros: ['8 г белка на 100 г', 'Без добавленного сахара и крахмала', 'Идеален вместо майонеза в салаты'],
      cons: ['Быстро разбирают с полок'],
      decisionTip: 'Золотой стандарт среди греческих йогуртов. Рекомендуем брать с запасом.',
    },
    storePrices: [
      {
        store: 'Магнит',
        price: 49,
        oldPrice: 59,
        distance: '450 м',
        inStock: true,
        address: 'пр. Ворошиловский, 18',
        isCheapest: true,
        mapCoords: { x: 55, y: 35 },
      },
      {
        store: 'Пятёрочка',
        price: 54,
        distance: '200 м',
        inStock: true,
        address: 'ул. Большая Садовая, 42',
        isCurrent: true,
        mapCoords: { x: 38, y: 44 },
      },
      {
        store: 'Перекрёсток',
        price: 56,
        distance: '1,1 км',
        inStock: true,
        address: 'пр. Будённовский, 49',
        mapCoords: { x: 25, y: 62 },
      },
      {
        store: 'Лента',
        price: 62,
        distance: '1,8 км',
        inStock: true,
        address: 'ул. Красноармейская, 157',
        mapCoords: { x: 80, y: 22 },
      },
    ],
    nutrition: {
      serving: 'На 100 г',
      calories: 67,
      proteins: 8.0,
      fats: 2.0,
      carbs: 4.2,
    },
    ingredients:
      'Молоко нормализованное пастеризованное с использованием закваски из термофильных молочнокислых стрептококков и болгарской молочнокислой палочки.',
    badges: ['Высокий белок (8г)', 'Без сахара', 'Живые культуры', 'Чистый состав'],
    reviews: [
      {
        id: 'rev-t1',
        userName: 'Дарья П.',
        userBadge: 'Нутрициолог',
        userReputation: 5.0,
        isVerifiedBuyer: true,
        date: '3 дня назад',
        rating: 5,
        pricePaid: 54,
        store: 'Пятёрочка',
        text: 'Мой фаворит уже года два. Густой, ложка стоит! Использую для заправки огурцов с укропом, с ягодами на завтрак или просто так.',
        likes: 92,
        commentsCount: 5,
      },
    ],
    isFavorite: true,
    isPopular: true,
    isDiscount: false,
  },
  {
    id: 'choc-ritter',
    barcode: '4000417025005',
    name: 'Шоколад Ritter Sport Марципан',
    brand: 'Ritter Sport',
    category: 'Сладости',
    volumeWeight: '100 г · темный',
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviewCount: 3410,
    currentStore: {
      name: 'Пятёрочка',
      price: 149,
      distance: '200 м',
      inStock: true,
      timestamp: 'сейчас',
    },
    averagePrice: 179,
    priceDifferencePercent: -17,
    cheapestStore: {
      name: 'Пятёрочка',
      price: 149,
      savings: 30,
    },
    aiSummary: {
      summary:
        'Шоколад с культовым статусом. Калифорнийский марципан с легкой миндальной горчинкой в сочетании с хрустящим 50% темным шоколадом. В Пятёрочке супер-скидка недели!',
      pros: ['Настоящий марципан (44%)', 'Сбалансированная сладость без приторности', 'Лучшая скидка в городе (-30 ₽)'],
      cons: ['Специфический вкус марципана понравится не всем'],
      decisionTip: 'Супер-цена 149 ₽ вместо 199 ₽ в других сетях. Берите не раздумывая!',
    },
    storePrices: [
      {
        store: 'Пятёрочка',
        price: 149,
        oldPrice: 189,
        distance: '200 м',
        inStock: true,
        address: 'ул. Большая Садовая, 42',
        isCurrent: true,
        isCheapest: true,
        mapCoords: { x: 38, y: 44 },
      },
      {
        store: 'Магнит',
        price: 179,
        distance: '450 м',
        inStock: true,
        address: 'пр. Ворошиловский, 18',
        mapCoords: { x: 55, y: 35 },
      },
      {
        store: 'Перекрёсток',
        price: 189,
        distance: '1,1 км',
        inStock: true,
        address: 'пр. Будённовский, 49',
        mapCoords: { x: 25, y: 62 },
      },
      {
        store: 'Лента',
        price: 199,
        distance: '1,8 км',
        inStock: true,
        address: 'ул. Красноармейская, 157',
        mapCoords: { x: 80, y: 22 },
      },
    ],
    nutrition: {
      serving: 'На 100 г',
      calories: 493,
      proteins: 6.4,
      fats: 27.0,
      carbs: 53.0,
    },
    ingredients:
      'Сахар, какао тертое, миндаль измельченный (16%), масло какао, инвертный сироп, эмульгатор соевый лецитин.',
    badges: ['Настоящий марципан', 'Какао 50%', 'Без пальмового масла'],
    reviews: [
      {
        id: 'rev-r1',
        userName: 'Константин В.',
        userReputation: 4.9,
        isVerifiedBuyer: true,
        date: '3 дня назад',
        rating: 5,
        pricePaid: 149,
        store: 'Пятёрочка',
        text: 'По акции за 149 ₽ это подарок. Марципан не сухой, сочный, шоколад благородный с приятной терпкостью.',
        likes: 77,
        commentsCount: 6,
      },
    ],
    isFavorite: false,
    isPopular: true,
    isDiscount: true,
  },
  {
    id: 'khleb-borodino',
    barcode: '4601955001123',
    name: 'Хлеб Бородинский подовый',
    brand: 'Коломенское',
    category: 'Бакалея',
    volumeWeight: '350 г · нарезка',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    rating: 4.6,
    reviewCount: 620,
    currentStore: {
      name: 'Пятёрочка',
      price: 46,
      distance: '200 м',
      inStock: true,
      timestamp: 'сейчас',
    },
    averagePrice: 47,
    priceDifferencePercent: -2,
    cheapestStore: {
      name: 'Лента',
      price: 44,
      savings: 2,
    },
    aiSummary: {
      summary:
        'Классический заварной ржаной хлеб с кориандром. Традиционная плотная влажная текстура и насыщенный аромат солода.',
      pros: ['Традиционная опара', 'Ароматный кориандр', 'Удобная аккуратная нарезка'],
      cons: ['Быстро сохнет, если оставить пакет приоткрытым'],
      decisionTip: 'Цена стабильная во всех сетях, разница не более 2 ₽.',
    },
    storePrices: [
      {
        store: 'Лента',
        price: 44,
        distance: '1,8 км',
        inStock: true,
        address: 'ул. Красноармейская, 157',
        isCheapest: true,
        mapCoords: { x: 80, y: 22 },
      },
      {
        store: 'Пятёрочка',
        price: 46,
        distance: '200 м',
        inStock: true,
        address: 'ул. Большая Садовая, 42',
        isCurrent: true,
        mapCoords: { x: 38, y: 44 },
      },
      {
        store: 'Магнит',
        price: 48,
        distance: '450 м',
        inStock: true,
        address: 'пр. Ворошиловский, 18',
        mapCoords: { x: 55, y: 35 },
      },
      {
        store: 'ВкусВилл',
        price: 52,
        distance: '800 м',
        inStock: true,
        address: 'ул. Пушкинская, 112',
        mapCoords: { x: 68, y: 50 },
      },
    ],
    nutrition: {
      serving: 'На 100 г',
      calories: 207,
      proteins: 6.8,
      fats: 1.3,
      carbs: 40.7,
    },
    ingredients:
      'Мука ржаная сеяная, мука пшеничная второго сорта, вода, солод ржаной ферментированный, сахар, патока, соль, дрожжи, кориандр.',
    badges: ['Ржаная опара', 'Без консервантов', 'С солодом и кориандром'],
    reviews: [
      {
        id: 'rev-k1',
        userName: 'Ольга Васильева',
        userReputation: 4.6,
        isVerifiedBuyer: true,
        date: '5 дней назад',
        rating: 5,
        pricePaid: 46,
        store: 'Пятёрочка',
        text: 'К борщу и с салом — ничего лучше не придумано. Кориандр свежий, хрустит на корочке.',
        likes: 29,
        commentsCount: 1,
      },
    ],
    isFavorite: false,
    isPopular: false,
    isDiscount: false,
  },
  {
    id: 'eggs-okskoe',
    barcode: '4607008540126',
    name: 'Яйцо куриное Окское С1',
    brand: 'Окское',
    category: 'Бакалея',
    volumeWeight: '10 шт · категория С1',
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    reviewCount: 1840,
    currentStore: {
      name: 'Пятёрочка',
      price: 119,
      distance: '200 м',
      inStock: true,
      timestamp: 'сейчас',
    },
    averagePrice: 124,
    priceDifferencePercent: -4,
    cheapestStore: {
      name: 'Магнит',
      price: 114,
      savings: 5,
    },
    aiSummary: {
      summary:
        'Яркий натуральный желток, прочная чистая скорлупа без перьев и грязи. Дата сортировки всегда нанесена на каждое яйцо.',
      pros: ['Яркий оранжевый желток', 'Чистая скорлупа без трещин', 'Четкая маркировка даты'],
      cons: ['С1 чуть меньше по размеру, чем отборное СО'],
      decisionTip: 'Надежное проверенное качество. Хорошая цена.',
    },
    storePrices: [
      {
        store: 'Магнит',
        price: 114,
        distance: '450 м',
        inStock: true,
        address: 'пр. Ворошиловский, 18',
        isCheapest: true,
        mapCoords: { x: 55, y: 35 },
      },
      {
        store: 'Пятёрочка',
        price: 119,
        distance: '200 м',
        inStock: true,
        address: 'ул. Большая Садовая, 42',
        isCurrent: true,
        mapCoords: { x: 38, y: 44 },
      },
      {
        store: 'Перекрёсток',
        price: 129,
        distance: '1,1 км',
        inStock: true,
        address: 'пр. Будённовский, 49',
        mapCoords: { x: 25, y: 62 },
      },
      {
        store: 'Лента',
        price: 134,
        distance: '1,8 км',
        inStock: true,
        address: 'ул. Красноармейская, 157',
        mapCoords: { x: 80, y: 22 },
      },
    ],
    nutrition: {
      serving: 'На 100 г',
      calories: 157,
      proteins: 12.7,
      fats: 11.5,
      carbs: 0.7,
    },
    ingredients: 'Яйцо куриное пищевое столовое первой категории.',
    badges: ['ГОСТ 31654-2012', 'Яркий желток', 'Контроль свежести'],
    reviews: [
      {
        id: 'rev-e1',
        userName: 'Сергей Баринов',
        userReputation: 4.8,
        isVerifiedBuyer: true,
        date: 'Вчера',
        rating: 5,
        pricePaid: 119,
        store: 'Пятёрочка',
        text: 'Беру только Окские. Всегда чистые, скорлупа крепкая, не разбиваются в пакете по дороге домой.',
        likes: 51,
        commentsCount: 3,
      },
    ],
    isFavorite: true,
    isPopular: true,
    isDiscount: false,
  },
];

export const POPULAR_CITIES = [
  'Ростов-на-Дону',
  'Москва',
  'Санкт-Петербург',
  'Краснодар',
  'Екатеринбург',
  'Казань',
  'Нижний Новгород',
];
