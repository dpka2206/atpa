export const site = {
  name: "Amateur Telangana Pickleball Association",
  shortName: "ATPA",
  tagline: "Growing the Game. Building the Community.",
  mission:
    "Promoting pickleball through tournaments, player development and community participation across Telangana.",
  affiliation: "All India Pickleball Association",
  contact: {
    address: "Ashiana Residency, Kamalapuri Colony, Hyderabad",
    email: "amateurtelanganapickleball@gmail.com",
    phone: "9849194841",
    phoneLabel: "P. Jagan Mohan",
    hours: "Weekdays 10am – 5pm",
    website: "www.amateurtelanganapickleballassociation.org",
  },
  social: {
    facebook: "#",
    instagram: "#",
    youtube: "#",
  },
} as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/tournaments", label: "Tournaments" },
  { href: "/rankings", label: "Rankings & Results" },
  { href: "/players", label: "Players & Membership" },
  { href: "/clubs", label: "Clubs & Courts" },
  { href: "/news", label: "News & Updates" },
  { href: "/about", label: "About ATPA" },
] as const;
