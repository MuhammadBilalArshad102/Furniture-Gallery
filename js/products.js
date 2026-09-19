/* =============================================================
   PRODUCT & CATEGORY DATA
   All product cards are generated from this array — nothing is
   hardcoded in the HTML.
   ============================================================= */

const CATEGORIES = [
  { id: "all",         label: "All" },
  { id: "living-room", label: "Living Room" },
  { id: "bedroom",     label: "Bedroom" },
  { id: "dining",      label: "Dining" },
  { id: "office",      label: "Office" },
  { id: "lighting",    label: "Lighting" },
  { id: "outdoor",     label: "Outdoor" },
];

const PRODUCTS = [
  {
    id: "p01", name: "Wren Bar Stool", category: "dining", rating: 4,
    price: 129, compareAt: null, badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=700&auto=format&fit=crop",
    description: "A counter-height stool with a molded seat and solid ash legs, finished by hand. Sturdy enough for daily use, light enough to move around the kitchen island.",
    features: ["Solid ash frame with a matte sealant finish", "Molded seat shell rated for daily use", "Footrest ring set at a comfortable height", "Stacks two-high for easy storage"]
  },
  {
    id: "p02", name: "Cage Pendant Lamp", category: "lighting", rating: 5,
    price: 89, compareAt: 110, badge: "Sale",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=700&auto=format&fit=crop",
    description: "An open metal cage pendant that casts warm, dappled light. Pairs well over a dining table or kitchen counter.",
    features: ["Powder-coated steel cage", "Adjustable cord length up to 6 ft", "Compatible with dimmable bulbs (not included)", "Hardwired — professional install recommended"]
  },
  {
    id: "p03", name: "Marlow Corner Table", category: "living-room", rating: 4,
    price: 349, compareAt: null, badge: "",
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=700&auto=format&fit=crop",
    description: "A rounded corner table in solid oak with a single open shelf, sized to tuck beside a sofa or armchair without crowding the room.",
    features: ["Solid oak top and legs", "Open lower shelf for books or baskets", "Rounded edges, no sharp corners", "Levelling feet for uneven floors"]
  },
  {
    id: "p04", name: "Studio Desk Lamp", category: "office", rating: 4,
    price: 79, compareAt: null, badge: "New",
    image: "https://images.unsplash.com/photo-1543198126-42aca41f1f8f?q=80&w=700&auto=format&fit=crop",
    description: "A task lamp with a weighted base and three-step dimming, built for long work sessions without glare.",
    features: ["Three-step touch dimmer", "360° rotating head", "Weighted cast-iron base", "USB-C charging port built into the base"]
  },
  {
    id: "p05", name: "Round Wall Clock", category: "living-room", rating: 5,
    price: 59, compareAt: null, badge: "",
    image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?q=80&w=700&auto=format&fit=crop",
    description: "A minimal wall clock with a walnut frame and a silent, sweeping second hand.",
    features: ["Walnut veneer frame", "Silent sweep movement — no ticking", "Requires 1x AA battery (not included)", "14 in. diameter"]
  },
  {
    id: "p06", name: "Halo Pendant Light", category: "lighting", rating: 4,
    price: 99, compareAt: null, badge: "",
    image: "https://images.unsplash.com/photo-1524634126442-357e0eac3c14?q=80&w=700&auto=format&fit=crop",
    description: "A ring-shaped pendant that throws soft, even light in every direction — a quiet centerpiece for any room.",
    features: ["Aluminum ring diffuser", "Dimmable with a compatible driver", "Adjustable hanging height", "Hardwired — professional install recommended"]
  },
  {
    id: "p07", name: "Kessler 3-Seat Sofa", category: "living-room", rating: 5,
    price: 1249, compareAt: 1450, badge: "Sale",
    image: "https://images.unsplash.com/photo-1567016432779-094069958ea5?q=80&w=700&auto=format&fit=crop",
    description: "Deep-seated and hand-finished, the Kessler is upholstered in brushed velvet over a hardwood frame built for decades of use.",
    features: ["Kiln-dried hardwood frame", "High-density foam and down-blend cushions", "Brushed velvet upholstery, spot clean only", "Solid walnut tapered legs"]
  },
  {
    id: "p08", name: "Windsor Accent Chair", category: "living-room", rating: 4,
    price: 389, compareAt: null, badge: "",
    image: "https://images.unsplash.com/photo-1550254478-ead40cc54513?q=80&w=700&auto=format&fit=crop",
    description: "A compact upholstered armchair with a gently curved back, sized to fit in a reading nook or bedroom corner.",
    features: ["Solid beech legs", "Foam-wrapped webbed seat base", "Removable seat cushion cover", "Assembly required — legs attach in minutes"]
  },
  {
    id: "p09", name: "Alder Platform Bed", category: "bedroom", rating: 5,
    price: 899, compareAt: null, badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=700&auto=format&fit=crop",
    description: "A low-profile platform bed in solid alder with a slatted base — no box spring needed.",
    features: ["Solid alder headboard and frame", "Built-in slat support, no box spring required", "Available in Queen and King", "Tool-assisted assembly, hardware included"]
  },
  {
    id: "p10", name: "Linden Bedside Table", category: "bedroom", rating: 4,
    price: 189, compareAt: null, badge: "",
    image: "https://images.unsplash.com/photo-1591129841117-3adfd313e34f?q=80&w=700&auto=format&fit=crop",
    description: "A compact nightstand with one soft-close drawer and an open lower shelf, matched to the Alder bed frame.",
    features: ["Soft-close drawer glides", "Open lower shelf", "Solid wood top, veneer sides", "Matches the Alder Platform Bed"]
  },
  {
    id: "p11", name: "Elm Dining Table", category: "dining", rating: 5,
    price: 699, compareAt: null, badge: "",
    image: "https://images.unsplash.com/photo-1617104551722-3b2d51366400?q=80&w=700&auto=format&fit=crop",
    description: "Live-edge elm top over a steel trestle base — seats six comfortably.",
    features: ["Solid live-edge elm top", "Powder-coated steel trestle base", "Seats up to 6", "Oil finish — re-oil yearly for best results"]
  },
  {
    id: "p12", name: "Rattan Dining Chair", category: "dining", rating: 4,
    price: 119, compareAt: null, badge: "New",
    image: "https://images.unsplash.com/photo-1519947486511-46149fa0a254?q=80&w=700&auto=format&fit=crop",
    description: "A woven rattan seat on a solid wood frame, light enough to rearrange and sturdy enough for everyday meals.",
    features: ["Hand-woven natural rattan seat", "Solid beech frame", "Stackable for easy storage", "Indoor use recommended"]
  },
  {
    id: "p13", name: "Sable Writing Desk", category: "office", rating: 4,
    price: 379, compareAt: null, badge: "",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=700&auto=format&fit=crop",
    description: "A slim writing desk with a single drawer, sized for small offices and apartment corners.",
    features: ["Single soft-close drawer", "Cable management cutout at the back", "Solid wood legs, veneer top", "40 in. wide — fits tight spaces"]
  },
  {
    id: "p14", name: "Ergo Task Chair", category: "office", rating: 3,
    price: 259, compareAt: null, badge: "",
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?q=80&w=700&auto=format&fit=crop",
    description: "An adjustable task chair with lumbar support, built for full workdays at a desk.",
    features: ["Adjustable lumbar support", "Height and tilt-tension adjustment", "Breathable mesh back", "Rated for up to 275 lb"]
  },
  {
    id: "p15", name: "Bronze Hanging Light", category: "lighting", rating: 5,
    price: 259, compareAt: 320, badge: "Sale",
    image: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=700&auto=format&fit=crop",
    description: "A cluster of bronze pendant shades on staggered cords — a warm, sculptural statement over a table or bar.",
    features: ["Antique bronze finish", "Three staggered pendant heads", "Adjustable cord lengths", "Hardwired — professional install recommended"]
  },
  {
    id: "p16", name: "Teak Outdoor Bench", category: "outdoor", rating: 4,
    price: 349, compareAt: null, badge: "",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=700&auto=format&fit=crop",
    description: "A weather-rated teak bench that silvers gracefully outdoors, or stays golden with annual oiling.",
    features: ["Solid teak construction", "Weather and UV resistant", "Seats two comfortably", "Oil yearly to maintain golden tone, or leave to silver naturally"]
  },
  {
    id: "p17", name: "Canvas Patio Sofa", category: "outdoor", rating: 4,
    price: 899, compareAt: null, badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=700&auto=format&fit=crop",
    description: "A powder-coated aluminum frame sofa with quick-dry cushions, built for patios and covered porches.",
    features: ["Powder-coated aluminum frame — rust resistant", "Quick-dry foam cushions", "Removable, machine-washable covers", "Cover recommended for winter storage"]
  },
  {
    id: "p18", name: "Nordic Wardrobe", category: "bedroom", rating: 5,
    price: 749, compareAt: null, badge: "",
    image: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=700&auto=format&fit=crop",
    description: "A tall two-door wardrobe with a hanging rail and two internal shelves, in a light Nordic oak finish.",
    features: ["Full-width hanging rail", "Two adjustable internal shelves", "Soft-close door hinges", "Tool-assisted assembly, hardware included"]
  },
];
