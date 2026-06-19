# Billing Method
This feature is responsible for allowing the user to select their prefered billing method. The focus right now is to start of with credit/debit card payemnts and deliver the necessary data to the backend. 

## Flows:
- User goes to prfile -> selects payment options -> Enters in the details.
- Investor hits fund escrow after agreeing to the terms. when both parties confirm terms -> Investor selects or enters payment option -> Backend recieves details.

## Requirments
- User must be able to enter card details. 
- Full card number must never be stored only last 4 digits and expiration date.
- Detail should only be asked for when both parties have agreed to the terms.

## Components

### Payment Method Selector

A dropdown that lets the user select between their saved payments options with an option to let them select an option to manually enter a new method.

Create: `components/billing/payments-selector.tsx`

Requirements:
- Must show saved payment methods(should never display full card only last 4 digits).
- Manually allow user to manually enter payments details via the `payement-details-modal`.


### Payment Details Modal
A model that allows the user to enter in their card information or payment details.

Create: `components/billing/payment-details-modal.tsx`

Requirements:-this should be a sheet that slides up look at the refrence in <!-- Payment Details Modal -->
- I must collect the user's card holder name, card number(Doesn't store the full number, only the last four digits), expiration date, and Address(City, State, Zip code)
- The backend expects this schema:
```
  "model": "BillingMethod",
  "enum": {
    "BillingMethodType": ["CARD", "PAYPAL", "VENMO"]
  },
  "fields": {
    "id":            { "type": "String",  "required": true,  "default": "cuid()", "note": "Primary key" },
    "userId":        { "type": "String",  "required": true,  "note": "FK → User, onDelete: Cascade" },
    "type":          { "type": "BillingMethodType", "required": true },
    "brand":         { "type": "String",  "required": false },
    "last4":         { "type": "String",  "required": false },
    "holderName":    { "type": "String",  "required": false },
    "expMonth":      { "type": "Int",     "required": false },
    "expYear":       { "type": "Int",     "required": false },
    "accountEmail":  { "type": "String",  "required": false },
    "country":       { "type": "String",  "required": false },
    "addressLine1":  { "type": "String",  "required": false },
    "addressLine2":  { "type": "String",  "required": false },
    "city":          { "type": "String",  "required": false },
    "state":         { "type": "String",  "required": false },
    "zipCode":       { "type": "String",  "required": false },
    "isDefault":     { "type": "Boolean", "required": true,  "default": false },
    "createdAt":     { "type": "DateTime","required": true,  "default": "now()" }
  },
  "indexes": [
    { "fields": ["userId"] }
  ]
```
but lets just focus on card for now.

## Payment options Screen
This is where the user goes when they tap in Payment Options quick link in the profile page.  
here is the reftence:
<!DOCTYPE html><html class="light" lang="en" style=""><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0, viewport-fit=cover" name="viewport">
<title>BuildMatch | Payment Settings</title>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "surface": "#F7F9FB",
                        "on-secondary": "#ffffff",
                        "inverse-primary": "#bec6e0",
                        "on-tertiary": "#ffffff",
                        "on-primary-fixed": "#131b2e",
                        "primary-fixed": "#14A800",
                        "surface-container-highest": "#E0E3E5",
                        "on-surface-variant": "#45464d",
                        "on-error": "#ffffff",
                        "on-background": "#0F172A",
                        "inverse-on-surface": "#eff1f3",
                        "on-primary": "#ffffff",
                        "surface-container-lowest": "#FFFFFF",
                        "primary-fixed-dim": "#bec6e0",
                        "surface-bright": "#f7f9fb",
                        "on-tertiary-fixed-variant": "#574425",
                        "error": "#ba1a1a",
                        "tertiary-container": "#FC4B9C",
                        "background": "#f7f9fb",
                        "on-secondary-fixed-variant": "#065300",
                        "inverse-surface": "#2d3133",
                        "surface-container-high": "#e6e8ea",
                        "secondary-fixed-dim": "#BEC6E0",
                        "error-container": "#FFDAD6",
                        "outline": "#76777d",
                        "surface-container-low": "#f2f4f6",
                        "on-error-container": "#93000a",
                        "primary-container": "#0F172A",
                        "on-primary-container": "#7c839b",
                        "secondary": "#14A800",
                        "surface-dim": "#d8dadc",
                        "tertiary-fixed-dim": "#dec29a",
                        "surface-variant": "#e0e3e5",
                        "outline-variant": "#BDCBB3",
                        "on-secondary-container": "#14A800",
                        "tertiary": "#000000",
                        "primary-dark": "#0F172A",
                        "secondary-fixed": "#14A800",
                        "primary": "#0F172A",
                        "on-surface": "#0F172A",
                        "tertiary-fixed": "#fcdeb5",
                        "on-tertiary-fixed": "#271901",
                        "surface-container": "#eceef0",
                        "surface-tint": "#0F172A",
                        "secondary-container": "#14A800",
                        "on-tertiary-container": "#98805d",
                        "on-secondary-fixed": "#012200",
                        "on-primary-fixed-variant": "#3f465c"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "1rem",
                        "2xl": "1.5rem",
                        "3xl": "2rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "margin": "32px",
                        "lg": "24px",
                        "unit": "4px",
                        "sm": "8px",
                        "md": "16px",
                        "xl": "48px",
                        "gutter": "24px"
                    },
                    "fontFamily": {
                        "sans": ["Plus Jakarta Sans", "sans-serif"],
                        "display-md": ["Plus Jakarta Sans"],
                        "headline-lg": ["Plus Jakarta Sans"],
                        "display-lg": ["Plus Jakarta Sans"],
                        "label-md": ["Plus Jakarta Sans"],
                        "display-lg-mobile": ["Plus Jakarta Sans"],
                        "headline-md": ["Plus Jakarta Sans"],
                        "label-lg": ["Plus Jakarta Sans"],
                        "body-lg": ["Plus Jakarta Sans"],
                        "body-md": ["Plus Jakarta Sans"],
                        "headline-sm": ["Plus Jakarta Sans"]
                    }
                },
            },
        }
    </script>
<style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .glass {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
        }
        .bottom-only-focus:focus {
            outline: none;
            border-bottom: 2px solid #14A800;
        }
        .modal-transition {
            transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
        }
        .hidden-modal {
            transform: translateY(100%);
            opacity: 0;
            pointer-events: none;
        }
        .visible-modal {
            transform: translateY(0);
            opacity: 1;
            pointer-events: auto;
        }
        .editorial-line {
            height: 1px;
            background: linear-gradient(90deg, #0F172A 0%, rgba(15, 23, 42, 0) 100%);
        }
    </style>
</head>
<body class="bg-surface text-on-surface min-h-screen flex flex-col overflow-x-hidden selection:bg-secondary/20 relative">
<!-- Watermark Background -->
<div class="fixed top-20 -right-20 pointer-events-none opacity-[0.03] rotate-12 z-0">
<img alt="" class="w-[600px] h-auto" src="https://lh3.googleusercontent.com/aida/AP1WRLugb55SzfFcpxtyfuh3deqRo1vbMLFLh5KYV4VCEd3TmwcdUEZALFsWtySkUca8rB7nRGdjfQ2EnCHJ8LkibkH1ij8OSZ894UTOwbB8hJ8qADhuqZOxcWQQE9SClH-LQhrLC4DeEmeVrY3Wr_pJ3CrgiK9f6LpBTruq4jvdzehnAojiAhEu1qD9ZGHgIVD4ht4w6gp4N2IC4-vykcCygPGpkbqgt9sTzQP_5dZk1GRIXok8dX4gCJPrxsqz">
</div>
<!-- Top App Bar -->
<header class="docked full-width top-0 sticky z-50 glass border-b border-on-background/5 flex justify-between items-center w-full px-lg py-md">
<div class="flex items-center gap-sm">
<h1 class="font-bold text-lg text-primary tracking-tighter uppercase italic">BuildMatch</h1>
</div>
<div class="w-10 h-10 rounded-full bg-surface-container-high ring-1 ring-on-background/5 flex items-center justify-center overflow-hidden">
<img class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUD0TBJScWWpZEdW1AzeT2e0k7xKd711mmy0MKA4VJIKIdwGmN4fCUc7l3dkeOIfiYVQ4GBtTdWMUW73E7gYATf2dp7WRqGUR-anrYvJVc-Ui35UZCiDFWypbMfODpm81oZgttrnmzoGD8Mm97WP_ouYpIyWs80aIcMCKebD_mxUVB8h-Md4uIKKhnp0ErWN7XISWb_OgXOJU8m1A8OoX8JbFOcS1zk_zc4i4uH9UFLXd3w_X45Eg-J51ZFV80DKyR9B5M3MCgzfke">
</div>
</header>
<main class="flex-1 p-lg max-w-md mx-auto w-full space-y-xl relative z-10">
<!-- Welcome Section -->
<section class="space-y-md pt-md">

<h2 class="text-5xl font-extrabold text-primary leading-[0.9] tracking-tighter uppercase">Payment Methods</h2>
<p class="text-sm text-on-surface-variant/80 max-w-[280px] leading-relaxed">Manage your premium architectural project funding sources with clinical precision.</p>
</section>
<!-- Payment Method Selector Section -->
<section class="space-y-lg">
<div class="flex justify-between items-end">
<label class="text-[10px] font-black text-primary uppercase tracking-widest opacity-40">Primary Gateway</label>
<div class="editorial-line flex-1 ml-lg mb-[6px]"></div>
</div>
<div class="relative" id="payment-selector">
<div class="glass p-lg rounded-2xl shadow-xl shadow-on-background/5 flex items-center justify-between group cursor-pointer transition-all active:scale-[0.97] border border-white/40">
<div class="flex items-center gap-lg">
<div class="w-14 h-9 bg-primary flex items-center justify-center rounded-md">
<span class="text-[8px] text-white font-black tracking-widest">VISA</span>
</div>
<div>
<p class="text-lg font-bold text-primary tracking-tight italic">Ending in 4242</p>
<p class="text-[10px] font-medium text-on-surface-variant tracking-widest uppercase">Valid thru 12/26</p>
</div>
</div>
<span class="material-symbols-outlined text-primary font-bold">keyboard_arrow_down</span>
</div>
<!-- Dropdown List -->
<div class="mt-sm glass rounded-2xl overflow-hidden hidden border border-white/40 shadow-2xl" id="payment-dropdown">
<div class="p-lg hover:bg-white/50 flex items-center justify-between group transition-colors">
<div class="flex items-center gap-lg">
<div class="w-10 h-6 bg-on-background/5 rounded flex items-center justify-center">
<span class="text-[6px] font-black tracking-widest">MC</span>
</div>
<p class="text-sm font-semibold tracking-tight italic">Mastercard •••• 8890</p>
</div>
<span class="material-symbols-outlined text-secondary text-lg">verified</span>
</div>
<button class="w-full p-lg flex items-center gap-md text-secondary bg-secondary/5 hover:bg-secondary/10 transition-colors" onclick="toggleModal(true)">
<span class="material-symbols-outlined">add</span>
<span class="text-xs font-black uppercase tracking-widest">Enroll New Asset</span>
</button>
</div>
</div>
</section>
<!-- Editorial Billing Summary -->
<section class="grid grid-cols-2 gap-md">
<div class="col-span-2 p-lg bg-surface-container-low rounded-3xl space-y-lg">
  <div class="flex justify-between items-center">
    <p class="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Recent Transactions</p>
    <span class="material-symbols-outlined text-on-surface-variant/40 text-lg">receipt_long</span>
  </div>
  <div class="space-y-md">
    <div class="flex justify-between items-center">
      <div>
        <p class="text-sm font-bold text-primary italic">Escrow Funding - Project X</p>
        <p class="text-[10px] font-medium text-on-surface-variant/60 uppercase tracking-widest">Oct 24, 2026</p>
      </div>
      <span class="text-sm font-extrabold text-primary">-$2,500.00</span>
    </div>
    <div class="h-[1px] bg-on-background/5"></div>
    <div class="flex justify-between items-center">
      <div>
        <p class="text-sm font-bold text-primary italic">Material Procurement - Steel</p>
        <p class="text-[10px] font-medium text-on-surface-variant/60 uppercase tracking-widest">Oct 22, 2026</p>
      </div>
      <span class="text-sm font-extrabold text-primary">-$8,120.00</span>
    </div>
    <div class="h-[1px] bg-on-background/5"></div>
    <div class="flex justify-between items-center">
      <div>
        <p class="text-sm font-bold text-primary italic">Consultancy Fee - Structural</p>
        <p class="text-[10px] font-medium text-on-surface-variant/60 uppercase tracking-widest">Oct 19, 2026</p>
      </div>
      <span class="text-sm font-extrabold text-primary">-$1,830.00</span>
    </div>
  </div>
</div>
<div class="p-lg glass rounded-3xl border border-white/40 space-y-md">
<span class="material-symbols-outlined text-secondary font-bold">verified_user</span>
<div>
<p class="text-[9px] font-black text-primary uppercase tracking-widest">Status</p>
<p class="text-xs font-bold italic">Auto-pay active</p>
</div>
</div>
<div class="p-lg bg-on-background text-white rounded-3xl space-y-md">
<span class="material-symbols-outlined text-secondary-fixed">history_edu</span>
<div>
<p class="text-[9px] font-black text-secondary-fixed uppercase tracking-widest">Archive</p>
<p class="text-xs font-bold italic">24 Invoices</p>
</div>
</div>
</section>
</main>
<!-- Payment Details Modal -->
<div class="fixed inset-0 z-[100] flex items-end justify-center hidden-modal modal-transition" id="payment-modal">
<div class="absolute inset-0 bg-on-background/40 backdrop-blur-sm" onclick="toggleModal(false)"></div>
<div class="glass w-full max-w-lg rounded-t-[3rem] p-xl shadow-2xl relative z-10 max-h-[95vh] overflow-y-auto border-t border-white/60">
<div class="flex justify-between items-start mb-xl">
<div class="space-y-md">
<div class="flex items-center gap-sm">
<span class="w-6 h-[2px] bg-secondary"></span>
<p class="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">New Protocol</p>
</div>
<h3 class="text-4xl font-extrabold text-primary leading-none uppercase tracking-tighter">SPEAK YOUR<br>TRUTH</h3>
</div>
<button class="w-12 h-12 rounded-full bg-on-background/5 flex items-center justify-center hover:bg-on-background/10 transition-colors" onclick="toggleModal(false)">
<span class="material-symbols-outlined">close</span>
</button>
</div>
<form class="space-y-xl" onsubmit="event.preventDefault(); toggleModal(false);">
<!-- Cardholder Name -->
<div class="space-y-sm">
<label class="text-[10px] font-black text-primary uppercase tracking-[0.2em] opacity-40">Identity on Card</label>
<input class="w-full bg-transparent px-0 py-lg border-0 border-b border-on-background/10 bottom-only-focus text-xl font-bold italic tracking-tight placeholder:opacity-20" placeholder="ALEXANDER VANGUARD" type="text">
</div>
<!-- Card Number -->
<div class="space-y-sm relative">
<label class="text-[10px] font-black text-primary uppercase tracking-[0.2em] opacity-40">Financial Token</label>
<div class="relative">
<input class="w-full bg-transparent px-0 py-lg border-0 border-b border-on-background/10 bottom-only-focus text-xl font-bold tracking-[0.2em] placeholder:opacity-20" placeholder="•••• •••• •••• 4242" type="text">
<div class="absolute right-0 top-1/2 -translate-y-1/2">
<span class="material-symbols-outlined text-primary/20">lock</span>
</div>
</div>
</div>
<!-- Expiry and CVV Row -->
<div class="grid grid-cols-2 gap-xl">
<div class="space-y-sm">
<label class="text-[10px] font-black text-primary uppercase tracking-[0.2em] opacity-40">Horizon</label>
<input class="w-full bg-transparent px-0 py-lg border-0 border-b border-on-background/10 bottom-only-focus text-xl font-bold tracking-widest placeholder:opacity-20" placeholder="MM / YY" type="text">
</div>
<div class="space-y-sm">
<label class="text-[10px] font-black text-primary uppercase tracking-[0.2em] opacity-40">Signature Code</label>
<input class="w-full bg-transparent px-0 py-lg border-0 border-b border-on-background/10 bottom-only-focus text-xl font-bold tracking-[0.5em] placeholder:opacity-20" placeholder="•••" type="password">
</div>
</div>
<!-- Address Cluster -->
<div class="pt-md space-y-lg">
<div class="flex items-center gap-md">
<p class="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Domicile</p>
<div class="flex-1 h-[1px] bg-on-background/5"></div>
</div>
<div class="space-y-sm">
<label class="text-[9px] font-bold text-on-surface-variant/60 uppercase tracking-widest">Street Address</label>
<input class="w-full bg-transparent px-0 py-md border-0 border-b border-on-background/10 bottom-only-focus text-lg font-medium italic" placeholder="1200 Architect Boulevard" type="text">
</div>
<div class="grid grid-cols-3 gap-lg">
<div class="col-span-1 space-y-sm">
<label class="text-[9px] font-bold text-on-surface-variant/60 uppercase tracking-widest">City</label>
<input class="w-full bg-transparent px-0 py-md border-0 border-b border-on-background/10 bottom-only-focus text-lg font-medium italic" placeholder="Chicago" type="text">
</div>
<div class="col-span-1 space-y-sm">
<label class="text-[9px] font-bold text-on-surface-variant/60 uppercase tracking-widest">State</label>
<input class="w-full bg-transparent px-0 py-md border-0 border-b border-on-background/10 bottom-only-focus text-lg font-medium italic" placeholder="IL" type="text">
</div>
<div class="col-span-1 space-y-sm">
<label class="text-[9px] font-bold text-on-surface-variant/60 uppercase tracking-widest">Postal</label>
<input class="w-full bg-transparent px-0 py-md border-0 border-b border-on-background/10 bottom-only-focus text-lg font-medium italic" placeholder="60601" type="text">
</div>
</div>
</div>
<!-- Action Button -->
<button class="w-full bg-on-background text-white py-xl rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl hover:bg-primary transition-all active:scale-95 mt-lg" type="submit">
                    Authorize &amp; Authenticate
                </button>
</form>
</div>
</div>
<script>
        const paymentSelector = document.getElementById('payment-selector');
        const paymentDropdown = document.getElementById('payment-dropdown');
        const paymentModal = document.getElementById('payment-modal');

        paymentSelector.addEventListener('click', (e) => {
            if (e.target.closest('button')) return;
            paymentDropdown.classList.toggle('hidden');
        });

        function toggleModal(show) {
            if (show) {
                paymentModal.classList.remove('hidden-modal');
                paymentModal.classList.add('visible-modal');
                paymentDropdown.classList.add('hidden');
                document.body.style.overflow = 'hidden';
            } else {
                paymentModal.classList.add('hidden-modal');
                paymentModal.classList.remove('visible-modal');
                document.body.style.overflow = 'auto';
            }
        }

        // Close modal on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') toggleModal(false);
        });
    </script>




</body></html>