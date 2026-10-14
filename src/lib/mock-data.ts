// সব placeholder data। Backend ready হলে service.ts থেকে আসবে।
const img = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

export const IMAGES = {
  hero: img("photo-1492684223066-81342ee5ff30", 1100),
  about1: img("photo-1470229722913-7c0e2dbbafd3", 800),
  about2: img("photo-1514525253161-7a46d19cd819", 600),
};

export type EventItem = {
  id: string; title: string; category: string; image: string;
  managerId: string; day: string; month: string; location: string; price: number; going: number;
};

export const EVENTS: EventItem[] = [
  { id: "1", managerId: "m1", title: "Skyline Paint & Party Night", category: "Party", image: img("photo-1540039155733-5bb30b53aa14"), day: "02", month: "Nov", location: "The Old Scarlet, Dhaka", price: 65, going: 420 },
  { id: "2", managerId: "m5", title: "Classic Rock Legends Tour", category: "Concert", image: img("photo-1459749411175-04bf5292ceea"), day: "14", month: "Nov", location: "Army Stadium, Dhaka", price: 90, going: 1280 },
  { id: "3", managerId: "m3", title: "Electric Beach Festival", category: "Festival", image: img("photo-1501281668745-f7f57925c3b4"), day: "28", month: "Nov", location: "Cox's Bazar Beach", price: 120, going: 3100 },
  { id: "4", managerId: "m4", title: "Midnight Club Sessions", category: "Club", image: img("photo-1429962714451-bb934ecdc4ec"), day: "05", month: "Dec", location: "Gulshan Arena, Dhaka", price: 40, going: 260 },
  { id: "5", managerId: "m2", title: "Acoustic Evenings Live", category: "Concert", image: img("photo-1470229722913-7c0e2dbbafd3"), day: "12", month: "Dec", location: "Chattogram Club", price: 35, going: 190 },
];

export type Manager = {
  id: string; name: string; org: string; image: string; events: number; rating: number;
};

export const MANAGERS: Manager[] = [
  { id: "m1", name: "Rafiq Ahmed", org: "Skyline Events", image: img("photo-1507003211169-0a1dd7228f2d", 700), events: 48, rating: 4.9 },
  { id: "m2", name: "Nusrat Jahan", org: "Pulse Productions", image: img("photo-1494790108377-be9c29b29330", 700), events: 36, rating: 4.8 },
  { id: "m3", name: "Tanvir Hasan", org: "Electric Beach Co.", image: img("photo-1500648767791-00dcc994a43e", 700), events: 52, rating: 4.9 },
  { id: "m4", name: "Mim Akter", org: "Nightshift Live", image: img("photo-1438761681033-6461ffad8d80", 700), events: 29, rating: 4.7 },
  { id: "m5", name: "Sabbir Khan", org: "Rock Arena BD", image: img("photo-1472099645785-5658abf4ff4e", 700), events: 41, rating: 4.8 },
];

export const TESTIMONIALS = [
  { name: "Ayesha Rahman", role: "Concert-goer", text: "Booked two front-row tickets in under a minute. The booking code arrived instantly and entry was smooth." },
  { name: "Imran Hossain", role: "Festival fan", text: "I switched the currency to my own and the price was clear from the start. No surprises at checkout." },
  { name: "Farzana Islam", role: "Club night regular", text: "I could message the organiser before the show and got an answer right away. That never happens elsewhere." },
];

export const CATEGORIES = ["Concert", "Festival", "Club", "Party"];

export const BLOGS = [
  { slug: "first-festival-checklist", title: "Your first music festival: what to pack and what to skip", category: "Guides", author: "Nusrat Jahan", date: "10 Oct 2026", read: "5 min", image: img("photo-1501281668745-f7f57925c3b4"),
    excerpt: "A short checklist for a long day outdoors, from tickets to the right shoes.",
    body: ["Arrive early. Gates are calmest in the first hour, and you will have time to find your spot and a water refill point.", "Pack light: phone, power bank, ID, your booking code saved offline and a small bag that fits the venue rules.", "Wear shoes you can stand in for six hours. Everything else is optional."] },
  { slug: "how-booking-codes-work", title: "How your booking code gets you through the gate", category: "Tips", author: "Rafiq Ahmed", date: "02 Oct 2026", read: "3 min", image: img("photo-1540039155733-5bb30b53aa14"),
    excerpt: "Every ticket has one unique code. Here is what happens when it is scanned.",
    body: ["After payment you receive a unique booking code for each ticket. It is stored in your account under My bookings.", "At the gate, staff scan or type the code. It works once, so sharing a screenshot is risky.", "If you lose access, message the event manager from your account and they can verify you."] },
  { slug: "choosing-the-right-seat", title: "Standing, seated or VIP: choosing the right ticket", category: "Guides", author: "Tanvir Hasan", date: "25 Sep 2026", read: "4 min", image: img("photo-1459749411175-04bf5292ceea"),
    excerpt: "Three ticket types, three very different nights. How to pick yours.",
    body: ["Standing tickets put you close to the energy and cost less. Expect a crowd.", "Seated tickets suit longer shows and anyone who wants a clear view without pushing.", "VIP usually adds early entry and a private area. Check what is included before you pay."] },
  { slug: "organiser-stories-nightshift", title: "Inside Nightshift Live: how a club night comes together", category: "Stories", author: "Mim Akter", date: "18 Sep 2026", read: "6 min", image: img("photo-1429962714451-bb934ecdc4ec"),
    excerpt: "Sound checks, guest lists and the last-minute fixes behind a sold-out night.",
    body: ["A club night starts weeks earlier with the venue, the lineup and the ticket plan.", "On the day, the team arrives at noon for sound checks and ends the night at four in the morning.", "Good organisers answer messages quickly. That is the biggest sign of a well-run event."] },
];

export const FAQS = [
  { q: "How do I book a ticket?", a: "Open an event, choose the number of tickets and press Book tickets. After payment you get a unique booking code in My bookings." },
  { q: "Which payment methods do you accept?", a: "Card payments through Stripe. You are redirected to a secure checkout page and returned to us when it is done." },
  { q: "Can I get a refund?", a: "Refund rules are set by each event manager and shown on the event page. Message the manager from your account if you have a question." },
  { q: "I did not receive my booking code.", a: "Open My bookings. If the payment shows as paid but there is no code, wait a minute and refresh, then contact support." },
  { q: "How do I change the language or currency?", a: "Use the language and currency menus in the header. Your choice is remembered on this device." },
  { q: "How can I become an event manager?", a: "Create an account and contact us with your organisation details. After verification an admin upgrades your role." },
];
