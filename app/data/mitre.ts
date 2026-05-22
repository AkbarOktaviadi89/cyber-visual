export interface MitreEntry {
  tactic: string;
  technique: string;
  id: string;
}

export const MITRE: Record<string, MitreEntry[]> = {
  phishing: [
    { tactic: 'Initial Access',     technique: 'Spearphishing Link',         id: 'T1566.002' },
    { tactic: 'Reconnaissance',     technique: 'Gather Victim Identity Info', id: 'T1589'     },
    { tactic: 'Credential Access',  technique: 'Steal Web Session Cookie',   id: 'T1539'     },
  ],
  ransomware: [
    { tactic: 'Impact',             technique: 'Data Encrypted for Impact',  id: 'T1486'     },
    { tactic: 'Credential Access',  technique: 'OS Credential Dumping',      id: 'T1003'     },
    { tactic: 'Lateral Movement',   technique: 'Remote Desktop Protocol',    id: 'T1021.001' },
  ],
  sqli: [
    { tactic: 'Initial Access',     technique: 'Exploit Public-Facing App',  id: 'T1190'     },
    { tactic: 'Collection',         technique: 'Data from Local System',     id: 'T1005'     },
    { tactic: 'Execution',          technique: 'Command and Scripting',      id: 'T1059'     },
  ],
  ddos: [
    { tactic: 'Impact',             technique: 'Network Denial of Service',  id: 'T1498'     },
    { tactic: 'Resource Dev',       technique: 'Botnet',                     id: 'T1583.005' },
    { tactic: 'Impact',             technique: 'Endpoint Denial of Service', id: 'T1499'     },
  ],
  mitm: [
    { tactic: 'Credential Access',  technique: 'Adversary-in-the-Middle',    id: 'T1557'     },
    { tactic: 'Credential Access',  technique: 'Network Sniffing',           id: 'T1040'     },
    { tactic: 'Collection',         technique: 'Man in the Browser',         id: 'T1185'     },
  ],
  xss: [
    { tactic: 'Initial Access',     technique: 'Drive-by Compromise',        id: 'T1189'     },
    { tactic: 'Credential Access',  technique: 'Steal Web Session Cookie',   id: 'T1539'     },
    { tactic: 'Collection',         technique: 'Input Capture',              id: 'T1056'     },
  ],
  'zero-day': [
    { tactic: 'Initial Access',     technique: 'Exploit Public-Facing App',  id: 'T1190'     },
    { tactic: 'Execution',          technique: 'Exploitation for Execution', id: 'T1203'     },
    { tactic: 'Defense Evasion',    technique: 'Exploit Protection Bypass',  id: 'T1211'     },
  ],
  'social-engineering': [
    { tactic: 'Initial Access',     technique: 'Phishing',                   id: 'T1566'     },
    { tactic: 'Reconnaissance',     technique: 'Phishing for Information',   id: 'T1598'     },
    { tactic: 'Initial Access',     technique: 'Valid Accounts',             id: 'T1078'     },
  ],
  'dns-spoofing': [
    { tactic: 'Credential Access',  technique: 'Adversary-in-the-Middle',    id: 'T1557'     },
    { tactic: 'Initial Access',     technique: 'Drive-by Compromise',        id: 'T1189'     },
    { tactic: 'Defense Evasion',    technique: 'DNS',                        id: 'T1071.004' },
  ],
  'supply-chain': [
    { tactic: 'Initial Access',     technique: 'Supply Chain Compromise',    id: 'T1195'     },
    { tactic: 'Persistence',        technique: 'Compromise Software Supply', id: 'T1195.002' },
    { tactic: 'Exfiltration',       technique: 'Exfiltration Over C2',       id: 'T1041'     },
  ],
  'insider-threat': [
    { tactic: 'Exfiltration',       technique: 'Exfiltration Over Alt Proto',id: 'T1048'     },
    { tactic: 'Collection',         technique: 'Data from Local System',     id: 'T1005'     },
    { tactic: 'Defense Evasion',    technique: 'Indicator Removal',          id: 'T1070'     },
  ],
  'ai-attack': [
    { tactic: 'Reconnaissance',     technique: 'Gather Victim Identity Info',id: 'T1589'     },
    { tactic: 'Resource Dev',       technique: 'Develop Capabilities',       id: 'T1587'     },
    { tactic: 'Execution',          technique: 'Command and Scripting',      id: 'T1059'     },
  ],
  'credential-stuffing': [
    { tactic: 'Initial Access',     technique: 'Valid Accounts',             id: 'T1078'     },
    { tactic: 'Credential Access',  technique: 'Brute Force',                id: 'T1110'     },
    { tactic: 'Initial Access',     technique: 'External Remote Services',   id: 'T1133'     },
  ],
  'cryptojacking': [
    { tactic: 'Execution',          technique: 'Command and Scripting',      id: 'T1059'     },
    { tactic: 'Impact',             technique: 'Resource Hijacking',         id: 'T1496'     },
    { tactic: 'Defense Evasion',    technique: 'Masquerading',               id: 'T1036'     },
  ],
  'csrf': [
    { tactic: 'Initial Access',     technique: 'Drive-by Compromise',        id: 'T1189'     },
    { tactic: 'Execution',          technique: 'User Execution',             id: 'T1204'     },
    { tactic: 'Credential Access',  technique: 'Steal Web Session Cookie',   id: 'T1539'     },
  ],
  'sim-swapping': [
    { tactic: 'Initial Access',     technique: 'Phishing',                   id: 'T1566'     },
    { tactic: 'Credential Access',  technique: 'Multi-Factor Auth Interception', id: 'T1111' },
    { tactic: 'Initial Access',     technique: 'Valid Accounts',             id: 'T1078'     },
  ],
  'fileless-malware': [
    { tactic: 'Defense Evasion',    technique: 'Reflective Code Loading',    id: 'T1620'     },
    { tactic: 'Persistence',        technique: 'Boot/Logon Autostart',       id: 'T1547'     },
    { tactic: 'Execution',          technique: 'Command/Scripting Interpreter', id: 'T1059'  },
  ],
  'clickjacking': [
    { tactic: 'Initial Access',     technique: 'Drive-by Compromise',        id: 'T1189'     },
    { tactic: 'Execution',          technique: 'User Execution',             id: 'T1204'     },
    { tactic: 'Defense Evasion',    technique: 'HTML Smuggling',             id: 'T1027.006' },
  ],
  'evil-maid': [
    { tactic: 'Initial Access',     technique: 'Hardware Additions',         id: 'T1200'     },
    { tactic: 'Credential Access',  technique: 'Input Capture',              id: 'T1056'     },
    { tactic: 'Defense Evasion',    technique: 'Pre-OS Boot',                id: 'T1542'     },
  ],
  'bad-usb': [
    { tactic: 'Initial Access',     technique: 'Hardware Additions',         id: 'T1200'     },
    { tactic: 'Execution',          technique: 'User Execution',             id: 'T1204'     },
    { tactic: 'Persistence',        technique: 'Boot/Logon Autostart',       id: 'T1547'     },
  ],
  'rainbow-table': [
    { tactic: 'Credential Access',  technique: 'Brute Force: Password Crack',id: 'T1110.002' },
    { tactic: 'Credential Access',  technique: 'OS Credential Dumping',      id: 'T1003'     },
    { tactic: 'Initial Access',     technique: 'Valid Accounts',             id: 'T1078'     },
  ],
  'brute-force': [
    { tactic: 'Credential Access',  technique: 'Brute Force',                id: 'T1110'     },
    { tactic: 'Credential Access',  technique: 'Password Cracking',          id: 'T1110.002' },
    { tactic: 'Initial Access',     technique: 'Valid Accounts',             id: 'T1078'     },
  ],
  'cloud-misconfig': [
    { tactic: 'Initial Access',     technique: 'Valid Accounts: Cloud',      id: 'T1078.004' },
    { tactic: 'Collection',         technique: 'Data from Cloud Storage',    id: 'T1530'     },
    { tactic: 'Privilege Escalation','technique': 'Valid Accounts',           id: 'T1078'     },
  ],
  'ssrf': [
    { tactic: 'Initial Access',     technique: 'Exploit Public-Facing App',  id: 'T1190'     },
    { tactic: 'Discovery',          technique: 'Cloud Instance Metadata',    id: 'T1552.005' },
    { tactic: 'Credential Access',  technique: 'Unsecured Credentials',      id: 'T1552'     },
  ],
  'mobile-malware': [
    { tactic: 'Initial Access',     technique: 'Repackaged Application',     id: 'T1444'     },
    { tactic: 'Collection',         technique: 'Input Capture',              id: 'T1056'     },
    { tactic: 'Credential Access',  technique: 'Access Notifications',       id: 'T1517'     },
  ],
  'iot-botnet': [
    { tactic: 'Initial Access',     technique: 'External Remote Services',   id: 'T1133'     },
    { tactic: 'Lateral Movement',   technique: 'Remote Services',            id: 'T1021'     },
    { tactic: 'Impact',             technique: 'Network Denial of Service',  id: 'T1498'     },
  ],
  'log4shell': [
    { tactic: 'Initial Access',     technique: 'Exploit Public-Facing App',  id: 'T1190'     },
    { tactic: 'Execution',          technique: 'Exploitation for Execution', id: 'T1203'     },
    { tactic: 'Command & Control',  technique: 'Application Layer Protocol', id: 'T1071'     },
  ],
  'printnightmare': [
    { tactic: 'Privilege Escalation','technique': 'Exploit Privilege Escalation', id: 'T1068' },
    { tactic: 'Lateral Movement',   technique: 'Remote Services',            id: 'T1021'     },
    { tactic: 'Persistence',        technique: 'Boot/Logon Autostart',       id: 'T1547'     },
  ],
  'oauth-bypass': [
    { tactic: 'Initial Access',     technique: 'Valid Accounts: Cloud',      id: 'T1078.004' },
    { tactic: 'Credential Access',  technique: 'Steal Application Token',    id: 'T1528'     },
    { tactic: 'Privilege Escalation','technique': 'Abuse Elevation Mechanism', id: 'T1548'  },
  ],
  'ssti': [
    { tactic: 'Initial Access',     technique: 'Exploit Public-Facing App',  id: 'T1190'     },
    { tactic: 'Execution',          technique: 'Server-Side Scripting',      id: 'T1059'     },
    { tactic: 'Collection',         technique: 'Data from Local System',     id: 'T1005'     },
  ],
  'xxe': [
    { tactic: 'Initial Access',     technique: 'Exploit Public-Facing App',  id: 'T1190'     },
    { tactic: 'Collection',         technique: 'Data from Local System',     id: 'T1005'     },
    { tactic: 'Discovery',          technique: 'Network Service Scanning',   id: 'T1046'     },
  ],
  'jwt-attack': [
    { tactic: 'Credential Access',  technique: 'Steal Application Token',    id: 'T1528'     },
    { tactic: 'Defense Evasion',    technique: 'Forge Web Credentials',      id: 'T1606'     },
    { tactic: 'Privilege Escalation','technique': 'Valid Accounts',           id: 'T1078'     },
  ],
  'subdomain-takeover': [
    { tactic: 'Resource Dev',       technique: 'Acquire Infrastructure',     id: 'T1583'     },
    { tactic: 'Initial Access',     technique: 'Drive-by Compromise',        id: 'T1189'     },
    { tactic: 'Credential Access',  technique: 'Steal Web Session Cookie',   id: 'T1539'     },
  ],
  'arp-spoofing': [
    { tactic: 'Credential Access',  technique: 'Adversary-in-the-Middle',    id: 'T1557'     },
    { tactic: 'Credential Access',  technique: 'Network Sniffing',           id: 'T1040'     },
    { tactic: 'Collection',         technique: 'Man in the Browser',         id: 'T1185'     },
  ],
  'bec': [
    { tactic: 'Initial Access',     technique: 'Spearphishing via Service',  id: 'T1566.003' },
    { tactic: 'Impersonation',      technique: 'Email Account Compromise',   id: 'T1586.002' },
    { tactic: 'Impact',             technique: 'Financial Theft',            id: 'T1657'     },
  ],
  'watering-hole': [
    { tactic: 'Initial Access',     technique: 'Drive-by Compromise',        id: 'T1189'     },
    { tactic: 'Resource Dev',       technique: 'Compromise Infrastructure',  id: 'T1584'     },
    { tactic: 'Execution',          technique: 'Exploitation for Execution', id: 'T1203'     },
  ],
  'keylogger': [
    { tactic: 'Collection',         technique: 'Input Capture: Keylogging',  id: 'T1056.001' },
    { tactic: 'Persistence',        technique: 'Boot/Logon Autostart',       id: 'T1547'     },
    { tactic: 'Exfiltration',       technique: 'Exfiltration Over C2',       id: 'T1041'     },
  ],
  'rootkit': [
    { tactic: 'Defense Evasion',    technique: 'Rootkit',                    id: 'T1014'     },
    { tactic: 'Persistence',        technique: 'Pre-OS Boot: Bootkit',       id: 'T1542.003' },
    { tactic: 'Defense Evasion',    technique: 'Hide Artifacts',             id: 'T1564'     },
  ],
  'tailgating': [
    { tactic: 'Initial Access',     technique: 'Hardware Additions',         id: 'T1200'     },
    { tactic: 'Reconnaissance',     technique: 'Physical Reconnaissance',    id: 'T1593'     },
    { tactic: 'Collection',         technique: 'Physical Access',            id: 'T1005'     },
  ],
  'qrishing': [
    { tactic: 'Initial Access',     technique: 'Spearphishing Link',         id: 'T1566.002' },
    { tactic: 'Reconnaissance',     technique: 'Phishing for Information',   id: 'T1598'     },
    { tactic: 'Credential Access',  technique: 'Steal Web Session Cookie',   id: 'T1539'     },
  ],
  'dependency-confusion': [
    { tactic: 'Initial Access',     technique: 'Supply Chain Compromise',    id: 'T1195'     },
    { tactic: 'Execution',          technique: 'Command and Scripting',      id: 'T1059'     },
    { tactic: 'Persistence',        technique: 'Event Triggered Execution',  id: 'T1546'     },
  ],
};
