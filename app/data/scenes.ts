export type EntityRole =
  | 'attacker' | 'victim' | 'server' | 'database'
  | 'organization' | 'c2' | 'botnet' | 'dns' | 'ai'
  | 'package' | 'person' | 'cloud';

export interface SceneEntity {
  id: string;
  label: string;
  sublabel?: string;
  role: EntityRole;
  x: number; // SVG coordinate (viewBox 0 0 760 340)
  y: number;
}

export interface SceneConnection {
  id: string;
  from: string; // entity id
  to: string;   // entity id
}

export interface SceneStep {
  conn: string | null;           // which connection to animate (null = no flow line)
  label: string;                 // action label displayed on the connection
  highlight: string[];           // entity ids to pulse/glow
  style?: 'recon' | 'normal' | 'danger'; // recon=dashed dim, normal=solid, danger=red
}

export interface AttackSceneData {
  entities: SceneEntity[];
  connections: SceneConnection[];
  steps: SceneStep[];            // one per attack step (index-matched)
}

export const SCENES: Record<string, AttackSceneData> = {

  phishing: {
    entities: [
      { id: 'att',  label: 'Attacker',     sublabel: 'Hacker', role: 'attacker', x: 90,  y: 170 },
      { id: 'smtp', label: 'Mail Server',  sublabel: 'SMTP',   role: 'server',   x: 330, y: 80  },
      { id: 'fake', label: 'Fake Website', sublabel: 'phishing page', role: 'cloud', x: 330, y: 270 },
      { id: 'vic',  label: 'Victim',       sublabel: 'target user',   role: 'victim', x: 640, y: 170 },
    ],
    connections: [
      { id: 'c1', from: 'att',  to: 'smtp' },
      { id: 'c2', from: 'smtp', to: 'vic'  },
      { id: 'c3', from: 'vic',  to: 'fake' },
      { id: 'c4', from: 'fake', to: 'att'  },
      { id: 'c5', from: 'att',  to: 'vic'  },
    ],
    steps: [
      { conn: 'c5',  label: 'OSINT Recon',       highlight: ['att', 'vic'],        style: 'recon'  },
      { conn: 'c1',  label: 'Email Spoofing',     highlight: ['att', 'smtp'],       style: 'normal' },
      { conn: 'c2',  label: 'Email Delivery',     highlight: ['smtp', 'vic'],       style: 'normal' },
      { conn: 'c3',  label: 'Click Phishing Link',highlight: ['vic', 'fake'],       style: 'normal' },
      { conn: 'c4',  label: 'Credential Harvest', highlight: ['fake', 'att'],       style: 'danger' },
      { conn: 'c5',  label: 'Account Takeover',   highlight: ['att', 'vic'],        style: 'danger' },
    ],
  },

  ransomware: {
    entities: [
      { id: 'att', label: 'Attacker',    sublabel: 'Ransomware Group', role: 'attacker',     x: 90,  y: 170 },
      { id: 'org', label: 'Target Org',  sublabel: 'victim network',   role: 'organization', x: 370, y: 170 },
      { id: 'db',  label: 'File Server', sublabel: 'all data',         role: 'database',     x: 590, y: 80  },
      { id: 'c2',  label: 'C2 Server',   sublabel: 'dark web',         role: 'c2',           x: 590, y: 280 },
    ],
    connections: [
      { id: 'c1', from: 'att', to: 'org' },
      { id: 'c2', from: 'org', to: 'db'  },
      { id: 'c3', from: 'org', to: 'c2'  },
      { id: 'c4', from: 'c2',  to: 'org' },
    ],
    steps: [
      { conn: 'c1', label: 'Initial Access (RDP/Phish)', highlight: ['att', 'org'], style: 'normal' },
      { conn: 'c2', label: 'Persistence & Lateral Move', highlight: ['org', 'db'],  style: 'normal' },
      { conn: 'c2', label: 'Lateral to All Systems',     highlight: ['org', 'db'],  style: 'normal' },
      { conn: 'c3', label: 'Data Exfiltration',          highlight: ['org', 'c2'],  style: 'danger' },
      { conn: 'c2', label: 'Mass Encryption AES-256',    highlight: ['org', 'db'],  style: 'danger' },
      { conn: 'c4', label: 'Ransom Demand',              highlight: ['c2', 'org'],  style: 'danger' },
    ],
  },

  sqli: {
    entities: [
      { id: 'att', label: 'Attacker',       sublabel: 'sqlmap / manual', role: 'attacker', x: 100, y: 170 },
      { id: 'web', label: 'Web App',        sublabel: 'vulnerable input', role: 'server',   x: 380, y: 170 },
      { id: 'db',  label: 'Database',       sublabel: 'MySQL / MSSQL',   role: 'database',  x: 660, y: 170 },
    ],
    connections: [
      { id: 'c1', from: 'att', to: 'web' },
      { id: 'c2', from: 'web', to: 'db'  },
      { id: 'c3', from: 'db',  to: 'att' },
      { id: 'c4', from: 'att', to: 'db'  },
    ],
    steps: [
      { conn: 'c1', label: 'Discovery Scan',       highlight: ['att', 'web'],        style: 'recon'  },
      { conn: 'c1', label: 'Error-Based Test',     highlight: ['att', 'web'],        style: 'normal' },
      { conn: 'c2', label: 'Auth Bypass via SQL',  highlight: ['web', 'db'],         style: 'normal' },
      { conn: 'c3', label: 'UNION Data Dump',      highlight: ['db', 'att'],         style: 'danger' },
      { conn: 'c2', label: 'OS Command Execution', highlight: ['web', 'db'],         style: 'danger' },
      { conn: 'c4', label: 'Full DB Compromise',   highlight: ['att', 'db'],         style: 'danger' },
    ],
  },

  ddos: {
    entities: [
      { id: 'att', label: 'Attacker',     sublabel: 'C2 operator',     role: 'attacker', x: 90,  y: 170 },
      { id: 'bot', label: 'Botnet',       sublabel: '127K IoT devices', role: 'botnet',   x: 340, y: 90  },
      { id: 'amp', label: 'Amplifiers',   sublabel: 'DNS/NTP/Memcache', role: 'server',   x: 340, y: 280 },
      { id: 'vic', label: 'Target Server',sublabel: 'victim',           role: 'victim',   x: 620, y: 170 },
    ],
    connections: [
      { id: 'c1', from: 'att', to: 'bot' },
      { id: 'c2', from: 'bot', to: 'vic' },
      { id: 'c3', from: 'amp', to: 'vic' },
      { id: 'c4', from: 'att', to: 'vic' },
    ],
    steps: [
      { conn: 'c1', label: 'Infect IoT Devices',    highlight: ['att', 'bot'],        style: 'normal' },
      { conn: 'c1', label: 'C2 Command Broadcast',  highlight: ['att', 'bot'],        style: 'normal' },
      { conn: 'c3', label: 'Amplification 51,000x', highlight: ['amp', 'vic'],        style: 'normal' },
      { conn: 'c2', label: 'Flood Launch 800 Gbps', highlight: ['bot', 'vic'],        style: 'danger' },
      { conn: 'c2', label: 'Service Collapse',       highlight: ['bot', 'vic'],        style: 'danger' },
      { conn: 'c4', label: 'Extortion / Ransom',     highlight: ['att', 'vic'],        style: 'danger' },
    ],
  },

  mitm: {
    entities: [
      { id: 'vic', label: 'Victim',      sublabel: 'public WiFi user', role: 'victim',   x: 100, y: 170 },
      { id: 'att', label: 'Attacker',    sublabel: 'MITM position',    role: 'attacker', x: 380, y: 170 },
      { id: 'srv', label: 'Web Server',  sublabel: 'bank / app',       role: 'server',   x: 660, y: 170 },
    ],
    connections: [
      { id: 'c1', from: 'att', to: 'vic' },
      { id: 'c2', from: 'vic', to: 'att' },
      { id: 'c3', from: 'att', to: 'srv' },
      { id: 'c4', from: 'srv', to: 'att' },
    ],
    steps: [
      { conn: 'c1', label: 'Evil Twin AP Setup',    highlight: ['att', 'vic'],  style: 'normal' },
      { conn: 'c1', label: 'ARP Spoofing',          highlight: ['att', 'vic'],  style: 'normal' },
      { conn: 'c2', label: 'Traffic Captured',       highlight: ['vic', 'att'],  style: 'normal' },
      { conn: 'c2', label: 'SSL Stripping',          highlight: ['vic', 'att'],  style: 'danger' },
      { conn: 'c2', label: 'Session Hijack Cookie',  highlight: ['vic', 'att'],  style: 'danger' },
      { conn: 'c3', label: 'Injected Modification',  highlight: ['att', 'srv'],  style: 'danger' },
    ],
  },

  xss: {
    entities: [
      { id: 'att', label: 'Attacker',       sublabel: 'payload crafter', role: 'attacker', x: 100, y: 170 },
      { id: 'web', label: 'Web App / DB',   sublabel: 'forum / social',  role: 'server',   x: 380, y: 170 },
      { id: 'vic', label: 'Victim Browser', sublabel: 'any visitor',     role: 'victim',   x: 660, y: 170 },
    ],
    connections: [
      { id: 'c1', from: 'att', to: 'web' },
      { id: 'c2', from: 'web', to: 'vic' },
      { id: 'c3', from: 'vic', to: 'att' },
    ],
    steps: [
      { conn: 'c1', label: 'XSS Discovery',          highlight: ['att', 'web'],  style: 'recon'  },
      { conn: null, label: 'Payload Crafting',        highlight: ['att'],         style: 'normal' },
      { conn: 'c1', label: 'Stored XSS Injection',   highlight: ['att', 'web'],  style: 'normal' },
      { conn: 'c2', label: 'Malicious JS Executes',  highlight: ['web', 'vic'],  style: 'danger' },
      { conn: 'c3', label: 'Cookie Theft to Attacker',highlight: ['vic', 'att'], style: 'danger' },
      { conn: 'c2', label: 'XSS Worm Propagation',   highlight: ['web', 'vic'],  style: 'danger' },
    ],
  },

  'zero-day': {
    entities: [
      { id: 'att',  label: 'APT Group',       sublabel: 'nation-state',    role: 'attacker',     x: 90,  y: 170 },
      { id: 'soft', label: 'Target Software', sublabel: 'unpatched vuln',  role: 'package',      x: 330, y: 80  },
      { id: 'tgt',  label: 'Target System',   sublabel: 'high-value target',role: 'victim',      x: 560, y: 170 },
      { id: 'c2',   label: 'C2 Server',       sublabel: 'APT infra',       role: 'c2',           x: 680, y: 310 },
    ],
    connections: [
      { id: 'c1', from: 'att',  to: 'soft' },
      { id: 'c2', from: 'att',  to: 'tgt'  },
      { id: 'c3', from: 'tgt',  to: 'c2'   },
      { id: 'c4', from: 'c2',   to: 'tgt'  },
    ],
    steps: [
      { conn: 'c1', label: 'Fuzzing & Reverse Eng',  highlight: ['att', 'soft'],  style: 'recon'  },
      { conn: 'c1', label: 'Exploit Development',    highlight: ['att', 'soft'],  style: 'normal' },
      { conn: null, label: 'Weaponization (Packing)',highlight: ['att'],           style: 'normal' },
      { conn: 'c2', label: 'Watering Hole Delivery', highlight: ['att', 'tgt'],   style: 'normal' },
      { conn: null, label: 'Silent Exploitation',    highlight: ['tgt'],           style: 'danger' },
      { conn: 'c3', label: 'APT Beacon to C2',       highlight: ['tgt', 'c2'],    style: 'danger' },
    ],
  },

  'social-engineering': {
    entities: [
      { id: 'att', label: 'Attacker',     sublabel: 'social engineer', role: 'attacker',     x: 100, y: 170 },
      { id: 'per', label: 'Target Person',sublabel: 'employee / insider', role: 'person',     x: 380, y: 170 },
      { id: 'org', label: 'Organization', sublabel: 'victim company',  role: 'organization',  x: 660, y: 170 },
    ],
    connections: [
      { id: 'c1', from: 'att', to: 'per' },
      { id: 'c2', from: 'per', to: 'att' },
      { id: 'c3', from: 'att', to: 'org' },
      { id: 'c4', from: 'per', to: 'org' },
    ],
    steps: [
      { conn: 'c1', label: 'OSINT Profiling',        highlight: ['att', 'per'],  style: 'recon'  },
      { conn: 'c1', label: 'Pretexting Call',        highlight: ['att', 'per'],  style: 'normal' },
      { conn: 'c1', label: 'Authority & Urgency',    highlight: ['att', 'per'],  style: 'normal' },
      { conn: 'c2', label: 'Vishing / Credential',   highlight: ['per', 'att'],  style: 'danger' },
      { conn: 'c3', label: 'Physical Tailgating',    highlight: ['att', 'org'],  style: 'danger' },
      { conn: 'c4', label: 'Data Exfiltration',      highlight: ['per', 'org'],  style: 'danger' },
    ],
  },

  'dns-spoofing': {
    entities: [
      { id: 'att',  label: 'Attacker',     sublabel: 'Kaminsky attack', role: 'attacker', x: 90,  y: 170 },
      { id: 'dns',  label: 'DNS Resolver', sublabel: 'ISP / recursive', role: 'dns',      x: 340, y: 80  },
      { id: 'fake', label: 'Fake Server',  sublabel: 'attacker IP',     role: 'c2',       x: 340, y: 280 },
      { id: 'vic',  label: 'Victim',       sublabel: 'all users',       role: 'victim',   x: 620, y: 170 },
    ],
    connections: [
      { id: 'c1', from: 'att',  to: 'dns'  },
      { id: 'c2', from: 'dns',  to: 'vic'  },
      { id: 'c3', from: 'vic',  to: 'fake' },
      { id: 'c4', from: 'fake', to: 'att'  },
    ],
    steps: [
      { conn: 'c1', label: 'DNS Reconnaissance',     highlight: ['att', 'dns'],   style: 'recon'  },
      { conn: 'c1', label: 'Cache Poisoning',        highlight: ['att', 'dns'],   style: 'danger' },
      { conn: 'c2', label: 'Poisoned Response',      highlight: ['dns', 'vic'],   style: 'danger' },
      { conn: null, label: 'Fake Server Active',     highlight: ['fake'],          style: 'normal' },
      { conn: 'c3', label: 'Victims Connect Fake',   highlight: ['vic', 'fake'],  style: 'danger' },
      { conn: null, label: 'Cache Persists 24h',     highlight: ['dns'],           style: 'danger' },
    ],
  },

  'supply-chain': {
    entities: [
      { id: 'att', label: 'APT Attacker', sublabel: 'Cozy Bear',        role: 'attacker',     x: 80,  y: 220 },
      { id: 'ven', label: 'Vendor',       sublabel: 'SolarWinds CI/CD', role: 'organization', x: 330, y: 80  },
      { id: 'pkg', label: 'Signed Update',sublabel: 'malicious dll',    role: 'package',      x: 480, y: 290 },
      { id: 'tgt', label: '18,000 Orgs',  sublabel: 'Pentagon etc.',    role: 'victim',       x: 670, y: 130 },
    ],
    connections: [
      { id: 'c1', from: 'att', to: 'ven' },
      { id: 'c2', from: 'ven', to: 'pkg' },
      { id: 'c3', from: 'pkg', to: 'tgt' },
      { id: 'c4', from: 'tgt', to: 'att' },
    ],
    steps: [
      { conn: null, label: 'Identify Weak Vendor',   highlight: ['att', 'ven'],  style: 'recon'  },
      { conn: 'c1', label: 'Compromise Vendor CI/CD',highlight: ['att', 'ven'],  style: 'normal' },
      { conn: 'c1', label: 'Inject SUNBURST Code',   highlight: ['att', 'ven'],  style: 'danger' },
      { conn: 'c3', label: 'Signed Auto-Update',     highlight: ['pkg', 'tgt'],  style: 'normal' },
      { conn: null, label: 'Dormant 12 Days',        highlight: ['tgt'],          style: 'recon'  },
      { conn: 'c4', label: 'Exfil to Attacker',      highlight: ['tgt', 'att'],  style: 'danger' },
    ],
  },

  'insider-threat': {
    entities: [
      { id: 'ins', label: 'Insider',        sublabel: 'malicious employee', role: 'person',       x: 120, y: 170 },
      { id: 'sys', label: 'Internal Systems',sublabel: 'databases / files', role: 'database',     x: 390, y: 170 },
      { id: 'ext', label: 'External Party', sublabel: 'buyer / competitor', role: 'c2',           x: 640, y: 170 },
    ],
    connections: [
      { id: 'c1', from: 'ins', to: 'sys' },
      { id: 'c2', from: 'sys', to: 'ins' },
      { id: 'c3', from: 'ins', to: 'ext' },
    ],
    steps: [
      { conn: null, label: 'Motivated Insider',       highlight: ['ins'],          style: 'recon'  },
      { conn: 'c1', label: 'Legitimate Access Abuse', highlight: ['ins', 'sys'],   style: 'normal' },
      { conn: 'c2', label: 'Gradual Data Aggregation',highlight: ['sys', 'ins'],   style: 'normal' },
      { conn: 'c3', label: 'Exfiltration via USB/Cloud',highlight: ['ins', 'ext'], style: 'danger' },
      { conn: 'c1', label: 'Covering Tracks / Delete Logs',highlight: ['ins', 'sys'],style: 'danger'},
      { conn: null, label: 'Monetization',            highlight: ['ext'],           style: 'danger' },
    ],
  },

  'ai-attack': {
    entities: [
      { id: 'att', label: 'Attacker',   sublabel: 'dark web tools',   role: 'attacker',     x: 90,  y: 170 },
      { id: 'ai',  label: 'AI / LLM',   sublabel: 'WormGPT / GPT-4',  role: 'ai',           x: 340, y: 80  },
      { id: 'vic', label: 'Victims',    sublabel: 'mass scale',        role: 'victim',       x: 590, y: 170 },
      { id: 'org', label: 'Organization',sublabel: 'target systems',   role: 'organization', x: 340, y: 280 },
    ],
    connections: [
      { id: 'c1', from: 'att', to: 'ai'  },
      { id: 'c2', from: 'ai',  to: 'vic' },
      { id: 'c3', from: 'ai',  to: 'org' },
      { id: 'c4', from: 'att', to: 'vic' },
    ],
    steps: [
      { conn: 'c2', label: 'AI Phishing x1M Targets',  highlight: ['ai', 'vic'],  style: 'normal' },
      { conn: 'c4', label: 'Deepfake Voice / Video',   highlight: ['att', 'vic'], style: 'normal' },
      { conn: 'c3', label: 'Auto Vuln Discovery',      highlight: ['ai', 'org'],  style: 'normal' },
      { conn: 'c3', label: 'Polymorphic Malware',      highlight: ['ai', 'org'],  style: 'danger' },
      { conn: 'c1', label: 'LLM Jailbreaking',         highlight: ['att', 'ai'],  style: 'danger' },
      { conn: 'c3', label: 'Autonomous Attack Agent',  highlight: ['ai', 'org'],  style: 'danger' },
    ],
  },

  'credential-stuffing': {
    entities: [
      { id: 'att',  label: 'Attacker',      sublabel: 'Hacker',        role: 'attacker',  x: 90,  y: 170 },
      { id: 'bdb',  label: 'Breach DB',     sublabel: '10B combos',    role: 'database',  x: 280, y: 80  },
      { id: 'bot',  label: 'Bot Farm',      sublabel: '50K proxies',   role: 'botnet',    x: 480, y: 170 },
      { id: 'tgt',  label: 'Target Site',   sublabel: 'login endpoint', role: 'server',   x: 660, y: 260 },
    ],
    connections: [
      { id: 'c1', from: 'att', to: 'bdb' },
      { id: 'c2', from: 'att', to: 'bot' },
      { id: 'c3', from: 'bot', to: 'tgt' },
      { id: 'c4', from: 'tgt', to: 'att' },
    ],
    steps: [
      { conn: 'c1', label: 'Acquire Breach Data',   highlight: ['att', 'bdb'], style: 'recon'  },
      { conn: 'c2', label: 'Load Credential List',  highlight: ['att', 'bot'], style: 'normal' },
      { conn: 'c3', label: 'Mass Login Testing',    highlight: ['bot', 'tgt'], style: 'danger' },
      { conn: 'c4', label: 'Valid Account Found',   highlight: ['tgt', 'att'], style: 'normal' },
      { conn: 'c3', label: 'Account Takeover',      highlight: ['bot', 'tgt'], style: 'danger' },
    ],
  },

  'cryptojacking': {
    entities: [
      { id: 'att',  label: 'Attacker',       sublabel: 'Miner Owner',   role: 'attacker',  x: 90,  y: 210 },
      { id: 'srv',  label: 'Script Server',  sublabel: 'XMRig Host',    role: 'server',    x: 310, y: 70  },
      { id: 'vic',  label: 'Victim Browser', sublabel: 'CPU hijacked',  role: 'victim',    x: 530, y: 210 },
      { id: 'pool', label: 'Mining Pool',    sublabel: 'Monero pool',   role: 'cloud',     x: 680, y: 80  },
    ],
    connections: [
      { id: 'c1', from: 'att',  to: 'srv'  },
      { id: 'c2', from: 'srv',  to: 'vic'  },
      { id: 'c3', from: 'vic',  to: 'pool' },
      { id: 'c4', from: 'pool', to: 'att'  },
    ],
    steps: [
      { conn: 'c1', label: 'Upload Mining Script',  highlight: ['att', 'srv'],  style: 'normal' },
      { conn: 'c2', label: 'Deliver to Victim',     highlight: ['srv', 'vic'],  style: 'normal' },
      { conn: 'c3', label: 'Silent Mining Runs',    highlight: ['vic', 'pool'], style: 'danger' },
      { conn: 'c4', label: 'Attacker Gets XMR',     highlight: ['pool', 'att'], style: 'danger' },
    ],
  },

  'csrf': {
    entities: [
      { id: 'att',  label: 'Attacker',      sublabel: 'Crafts payload', role: 'attacker',     x: 90,  y: 170 },
      { id: 'evil', label: 'Evil Website',  sublabel: 'auto-submit',    role: 'cloud',        x: 260, y: 300 },
      { id: 'vic',  label: 'Victim',        sublabel: 'logged in',      role: 'victim',       x: 490, y: 170 },
      { id: 'bank', label: 'Target Server', sublabel: 'bank.com',       role: 'server',       x: 670, y: 170 },
    ],
    connections: [
      { id: 'c1', from: 'att',  to: 'evil' },
      { id: 'c2', from: 'evil', to: 'vic'  },
      { id: 'c3', from: 'vic',  to: 'bank' },
      { id: 'c4', from: 'bank', to: 'att'  },
    ],
    steps: [
      { conn: 'c1', label: 'Craft Forged Request', highlight: ['att', 'evil'], style: 'recon'  },
      { conn: 'c2', label: 'Lure Victim',           highlight: ['evil', 'vic'], style: 'normal' },
      { conn: 'c3', label: 'Auto-Submit Request',   highlight: ['vic', 'bank'], style: 'danger' },
      { conn: 'c3', label: 'Server Executes Action',highlight: ['vic', 'bank'], style: 'danger' },
      { conn: 'c4', label: 'Attacker Profits',      highlight: ['bank', 'att'], style: 'danger' },
    ],
  },

  'sim-swapping': {
    entities: [
      { id: 'att',     label: 'Attacker',      sublabel: 'Social engineer', role: 'attacker',     x: 90,  y: 170 },
      { id: 'carrier', label: 'Telecom Agent', sublabel: 'T-Mobile / AT&T', role: 'organization', x: 360, y: 170 },
      { id: 'vic',     label: 'Victim Phone',  sublabel: 'No service',      role: 'person',       x: 590, y: 80  },
      { id: 'accs',    label: 'Victim Accounts',sublabel: 'Bank & Crypto',  role: 'database',     x: 640, y: 280 },
    ],
    connections: [
      { id: 'c1', from: 'att',     to: 'carrier' },
      { id: 'c2', from: 'carrier', to: 'vic'     },
      { id: 'c3', from: 'carrier', to: 'att'     },
      { id: 'c4', from: 'att',     to: 'accs'    },
    ],
    steps: [
      { conn: 'c1', label: 'OSINT + Pretext Call',  highlight: ['att', 'carrier'], style: 'recon'  },
      { conn: 'c1', label: 'Social Engineer Agent', highlight: ['att', 'carrier'], style: 'normal' },
      { conn: 'c2', label: 'Victim SIM Deactivated',highlight: ['carrier', 'vic'], style: 'danger' },
      { conn: 'c3', label: 'Attacker Gets Number',  highlight: ['carrier', 'att'], style: 'danger' },
      { conn: 'c4', label: 'Intercept 2FA & Drain', highlight: ['att', 'accs'],    style: 'danger' },
    ],
  },

  'fileless-malware': {
    entities: [
      { id: 'att', label: 'Attacker',    sublabel: 'APT Group',       role: 'attacker', x: 110, y: 170 },
      { id: 'vic', label: 'Victim PC',   sublabel: 'Windows host',    role: 'victim',   x: 420, y: 170 },
      { id: 'mem', label: 'RAM / WMI',   sublabel: 'In-memory only',  role: 'server',   x: 580, y: 80  },
      { id: 'c2s', label: 'C2 Server',   sublabel: 'HTTPS beacon',    role: 'c2',       x: 660, y: 290 },
    ],
    connections: [
      { id: 'c1', from: 'att', to: 'vic' },
      { id: 'c2', from: 'vic', to: 'mem' },
      { id: 'c3', from: 'mem', to: 'c2s' },
      { id: 'c4', from: 'c2s', to: 'att' },
    ],
    steps: [
      { conn: 'c1', label: 'Phish + Macro Exploit',   highlight: ['att', 'vic'], style: 'normal' },
      { conn: 'c2', label: 'Execute In-Memory Only',   highlight: ['vic', 'mem'], style: 'normal' },
      { conn: 'c2', label: 'WMI/Registry Persistence', highlight: ['vic', 'mem'], style: 'recon'  },
      { conn: 'c3', label: 'Encrypted C2 Beacon',     highlight: ['mem', 'c2s'], style: 'recon'  },
      { conn: 'c3', label: 'Lateral + Exfiltrate',    highlight: ['mem', 'c2s'], style: 'danger' },
      { conn: 'c4', label: 'Attacker Receives Data',  highlight: ['c2s', 'att'], style: 'danger' },
    ],
  },

  'clickjacking': {
    entities: [
      { id: 'att',   label: 'Attacker',       sublabel: 'UI Redresser',    role: 'attacker', x: 90,  y: 170 },
      { id: 'frame', label: 'Malicious Page', sublabel: 'iframe overlay',  role: 'cloud',    x: 310, y: 170 },
      { id: 'vic',   label: 'Victim',         sublabel: 'thinks clicking', role: 'victim',   x: 510, y: 170 },
      { id: 'tgt',   label: 'Target Site',    sublabel: 'hidden action',   role: 'server',   x: 670, y: 170 },
    ],
    connections: [
      { id: 'c1', from: 'att',   to: 'frame' },
      { id: 'c2', from: 'frame', to: 'vic'   },
      { id: 'c3', from: 'vic',   to: 'tgt'   },
      { id: 'c4', from: 'tgt',   to: 'att'   },
    ],
    steps: [
      { conn: 'c1', label: 'Create Transparent Overlay', highlight: ['att', 'frame'], style: 'recon'  },
      { conn: 'c2', label: 'Lure Victim to Page',        highlight: ['frame', 'vic'], style: 'normal' },
      { conn: 'c3', label: 'Hidden Click Hijacked',      highlight: ['vic', 'tgt'],   style: 'danger' },
      { conn: 'c3', label: 'Target Action Executes',     highlight: ['vic', 'tgt'],   style: 'danger' },
      { conn: 'c4', label: 'Attacker Profits',           highlight: ['tgt', 'att'],   style: 'danger' },
    ],
  },

  'evil-maid': {
    entities: [
      { id: 'att', label: 'Attacker',    sublabel: 'Physical access', role: 'attacker', x: 90,  y: 170 },
      { id: 'lap', label: 'Victim Laptop', sublabel: 'Unattended',   role: 'victim',   x: 340, y: 170 },
      { id: 'usb', label: 'USB Bootkit', sublabel: 'Live OS',        role: 'package',  x: 560, y: 80  },
      { id: 'c2s', label: 'C2 Server',   sublabel: 'Remote access',  role: 'c2',       x: 640, y: 280 },
    ],
    connections: [
      { id: 'c1', from: 'att', to: 'lap' },
      { id: 'c2', from: 'att', to: 'usb' },
      { id: 'c3', from: 'usb', to: 'lap' },
      { id: 'c4', from: 'lap', to: 'c2s' },
    ],
    steps: [
      { conn: 'c1', label: 'Physical Access',      highlight: ['att', 'lap'], style: 'recon'  },
      { conn: 'c2', label: 'Prepare USB Bootkit',  highlight: ['att', 'usb'], style: 'normal' },
      { conn: 'c3', label: 'Boot from USB',        highlight: ['usb', 'lap'], style: 'danger' },
      { conn: 'c3', label: 'Install Bootkit',      highlight: ['usb', 'lap'], style: 'danger' },
      { conn: 'c4', label: 'Remote Access Live',   highlight: ['lap', 'c2s'], style: 'danger' },
    ],
  },

  'bad-usb': {
    entities: [
      { id: 'att', label: 'Attacker',    sublabel: 'USB creator',   role: 'attacker', x: 90,  y: 170 },
      { id: 'usb', label: 'Rubber Ducky', sublabel: 'HID device',   role: 'package',  x: 310, y: 170 },
      { id: 'vic', label: 'Victim PC',   sublabel: 'Trusts USB',    role: 'victim',   x: 510, y: 170 },
      { id: 'c2s', label: 'C2 Server',   sublabel: 'Reverse shell', role: 'c2',       x: 670, y: 80  },
    ],
    connections: [
      { id: 'c1', from: 'att', to: 'usb' },
      { id: 'c2', from: 'usb', to: 'vic' },
      { id: 'c3', from: 'vic', to: 'c2s' },
      { id: 'c4', from: 'c2s', to: 'att' },
    ],
    steps: [
      { conn: 'c1', label: 'Program Payload',     highlight: ['att', 'usb'], style: 'recon'  },
      { conn: 'c2', label: 'USB Plugged In',       highlight: ['usb', 'vic'], style: 'normal' },
      { conn: 'c2', label: 'Auto-Type Commands',   highlight: ['usb', 'vic'], style: 'danger' },
      { conn: 'c3', label: 'Reverse Shell Opened', highlight: ['vic', 'c2s'], style: 'danger' },
      { conn: 'c4', label: 'Full Remote Access',   highlight: ['c2s', 'att'], style: 'danger' },
    ],
  },

  'rainbow-table': {
    entities: [
      { id: 'att', label: 'Attacker',      sublabel: 'Has hash dump',  role: 'attacker',  x: 90,  y: 170 },
      { id: 'tbl', label: 'Rainbow Table', sublabel: '100GB precomp',  role: 'database',  x: 320, y: 80  },
      { id: 'gpu', label: 'GPU Cluster',   sublabel: 'Hash lookup',    role: 'server',    x: 510, y: 170 },
      { id: 'pwd', label: 'Plaintext PWDs', sublabel: 'Cracked',       role: 'cloud',     x: 670, y: 80  },
    ],
    connections: [
      { id: 'c1', from: 'att', to: 'tbl' },
      { id: 'c2', from: 'tbl', to: 'gpu' },
      { id: 'c3', from: 'att', to: 'gpu' },
      { id: 'c4', from: 'gpu', to: 'pwd' },
      { id: 'c5', from: 'pwd', to: 'att' },
    ],
    steps: [
      { conn: 'c3', label: 'Load Hash Dump',        highlight: ['att', 'gpu'], style: 'recon'  },
      { conn: 'c1', label: 'Load Rainbow Table',    highlight: ['att', 'tbl'], style: 'normal' },
      { conn: 'c2', label: 'Table Lookup',          highlight: ['tbl', 'gpu'], style: 'normal' },
      { conn: 'c4', label: 'Instant Hash Reversed', highlight: ['gpu', 'pwd'], style: 'danger' },
      { conn: 'c5', label: 'All Passwords Cracked', highlight: ['pwd', 'att'], style: 'danger' },
    ],
  },

  'brute-force': {
    entities: [
      { id: 'att', label: 'Attacker',    sublabel: 'Wordlist',      role: 'attacker', x: 90,  y: 170 },
      { id: 'gpu', label: 'GPU Farm',    sublabel: 'RTX 4090 ×8',  role: 'server',   x: 330, y: 170 },
      { id: 'hsh', label: 'Hash Target', sublabel: 'MD5/NTLM',     role: 'database', x: 560, y: 80  },
      { id: 'res', label: 'Cracked PWDs', sublabel: 'Plaintext',   role: 'cloud',    x: 650, y: 270 },
    ],
    connections: [
      { id: 'c1', from: 'att', to: 'gpu' },
      { id: 'c2', from: 'gpu', to: 'hsh' },
      { id: 'c3', from: 'hsh', to: 'gpu' },
      { id: 'c4', from: 'gpu', to: 'res' },
      { id: 'c5', from: 'res', to: 'att' },
    ],
    steps: [
      { conn: 'c1', label: 'Load Wordlist + Rules', highlight: ['att', 'gpu'], style: 'normal' },
      { conn: 'c2', label: 'Generate Candidates',   highlight: ['gpu', 'hsh'], style: 'normal' },
      { conn: 'c3', label: 'Compare Hashes',        highlight: ['hsh', 'gpu'], style: 'recon'  },
      { conn: 'c4', label: 'Match Found',           highlight: ['gpu', 'res'], style: 'danger' },
      { conn: 'c5', label: 'Plaintext Recovered',   highlight: ['res', 'att'], style: 'danger' },
    ],
  },

  'cloud-misconfig': {
    entities: [
      { id: 'att', label: 'Attacker',    sublabel: 'Scanner',       role: 'attacker',     x: 90,  y: 170 },
      { id: 's3',  label: 'S3 Bucket',   sublabel: 'Public! ACL',   role: 'cloud',        x: 320, y: 80  },
      { id: 'iam', label: 'IAM / Creds', sublabel: '.env exposed',  role: 'database',     x: 500, y: 270 },
      { id: 'inf', label: 'AWS Infra',   sublabel: 'All services',  role: 'organization', x: 650, y: 170 },
    ],
    connections: [
      { id: 'c1', from: 'att', to: 's3'  },
      { id: 'c2', from: 's3',  to: 'att' },
      { id: 'c3', from: 'att', to: 'iam' },
      { id: 'c4', from: 'iam', to: 'inf' },
      { id: 'c5', from: 'att', to: 'inf' },
    ],
    steps: [
      { conn: 'c1', label: 'Scan Public Buckets',    highlight: ['att', 's3'],  style: 'recon'  },
      { conn: 'c2', label: 'Download Sensitive Files', highlight: ['s3', 'att'],  style: 'danger' },
      { conn: 'c3', label: 'Extract AWS Credentials', highlight: ['att', 'iam'], style: 'danger' },
      { conn: 'c4', label: 'Escalate IAM Privilege',  highlight: ['iam', 'inf'], style: 'danger' },
      { conn: 'c5', label: 'Full Cloud Takeover',     highlight: ['att', 'inf'], style: 'danger' },
    ],
  },

  'ssrf': {
    entities: [
      { id: 'att', label: 'Attacker',     sublabel: 'Craft request', role: 'attacker', x: 90,  y: 170 },
      { id: 'app', label: 'Web App',      sublabel: 'URL fetcher',   role: 'server',   x: 330, y: 170 },
      { id: 'meta', label: 'Metadata API', sublabel: '169.254.x.x',  role: 'cloud',    x: 550, y: 80  },
      { id: 'iam', label: 'IAM Creds',    sublabel: 'Temp tokens',   role: 'database', x: 660, y: 270 },
    ],
    connections: [
      { id: 'c1', from: 'att',  to: 'app'  },
      { id: 'c2', from: 'app',  to: 'meta' },
      { id: 'c3', from: 'meta', to: 'app'  },
      { id: 'c4', from: 'app',  to: 'att'  },
      { id: 'c5', from: 'att',  to: 'iam'  },
    ],
    steps: [
      { conn: 'c1', label: 'Inject Internal URL',    highlight: ['att', 'app'],  style: 'recon'  },
      { conn: 'c2', label: 'Server Fetches Metadata', highlight: ['app', 'meta'], style: 'normal' },
      { conn: 'c3', label: 'IAM Token Returned',     highlight: ['meta', 'app'], style: 'danger' },
      { conn: 'c4', label: 'Credentials Leaked',     highlight: ['app', 'att'],  style: 'danger' },
      { conn: 'c5', label: 'Full AWS Access',        highlight: ['att', 'iam'],  style: 'danger' },
    ],
  },

  'mobile-malware': {
    entities: [
      { id: 'att', label: 'Attacker',    sublabel: 'RAT operator',  role: 'attacker', x: 90,  y: 170 },
      { id: 'apk', label: 'Fake APK',    sublabel: 'Trojan app',    role: 'package',  x: 300, y: 80  },
      { id: 'vic', label: 'Victim Phone', sublabel: 'Android',      role: 'victim',   x: 490, y: 170 },
      { id: 'bnk', label: 'Mobile Bank', sublabel: 'OTP target',    role: 'server',   x: 660, y: 80  },
    ],
    connections: [
      { id: 'c1', from: 'att', to: 'apk' },
      { id: 'c2', from: 'apk', to: 'vic' },
      { id: 'c3', from: 'vic', to: 'bnk' },
      { id: 'c4', from: 'bnk', to: 'att' },
      { id: 'c5', from: 'att', to: 'vic' },
    ],
    steps: [
      { conn: 'c1', label: 'Create Trojan APK',     highlight: ['att', 'apk'], style: 'recon'  },
      { conn: 'c2', label: 'Victim Installs APK',   highlight: ['apk', 'vic'], style: 'normal' },
      { conn: 'c3', label: 'Overlay on Bank App',   highlight: ['vic', 'bnk'], style: 'danger' },
      { conn: 'c4', label: 'OTP & Creds Stolen',    highlight: ['bnk', 'att'], style: 'danger' },
      { conn: 'c5', label: 'Full RAT Control',      highlight: ['att', 'vic'], style: 'danger' },
    ],
  },

  'iot-botnet': {
    entities: [
      { id: 'att', label: 'Attacker',    sublabel: 'Botmaster',     role: 'attacker',     x: 90,  y: 170 },
      { id: 'bot', label: 'IoT Botnet',  sublabel: '847K devices',  role: 'botnet',       x: 340, y: 170 },
      { id: 'c2s', label: 'C2 Server',   sublabel: 'Command hub',   role: 'c2',           x: 560, y: 80  },
      { id: 'tgt', label: 'DDoS Target', sublabel: '1.2 Tbps',      role: 'organization', x: 650, y: 280 },
    ],
    connections: [
      { id: 'c1', from: 'att', to: 'bot' },
      { id: 'c2', from: 'bot', to: 'c2s' },
      { id: 'c3', from: 'c2s', to: 'att' },
      { id: 'c4', from: 'att', to: 'c2s' },
      { id: 'c5', from: 'bot', to: 'tgt' },
    ],
    steps: [
      { conn: 'c1', label: 'Scan & Infect IoT',     highlight: ['att', 'bot'], style: 'recon'  },
      { conn: 'c2', label: 'Bots Enroll to C2',     highlight: ['bot', 'c2s'], style: 'normal' },
      { conn: 'c4', label: 'Issue Attack Command',   highlight: ['att', 'c2s'], style: 'danger' },
      { conn: 'c5', label: 'DDoS Flood Launched',   highlight: ['bot', 'tgt'], style: 'danger' },
      { conn: 'c5', label: 'Target Goes Down',       highlight: ['bot', 'tgt'], style: 'danger' },
    ],
  },

  'log4shell': {
    entities: [
      { id: 'att',  label: 'Attacker',      sublabel: 'Threat Actor',   role: 'attacker', x: 90,  y: 170 },
      { id: 'srv',  label: 'Target Server', sublabel: 'Log4j enabled',  role: 'server',   x: 350, y: 170 },
      { id: 'jndi', label: 'JNDI Server',   sublabel: 'attacker-hosted',role: 'c2',       x: 590, y: 80  },
      { id: 'c2',   label: 'C2 Server',     sublabel: 'reverse shell',  role: 'c2',       x: 590, y: 280 },
    ],
    connections: [
      { id: 'c1', from: 'att',  to: 'srv'  },
      { id: 'c2', from: 'srv',  to: 'jndi' },
      { id: 'c3', from: 'jndi', to: 'srv'  },
      { id: 'c4', from: 'srv',  to: 'c2'   },
      { id: 'c5', from: 'att',  to: 'c2'   },
    ],
    steps: [
      { conn: 'c1', label: 'Reconnaissance',         highlight: ['att', 'srv'],  style: 'recon'  },
      { conn: 'c1', label: 'Send JNDI Payload',      highlight: ['att', 'srv'],  style: 'danger' },
      { conn: 'c2', label: 'Log4j Processes & Fetches', highlight: ['srv', 'jndi'], style: 'danger' },
      { conn: 'c3', label: 'JNDI Returns Malicious Class', highlight: ['jndi', 'srv'], style: 'danger' },
      { conn: 'c4', label: 'RCE — Reverse Shell',    highlight: ['srv', 'c2'],   style: 'danger' },
      { conn: 'c5', label: 'Attacker Controls Server', highlight: ['att', 'c2'], style: 'danger' },
    ],
  },

  'printnightmare': {
    entities: [
      { id: 'att', label: 'Attacker',        sublabel: 'Low-priv user',    role: 'attacker',     x: 90,  y: 170 },
      { id: 'dc',  label: 'Domain Controller', sublabel: 'Print Spooler',  role: 'server',       x: 370, y: 170 },
      { id: 'drv', label: 'Malicious Driver', sublabel: 'DLL payload',     role: 'package',      x: 620, y: 80  },
      { id: 'adm', label: 'Admin Shell',     sublabel: 'SYSTEM priv',      role: 'c2',           x: 620, y: 280 },
    ],
    connections: [
      { id: 'c1', from: 'att', to: 'dc'  },
      { id: 'c2', from: 'att', to: 'drv' },
      { id: 'c3', from: 'dc',  to: 'drv' },
      { id: 'c4', from: 'drv', to: 'dc'  },
      { id: 'c5', from: 'dc',  to: 'adm' },
    ],
    steps: [
      { conn: 'c1', label: 'Enumerate Print Spooler',  highlight: ['att', 'dc'],  style: 'recon'  },
      { conn: 'c2', label: 'Upload Malicious Driver',  highlight: ['att', 'drv'], style: 'danger' },
      { conn: 'c3', label: 'Spooler Loads Driver',     highlight: ['dc', 'drv'],  style: 'danger' },
      { conn: 'c4', label: 'DLL Executes as SYSTEM',   highlight: ['drv', 'dc'],  style: 'danger' },
      { conn: 'c5', label: 'Admin Shell Obtained',     highlight: ['dc', 'adm'],  style: 'danger' },
      { conn: 'c1', label: 'Full Domain Compromise',   highlight: ['att', 'dc'],  style: 'danger' },
    ],
  },

  'oauth-bypass': {
    entities: [
      { id: 'att',  label: 'Attacker',      sublabel: 'Malicious App', role: 'attacker', x: 90,  y: 170 },
      { id: 'auth', label: 'Auth Server',   sublabel: 'OAuth Provider',role: 'server',   x: 350, y: 80  },
      { id: 'app',  label: 'Target App',    sublabel: 'Relying Party', role: 'cloud',    x: 350, y: 280 },
      { id: 'vic',  label: 'Victim User',   sublabel: 'token holder',  role: 'victim',   x: 620, y: 170 },
    ],
    connections: [
      { id: 'c1', from: 'att',  to: 'vic'  },
      { id: 'c2', from: 'vic',  to: 'auth' },
      { id: 'c3', from: 'auth', to: 'vic'  },
      { id: 'c4', from: 'vic',  to: 'app'  },
      { id: 'c5', from: 'att',  to: 'app'  },
    ],
    steps: [
      { conn: 'c1', label: 'Craft Malicious OAuth URL',  highlight: ['att', 'vic'],  style: 'recon'  },
      { conn: 'c1', label: 'Send Phishing Auth Link',    highlight: ['att', 'vic'],  style: 'normal' },
      { conn: 'c2', label: 'Victim Authenticates',       highlight: ['vic', 'auth'], style: 'normal' },
      { conn: 'c3', label: 'Token Redirected to Attacker', highlight: ['auth', 'vic'], style: 'danger' },
      { conn: 'c4', label: 'Attacker Uses Token on App', highlight: ['vic', 'app'],  style: 'danger' },
      { conn: 'c5', label: 'Unauthorized Access Granted', highlight: ['att', 'app'], style: 'danger' },
    ],
  },

  'ssti': {
    entities: [
      { id: 'att', label: 'Attacker',       sublabel: 'Injects Template', role: 'attacker', x: 90,  y: 170 },
      { id: 'web', label: 'Web App',        sublabel: 'Template Engine',  role: 'server',   x: 370, y: 170 },
      { id: 'os',  label: 'OS / Shell',     sublabel: 'server process',   role: 'server',   x: 620, y: 80  },
      { id: 'c2',  label: 'C2 Server',      sublabel: 'exfil destination',role: 'c2',       x: 620, y: 280 },
    ],
    connections: [
      { id: 'c1', from: 'att', to: 'web' },
      { id: 'c2', from: 'web', to: 'os'  },
      { id: 'c3', from: 'os',  to: 'c2'  },
      { id: 'c4', from: 'att', to: 'c2'  },
    ],
    steps: [
      { conn: 'c1', label: 'Recon — Find Template Input', highlight: ['att', 'web'], style: 'recon'  },
      { conn: 'c1', label: 'Inject {{7*7}} Test Payload', highlight: ['att', 'web'], style: 'normal' },
      { conn: 'c2', label: 'Template Engine Evaluates',   highlight: ['web', 'os'],  style: 'danger' },
      { conn: 'c2', label: 'OS Command Injection via RCE',highlight: ['web', 'os'],  style: 'danger' },
      { conn: 'c3', label: 'Data Exfiltration',           highlight: ['os', 'c2'],   style: 'danger' },
      { conn: 'c4', label: 'Attacker Has Full Shell',     highlight: ['att', 'c2'],  style: 'danger' },
    ],
  },

  'xxe': {
    entities: [
      { id: 'att',  label: 'Attacker',     sublabel: 'Crafted XML',   role: 'attacker', x: 90,  y: 170 },
      { id: 'web',  label: 'Web Server',   sublabel: 'XML Parser',    role: 'server',   x: 370, y: 170 },
      { id: 'int',  label: 'Internal Srv', sublabel: 'SSRF target',   role: 'server',   x: 620, y: 80  },
      { id: 'files',label: 'File System',  sublabel: '/etc/passwd',   role: 'database', x: 620, y: 280 },
    ],
    connections: [
      { id: 'c1', from: 'att', to: 'web'   },
      { id: 'c2', from: 'web', to: 'int'   },
      { id: 'c3', from: 'web', to: 'files' },
      { id: 'c4', from: 'files', to: 'att' },
      { id: 'c5', from: 'int',   to: 'att' },
    ],
    steps: [
      { conn: 'c1', label: 'Identify XML Endpoint',    highlight: ['att', 'web'],   style: 'recon'  },
      { conn: 'c1', label: 'Send Malicious DOCTYPE',   highlight: ['att', 'web'],   style: 'danger' },
      { conn: 'c3', label: 'Parser Reads Local File',  highlight: ['web', 'files'], style: 'danger' },
      { conn: 'c2', label: 'SSRF — Internal Port Scan',highlight: ['web', 'int'],   style: 'danger' },
      { conn: 'c4', label: 'File Contents Leaked',     highlight: ['files', 'att'], style: 'danger' },
      { conn: 'c5', label: 'Internal Service Accessed',highlight: ['int', 'att'],   style: 'danger' },
    ],
  },

  'jwt-attack': {
    entities: [
      { id: 'att',  label: 'Attacker',    sublabel: 'Token Forger',  role: 'attacker', x: 90,  y: 170 },
      { id: 'auth', label: 'Auth Server', sublabel: 'JWT Issuer',    role: 'server',   x: 370, y: 80  },
      { id: 'api',  label: 'API Server',  sublabel: 'JWT Validator', role: 'server',   x: 370, y: 280 },
      { id: 'db',   label: 'Database',    sublabel: 'sensitive data',role: 'database', x: 620, y: 170 },
    ],
    connections: [
      { id: 'c1', from: 'att',  to: 'auth' },
      { id: 'c2', from: 'auth', to: 'att'  },
      { id: 'c3', from: 'att',  to: 'api'  },
      { id: 'c4', from: 'api',  to: 'db'   },
      { id: 'c5', from: 'db',   to: 'att'  },
    ],
    steps: [
      { conn: 'c1', label: 'Login — Obtain JWT',         highlight: ['att', 'auth'], style: 'recon'  },
      { conn: 'c2', label: 'Decode & Inspect Token',     highlight: ['auth', 'att'], style: 'normal' },
      { conn: 'c3', label: 'Forge alg:none Signature',  highlight: ['att', 'api'],  style: 'danger' },
      { conn: 'c4', label: 'API Accepts Forged Token',   highlight: ['api', 'db'],   style: 'danger' },
      { conn: 'c4', label: 'Privilege Escalation',       highlight: ['api', 'db'],   style: 'danger' },
      { conn: 'c5', label: 'Sensitive Data Extracted',   highlight: ['db', 'att'],   style: 'danger' },
    ],
  },

  'subdomain-takeover': {
    entities: [
      { id: 'att', label: 'Attacker',      sublabel: 'Registers resource', role: 'attacker', x: 90,  y: 170 },
      { id: 'dns', label: 'DNS Server',    sublabel: 'CNAME record',       role: 'dns',      x: 370, y: 80  },
      { id: 'cld', label: 'Cloud Provider',sublabel: 'unclaimed bucket',   role: 'cloud',    x: 620, y: 80  },
      { id: 'vic', label: 'Victim Users',  sublabel: 'trust the domain',   role: 'victim',   x: 620, y: 280 },
    ],
    connections: [
      { id: 'c1', from: 'att', to: 'dns' },
      { id: 'c2', from: 'dns', to: 'cld' },
      { id: 'c3', from: 'att', to: 'cld' },
      { id: 'c4', from: 'vic', to: 'dns' },
      { id: 'c5', from: 'cld', to: 'vic' },
    ],
    steps: [
      { conn: 'c1', label: 'Enumerate DNS — Find Dangling CNAME', highlight: ['att', 'dns'], style: 'recon'  },
      { conn: 'c2', label: 'Target Subdomain Points to Void', highlight: ['dns', 'cld'],   style: 'recon'  },
      { conn: 'c3', label: 'Attacker Claims Cloud Resource', highlight: ['att', 'cld'],    style: 'danger' },
      { conn: 'c4', label: 'Victims Visit Subdomain',        highlight: ['vic', 'dns'],    style: 'normal' },
      { conn: 'c5', label: 'Serve Malicious Content',        highlight: ['cld', 'vic'],    style: 'danger' },
      { conn: 'c5', label: 'Credential Harvest / Drive-by',  highlight: ['cld', 'vic'],    style: 'danger' },
    ],
  },

  'arp-spoofing': {
    entities: [
      { id: 'att',  label: 'Attacker',  sublabel: 'Same LAN',      role: 'attacker', x: 90,  y: 170 },
      { id: 'vic',  label: 'Victim',    sublabel: 'target host',   role: 'victim',   x: 370, y: 80  },
      { id: 'gw',   label: 'Gateway',   sublabel: 'default router',role: 'server',   x: 370, y: 280 },
      { id: 'ext',  label: 'Internet',  sublabel: 'real traffic',  role: 'cloud',    x: 630, y: 170 },
    ],
    connections: [
      { id: 'c1', from: 'att', to: 'vic'  },
      { id: 'c2', from: 'att', to: 'gw'   },
      { id: 'c3', from: 'vic', to: 'att'  },
      { id: 'c4', from: 'att', to: 'gw'   },
      { id: 'c5', from: 'gw',  to: 'ext'  },
    ],
    steps: [
      { conn: 'c1', label: 'ARP Broadcast to Victim',     highlight: ['att', 'vic'],  style: 'recon'  },
      { conn: 'c2', label: 'ARP Broadcast to Gateway',    highlight: ['att', 'gw'],   style: 'recon'  },
      { conn: 'c1', label: 'Poison Victim ARP Table',     highlight: ['att', 'vic'],  style: 'danger' },
      { conn: 'c2', label: 'Poison Gateway ARP Table',    highlight: ['att', 'gw'],   style: 'danger' },
      { conn: 'c3', label: 'Traffic Flows Through Attacker', highlight: ['vic', 'att'], style: 'danger' },
      { conn: 'c4', label: 'Credentials & Data Captured', highlight: ['att', 'gw'],   style: 'danger' },
    ],
  },

  'bec': {
    entities: [
      { id: 'att',  label: 'Attacker',    sublabel: 'Compromised Email', role: 'attacker',     x: 90,  y: 170 },
      { id: 'ceo',  label: 'CEO / CFO',   sublabel: 'spoofed identity',  role: 'person',       x: 370, y: 80  },
      { id: 'fin',  label: 'Finance Dept',sublabel: 'wire transfer',     role: 'organization', x: 370, y: 280 },
      { id: 'bank', label: 'Bank Account',sublabel: "attacker's account",role: 'c2',           x: 630, y: 170 },
    ],
    connections: [
      { id: 'c1', from: 'att', to: 'ceo' },
      { id: 'c2', from: 'att', to: 'fin' },
      { id: 'c3', from: 'ceo', to: 'fin' },
      { id: 'c4', from: 'fin', to: 'bank'},
      { id: 'c5', from: 'att', to: 'bank'},
    ],
    steps: [
      { conn: 'c1', label: 'Compromise / Spoof CEO Email',   highlight: ['att', 'ceo'], style: 'recon'  },
      { conn: 'c2', label: 'Monitor Finance Communications', highlight: ['att', 'fin'], style: 'recon'  },
      { conn: 'c3', label: 'Intercept Pending Transaction',  highlight: ['ceo', 'fin'], style: 'normal' },
      { conn: 'c2', label: '"CEO" Requests Wire Transfer',   highlight: ['att', 'fin'], style: 'danger' },
      { conn: 'c4', label: 'Finance Sends Funds',            highlight: ['fin', 'bank'],style: 'danger' },
      { conn: 'c5', label: 'Funds Reach Attacker Account',   highlight: ['att', 'bank'],style: 'danger' },
    ],
  },

  'watering-hole': {
    entities: [
      { id: 'att',  label: 'Attacker',     sublabel: 'Plants exploit',   role: 'attacker', x: 90,  y: 170 },
      { id: 'site', label: 'Target Website',sublabel: 'trusted by victims',role: 'server', x: 370, y: 170 },
      { id: 'vic',  label: 'Victim',        sublabel: 'frequent visitor', role: 'victim',  x: 620, y: 80  },
      { id: 'c2',   label: 'C2 Server',     sublabel: 'malware delivery', role: 'c2',      x: 620, y: 280 },
    ],
    connections: [
      { id: 'c1', from: 'att',  to: 'site' },
      { id: 'c2', from: 'vic',  to: 'site' },
      { id: 'c3', from: 'site', to: 'vic'  },
      { id: 'c4', from: 'vic',  to: 'c2'   },
      { id: 'c5', from: 'att',  to: 'c2'   },
    ],
    steps: [
      { conn: 'c1', label: 'Identify & Profile Target Sites', highlight: ['att', 'site'], style: 'recon'  },
      { conn: 'c1', label: 'Compromise Trusted Website',      highlight: ['att', 'site'], style: 'danger' },
      { conn: 'c1', label: 'Plant Browser Exploit',           highlight: ['att', 'site'], style: 'danger' },
      { conn: 'c2', label: 'Victim Visits Infected Site',     highlight: ['vic', 'site'], style: 'normal' },
      { conn: 'c3', label: 'Drive-by Exploit Fires',          highlight: ['site', 'vic'], style: 'danger' },
      { conn: 'c4', label: 'Victim Beacons to C2',            highlight: ['vic', 'c2'],   style: 'danger' },
    ],
  },

  'keylogger': {
    entities: [
      { id: 'att', label: 'Attacker',   sublabel: 'Keylog Controller', role: 'attacker', x: 90,  y: 170 },
      { id: 'vic', label: 'Victim PC',  sublabel: 'infected machine',  role: 'victim',   x: 370, y: 170 },
      { id: 'log', label: 'Log Buffer', sublabel: 'keystroke capture', role: 'database', x: 620, y: 80  },
      { id: 'c2',  label: 'C2 Server',  sublabel: 'exfil endpoint',    role: 'c2',       x: 620, y: 280 },
    ],
    connections: [
      { id: 'c1', from: 'att', to: 'vic' },
      { id: 'c2', from: 'vic', to: 'log' },
      { id: 'c3', from: 'log', to: 'c2'  },
      { id: 'c4', from: 'att', to: 'c2'  },
    ],
    steps: [
      { conn: 'c1', label: 'Deploy Keylogger via Dropper',   highlight: ['att', 'vic'], style: 'normal' },
      { conn: 'c2', label: 'Hook Keyboard API / Driver',     highlight: ['vic', 'log'], style: 'danger' },
      { conn: 'c2', label: 'Capture Keystrokes Silently',    highlight: ['vic', 'log'], style: 'danger' },
      { conn: 'c3', label: 'Encrypt & Buffer Logs',          highlight: ['log', 'c2'],  style: 'danger' },
      { conn: 'c3', label: 'Periodic Exfil to C2',           highlight: ['log', 'c2'],  style: 'danger' },
      { conn: 'c4', label: 'Attacker Harvests Credentials',  highlight: ['att', 'c2'],  style: 'danger' },
    ],
  },

  'rootkit': {
    entities: [
      { id: 'att',    label: 'Attacker',   sublabel: 'Stealthy Actor',  role: 'attacker', x: 90,  y: 170 },
      { id: 'host',   label: 'Host System',sublabel: 'compromised OS',  role: 'victim',   x: 370, y: 170 },
      { id: 'kernel', label: 'Kernel',     sublabel: 'ring 0 access',   role: 'server',   x: 620, y: 80  },
      { id: 'c2',     label: 'C2 Server',  sublabel: 'persistent access',role: 'c2',      x: 620, y: 280 },
    ],
    connections: [
      { id: 'c1', from: 'att',  to: 'host'   },
      { id: 'c2', from: 'host', to: 'kernel' },
      { id: 'c3', from: 'kernel', to: 'host' },
      { id: 'c4', from: 'host', to: 'c2'     },
      { id: 'c5', from: 'att',  to: 'c2'     },
    ],
    steps: [
      { conn: 'c1', label: 'Gain Initial Access',        highlight: ['att', 'host'],     style: 'normal' },
      { conn: 'c1', label: 'Escalate to Root/SYSTEM',    highlight: ['att', 'host'],     style: 'danger' },
      { conn: 'c2', label: 'Inject Rootkit into Kernel', highlight: ['host', 'kernel'],  style: 'danger' },
      { conn: 'c3', label: 'Hook Syscalls — Hide Files', highlight: ['kernel', 'host'],  style: 'danger' },
      { conn: 'c4', label: 'Establish Covert Persistence',highlight: ['host', 'c2'],     style: 'danger' },
      { conn: 'c5', label: 'Silent Long-term Control',   highlight: ['att', 'c2'],       style: 'danger' },
    ],
  },

  'tailgating': {
    entities: [
      { id: 'att',  label: 'Attacker',   sublabel: 'Poses as employee', role: 'person',       x: 90,  y: 170 },
      { id: 'emp',  label: 'Employee',   sublabel: 'badge holder',      role: 'victim',       x: 370, y: 170 },
      { id: 'door', label: 'Secure Door',sublabel: 'access control',    role: 'organization', x: 370, y: 280 },
      { id: 'srv',  label: 'Server Room',sublabel: 'physical target',   role: 'server',       x: 640, y: 170 },
    ],
    connections: [
      { id: 'c1', from: 'att',  to: 'emp'  },
      { id: 'c2', from: 'emp',  to: 'door' },
      { id: 'c3', from: 'att',  to: 'door' },
      { id: 'c4', from: 'att',  to: 'srv'  },
    ],
    steps: [
      { conn: 'c1', label: 'Scout Building — OSINT',     highlight: ['att', 'emp'],  style: 'recon'  },
      { conn: 'c1', label: 'Pose as Courier / Employee', highlight: ['att', 'emp'],  style: 'normal' },
      { conn: 'c2', label: 'Employee Badged In',         highlight: ['emp', 'door'], style: 'normal' },
      { conn: 'c3', label: 'Attacker Tailgates Through', highlight: ['att', 'door'], style: 'danger' },
      { conn: 'c4', label: 'Reach Server Room',          highlight: ['att', 'srv'],  style: 'danger' },
      { conn: 'c4', label: 'Install Hardware Implant',   highlight: ['att', 'srv'],  style: 'danger' },
    ],
  },

  'qrishing': {
    entities: [
      { id: 'att',  label: 'Attacker',    sublabel: 'Plants QR codes',  role: 'attacker', x: 90,  y: 170 },
      { id: 'qr',   label: 'Fake QR Code',sublabel: 'sticker / print',  role: 'package',  x: 370, y: 80  },
      { id: 'vic',  label: 'Victim',      sublabel: 'scans QR',         role: 'victim',   x: 370, y: 280 },
      { id: 'site', label: 'Phishing Site',sublabel: 'attacker-hosted', role: 'cloud',    x: 630, y: 170 },
    ],
    connections: [
      { id: 'c1', from: 'att',  to: 'qr'   },
      { id: 'c2', from: 'vic',  to: 'qr'   },
      { id: 'c3', from: 'qr',   to: 'site' },
      { id: 'c4', from: 'site', to: 'att'  },
    ],
    steps: [
      { conn: 'c1', label: 'Create Malicious QR Code',      highlight: ['att', 'qr'],   style: 'recon'  },
      { conn: 'c1', label: 'Plant QR at Public Location',   highlight: ['att', 'qr'],   style: 'normal' },
      { conn: 'c2', label: 'Victim Scans QR Code',          highlight: ['vic', 'qr'],   style: 'normal' },
      { conn: 'c3', label: 'Redirected to Phishing Site',   highlight: ['qr', 'site'],  style: 'danger' },
      { conn: 'c3', label: 'Fake Login / Malware Download', highlight: ['qr', 'site'],  style: 'danger' },
      { conn: 'c4', label: 'Credentials Harvested',         highlight: ['site', 'att'], style: 'danger' },
    ],
  },

  'dependency-confusion': {
    entities: [
      { id: 'att', label: 'Attacker',     sublabel: 'Publishes pkg',  role: 'attacker', x: 90,  y: 170 },
      { id: 'pub', label: 'Public Registry', sublabel: 'npm / PyPI', role: 'package',  x: 370, y: 80  },
      { id: 'ci',  label: 'CI/CD Pipeline', sublabel: 'auto install', role: 'server',  x: 370, y: 280 },
      { id: 'prod',label: 'Production',    sublabel: 'infected build',role: 'organization', x: 630, y: 170 },
    ],
    connections: [
      { id: 'c1', from: 'att', to: 'pub'  },
      { id: 'c2', from: 'pub', to: 'ci'   },
      { id: 'c3', from: 'ci',  to: 'prod' },
      { id: 'c4', from: 'att', to: 'prod' },
    ],
    steps: [
      { conn: 'c1', label: 'Discover Internal Package Names', highlight: ['att', 'pub'],  style: 'recon'  },
      { conn: 'c1', label: 'Publish Higher-Version Public Pkg', highlight: ['att', 'pub'], style: 'danger' },
      { conn: 'c2', label: 'CI Resolves Highest Version',     highlight: ['pub', 'ci'],   style: 'danger' },
      { conn: 'c2', label: 'Malicious Package Installed',     highlight: ['pub', 'ci'],   style: 'danger' },
      { conn: 'c3', label: 'Payload Executes in Build',       highlight: ['ci', 'prod'],  style: 'danger' },
      { conn: 'c4', label: 'Supply Chain Backdoor Deployed',  highlight: ['att', 'prod'], style: 'danger' },
    ],
  },

};
