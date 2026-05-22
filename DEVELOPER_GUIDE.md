# KRES Co. Enhanced Search System - Developer Documentation

## Architecture Overview

The enhanced search system is built on three layers:

```
┌─────────────────────────────────────┐
│     User Input (Search Bar)         │
│        performSearch()              │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│  Filter Application Layer           │
│  getFilteredProducts()              │
│  ├─ Category Filter                 │
│  ├─ Flower Type Filter              │
│  └─ Enhanced Search Filter          │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│  Smart Matching Engine              │
│  matchesEnhancedSearch()            │
│  ├─ matchesFlowerSearch()           │
│  ├─ parseFlowersAndFillers()        │
│  └─ keywordMatches()                │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│  Rendering Layer                    │
│  renderProducts()                   │
│  └─ Display Results or No-Results   │
└─────────────────────────────────────┘
```

## Function Reference

### Core Search Functions

#### `parseFlowersAndFillers(text: string): string[]`

**Purpose**: Convert raw text into an array of individual flower/filler names.

**Input**:
```javascript
"Local Roses, Lilies & Carnation with Eucalyptus"
```

**Output**:
```javascript
['local roses', 'lilies', 'carnation', 'eucalyptus']
```

**Process**:
1. Replace "and", "with", "&" with commas
2. Split by commas
3. Trim and lowercase each item
4. Filter out empty strings

**Code Location**: Line ~1610

---

#### `getProductFlowerData(product): {flowers: [], fillers: []}`

**Purpose**: Extract structured flower and filler data from a product.

**Input**:
```javascript
{
  id: 1,
  name: 'JOY',
  flowers: '3 Local Roses',
  fillers: 'Fillers & Foliage'
}
```

**Output**:
```javascript
{
  flowers: ['3 local roses'],
  fillers: ['fillers', 'foliage']
}
```

**Note**: Parses on-the-fly; can be memoized for performance if needed.

**Code Location**: Line ~1625

---

#### `keywordMatches(keyword: string, flowerData): boolean`

**Purpose**: Check if a keyword (partial match) exists in flowers or fillers.

**Examples**:
```javascript
keywordMatches('sun', {flowers: ['sunflower'], fillers: []})  // true
keywordMatches('baby', {flowers: [], fillers: ["baby's breath"]})  // true
keywordMatches('daisy', {flowers: ['rose'], fillers: []})  // false
```

**Logic**: Substring matching (case-insensitive)
- `keyword.includes()` on each flower/filler item
- Returns true if ANY match found

**Code Location**: Line ~1641

---

#### `matchesFlowerSearch(product, searchQuery: string): boolean`

**Purpose**: PRIMARY SEARCH - Check if product matches ALL keywords in search query.

**Examples**:
```javascript
// Single keyword
matchesFlowerSearch(roseProduct, 'rose')  // true

// Multiple keywords (ALL must match)
matchesFlowerSearch(roseEucalyptusProduct, 'rose eucalyptus')  // true
matchesFlowerSearch(roseEucalyptusProduct, 'rose daisy')  // false

// Empty search
matchesFlowerSearch(anyProduct, '')  // true
```

**Logic**:
1. Split search by spaces → get individual keywords
2. For EACH keyword, call keywordMatches()
3. Return true only if ALL keywords match

**Keyword Logic**: AND (all must match)
```javascript
keywords.every(keyword => keywordMatches(keyword, flowerData))
```

**Code Location**: Line ~1655

---

#### `matchesEnhancedSearch(product, searchQuery: string): boolean`

**Purpose**: WRAPPER FUNCTION - Provides two-tier search:
1. **Primary**: Flower/filler-based search
2. **Fallback**: Product name/description search

**Examples**:
```javascript
// Primary match (flower search)
matchesEnhancedSearch(roseProduct, 'rose')  // true (via matchesFlowerSearch)

// Fallback match (name contains keyword)
matchesEnhancedSearch(productNamed'AMORE', 'amore')  // true (name match)

// No match anywhere
matchesEnhancedSearch(product, 'nonexistent')  // false
```

**Logic**:
```
IF flower search matches → return true
ELSE IF product name/description contains keyword → return true
ELSE → return false
```

**Code Location**: Line ~1685

---

#### `getFilteredProducts(): Product[]`

**Purpose**: Apply all three filters in sequence and return matching products.

**Filters Applied**:
1. **Category Filter**: currentMainCategory (Fresh, Dried, Weddings, Events)
2. **Flower Type Filter**: currentFlowerType (Roses, Tulips, etc.)
3. **Enhanced Search**: searchQuery (user input)

**Logic**:
```javascript
let filtered = allProducts;

// Filter 1: Category
if (currentMainCategory) {
  filtered = filtered.filter(p => p.mainCategory === currentMainCategory)
}

// Filter 2: Flower Type
if (currentFlowerType) {
  filtered = filtered.filter(p => p.flowerType === selectedFlowerType)
}

// Filter 3: Search
if (searchQuery) {
  filtered = filtered.filter(p => matchesEnhancedSearch(p, searchQuery))
}

return filtered;
```

**Code Location**: Line ~1696

---

## Event Flow

### User Interaction: Typing in Search Bar

```
User types "rose" in search input
    ↓
oninput="performSearch()" triggered
    ↓
searchQuery = input.value  // "rose"
currentPage = 1
renderProducts() called
    ↓
getPageProducts() called
    ├─ getFilteredProducts() called
    │   ├─ Apply category filter
    │   ├─ Apply flower type filter
    │   ├─ Apply enhanced search filter
    │   │   └─ matchesEnhancedSearch() for each product
    │   └─ Return matching products
    ├─ Slice for pagination
    └─ Return page products
    ↓
Products rendered or no-results message shown
```

### User Interaction: Clicking Category Filter

```
User clicks "Fresh" button
    ↓
setMainCategory('fresh', button) called
    ↓
currentMainCategory = 'fresh'
currentFlowerType = null  // Reset
currentPage = 1
renderProducts() called (same as above)
    ↓
Products filtered by Fresh category + search query
```

### User Interaction: Clicking Flower Type Filter

```
User clicks "Roses" button (after selecting Fresh)
    ↓
setFlowerType('roses', button) called
    ↓
currentFlowerType = 'roses'
currentPage = 1
renderProducts() called
    ↓
Products filtered by Fresh category + Roses flower type + search query
```

## Data Flow

```
Raw Product Data
├─ id, name, price, image
├─ flowers: "Local Roses, Imported Fillers"
└─ fillers: "Eucalyptus & Foliage"
    ↓
parseFlowersAndFillers()
    ↓
Structured Data
├─ flowers: ['local roses', 'imported fillers']
└─ fillers: ['eucalyptus', 'foliage']
    ↓
matchesFlowerSearch('rose eucalyptus')
    ├─ keywordMatches('rose', flowerData) → true
    └─ keywordMatches('eucalyptus', flowerData) → true
    ↓
Returns: Product matches!
```

## State Management

### Global Variables

```javascript
let currentMainCategory = null;     // 'fresh', 'dried', 'weddings', 'events'
let currentFlowerType = null;       // 'roses', 'tulips', 'lily', etc.
let currentPage = 1;               // Pagination
let searchQuery = '';              // User's search input
const itemsPerPage = 8;            // Pagination size
```

### State Transitions

```
Initial State:
├─ currentMainCategory = null
├─ currentFlowerType = null
├─ currentPage = 1
└─ searchQuery = ''

↓ User types "rose"

Intermediate State:
├─ currentMainCategory = null
├─ currentFlowerType = null
├─ currentPage = 1
└─ searchQuery = 'rose'

↓ User clicks "Fresh"

New State:
├─ currentMainCategory = 'fresh'
├─ currentFlowerType = null  (reset)
├─ currentPage = 1
└─ searchQuery = 'rose'  (preserved)
```

## Performance Considerations

### Current Performance Profile

| Operation | Complexity | Time (49 products) |
|-----------|-----------|------------------|
| Parse flowers/fillers | O(n) | <1ms |
| Single keyword match | O(n*m) | <1ms |
| Multi-keyword search | O(n*k*m) | <2ms |
| Full filtering | O(n*k) | <5ms |
| Rendering | O(n) | <10ms |

Where:
- n = number of products (49)
- k = number of keywords (1-5)
- m = average items per flower/filler (3-5)

### Optimization Opportunities

1. **Memoization** (if searching frequently):
   ```javascript
   const flowerDataCache = new Map();
   
   function getProductFlowerData(product) {
     if (!flowerDataCache.has(product.id)) {
       flowerDataCache.set(product.id, {
         flowers: parseFlowersAndFillers(product.flowers),
         fillers: parseFlowersAndFillers(product.fillers)
       });
     }
     return flowerDataCache.get(product.id);
   }
   ```

2. **Debouncing** (if database grows significantly):
   ```javascript
   let searchTimeout;
   function performSearch() {
     clearTimeout(searchTimeout);
     searchTimeout = setTimeout(() => {
       searchQuery = document.getElementById('searchInput').value;
       currentPage = 1;
       renderProducts();
     }, 300); // 300ms debounce
   }
   ```

3. **Index Filtering** (for large databases):
   - Pre-build flower/filler indices
   - Use Set data structure for O(1) lookups

## Testing

### Unit Test Examples

```javascript
// Test parseFlowersAndFillers
console.assert(
  JSON.stringify(parseFlowersAndFillers("Rose, Lily & Carnation")) 
  === JSON.stringify(['rose', 'lily', 'carnation']),
  'Failed: parseFlowersAndFillers'
);

// Test keywordMatches
const flowerData = {
  flowers: ['rose', 'lily'],
  fillers: ['eucalyptus']
};
console.assert(
  keywordMatches('rose', flowerData) === true,
  'Failed: keywordMatches single match'
);
console.assert(
  keywordMatches('daisy', flowerData) === false,
  'Failed: keywordMatches no match'
);

// Test matchesFlowerSearch (multiple keywords)
const roseEucalyptusProduct = {
  flowers: 'Rose',
  fillers: 'Eucalyptus'
};
console.assert(
  matchesFlowerSearch(roseEucalyptusProduct, 'rose eucalyptus') === true,
  'Failed: multiple keyword match'
);
```

### Integration Test Checklist

- [ ] Search bar updates live (oninput)
- [ ] Single keyword searches work (e.g., "rose")
- [ ] Multiple keyword searches work (e.g., "rose eucalyptus")
- [ ] Partial matching works (e.g., "sun" → "sunflower")
- [ ] Case-insensitive (e.g., "ROSE" → "rose")
- [ ] Category filters work
- [ ] Flower type filters work
- [ ] Search + category filters work together
- [ ] No results show friendly message
- [ ] Pagination works with filtered results
- [ ] Clearing search shows all (in category)
- [ ] Clearing category removes flower type filter

## Maintenance & Updates

### Adding a New Product

The search system automatically works with new products:

```javascript
{
  id: 50,
  name: 'NEW PRODUCT',
  flowers: 'Orchid, Rose',
  fillers: 'Eucalyptus & Ferns',
  // ... other properties
}
```

Search queries that now work:
- "orchid"
- "fern"
- "orchid eucalyptus"
- "rose fern"

### Updating Product Data

No code changes needed. Just update the `flowers` or `fillers` fields:

```javascript
// Before
{ name: 'JOY', flowers: '3 Local Roses', fillers: 'Fillers' }

// After (new filler added)
{ name: 'JOY', flowers: '3 Local Roses', fillers: 'Fillers, Eucalyptus' }
```

Search "eucalyptus" now includes this product.

### Extending Search Functionality

To add new search criteria (e.g., by price, color, season):

```javascript
function matchesAdvancedSearch(product, searchQuery, priceRange, season) {
  // Existing search
  if (!matchesEnhancedSearch(product, searchQuery)) {
    return false;
  }
  
  // Price filter
  if (priceRange && (product.price < priceRange.min || product.price > priceRange.max)) {
    return false;
  }
  
  // Season filter
  if (season && !product.seasons.includes(season)) {
    return false;
  }
  
  return true;
}
```

## Known Limitations

1. **Parsing Limitations**
   - Doesn't understand synonyms (e.g., "roses" vs "rose")
   - Can't handle complex grammar ("roses mixed with lilies")
   - Depends on consistent data formatting

2. **Performance at Scale**
   - Real-time search may lag with 1000+ products
   - Recommendation: Implement debouncing at 500+ products

3. **Search Quality**
   - Depends on quality of `flowers` and `fillers` data
   - Typos in product data affect search results
   - Missing data won't be searchable

## Troubleshooting Guide

| Problem | Cause | Solution |
|---------|-------|----------|
| Search not working | Search bar ID incorrect | Check `id="searchInput"` |
| Wrong results | Flower data not updated | Check `flowers` and `fillers` fields in product data |
| Slow performance | Too many products | Implement memoization or debouncing |
| Case sensitivity issues | Old code still running | Clear browser cache, do hard refresh |
| Filters not working | State variables not updating | Check browser console for errors |

## Version History

### v1.0 (April 27, 2026) - Initial Release
- Multi-keyword search support
- Partial matching for flowers/fillers
- Integration with category and flower-type filters
- Friendly error messages
- Live search functionality

---

**Document Version**: 1.0  
**Last Updated**: April 27, 2026  
**Status**: Production Ready  
**Maintainer**: Development Team
