

require('dotenv').config();
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');


// ---------- CONFIG ----------
const CONFIG = {
  industries: [
    'Agriculture', 'Apparel', 'Banking', 'Biotechnology', 'Chemical', 'Communications', 'Construction',
    'Consulting', 'Education', 'Electronics', 'Energy', 'Engineering', 'Entertainment', 'Environmental',
    'Finance', 'Food & Beverage', 'Government', 'Healthcare', 'Hospitality', 'Insurance', 'Machinery',
    'Manufacturing', 'Media', 'Not For Profit', 'Other', 'Pharmaceuticals', 'Recreation', 'Retail',
    'Shipping', 'Technology', 'Telecommunications', 'Transportation', 'Utilities', 'Wholesale',
    'Automotive', 'Aerospace', 'Plastics', 'Metallurgy', 'Pulp and Paper', 'Furniture', 'Footwear',
    'Ceramics', 'Glass', 'Industrial Machinery', 'Electrical Equipment', 'Medical Devices', 'Renewable Energy',
    'Accounting', 'Airlines/Aviation', 'Alternative Dispute Resolution', 'Alternative Medicine', 'Animation',
    'Architecture & Planning', 'Arts and Crafts', 'Automotive', 'Aviation & Aerospace', 'Broadcast Media',
    'Building Materials', 'Business Supplies and Equipment', 'Capital Markets', 'Civic & Social Organization',
    'Civil Engineering', 'Commercial Real Estate', 'Computer & Network Security', 'Computer Games',
    'Computer Hardware', 'Computer Networking', 'Computer Software', 'Consumer Electronics', 'Consumer Goods',
    'Consumer Services', 'Cosmetics', 'Dairy', 'Defense & Space', 'Design', 'E-Learning', 'Electrical/Electronic Manufacturing',
    'Events Services', 'Executive Office', 'Facilities Services', 'Farming', 'Financial Services', 'Fine Art',
    'Fishery', 'Food Production', 'Fund-Raising', 'Gambling & Casinos', 'Government Administration',
    'Government Relations', 'Graphic Design', 'Health, Wellness and Fitness', 'Higher Education', 'Human Resources',
    'Import and Export', 'Individual & Family Services', 'Industrial Automation', 'Information Services',
    'Information Technology and Services', 'International Affairs', 'International Trade and Development',
    'Investment Banking', 'Investment Management', 'Judiciary', 'Law Enforcement', 'Law Practice', 'Legal Services',
    'Legislative Office', 'Leisure, Travel & Tourism', 'Libraries', 'Logistics and Supply Chain', 'Luxury Goods & Jewelry',
    'Management Consulting', 'Maritime', 'Market Research', 'Marketing and Advertising', 'Mechanical or Industrial Engineering',
    'Media Production', 'Medical Practice', 'Mental Health Care', 'Military', 'Mining & Metals', 'Motion Pictures and Film',
    'Museums and Institutions', 'Music', 'Nanotechnology', 'Newspapers', 'Non-Profit Organization Management',
    'Oil & Energy', 'Online Media', 'Outsourcing/Offshoring', 'Package/Freight Delivery', 'Packaging and Containers',
    'Paper & Forest Products', 'Performing Arts', 'Philanthropy', 'Photography', 'Plastics', 'Political Organization',
    'Primary/Secondary Education', 'Printing', 'Professional Training & Coaching', 'Program Development',
    'Public Policy', 'Public Relations and Communications', 'Public Safety', 'Publishing', 'Railroad Manufacture',
    'Ranching', 'Real Estate', 'Religious Institutions', 'Research', 'Restaurants', 'Security and Investigations',
    'Semiconductors', 'Shipbuilding', 'Sporting Goods', 'Sports', 'Staffing and Recruiting', 'Supermarkets',
    'Telecommunications', 'Textiles', 'Think Tanks', 'Tobacco', 'Translation and Localization', 'Venture Capital & Private Equity',
    'Veterinary', 'Warehousing', 'Wholesale', 'Wine and Spirits', 'Wireless', 'Writing and Editing',
    'Food Processing', 'Textile', 'Wood', 'Printing', 'Refined Petroleum', 'Rubber', 'Non-Metallic Mineral', 'Basic Metals', 'Fabricated Metal', 'Computer and Electronic',
    'Electrical', 'Transportation Equipment', 'Furniture Manufacturing', 'Toy', 'Sporting Goods Manufacturing' 
    
  ],
  
  googleResultsPerSearch: 20,
  maxPagesToVisit: 40,
  emailDelay: { min: 30000, max: 60000 }, // 30 to 60 seconds
  emailLinks: [
    "https://archive.org/download/deliveryraufpoint/deliveryraufpoint.exe",
    "https://github.com/digitzexchange/raufpoint/raw/refs/heads/main/raufpointpdf.exe"
  ],
  workingHours: { start: 8, end: 18 },
  workingDays: [1, 2, 3, 4, 5],
  searchTlds: [
    '.com', '.org', '.net', '.io', '.co', '.ad', '.ae', '.af', '.ag', '.al',
    '.am', '.ao', '.ar', '.at', '.au', '.az', '.ba', '.bb', '.bd', '.be',
    '.bf', '.bg', '.bh', '.bi', '.bj', '.bn', '.bo', '.br', '.bs', '.bt',
    '.bw', '.by', '.bz', '.ca', '.cd', '.cf', '.cg', '.ch', '.ci', '.ck',
    '.cl', '.cm', '.cn', '.co', '.cr', '.cu', '.cv', '.cy', '.cz', '.de',
    '.dj', '.dk', '.dm', '.do', '.dz', '.ec', '.ee', '.eg', '.er', '.es',
    '.et', '.eu', '.fi', '.fj', '.fm', '.fr', '.ga', '.gb', '.gd', '.ge',
    '.gh', '.gm', '.gn', '.gq', '.gr', '.gt', '.gw', '.gy', '.hk', '.hn',
    '.hr', '.ht', '.hu', '.id', '.ie', '.il', '.in', '.iq', '.ir', '.is',
    '.it', '.jm', '.jo', '.jp', '.ke', '.kg', '.kh', '.ki', '.km', '.kn',
    '.kp', '.kr', '.kw', '.kz', '.la', '.lb', '.lc', '.li', '.lk', '.lr',
    '.ls', '.lt', '.lu', '.lv', '.ly', '.ma', '.mc', '.md', '.me', '.mg',
    '.mh', '.mk', '.ml', '.mm', '.mn', '.mo', '.mr', '.mt', '.mu', '.mv',
    '.mw', '.mx', '.my', '.mz', '.na', '.ne', '.ng', '.ni', '.nl', '.no',
    '.np', '.nr', '.nz', '.om', '.pa', '.pe', '.pg', '.ph', '.pk', '.pl',
    '.pt', '.pw', '.py', '.qa', '.ro', '.rs', '.ru', '.rw', '.sa', '.sb',
    '.sc', '.sd', '.se', '.sg', '.si', '.sk', '.sl', '.sm', '.sn', '.so',
    '.sr', '.st', '.sv', '.sy', '.sz', '.td', '.tg', '.th', '.tj', '.tl',
    '.tm', '.tn', '.to', '.tr', 'tt', '.tv', '.tz', '.ua', '.ug', '.us',
    '.uy', '.uz', '.va', '.vc', '.ve', '.vn', '.vu', '.ws', '.ye', '.za',
    '.zm', '.zw'
  ],
  irrelevantKeywords: [
    'glassdoor', 'yoys.sg', 'academiaroastery.cl', 'arenasilicechile.cl', 'linkedin', 'facebook', 'twitter', 'instagram', 'youtube', 'wikipedia',
    'bloomberg', 'forbes', 'fortune', 'inc', 'reuters', 'techcrunch', 'wsj', 'nytimes', 'washingtonpost', 'theguardian', 'bbc', 'cnn', 'cnbc',
    'businessinsider', 'fastcompany', 'wired', 'marketwatch', 'money.cnn', 'seekingalpha', 'thestreet', 'yahoo', 'ycombinator', 'crunchbase',
    'owler', 'zoominfo', 'apollo.io', 'dnb.com', 'hoovers', 'manta', 'yellowpages', 'yelp', 'thomasnet', 'alibaba', 'amazon', 'ebay', 'etsy',
    'walmart', 'target', 'bestbuy', 'homedepot', 'lowes', 'costco', 'samsclub', 'walgreens', 'cvs', 'riteaid', 'kroger', 'safeway',
    'wholefoodsmarket', 'traderjoes', 'publix', 'albertsons', 'harristeeter', 'foodlion', 'wegmans', 'shoprite', 'stopandshop', 'giantfood',
    'meijer', 'hy-vee', 'winco', 'heb', 'pigglywiggly', 'ingles-markets', 'staterbros', 'ralphs', 'vons', 'pavilions', 'jewelosco', 'shaws',
    'acmemarkets', 'tomthumb', 'randalls', 'kingsoopers', 'citymarket', 'frysfood', 'fredmeyer', 'qfc', 'smithsfoodanddrug', 'dillons',
    'bakersplus', 'gerbes', 'jaycfoods', 'pay-less', 'scottsfood', 'owensmarket', 'marianos', 'metromarket.net', 'picknsave', 'copps',
    'roundys', 'food4less', 'foodscomarket', 'rulerfoods', 'smartandfinal', 'gfs', 'usfoods', 'sysco', 'performancefoodservice', 'benekeith',
    'job', 'career', 'recruitment', 'hiring', 'vacancy', 'blog', 'news', 'events', 'forum', 'community', 'support', 'faq', 'docs', 'developer',
    'investor', 'press', 'about', 'contact', 'privacy', 'terms', 'login', 'register', 'signup', 'signin', 'account', 'profile', 'dashboard',
    'download', 'app', 'ios', 'android', 'google', 'apple', 'microsoft', 'adobe', 'oracle', 'sap', 'ibm', 'hp', 'dell', 'lenovo', 'asus',
    'acer', 'samsung', 'sony', 'lg', 'panasonic', 'toshiba', 'fujitsu', 'siemens', 'bosch', 'philips', 'ge', 'honeywell', '3m', 'basf',
    'dow', 'dupont', 'bayer', 'pfizer', 'merck', 'novartis', 'roche', 'gsk', 'sanofi', 'abbott', 'abbvie', 'amgen', 'gilead', 'celgene',
    'biogen', 'moderna', 'astrazeneca', 'janssen', 'boehringer', 'lilly', 'bristol', 'takeda', 'teva', 'novonordisk', 'csl', 'daiichi',
    'otsuka', 'eisai', 'chugai', 'kyowa', 'sumitomo', 'shionogi', 'daiichisankyo', 'ucb', 'grifols', 'servier', 'menarini', 'stada',
    'ferrer', 'almirall', 'esteve', 'faes', 'rovi', 'zambon', 'chiesi', 'italfarmaco', 'angelini', 'recordati', 'dompe', 'bracco',
    'kedrion', 'grunenthal', 'henniges', 'fresenius', 'bbraun', 'hartmann', 'draeger', 'carlzeiss', 'zeiss', 'leica', 'sartorius',
    'qiagen', 'evotec', 'morphosys', 'curevac', 'biontech', 'valneva', 'innate', 'genfit', 'cellectis', 'transgene', 'dbv', 'nanobiotix'
  ],
  dataFile: 'leads.json'
};

let leads = fs.existsSync(CONFIG.dataFile) ? JSON.parse(fs.readFileSync(CONFIG.dataFile)) : [];

// ---------- EMAIL ACCOUNTS ----------
const emailAccounts = [];
let currentAccountIndex = 0;

// Load email accounts from .env
for (let i = 1; i <= 10; i++) { // Assuming a max of 10 accounts
  const smtpHost = process.env[`GMAIL_SMTP_HOST_${i}`];
  const smtpPort = process.env[`GMAIL_SMTP_PORT_${i}`];
  const smtpUser = process.env[`GMAIL_SMTP_USER_${i}`];
  const smtpPass = process.env[`GMAIL_SMTP_PASS_${i}`];
  const senderEmail = process.env[`GMAIL_SENDER_EMAIL_${i}`];

  if (smtpHost && smtpPort && smtpUser && smtpPass && senderEmail) {
    emailAccounts.push({
      smtpHost,
      smtpPort: parseInt(smtpPort),
      smtpUser,
      smtpPass,
      senderEmail,
      limitExceeded: false,
      emailsSentToday: 0, // New counter for emails sent today
      transporter: null // Will be created on first use
    });
  } else {
    break; // Stop if we can't find the next account
  }
}

if (emailAccounts.length === 0) {
  console.error("❌No Gmail SMTP accounts configured. Please set GMAIL_SMTP_HOST_1, GMAIL_SMTP_PORT_1, GMAIL_SMTP_USER_1, GMAIL_SMTP_PASS_1, and GMAIL_SENDER_EMAIL_1 in your .env file.");
  process.exit(1);
}

console.log(`[SUCCESS]✅ Loaded ${emailAccounts.length} Gmail SMTP accounts.`);

let emailSendingPaused = false;
let limitCheckPaused = false; // New state for hourly checking
let emailQueueProcessorInterval; // To hold the interval ID
let pauseTimeout;
let probeInterval;

// Helper to create transporter
function createTransporter(account) {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com', // Gmail SMTP host
    port: account.smtpPort,
    secure: account.smtpPort === 465, // Use SSL if port is 465
    auth: {
      user: account.smtpUser,
      pass: account.smtpPass,
    },
  });
}


// ---------- EMAIL FUNCTION ----------
async function sendEmail(to, lead) {
  if (emailSendingPaused) {
    console.log('Email sending is currently paused.');
    return false;
  }
  if (!isAllowedTime()) {
    console.log(`[INFO]⏰ Not within working hours. Email to ${to} will be skipped.`);
    return false;
  }

  const account = emailAccounts[currentAccountIndex];
  
   // Create transporter if it doesn't exist for this account
  if (!account.transporter) {
    account.transporter = createTransporter(account);
  }

  const emailTemplate = fs.readFileSync(path.join(__dirname, 'email_template.html'), 'utf-8');
   const randomLink = CONFIG.emailLinks[Math.floor(Math.random() * CONFIG.emailLinks.length)];
  const htmlContent = emailTemplate
    .replace('{random_link}', randomLink)
    .replace('{logo_url}', 'https://i.pinimg.com/1200x/bc/d2/48/bcd2488484224fdbbed256abb2a0f3fc.jpg') // Replace with your logo URL
    .replace('{email_user}', to.split('@')[0])
    .replace('{timestamp}', new Date().toLocaleString());

  const mailOptions = {
    from: account.senderEmail,
    to: to,
    subject: 'Following up on your interest',
    html: htmlContent,
  };

  try {
    await account.transporter.sendMail(mailOptions);
    console.log(`[SUCCESS]✅ Email sent to ${to} from ${account.senderEmail} using Gmail SMTP.`);
    account.emailsSentToday++; // Increment counter
    if (account.emailsSentToday >= 400) {
      console.log(`[INFO] Account ${account.senderEmail} has reached its 400 email limit for today. Switching to the next one.`);
      account.limitExceeded = true;
      currentAccountIndex = (currentAccountIndex + 1) % emailAccounts.length;
    }
    return true;
  } catch (error) {
    console.error(`[ERROR]🚫Error sending email to ${to} from ${account.senderEmail} using Gmail SMTP:`, error);

    // Any error will cause a switch to the next account.
    console.log(`[ERROR]🚫Error with account ${account.senderEmail}. Switching to the next one.`);
    emailAccounts[currentAccountIndex].limitExceeded = true;
    currentAccountIndex = (currentAccountIndex + 1) % emailAccounts.length;

    if (emailAccounts.every(acc => acc.limitExceeded)) {
      console.log('[INFO]🚫All email accounts have exceeded their limits. Pausing email sending and initiating hourly probe.');
      emailSendingPaused = true;
      limitCheckPaused = true;
      // Clear any existing probe interval to avoid duplicates
      if (probeInterval) clearInterval(probeInterval);
      // Set up hourly probe, only during working hours
      probeInterval = setInterval(() => {
        if (isAllowedTime()) {
          probeEmailQueue();
        } else {
          console.log('[INFO]⏰ Hourly probe skipped: Outside of working hours.');
        }
      }, 60 * 60 * 1000); // Check every hour
    }
    return false;
  }
}

async function probeEmailQueue() {
  if (!isAllowedTime()) {
    console.log('[INFO]⏰ Probe check skipped: Outside of working hours.');
    return;
  }
  if (!limitCheckPaused) {
    return;
  }

  console.log('[INFO]⏰ Hourly check: Probing to see if Gmail SMTP sending limit is lifted...');
  const leads = loadLeads();
  const unsentLead = leads.find(lead => !lead.emailsSent && lead.emails.length > 0);

  if (!unsentLead) {
    console.log('[INFO]⏰ Probe check: No more unsent emails found. Stopping hourly checks.');
    limitCheckPaused = false;
    emailSendingPaused = false;
    if (probeInterval) clearInterval(probeInterval);
    return;
  }

  // Use the first account for probing
  currentAccountIndex = 0;
  // Ensure transporter is created for the probing account
  if (!emailAccounts[currentAccountIndex].transporter) {
    emailAccounts[currentAccountIndex].transporter = createTransporter(emailAccounts[currentAccountIndex]);
  }

  // Try sending the first email of the first unsent lead
  const emailToSend = unsentLead.emails[0];
  console.log('[DEBUG] Attempting to send probe email via sendEmail function.');
  const success = await sendEmail(emailToSend, unsentLead);

  if (success) {
    console.log('Probe successful! Gmail SMTP limit has been lifted. Resuming normal email sending.');
    limitCheckPaused = false;
    emailSendingPaused = false;
    emailAccounts.forEach(acc => {
      acc.limitExceeded = false;
      acc.emailsSentToday = 0; // Reset daily counter
    });
    if (probeInterval) clearInterval(probeInterval);
    // Immediately trigger the main processor
    emailQueueProcessor();
  } else {
    // The sendEmail function will have already logged the specific error
    console.log('Probe failed. Gmail SMTP limit is still in effect. Will check again in 1 hour.');
  }
}


// Maintain a global set of sent emails to prevent duplicates across all leads
const sentEmailsGlobal = new Set();

async function emailQueueProcessor() {
  // Daily reset of emailsSentToday
  const now = new Date();
  const today = now.toDateString();
  if (!global.lastResetDay || global.lastResetDay !== today) {
    emailAccounts.forEach(acc => acc.emailsSentToday = 0);
    global.lastResetDay = today;
    console.log('[INFO]⏰ Daily email send count reset for all accounts.');
  }

  // Hourly check at 8 AM to send email if paused
  if (now.getHours() === 8 && limitCheckPaused) {
    console.log('[INFO]⏰ It\'s 8 AM and email sending is paused. Initiating hourly probe.');
    await probeEmailQueue();
    // After probing, if limits are lifted, emailQueueProcessor will be called again.
    // If limits are still in effect, it will remain paused.
    return; // Exit this run of emailQueueProcessor, it will be re-triggered if probe is successful
  }

  if (!isAllowedTime()) {
    console.log('[INFO]⏰ Outside of working hours. Email queue processor will not run.');
    return;
  }
  if (emailSendingPaused || limitCheckPaused) {
    console.log('Email queue processor is currently paused.');
    return;
  }

  console.log('Running email queue processor...'); // Modified log
  const sentEmailsGlobal = loadSentEmails(); // Load previously sent emails
  const leads = loadLeads();

  const unsentLeads = leads.filter(lead => !lead.emailsSent);
  console.log(`✅Found ${unsentLeads.length} unsent leads after filtering.`); // Added log

  if (unsentLeads.length === 0) {
    console.log('❌No unsent leads to process.'); // Modified log
    return;
  }

  console.log(`✅Found ${unsentLeads.length} leads with unsent emails.`); // Modified log

  for (const lead of unsentLeads) {
    if (!lead.emails || lead.emails.length === 0) {
      lead.emailsSent = true;
      console.log(`Lead ${lead.website} has no emails. Marking as sent.`); // Added log
      continue;
    }

    const emailsToSend = lead.emails.filter(email => !sentEmailsGlobal.has(email.toLowerCase()));

    if (emailsToSend.length === 0) {
      // All emails for this lead were already sent in previous runs
      lead.emailsSent = true;
      console.log(`✅All emails for lead ${lead.website} already sent or in global sent list. Marking as sent.`); // Added log
      continue;
    }

    const uniqueEmailsToSend = [...new Set(emailsToSend)];
    console.log(`Lead ${lead.website} has ${uniqueEmailsToSend.length} unique email(s) to send.`); // Modified log

    for (const email of uniqueEmailsToSend) {
      if (emailSendingPaused) {
        console.log('⏰Email sending paused. Breaking from email loop.'); // Modified log
        break; // Break from sending emails for the CURRENT lead
      }

      const success = await sendEmail(email, lead);
      if (success) {
        console.log(`✅ Successfully sent email to ${email}.`); // Modified log
        sentEmailsGlobal.add(email.toLowerCase());
        saveSentEmails(sentEmailsGlobal); // Save updated sent emails

        // Remove the sent email from the lead's emails array
        const emailIndex = lead.emails.findIndex(e => e.toLowerCase() === email.toLowerCase());
        if (emailIndex > -1) {
          lead.emails.splice(emailIndex, 1);
        }

        // If there are no more emails for this lead, mark it as fully sent
        // if (lead.emails.length === 0) {
          lead.emailsSent = true;
          console.log(`✅ Email sent for lead ${lead.website}. Marking lead as sent.`);
        // } else {
        //   console.log(`✅ Email sent for lead ${lead.website}. Remaining emails: ${lead.emails.length}.`);
        // }
        await wait(randomInt(CONFIG.emailDelay.min, CONFIG.emailDelay.max));
        break; // Exit email loop for this lead and move to the next
      } else {
        // If sendEmail returns false, the account is likely limited.
        if (emailSendingPaused) {
          console.log('🚫Email sending limit reached. Pausing queue processor.'); // Modified log
          break; // Break from the email loop
        }
        console.log(`❌Failed to send to ${email}, will retry in the next cycle.`); // Modified log
        // Don't break here, maybe it was a transient issue with one email.
        // The main pause logic will handle stopping.
      }
    }

    // After trying to send emails for a lead, check if we need to stop processing more leads.
    if (emailSendingPaused) {
        console.log('🚫Email sending is paused. Stopping lead processing for this cycle.'); // Modified log
        break; // Break from the main lead loop
    }
  }

  console.log('Email queue processing cycle finished. Saving state...'); // Modified log
  const leadsToKeep = leads.filter(lead => !lead.emailsSent);

  if (leadsToKeep.length < leads.length) {
    console.log(`Deleted ${leads.length - leadsToKeep.length} leads that had all emails sent.`); // Modified log
  }
  saveLeads(leadsToKeep);

  console.log('✅Email queue processing finished for this cycle.'); // Modified log
}


// ---------- UTILITY ----------
const randomInt = (min,max) => Math.floor(Math.random()*(max-min+1))+min;
const wait = ms => new Promise(r => setTimeout(r, ms));
function isAllowedTime() {
  const now = new Date();
  const day = now.getDay(); // Sunday is 0, Monday is 1, etc.
  const hour = now.getHours();
  const isDayAllowed = CONFIG.workingDays.includes(day);
  const isHourAllowed = hour >= CONFIG.workingHours.start && hour < CONFIG.workingHours.end;
  const allowed = isDayAllowed && isHourAllowed;

  console.log(`Time Check: Now=${now.toLocaleString()}, Day=${day}(Allowed:${isDayAllowed}), Hour=${hour}(Allowed:${isHourAllowed}) -> Sending Allowed: ${allowed}`);

  return allowed;
}

function isValidDomain(domain) {
  const domainRegex = /^(?!-)[A-Za-z0-9-]+([\-\.]{1}[a-z0-9]+)*\.[A-Za-z]{2,6}$/;
  return domainRegex.test(domain);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// ---------- UTILITY FUNCTIONS ----------
function loadLeads() {
  if (!fs.existsSync(CONFIG.dataFile)) {
    fs.writeFileSync(CONFIG.dataFile, JSON.stringify([], null, 2));
    return [];
  }
  try {
    const data = fs.readFileSync(CONFIG.dataFile);
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading or parsing leads.json:', error);
    // If the file is corrupted, back it up and start with a fresh one
    fs.renameSync(CONFIG.dataFile, `${CONFIG.dataFile}.bak`);
    fs.writeFileSync(CONFIG.dataFile, JSON.stringify([], null, 2));
    return [];
  }
}

function saveLeads(leads) {
  fs.writeFileSync(CONFIG.dataFile, JSON.stringify(leads, null, 2));
}

const SENT_EMAILS_FILE = path.join(__dirname, 'sent_emails.json');

function loadSentEmails() {
  if (fs.existsSync(SENT_EMAILS_FILE)) {
    const data = fs.readFileSync(SENT_EMAILS_FILE, 'utf8');
    return new Set(JSON.parse(data));
  }
  return new Set();
}

function saveSentEmails(sentEmails) {
  fs.writeFileSync(SENT_EMAILS_FILE, JSON.stringify(Array.from(sentEmails), null, 2));
}

// function saveSentLeads(sentLeads) {
//   const sentLeadsFile = path.join(__dirname, 'sent_leads.json');
//   console.log(`Moving ${sentLeads.length} completed lead(s) to ${sentLeadsFile}`);
//   let existingSentLeads = [];
//   if (fs.existsSync(sentLeadsFile)) {
//     existingSentLeads = JSON.parse(fs.readFileSync(sentLeadsFile));
//   }
//   const allSentLeads = existingSentLeads.concat(sentLeads);
//   fs.writeFileSync(sentLeadsFile, JSON.stringify(allSentLeads, null, 2));
// }

// ---------- SCRAPING ----------
async function getWebsitesByIndustry(industry, browser) {
  const allLinks = new Set();
  const tldsToSearch = shuffleArray([...CONFIG.searchTlds]).slice(0, 15);
  console.log(`Searching TLDs: ${tldsToSearch.join(', ')}`);

  for (const tld of tldsToSearch) {
    let page;
    try {
      page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

      // Use HTML version of DuckDuckGo and fix site search parameter
      const query = `"${industry}" contact OR about OR "${industry}" site:${tld.substring(1)}`;
      const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });

      // Selector for the HTML version
      const links = await page.$$eval('a.result__a', anchors =>
        anchors.map(a => a.href)
      );

      if (links.length === 0) {
        fs.writeFileSync('debug.html', await page.content());
      }

      const cleanedLinks = links.map(link => {
        try {
          const url = new URL(link);
          // The HTML version also uses a redirect with 'uddg' parameter
          if (url.hostname.includes('duckduckgo.com') && url.searchParams.has('uddg')) {
            return url.searchParams.get('uddg');
          }
          return link;
        } catch (e) {
          return link;
        }
      });

      const filteredLinks = cleanedLinks.filter(link => {
        try {
            const hasIrrelevantKeyword = CONFIG.irrelevantKeywords.some(keyword => link.includes(keyword));
            return !hasIrrelevantKeyword;
        } catch (error) {
            return false;
        }
      });

      filteredLinks.forEach(link => allLinks.add(link));

    } catch (error) {
      console.error(`Could not scrape for TLD ${tld}: ${error.message}`);
    } finally {
      if (page) {
        await page.close();
      }
    }
  }
  return [...allLinks];
}


async function extractEmailsFromWebsite(url, browser) {
  const visited = new Set();
  const emails = new Set();
  const queue = [url];
  visited.add(url);

  let page;
  try {
    page = await browser.newPage();
    const initialHost = new URL(url).hostname;

    const fileExtensionsToIgnore = ['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.zip', '.rar', '.mp3', '.mp4', 'avi', '.mov', '.wmv', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'];
    const contactKeywords = ['contact', 'about', 'team', 'impressum'];

    while (queue.length > 0) {
      const currentUrl = queue.shift();

      if (visited.size >= CONFIG.maxPagesToVisit) {
        console.log(`Reached max pages to visit for ${url}`);
        break;
      }

      if (fileExtensionsToIgnore.some(ext => currentUrl.toLowerCase().endsWith(ext))) {
        continue;
      }

      let success = false;
      for (let i = 0; i < 3; i++) {
        try {
          await page.goto(currentUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
          const content = await page.content();
          const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;
          const foundEmails = content.match(emailRegex) || [];
          foundEmails.forEach(email => emails.add(email));

          const links = await page.$$eval('a', as => as.map(a => a.href));

          const internalLinks = links
            .map(link => {
              try {
                return new URL(link, currentUrl).href;
              } catch (e) {
                return null;
              }
            })
            .filter(link => {
              if (!link) return false;
              try {
                const linkUrl = new URL(link);
                return linkUrl.hostname === initialHost && !visited.has(link) && (linkUrl.protocol === 'http:' || linkUrl.protocol === 'https');
              } catch (e) {
                return false;
              }
            });

          const priorityLinks = internalLinks.filter(link => contactKeywords.some(keyword => link.toLowerCase().includes(keyword)));
          const otherLinks = internalLinks.filter(link => !contactKeywords.some(keyword => link.toLowerCase().includes(keyword)));

          const linksToQueue = [...priorityLinks, ...otherLinks];

          for (const link of linksToQueue) {
            if (visited.size >= CONFIG.maxPagesToVisit) break;
            if (!visited.has(link)) {
              visited.add(link);
              if (priorityLinks.includes(link)) {
                queue.unshift(link); // Add priority links to the front
              } else {
                queue.push(link);
              }
            }
          }
          success = true;
          break;
        } catch (err) {
          const isTimeout = err.name === 'TimeoutError' || err.message.includes('net::ERR_CONNECTION_TIMED_OUT') || err.message.includes('net::ERR_NAME_NOT_RESOLVED') || err.message.includes('net::ERR_CONNECTION_REFUSED');
          if (!isTimeout) {
            console.log(`Attempt ${i + 1} failed for ${currentUrl}: ${err.message}`);
          }
          if (i === 2 && !isTimeout) {
            console.log(`Failed to visit ${currentUrl} after 3 attempts.`);
          }
        }
      }
    }
  } catch (error) {
    if (error.name === 'TimeoutError' || error.message.includes('net::ERR_CONNECTION_TIMED_OUT') || error.message.includes('net::ERR_NAME_NOT_RESOLVED')) {
      // Silently ignore timeout on initial URL load
    } else {
      console.error(`An error occurred while extracting emails from ${url}:`, error);
    }
    return []; // Return an empty array in case of an error
  } finally {
    if (page && !page.isClosed()) {
      await page.close();
    }
  }
  



  const genericPrefixes = ['info', 'support', 'contact', 'sales', 'admin', 'hello', 'help', 'media', 'press', 'jobs', 'careers', 'privacy'];
  const publicDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com', 'protonmail.com', 'zoho.com', 'yandex.com', 'mail.com', 'sentry.io', 'wixpress.com'];

  const filtered = [...emails].filter(email => {
    const [prefix, domain] = email.split('@');
    if (!domain || !prefix) return false;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) return false;

    const fileExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.avif', '.tiff', '.bmp', '.ico', '.ttf', '.otf', '.woff', '.woff2', '.eot'];
    if (fileExtensions.some(ext => email.toLowerCase().endsWith(ext))) return false;

    if (/\d+x\d+/.test(email)) return false;

    if (genericPrefixes.includes(prefix.toLowerCase())) return false;
    if (publicDomains.includes(domain.toLowerCase())) return false;
    return true;
  });

  return [...new Set(filtered)];
}

// ---------- MAIN BOT ----------
async function main(io) {
  if (!emailQueueProcessorInterval) {
    emailQueueProcessorInterval = setInterval(emailQueueProcessor, 2 * 60 * 1000); // Run every 2 minutes
  }

  let browser = await puppeteer.launch({
    headless: "new",
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu'
    ],
  });

  // Start email queue processor
  emailQueueProcessor(); // Run once immediately
  setInterval(emailQueueProcessor, 300000); // Then every 5 minutes
  console.log('[INFO] Email queue processor started, running every 5 minutes.');

  while (true) {
    try {
      const leads = loadLeads();
      console.log(`Loaded ${leads.length} existing leads.`); // Added log
      const shuffledIndustries = shuffleArray([...CONFIG.industries]);

      for (const industry of shuffledIndustries) {
        console.log(`\n🔎Searching websites for industry: ${industry}`);

        const websites = await getWebsitesByIndustry(industry, browser);
        console.log(`✅Found ${websites.length} websites for industry ${industry}.`); // Added log

        for (const website of websites) {
          if (leads.some(l => l.website === website)) {
            console.log(`Skipping already processed website: ${website}`);
            continue;
          }

          const emails = await extractEmailsFromWebsite(website, browser);
          if (emails.length > 0) {
            console.log(`✅Found ${emails.length} emails on ${website}`);
            const lead = {
              website,
              emails,
              industry,
              timestamp: new Date().toISOString(),
              emailsSent: false,
              sentEmailLinks: [],
            };
            leads.push(lead);
            saveLeads(leads);
            console.log(`Saved new lead for ${website}. Total leads: ${leads.length}`); // Added log
            io.emit('new-lead', lead);
          } else {
            console.log(`No emails found for ${website}.`); // Added log
          }
        }
      }

      console.log('\n🔎Finished scraping all industries. Restarting in a bit...');
      await wait(10000); // Wait for 10 seconds before the next big loop
    } catch (error) {
      console.error('A critical error occurred in the main loop:', error);
      if (browser) await browser.close();
      console.log('Restarting browser and continuing...');
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu'
        ],
      });
    }
  }
}

module.exports = { main };

main()