export interface AttackTiming {
  attackId: string;
  hourly: number[];   // length 24, hour 0-23, values 0-100 (relative frequency)
  daily: number[];    // length 7, index 0=Sunday, values 0-100
  monthly: number[];  // length 12, index 0=January, values 0-100
}

export const ATTACK_TIMINGS: AttackTiming[] = [
  {
    attackId: "phishing",
    // Peaks Mon-Fri 8-11am, low nights/weekends
    hourly: [10, 8, 7, 6, 8, 15, 30, 55, 85, 100, 95, 80, 65, 70, 75, 68, 55, 40, 30, 22, 18, 15, 12, 10],
    // Low Sun/Sat, peak Mon-Fri
    daily: [15, 95, 90, 88, 92, 85, 18],
    // Peaks Jan, Mar, Apr, Sep, Oct, Nov
    monthly: [90, 55, 85, 88, 60, 50, 45, 50, 87, 92, 95, 60],
  },
  {
    attackId: "ransomware",
    // Peaks Fri evening 16-18, then stays elevated for weekend deploy
    hourly: [35, 30, 28, 25, 28, 32, 40, 50, 60, 65, 62, 60, 58, 60, 65, 80, 95, 100, 88, 75, 65, 55, 45, 38],
    // Peaks Fri, elevated Sat/Sun for deployment
    daily: [70, 55, 60, 62, 65, 100, 80],
    // Peaks Jan, Mar, Jul, Nov
    monthly: [90, 60, 88, 55, 58, 60, 85, 55, 65, 62, 88, 70],
  },
  {
    attackId: "sqli",
    // Mixed: business hours and hacker late nights
    hourly: [55, 50, 48, 45, 42, 45, 52, 65, 80, 88, 90, 88, 82, 85, 87, 85, 80, 75, 72, 70, 72, 75, 70, 62],
    // Business days higher, some weekend activity
    daily: [55, 85, 88, 90, 88, 85, 58],
    // Fairly even, slight peaks during major vulnerability disclosures
    monthly: [75, 70, 78, 80, 72, 68, 70, 72, 78, 80, 75, 70],
  },
  {
    attackId: "ddos",
    // Peaks evenings 18-22
    hourly: [40, 35, 32, 30, 28, 30, 35, 42, 52, 58, 60, 58, 55, 55, 58, 62, 68, 78, 90, 100, 95, 85, 68, 52],
    // Peaks weekends (gaming, holiday events) and Mon
    daily: [88, 72, 65, 68, 65, 75, 92],
    // Peaks Jan, Jul, Dec (holidays, gaming events)
    monthly: [92, 65, 68, 62, 60, 65, 88, 70, 65, 68, 72, 95],
  },
  {
    attackId: "mitm",
    // Business hours and evenings
    hourly: [30, 25, 22, 20, 22, 28, 40, 58, 75, 82, 85, 82, 78, 80, 82, 80, 78, 75, 70, 65, 58, 50, 42, 35],
    // Weekdays higher
    daily: [50, 82, 85, 88, 85, 80, 52],
    // Fairly even
    monthly: [72, 68, 75, 78, 72, 68, 65, 68, 75, 78, 72, 68],
  },
  {
    attackId: "xss",
    // Business hours and hacker nights
    hourly: [52, 48, 45, 42, 40, 44, 52, 65, 78, 88, 90, 88, 82, 84, 86, 84, 80, 76, 73, 70, 72, 73, 68, 60],
    // Slightly higher on weekdays
    daily: [58, 82, 85, 88, 85, 82, 60],
    // Even distribution
    monthly: [75, 70, 78, 80, 72, 70, 72, 74, 78, 82, 76, 72],
  },
  {
    attackId: "zero-day",
    // Business hours Mon-Fri, researchers and APTs work normal hours
    hourly: [20, 18, 15, 14, 15, 20, 30, 50, 72, 85, 90, 88, 82, 85, 88, 85, 78, 68, 58, 48, 38, 30, 24, 20],
    // Strictly business days
    daily: [20, 88, 92, 95, 92, 85, 22],
    // Peaks around Patch Tuesday (Jan, Mar, Apr, Sep)
    monthly: [85, 70, 88, 90, 72, 65, 68, 72, 88, 80, 75, 65],
  },
  {
    attackId: "social-engineering",
    // Business hours Mon-Thu, low weekends
    hourly: [10, 8, 7, 6, 8, 15, 30, 55, 82, 92, 90, 85, 75, 80, 82, 78, 68, 52, 38, 28, 20, 15, 12, 10],
    // Mon-Thu peak, Fri lower, very low weekends
    daily: [12, 90, 92, 95, 90, 60, 15],
    // Even with slight peaks in Q1/Q4
    monthly: [85, 70, 75, 78, 68, 60, 58, 60, 72, 80, 85, 75],
  },
  {
    attackId: "credential-stuffing",
    // Peaks late night 22-04, automated but also higher when defenses low
    hourly: [88, 92, 88, 85, 80, 65, 50, 42, 38, 35, 35, 35, 36, 36, 38, 40, 42, 48, 56, 65, 76, 85, 92, 95],
    // Runs 24/7, slightly lower on weekdays when security teams are active
    daily: [78, 65, 62, 60, 62, 65, 80],
    // Even distribution, slight peak after major breaches
    monthly: [78, 70, 75, 72, 68, 70, 72, 75, 78, 80, 76, 72],
  },
  {
    attackId: "csrf",
    // Business hours when users are active
    hourly: [20, 16, 14, 12, 14, 20, 32, 52, 72, 85, 88, 85, 78, 80, 82, 80, 75, 68, 60, 52, 42, 34, 26, 22],
    // Weekdays
    daily: [35, 85, 88, 90, 88, 82, 38],
    // Even
    monthly: [70, 65, 72, 75, 70, 65, 65, 68, 72, 75, 70, 65],
  },
  {
    attackId: "dns-spoofing",
    // Business hours and evenings
    hourly: [32, 28, 25, 22, 24, 30, 42, 60, 75, 85, 88, 85, 80, 82, 84, 82, 78, 74, 68, 62, 56, 48, 40, 35],
    // Weekdays higher
    daily: [52, 80, 84, 86, 84, 80, 54],
    // Even
    monthly: [72, 68, 74, 76, 70, 66, 68, 70, 74, 76, 72, 68],
  },
  {
    attackId: "arp-spoofing",
    // Business hours and evenings, network-based
    hourly: [28, 24, 22, 20, 22, 28, 40, 56, 72, 82, 85, 82, 78, 80, 82, 80, 76, 72, 66, 60, 54, 46, 38, 32],
    // Weekdays
    daily: [48, 80, 84, 86, 84, 78, 50],
    // Even
    monthly: [70, 66, 72, 74, 68, 64, 66, 68, 72, 74, 70, 66],
  },
  {
    attackId: "clickjacking",
    // Business hours when users are browsing
    hourly: [18, 15, 12, 10, 12, 18, 30, 50, 70, 82, 85, 82, 76, 78, 80, 78, 72, 65, 56, 48, 38, 30, 24, 20],
    // Weekdays
    daily: [40, 82, 86, 88, 86, 80, 42],
    // Even
    monthly: [68, 62, 70, 72, 66, 62, 64, 66, 70, 72, 68, 64],
  },
  {
    attackId: "rainbow-table",
    // Compute-intensive, runs at night when idle resources available
    hourly: [95, 100, 98, 96, 92, 82, 60, 42, 35, 30, 28, 28, 30, 30, 32, 35, 38, 44, 52, 62, 72, 80, 88, 94],
    // Runs any day, slightly less during business hours
    daily: [82, 65, 62, 60, 62, 68, 85],
    // Even
    monthly: [72, 68, 72, 70, 68, 66, 68, 70, 72, 72, 70, 68],
  },
  {
    attackId: "cloud-misconfig",
    // No clear pattern, uniform with slight business hour peak
    hourly: [55, 52, 50, 48, 50, 54, 60, 68, 78, 85, 88, 86, 82, 83, 85, 83, 80, 76, 72, 68, 64, 62, 58, 56],
    // Slight weekday peak
    daily: [65, 80, 82, 84, 82, 78, 65],
    // Even
    monthly: [72, 68, 74, 76, 70, 68, 70, 72, 74, 76, 72, 68],
  },
  {
    attackId: "insider-threat",
    // Strict business hours Mon-Fri 9-17
    hourly: [5, 4, 4, 4, 5, 8, 15, 30, 55, 90, 95, 92, 85, 88, 90, 85, 78, 55, 25, 12, 8, 7, 6, 5],
    // Mon-Fri only, very low weekends
    daily: [8, 90, 92, 95, 90, 88, 10],
    // Slightly more during budget/review periods
    monthly: [75, 70, 78, 80, 72, 68, 65, 70, 78, 80, 75, 70],
  },
  {
    attackId: "mobile-malware",
    // Evenings 19-23 when people use phones, weekends higher
    hourly: [45, 38, 32, 28, 25, 22, 24, 28, 35, 42, 48, 50, 52, 52, 55, 58, 62, 68, 75, 90, 100, 95, 82, 62],
    // Weekends higher
    daily: [88, 60, 58, 60, 58, 65, 92],
    // Even
    monthly: [70, 65, 70, 72, 68, 72, 75, 78, 72, 70, 68, 72],
  },
  {
    attackId: "bec",
    // Peak Mon-Fri 8-11am like phishing
    hourly: [8, 6, 5, 5, 6, 12, 28, 52, 82, 98, 100, 92, 78, 80, 82, 75, 62, 48, 35, 25, 18, 14, 10, 8],
    // Mon-Fri peak
    daily: [12, 92, 95, 98, 95, 88, 15],
    // Q1 and Q4 peaks (financial year end/start, tax season)
    monthly: [95, 72, 85, 88, 68, 58, 55, 58, 82, 90, 95, 78],
  },
  {
    attackId: "jwt-attack",
    // Business hours and hacker nights
    hourly: [50, 46, 42, 40, 40, 44, 52, 65, 78, 88, 90, 88, 82, 84, 86, 84, 80, 75, 70, 68, 68, 70, 65, 56],
    // Weekdays higher
    daily: [55, 82, 86, 88, 86, 82, 58],
    // Even
    monthly: [72, 68, 74, 76, 70, 68, 70, 72, 74, 76, 72, 68],
  },
  {
    attackId: "cryptojacking",
    // Nearly flat all day, slightly higher at night when systems idle
    hourly: [75, 78, 80, 82, 80, 76, 70, 65, 60, 58, 57, 57, 58, 58, 59, 60, 62, 65, 68, 70, 72, 74, 76, 76],
    // Flat across days
    daily: [72, 68, 68, 68, 68, 70, 74],
    // Even
    monthly: [70, 68, 70, 70, 68, 68, 70, 70, 70, 70, 68, 70],
  },
  {
    attackId: "keylogger",
    // Business hours when users are typing, slight evening peak
    hourly: [20, 16, 14, 12, 14, 20, 32, 52, 75, 88, 90, 88, 82, 84, 86, 84, 78, 70, 62, 55, 46, 38, 28, 22],
    // Weekdays higher
    daily: [42, 84, 88, 90, 88, 82, 45],
    // Even
    monthly: [72, 66, 74, 76, 70, 66, 66, 68, 72, 76, 72, 68],
  },
  {
    attackId: "qrishing",
    // Business hours, physical context (people at work/out)
    hourly: [10, 8, 7, 6, 8, 14, 28, 50, 75, 88, 90, 86, 78, 80, 82, 78, 70, 62, 52, 42, 32, 24, 16, 12],
    // Weekdays peak, some weekend
    daily: [38, 85, 88, 90, 88, 82, 42],
    // Even
    monthly: [70, 65, 72, 74, 68, 64, 65, 68, 72, 74, 70, 66],
  },
  {
    attackId: "tailgating",
    // Business hours Mon-Thu when offices are occupied
    hourly: [5, 4, 4, 3, 5, 10, 22, 50, 80, 92, 88, 75, 68, 72, 80, 78, 65, 45, 25, 14, 8, 6, 5, 5],
    // Mon-Thu peak, very low weekends
    daily: [10, 90, 92, 95, 88, 55, 12],
    // Even
    monthly: [72, 68, 74, 76, 70, 64, 62, 64, 72, 76, 74, 68],
  },
  {
    attackId: "bad-usb",
    // Business hours, requires physical access
    hourly: [8, 6, 5, 5, 6, 12, 25, 48, 78, 90, 88, 82, 75, 78, 80, 76, 66, 50, 32, 20, 12, 10, 8, 8],
    // Mon-Thu peak
    daily: [12, 88, 90, 92, 88, 58, 14],
    // Even
    monthly: [70, 66, 72, 74, 68, 62, 62, 64, 70, 74, 72, 66],
  },
  {
    attackId: "sim-swapping",
    // Business hours when carriers are open (9-17)
    hourly: [5, 4, 4, 4, 5, 8, 16, 35, 65, 90, 95, 92, 85, 86, 88, 84, 72, 50, 25, 14, 10, 8, 6, 5],
    // Mon-Fri
    daily: [15, 88, 90, 92, 90, 85, 18],
    // Even
    monthly: [72, 66, 72, 74, 68, 64, 64, 66, 72, 74, 72, 68],
  },
  {
    attackId: "watering-hole",
    // Business hours when targets browse
    hourly: [18, 14, 12, 10, 12, 18, 30, 50, 72, 85, 88, 85, 80, 82, 84, 82, 76, 68, 58, 48, 38, 30, 24, 20],
    // Weekdays
    daily: [38, 82, 86, 88, 86, 80, 40],
    // Even
    monthly: [70, 66, 72, 74, 68, 65, 66, 68, 72, 74, 70, 66],
  },
  {
    attackId: "supply-chain",
    // Business hours Mon-Fri, developer activity hours
    hourly: [15, 12, 10, 8, 10, 15, 28, 50, 75, 88, 92, 90, 84, 86, 88, 85, 78, 65, 52, 40, 30, 24, 18, 15],
    // Mon-Fri
    daily: [20, 88, 92, 95, 92, 85, 22],
    // Slight peaks after major disclosure events
    monthly: [80, 70, 82, 85, 72, 68, 70, 72, 82, 80, 78, 70],
  },
  {
    attackId: "log4shell",
    // Business hours and active exploitation around the clock during active campaigns
    hourly: [60, 58, 55, 52, 55, 60, 68, 78, 88, 95, 98, 95, 90, 92, 94, 92, 88, 84, 80, 76, 72, 70, 66, 62],
    // Active all week, slight weekday peak
    daily: [78, 88, 90, 92, 90, 88, 80],
    // Concentrated in Dec 2021 (index 11) and following months
    monthly: [95, 88, 80, 72, 65, 60, 58, 60, 65, 70, 75, 100],
  },
  {
    attackId: "ssrf",
    // Business hours and hacker nights
    hourly: [50, 46, 42, 40, 40, 44, 54, 66, 80, 90, 92, 90, 84, 86, 88, 86, 82, 76, 72, 68, 68, 70, 64, 56],
    // Weekdays higher
    daily: [55, 84, 88, 90, 88, 84, 58],
    // Even
    monthly: [74, 70, 76, 78, 72, 68, 70, 72, 76, 78, 74, 70],
  },
  {
    attackId: "fileless-malware",
    // Late nights 1-5am when admins sleep
    hourly: [72, 88, 95, 100, 98, 90, 72, 52, 40, 35, 32, 30, 30, 30, 32, 34, 36, 40, 48, 58, 65, 70, 74, 74],
    // Any day
    daily: [72, 68, 65, 65, 65, 68, 74],
    // Even
    monthly: [70, 66, 70, 70, 66, 65, 65, 66, 68, 70, 68, 66],
  },
  {
    attackId: "ssti",
    // Business hours and hacker nights
    hourly: [50, 46, 42, 40, 40, 44, 52, 65, 79, 88, 90, 88, 82, 84, 86, 84, 80, 75, 70, 68, 68, 70, 65, 56],
    // Weekdays
    daily: [55, 82, 86, 88, 86, 82, 58],
    // Even
    monthly: [72, 68, 74, 76, 70, 68, 70, 72, 74, 76, 72, 68],
  },
  {
    attackId: "rootkit",
    // Late nights 1-5am when admins sleep
    hourly: [68, 85, 95, 100, 98, 88, 68, 48, 36, 30, 28, 27, 27, 28, 30, 32, 34, 38, 46, 56, 62, 66, 70, 70],
    // Any day, slightly less during business hours
    daily: [74, 65, 62, 60, 62, 66, 76],
    // Even
    monthly: [70, 66, 70, 70, 65, 64, 64, 65, 68, 70, 68, 65],
  },
];
