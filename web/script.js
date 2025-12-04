const $ = (s) => document.querySelector(s);
const jsonInput = $('#json-input');
const pathInput = $('#path');
const valueInput = $('#value');
const out = {
  result: $('#result-output'),
  type: $('#result-type'),
  info: $('#result-info'),
  error: $('#result-error')
};

// ============================================================================
// COMPREHENSIVE SAMPLE DATA FOR ALL NQJSON v1.1.0 FEATURES
// ============================================================================

const sample = {
  user: {
    id: 123,
    name: "John Doe",
    email: "john@example.com",
    active: true,
    role: "admin",
    profile: {
      age: 30,
      bio: "Software developer",
      interests: ["sports", "music", "coding", "travel"],
      social: {
        twitter: "@johndoe",
        github: "johndoe"
      },
      address: { 
        city: "New York", 
        state: "NY",
        zip: "10001",
        country: "USA"
      }
    },
    settings: {
      theme: "dark",
      notifications: true,
      language: "en"
    }
  },
  scores: [95.5, 87.2, 92.8, 88.5, 91.0, 78.3, 99.1, 85.6],
  nums: [5, 2, 8, 1, 9, 3, 4, 7, 6],
  duplicates: [1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5],
  mixed: ["apple", "banana", "apple", "cherry", "banana", "date"],
  nested: [[1, 2], [3, 4], [5, 6]],
  items: [
    { id: 0, name: "Laptop", price: 999.99, inStock: true, tags: ["electronics", "computers"], rating: 4.5 },
    { id: 1, name: "Mouse", price: 29.99, inStock: true, tags: ["electronics", "accessories"], rating: 4.2 },
    { id: 2, name: "Keyboard", price: 79.99, inStock: false, tags: ["electronics", "accessories"], rating: 4.7 },
    { id: 3, name: "Monitor", price: 349.99, inStock: true, tags: ["electronics", "displays"], rating: 4.8 },
    { id: 4, name: "Headphones", price: 149.99, inStock: true, tags: ["electronics", "audio"], rating: 4.3 }
  ]
};

const docs = {
  // ============================================================================
  // BASIC OPERATIONS - Fundamental path navigation
  // ============================================================================
  default: {
    json: sample,
    examples: [
      { title: '📌 Simple key access', path: 'user.name', note: 'Get a top-level nested value' },
      { title: '📌 Deep nested path', path: 'user.profile.address.city', note: '4 levels deep navigation' },
      { title: '📌 Boolean value', path: 'user.active', note: 'Returns true/false' },
      { title: '📌 Numeric value', path: 'user.id', note: 'Returns number type' },
      { title: '📌 Array by index (dot)', path: 'items.0.name', note: 'First item using dot notation' },
      { title: '📌 Array by index (bracket)', path: 'items[2].price', note: 'Third item using bracket notation' },
      { title: '📌 Last element', path: 'scores|@last', note: 'Use @last modifier to get last element' },
      { title: '📌 Get entire array', path: 'items', note: 'Returns full array' },
      { title: '📌 Get entire object', path: 'user.profile', note: 'Returns nested object' },
      { title: '🆕 Multipath Query', path: 'user.name,user.email,user.role', note: 'v1.1.0: Multiple values in one query' },
    ],
  },

  // ============================================================================
  // ARRAY PROJECTIONS - Map operations across arrays
  // ============================================================================
  projections: {
    json: sample,
    examples: [
      { title: '📊 All item names', path: 'items.#.name', note: 'Project single field from array' },
      { title: '📊 All item prices', path: 'items.#.price', note: 'Get all prices as array' },
      { title: '📊 All ratings', path: 'items.#.rating', note: 'Numeric projections' },
      { title: '📊 Nested array field', path: 'items.#.tags', note: 'Get array of arrays' },
      { title: '📊 First tag of each item', path: 'items.#.tags.0', note: 'Project nested array element' },
      { title: '📊 All interests', path: 'user.profile.interests', note: 'Simple array access' },
      { title: '📊 Count items', path: 'items.#', note: 'Get array length (returns array)' },
      { title: '🆕 Project + Sum', path: 'items.#.price|@sum', note: 'v1.1.0: Sum projected values' },
      { title: '🆕 Project + Average', path: 'items.#.rating|@avg', note: 'v1.1.0: Average of ratings' },
      { title: '🆕 Multi-projection', path: 'items.#.name,items.#.price', note: 'v1.1.0: Multiple projections' },
    ],
  },

  // ============================================================================
  // FILTERS - Conditional queries with comparisons
  // ============================================================================
  filters: {
    json: sample,
    examples: [
      { title: '🔍 Filter: equality', path: 'items[?(@.inStock==true)].name', note: 'Items in stock' },
      { title: '🔍 Filter: greater than', path: 'items[?(@.price>100)].name', note: 'Expensive items (>$100)' },
      { title: '🔍 Filter: less than', path: 'items[?(@.price<50)].name', note: 'Cheap items (<$50)' },
      { title: '🔍 Filter: greater or equal', path: 'items[?(@.rating>=4.5)].name', note: 'Highly rated items' },
      { title: '🔍 Filter: not equal', path: 'items[?(@.inStock!=false)].name', note: 'Available items' },
      { title: '🔍 Filter: string match', path: 'items[?(@.name=="Mouse")].price', note: 'Find specific item' },
      { title: '🔍 Filter: regex', path: 'items[?(@.name=~"^M")].name', note: 'Items starting with M' },
      { title: '🔍 Filter: regex pattern', path: 'items[?(@.name=~"board$")].name', note: 'Items ending with "board"' },
      { title: '🆕 Filter + Sum', path: 'items[?(@.inStock==true)].price|@sum', note: 'v1.1.0: Sum of in-stock items' },
      { title: '🆕 Filter + Count', path: 'items[?(@.price>100)].id', note: 'IDs of expensive items' },
    ],
  },

  // ============================================================================
  // MODIFIERS - v1.1.0 Extended modifiers for arrays
  // ============================================================================
  modifiers: {
    json: sample,
    examples: [
      { title: '🆕 @sum - Total', path: 'scores|@sum', note: 'Sum all numeric values: 718.0' },
      { title: '🆕 @avg - Average', path: 'scores|@avg', note: 'Calculate average: 89.75' },
      { title: '🆕 @min - Minimum', path: 'scores|@min', note: 'Find lowest value: 78.3' },
      { title: '🆕 @max - Maximum', path: 'scores|@max', note: 'Find highest value: 99.1' },
      { title: '🆕 @sort - Sort asc', path: 'nums|@sort', note: 'Sort ascending: [1,2,3,4,5,6,7,8,9]' },
      { title: '🆕 @reverse - Reverse', path: 'nums|@reverse', note: 'Reverse order: [6,7,4,3,9,1,8,2,5]' },
      { title: '🆕 @first - First item', path: 'items|@first', note: 'Get first element' },
      { title: '🆕 @last - Last item', path: 'items|@last', note: 'Get last element' },
      { title: '🆕 @distinct - Unique', path: 'duplicates|@distinct', note: 'Remove duplicates: [1,2,3,4,5]' },
      { title: '🆕 @distinct strings', path: 'mixed|@distinct', note: 'Unique strings' },
      { title: '🆕 @flatten - Flatten', path: 'nested|@flatten', note: 'Flatten nested arrays: [1,2,3,4,5,6]' },
      { title: '🆕 @sort + @reverse', path: 'nums|@sort|@reverse', note: 'Sort then reverse (descending)' },
    ],
  },

  // ============================================================================
  // MULTIPATH - v1.1.0 Query multiple paths at once
  // ============================================================================
  multipath: {
    json: sample,
    examples: [
      { title: '🆕 Basic multipath', path: 'user.name,user.email', note: 'Two fields at once' },
      { title: '🆕 Three fields', path: 'user.name,user.email,user.role', note: 'Get name, email, role' },
      { title: '🆕 Mixed types', path: 'user.id,user.name,user.active', note: 'Number, string, boolean' },
      { title: '🆕 Nested paths', path: 'user.profile.age,user.profile.address.city', note: 'Deep nested multipath' },
      { title: '🆕 Array + scalar', path: 'user.name,scores', note: 'Mix scalar and array' },
      { title: '🆕 With modifiers', path: 'scores|@sum,scores|@avg,scores|@max', note: 'Multiple aggregations' },
      { title: '🆕 Projections combo', path: 'items.#.name,items.#.price', note: 'Multiple projections' },
      { title: '🆕 Stats combo', path: 'items.#.price|@sum,items.#.price|@avg,items.#.price|@min,items.#.price|@max', note: 'Full price statistics' },
      { title: '🆕 User summary', path: 'user.name,user.email,user.profile.age,user.profile.address.city', note: 'Complete user summary' },
      { title: '🆕 Five fields', path: 'user.id,user.name,user.email,user.active,user.role', note: 'Five fields at once' },
    ],
  },

  // ============================================================================
  // E-COMMERCE - Real-world store example
  // ============================================================================
  store: {
    json: {
      store: {
        name: "TechMart",
        location: "San Francisco",
        books: [
          { title: 'Go Programming', author: 'John Doe', price: 29.99, stock: 15, rating: 4.5, categories: ['programming', 'go', 'backend'] },
          { title: 'Web Design Basics', author: 'Jane Smith', price: 19.99, stock: 8, rating: 4.2, categories: ['design', 'web', 'frontend'] },
          { title: 'Data Science with Python', author: 'Bob Wilson', price: 39.99, stock: 12, rating: 4.8, categories: ['programming', 'python', 'data'] },
          { title: 'JavaScript Mastery', author: 'Alice Brown', price: 34.99, stock: 20, rating: 4.6, categories: ['programming', 'javascript', 'frontend'] },
          { title: 'DevOps Handbook', author: 'Charlie Davis', price: 44.99, stock: 5, rating: 4.7, categories: ['devops', 'infrastructure', 'backend'] },
        ],
        electronics: [
          { name: 'Laptop Pro', brand: 'TechBrand', price: 1299.99, stock: 10 },
          { name: 'Wireless Mouse', brand: 'ClickMaster', price: 49.99, stock: 50 },
          { name: '4K Monitor', brand: 'ViewMax', price: 599.99, stock: 15 },
        ]
      }
    },
    examples: [
      { title: '🛒 Store name', path: 'store.name', note: 'Basic access' },
      { title: '🛒 All book titles', path: 'store.books.#.title', note: 'Project book titles' },
      { title: '🛒 Books over $30', path: 'store.books[?(@.price>30)].title', note: 'Filter expensive books' },
      { title: '🛒 High rated books', path: 'store.books[?(@.rating>=4.6)].title', note: 'Rating >= 4.6' },
      { title: '🛒 Low stock books', path: 'store.books[?(@.stock<10)].title', note: 'Stock < 10' },
      { title: '🆕 Total book value', path: 'store.books.#.price|@sum', note: 'Sum all book prices' },
      { title: '🆕 Average book price', path: 'store.books.#.price|@avg', note: 'Average price' },
      { title: '🆕 Cheapest book price', path: 'store.books.#.price|@min', note: 'Minimum price' },
      { title: '🆕 Most expensive', path: 'store.books.#.price|@max', note: 'Maximum price' },
      { title: '🆕 Book stats', path: 'store.books.#.price|@sum,store.books.#.price|@avg,store.books.#.rating|@avg', note: 'Price sum, avg, rating avg' },
      { title: '🆕 Best book', path: 'store.books|@last', note: 'Last book in list' },
      { title: '🆕 Sort by rating', path: 'store.books.#.rating|@sort', note: 'Sorted ratings' },
    ],
  },

  // ============================================================================
  // COMPANY DATA - Employee management example
  // ============================================================================
  employees: {
    json: {
      company: "TechCorp Inc.",
      founded: 2010,
      ceo: "Sarah Johnson",
      employees: [
        { id: 1, name: 'Alice Chen', age: 30, department: 'engineering', role: 'Senior Developer', salary: 95000, active: true, skills: ['go', 'python', 'kubernetes'] },
        { id: 2, name: 'Bob Martinez', age: 25, department: 'marketing', role: 'Marketing Manager', salary: 65000, active: false, skills: ['seo', 'analytics', 'content'] },
        { id: 3, name: 'Charlie Kim', age: 35, department: 'engineering', role: 'Tech Lead', salary: 120000, active: true, skills: ['go', 'rust', 'architecture'] },
        { id: 4, name: 'Diana Patel', age: 28, department: 'engineering', role: 'Developer', salary: 85000, active: true, skills: ['javascript', 'react', 'node'] },
        { id: 5, name: 'Eve Williams', age: 32, department: 'marketing', role: 'Content Lead', salary: 75000, active: true, skills: ['writing', 'editing', 'social'] },
        { id: 6, name: 'Frank Brown', age: 40, department: 'hr', role: 'HR Director', salary: 90000, active: true, skills: ['recruiting', 'training', 'compliance'] },
        { id: 7, name: 'Grace Lee', age: 27, department: 'engineering', role: 'Junior Developer', salary: 70000, active: true, skills: ['python', 'sql', 'testing'] },
      ],
      departments: ['engineering', 'marketing', 'hr', 'finance'],
      budget: { engineering: 500000, marketing: 200000, hr: 100000, finance: 150000 }
    },
    examples: [
      { title: '👥 Company name', path: 'company', note: 'Basic field' },
      { title: '👥 All employee names', path: 'employees.#.name', note: 'Project names' },
      { title: '👥 Active employees', path: 'employees[?(@.active==true)].name', note: 'Filter by active status' },
      { title: '👥 Engineering team', path: 'employees[?(@.department=="engineering")].name', note: 'Filter by department' },
      { title: '👥 Senior staff (age>30)', path: 'employees[?(@.age>30)].name', note: 'Age filter' },
      { title: '👥 High earners', path: 'employees[?(@.salary>=90000)].name', note: 'Salary >= 90k' },
      { title: '🆕 Total payroll', path: 'employees.#.salary|@sum', note: 'Sum all salaries: 600000' },
      { title: '🆕 Average salary', path: 'employees.#.salary|@avg', note: 'Average: ~85714' },
      { title: '🆕 Highest salary', path: 'employees.#.salary|@max', note: 'Max salary: 120000' },
      { title: '🆕 Lowest salary', path: 'employees.#.salary|@min', note: 'Min salary: 65000' },
      { title: '🆕 Youngest age', path: 'employees.#.age|@min', note: 'Youngest: 25' },
      { title: '🆕 Oldest age', path: 'employees.#.age|@max', note: 'Oldest: 40' },
      { title: '🆕 Average age', path: 'employees.#.age|@avg', note: 'Average age' },
      { title: '🆕 Sorted salaries', path: 'employees.#.salary|@sort', note: 'Ascending order' },
      { title: '🆕 Unique departments', path: 'employees.#.department|@distinct', note: 'Distinct depts' },
      { title: '🆕 Employee count', path: 'employees|@last', note: 'Last employee' },
      { title: '🆕 Payroll stats', path: 'employees.#.salary|@sum,employees.#.salary|@avg,employees.#.salary|@min,employees.#.salary|@max', note: 'Full payroll statistics' },
      { title: '🆕 Team summary', path: 'company,ceo,employees.#.salary|@sum', note: 'Company overview' },
    ],
  },

  // ============================================================================
  // ANALYTICS DATA - Metrics and statistics example
  // ============================================================================
  analytics: {
    json: {
      website: "example.com",
      period: "2024-Q4",
      daily_visits: [1250, 1380, 1420, 1100, 980, 1560, 1890, 1720, 1340, 1280, 1450, 1620, 1380, 1290],
      bounce_rates: [0.32, 0.28, 0.35, 0.41, 0.38, 0.25, 0.22, 0.30, 0.33, 0.29, 0.31, 0.27, 0.34, 0.36],
      conversions: [45, 52, 48, 38, 35, 68, 82, 75, 51, 47, 55, 62, 49, 44],
      revenue: [2250.50, 2600.00, 2400.75, 1900.25, 1750.00, 3400.50, 4100.00, 3750.25, 2550.00, 2350.75, 2750.50, 3100.00, 2450.25, 2200.00],
      top_pages: [
        { path: "/home", views: 5420, unique: 3210 },
        { path: "/products", views: 3850, unique: 2340 },
        { path: "/about", views: 1240, unique: 980 },
        { path: "/contact", views: 890, unique: 720 },
        { path: "/blog", views: 2100, unique: 1560 }
      ],
      referrers: ["google", "facebook", "twitter", "linkedin", "direct", "google", "facebook", "direct"]
    },
    examples: [
      { title: '📈 Website name', path: 'website', note: 'Basic field' },
      { title: '📈 All daily visits', path: 'daily_visits', note: 'Full array' },
      { title: '📈 Page paths', path: 'top_pages.#.path', note: 'All page paths' },
      { title: '🆕 Total visits', path: 'daily_visits|@sum', note: 'Sum of daily visits' },
      { title: '🆕 Average daily visits', path: 'daily_visits|@avg', note: 'Average per day' },
      { title: '🆕 Peak visits', path: 'daily_visits|@max', note: 'Highest day: 1890' },
      { title: '🆕 Lowest visits', path: 'daily_visits|@min', note: 'Lowest day: 980' },
      { title: '🆕 Total revenue', path: 'revenue|@sum', note: 'Sum all revenue' },
      { title: '🆕 Average revenue', path: 'revenue|@avg', note: 'Daily average' },
      { title: '🆕 Best revenue day', path: 'revenue|@max', note: 'Highest: 4100.00' },
      { title: '🆕 Total conversions', path: 'conversions|@sum', note: 'Sum conversions' },
      { title: '🆕 Conversion average', path: 'conversions|@avg', note: 'Daily avg' },
      { title: '🆕 Avg bounce rate', path: 'bounce_rates|@avg', note: 'Average bounce' },
      { title: '🆕 Best bounce rate', path: 'bounce_rates|@min', note: 'Lowest bounce: 0.22' },
      { title: '🆕 Sorted visits', path: 'daily_visits|@sort', note: 'Ascending order' },
      { title: '🆕 Top visits desc', path: 'daily_visits|@sort|@reverse', note: 'Descending order' },
      { title: '🆕 Unique referrers', path: 'referrers|@distinct', note: 'Distinct sources' },
      { title: '🆕 Total page views', path: 'top_pages.#.views|@sum', note: 'Sum all page views' },
      { title: '🆕 Full traffic stats', path: 'daily_visits|@sum,daily_visits|@avg,daily_visits|@min,daily_visits|@max', note: 'Complete traffic statistics' },
      { title: '🆕 Revenue overview', path: 'revenue|@sum,revenue|@avg,conversions|@sum', note: 'Revenue and conversions' },
    ],
  },

  // ============================================================================
  // SET & DELETE OPERATIONS - Mutation examples
  // ============================================================================
  mutations: {
    json: {
      config: {
        app: "MyApp",
        version: "1.0.0",
        settings: {
          debug: false,
          maxRetries: 3,
          timeout: 30
        },
        features: ["auth", "logging", "cache"]
      },
      users: [
        { id: 1, name: "Admin", role: "admin" },
        { id: 2, name: "User1", role: "user" }
      ]
    },
    examples: [
      { title: '✏️ Read app name', path: 'config.app', note: 'Get before setting' },
      { title: '✏️ Read version', path: 'config.version', note: 'Current version' },
      { title: '✏️ Read debug flag', path: 'config.settings.debug', note: 'Boolean setting' },
      { title: '✏️ Read features', path: 'config.features', note: 'Array of features' },
      { title: '✏️ Read all users', path: 'users', note: 'User array' },
      { title: '✏️ Read first user', path: 'users.0', note: 'First user object' },
      { title: '💡 SET: Update version', path: 'config.version', note: 'Try SET with value: "2.0.0"' },
      { title: '💡 SET: Enable debug', path: 'config.settings.debug', note: 'Try SET with value: true' },
      { title: '💡 SET: Add new setting', path: 'config.settings.newOption', note: 'Try SET with value: "test"' },
      { title: '💡 SET: Add to array', path: 'config.features.-1', note: 'Append with value: "metrics"' },
      { title: '💡 DELETE: Remove setting', path: 'config.settings.timeout', note: 'Use DELETE button' },
      { title: '💡 DELETE: Remove feature', path: 'config.features.0', note: 'Remove first feature' },
    ],
  },
};

function setJSON(obj) {
  jsonInput.value = JSON.stringify(obj, null, 2);
}

function getJSONBytes() {
  const s = jsonInput.value.trim();
  return new TextEncoder().encode(s);
}

function setResult({ text = 'Ready to query...', type = '—', info = '—', error = '' } = {}) {
  out.result.textContent = text;
  out.type.textContent = type;
  if (out.info) out.info.textContent = info;
  
  // Show/hide error card based on whether there's an error
  const errorCard = $('#error-card');
  if (error) {
    out.error.textContent = error;
    if (errorCard) errorCard.style.display = 'block';
  } else {
    out.error.textContent = '';
    if (errorCard) errorCard.style.display = 'none';
  }
}

function updateStats() {
  const statsEl = $('#json-stats');
  if (statsEl) {
    try {
      const parsed = JSON.parse(jsonInput.value);
      const lines = jsonInput.value.split('\n').length;
      const chars = jsonInput.value.length;
      statsEl.textContent = `${lines} lines, ${chars} chars`;
    } catch {
      statsEl.textContent = 'Invalid JSON';
    }
  }
}

// WASM bridge helpers
function ensureGoRuntime() {
  if (!window.__goInstance) {
    // eslint-disable-next-line no-undef
    const go = new Go();
    window.__goInstance = go;
  }
  return window.__goInstance;
}

let wasmReady = null;
function loadWasm() {
  if (wasmReady) return wasmReady;
  const go = ensureGoRuntime();
  const base = (function(){
    const parts = location.pathname.split('/').filter(Boolean);
    if (parts.length > 0) return '/' + parts[0] + '/';
    return '/';
  })();
  const wasmURL = base + 'main.wasm';
  wasmReady = WebAssembly.instantiateStreaming(fetch(wasmURL), go.importObject)
    .then((result) => {
      go.run(result.instance);
      return true;
    });
  return wasmReady;
}

async function onGet() {
  try {
    await loadWasm();
    const jsonStr = jsonInput.value;
    const data = window.nqjsonGet(jsonStr, pathInput.value);
    if (!data.exists) {
      setResult({ text: 'null (not found)', type: 'null', info: 'Path does not exist in document' });
      return;
    }
    if (data.value !== undefined) {
      const typeInfo = data.type === 'array' ? `array (${Array.isArray(data.value) ? data.value.length : 0} items)` :
                      data.type === 'object' ? `object (${data.value && typeof data.value === 'object' ? Object.keys(data.value).length : 0} keys)` :
                      data.type;
      setResult({ text: JSON.stringify(data.value, null, 2), type: data.type, info: typeInfo });
    } else if (typeof data.string === 'string') {
      setResult({ text: JSON.stringify(data.string), type: data.type, info: `string (${data.string.length} chars)` });
    } else if (typeof data.number === 'number') {
      setResult({ text: String(data.number), type: data.type, info: 'number' });
    } else if (typeof data.bool === 'boolean') {
      setResult({ text: String(data.bool), type: data.type, info: 'boolean' });
    } else {
      setResult({ text: 'null', type: 'null', info: 'null value' });
    }
    updateStats();
  } catch (e) {
    setResult({ error: e.message });
  }
}

async function onSet() {
  try {
    await loadWasm();
    const valueText = valueInput.value.trim();
    if (!valueText) throw new Error('Provide a JSON value to set');
    let parsed;
    try { parsed = JSON.parse(valueText); } catch { throw new Error('Value must be valid JSON'); }
    const resp = window.nqjsonSet(jsonInput.value, pathInput.value, JSON.stringify(parsed));
    if (resp.error) throw new Error(resp.error);
    jsonInput.value = JSON.stringify(JSON.parse(resp.json), null, 2);
    updateStats();
    setResult({ text: 'Value set successfully', type: 'success', info: 'JSON document updated' });
  } catch (e) {
    setResult({ error: e.message });
  }
}

async function onDelete() {
  try {
    await loadWasm();
    const resp = window.nqjsonDelete(jsonInput.value, pathInput.value);
    if (resp.error) throw new Error(resp.error);
    jsonInput.value = JSON.stringify(JSON.parse(resp.json), null, 2);
    updateStats();
    setResult({ text: 'Value deleted successfully', type: 'success', info: 'JSON document updated' });
  } catch (e) {
    setResult({ error: e.message });
  }
}

// Pretty/Compact
$('#btn-pretty').addEventListener('click', () => {
  try { 
    setJSON(JSON.parse(jsonInput.value)); 
    setResult({ text: 'JSON formatted', type: 'success', info: 'Applied pretty formatting' });
  } catch { 
    setResult({ error: 'Invalid JSON' }); 
  }
});
$('#btn-compact').addEventListener('click', () => {
  try { 
    jsonInput.value = JSON.stringify(JSON.parse(jsonInput.value)); 
    updateStats();
    setResult({ text: 'JSON compacted', type: 'success', info: 'Removed formatting' });
  } catch { 
    setResult({ error: 'Invalid JSON' }); 
  }
});

// Clear JSON button
const clearBtn = $('#clear-json');
if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    jsonInput.value = '{}';
    updateStats();
    setResult({ text: 'JSON cleared', type: 'success', info: 'Document reset to empty object' });
  });
}

// Copy JSON button
const copyJsonBtn = $('#copy-json');
if (copyJsonBtn) {
  copyJsonBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(jsonInput.value);
      setResult({ text: 'JSON copied to clipboard', type: 'success', info: 'Document copied' });
    } catch (e) {
      setResult({ error: 'Failed to copy: ' + e.message });
    }
  });
}

// Copy Result button
const copyResultBtn = $('#copy-result');
if (copyResultBtn) {
  copyResultBtn.addEventListener('click', async () => {
    try {
      const resultText = out.result.textContent;
      await navigator.clipboard.writeText(resultText);
      setResult({ text: resultText, type: out.type.textContent, info: 'Result copied to clipboard' });
    } catch (e) {
      setResult({ error: 'Failed to copy: ' + e.message });
    }
  });
}

// JSON input change tracking
jsonInput.addEventListener('input', updateStats);

$('#btn-get').addEventListener('click', onGet);
$('#btn-set').addEventListener('click', onSet);
$('#btn-delete').addEventListener('click', onDelete);

// Initialize
setJSON(sample);
pathInput.value = 'user.profile.address.city';
setResult();
updateStats();

// Examples UI
const exampleList = document.getElementById('example-list');
const docsetButtons = document.querySelectorAll('.dataset-btn');

function renderExamples(key) {
  const set = docs[key] || docs.default;
  setJSON(set.json);
  exampleList.innerHTML = '';
  set.examples.forEach(ex => {
    const el = document.createElement('div');
    el.className = 'example-item';
    el.innerHTML = `
      <div class="example-content">
        <div class="example-title">${ex.title}</div>
        <div class="example-path">${ex.path}</div>
        <div class="example-note">${ex.note || ''}</div>
      </div>
      <div class="actions">
        <button class="btn btn-ghost" data-path="${ex.path}">Try</button>
        <button class="btn btn-ghost" data-copy="${ex.path}">Copy</button>
      </div>
    `;
    exampleList.appendChild(el);
  });

  exampleList.querySelectorAll('[data-path]').forEach(btn => {
    btn.addEventListener('click', () => {
      pathInput.value = btn.getAttribute('data-path');
      onGet();
    });
  });
  exampleList.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', async () => {
      await navigator.clipboard.writeText(btn.getAttribute('data-copy'));
      setResult({ text: 'Path copied to clipboard', type: 'success', info: 'Query path copied' });
    });
  });
}

docsetButtons.forEach(b => b.addEventListener('click', () => {
  // Update active state
  docsetButtons.forEach(btn => btn.classList.remove('active'));
  b.classList.add('active');
  renderExamples(b.dataset.doc);
}));
renderExamples('default');
renderExamples('default');
