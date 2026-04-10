const LOCATIONS = {
  woodland_fwd:     { label: "Woodland forward window",        x: 437,  y: 329  },
  lares_food:       { label: "Lares food court window",        x: 908,  y: 303  },
  athletic:         { label: "Athletic building balcony",      x: 321,  y: 860  },
  cl_balcony:       { label: "Computer lab / Woodland back",   x: 467,  y: 389  },
  library_main:     { label: "Library main window",            x: 552,  y: 201  },
  library_pond:     { label: "Library pond window",            x: 606,  y: 137  },
  sutherland_plaza: { label: "Sutherland plaza",               x: 971,  y: 531  },
  lares_balcony:    { label: "Lares balcony",                  x: 819,  y: 263  },
  sutherland_front: { label: "Sutherland front",               x: 1013, y: 462  },
  bookstore:        { label: "Bookstore",                      x: 874,  y: 314  },
};

// Map image native dimensions — used for CSS % positioning
const MAP_W = 1182;
const MAP_H = 1096;

// Collision records — preliminaries excluded, "maybe old" included
// season: "fall2024" | "spring2025" | "fall2025"
const RECORDS = [
  // Fall 2024
  { season: "fall2024",   location: "woodland_fwd",     species: "Swift",                    date: new Date(2024, 9,  1) },
  { season: "fall2024",   location: "lares_food",        species: "Ovenbird",                 date: new Date(2024, 9,  2) },
  { season: "fall2024",   location: "athletic",          species: "Mourning Dove",            date: new Date(2024, 9,  2) },
  { season: "fall2024",   location: "lares_food",        species: "Eastern Towhee",           date: new Date(2024, 9,  6) },
  { season: "fall2024",   location: "woodland_fwd",     species: "Sapsucker",                date: new Date(2024, 9, 14) },
  { season: "fall2024",   location: "cl_balcony",        species: "Kinglet",                  date: new Date(2024, 9, 17) },
  { season: "fall2024",   location: "library_main",      species: "American Robin",           date: new Date(2024, 9, 30) },
  { season: "fall2024",   location: "athletic",          species: "Junco",                    date: new Date(2024, 10, 2) },
  { season: "fall2024",   location: "library_pond",      species: "Junco",                    date: new Date(2024, 10, 3) },

  // Spring 2025
  { season: "spring2025", location: "library_main",      species: "Black-and-white Warbler",  date: new Date(2025, 4, 12) },
  { season: "spring2025", location: "cl_balcony",        species: "Black-and-white Warbler",  date: new Date(2025, 4, 20) },

  // Fall 2025
  { season: "fall2025",   location: "athletic",          species: "Ruby-throated Hummingbird", date: new Date(2025, 8, 30) },
  { season: "fall2025",   location: "athletic",          species: "Northern Flicker",          date: new Date(2025, 8, 30) },
  { season: "fall2025",   location: "sutherland_plaza",  species: "Black-and-white Warbler",   date: new Date(2025, 8, 30) },
  { season: "fall2025",   location: "cl_balcony",        species: "Hermit Thrush",             date: new Date(2025, 9, 19) },
  { season: "fall2025",   location: "lares_balcony",     species: "Unknown",                   date: new Date(2025, 9, 27) },
  { season: "fall2025",   location: "sutherland_front",  species: "House Sparrow",             date: new Date(2025, 10,  6) },
  { season: "fall2025",   location: "woodland_fwd",     species: "Golden-crowned Kinglet",    date: new Date(2025, 10, 10) },
  { season: "fall2025",   location: "bookstore",         species: "Hermit Thrush",             date: new Date(2025, 10, 15) },
];
