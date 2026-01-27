

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
  emailDelay: { min: 30000, max: 60000 }, // 30 to 60 seconds
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
  const user = process.env[`EMAIL_USER_${i}`];
  const pass = process.env[`EMAIL_PASS_${i}`];
  if (user && pass) {
    emailAccounts.push({ user, pass, limitExceeded: false });
  } else {
    break; // Stop if we can't find the next account
  }
}

if (emailAccounts.length === 0) {
  console.error("❌ No email accounts configured. Please set EMAIL_USER_1, EMAIL_PASS_1, etc. in your .env file.");
  process.exit(1);
}

console.log(`✅ Loaded ${emailAccounts.length} email accounts.`);

// ---------- EMAIL TRANSPORTER ----------
let transporter;

function setupTransporter() {
  if (emailAccounts.length === 0) {
    console.error("Cannot set up transporter: No email accounts loaded.");
    return;
  }
  const account = emailAccounts[currentAccountIndex];
  console.log(`Setting up transporter for account: ${account.user}`);

  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: account.user,
      pass: account.pass,
    },
  });

  transporter.verify(function (error, success) {
    if (error) {
      console.error(`❌ Nodemailer configuration error for ${account.user}:`, error);
    } else {
      console.log(`✅ Nodemailer is ready for ${account.user}.`);
    }
  });
}

setupTransporter(); // Initial setup


let emailSendingPaused = false;
let limitCheckPaused = false; // New state for hourly checking
let emailQueueProcessorInterval; // To hold the interval ID
let pauseTimeout;
let probeInterval;

// ---------- EMAIL FUNCTION ----------
async function sendEmail(to, lead) {
  if (emailSendingPaused) {
    console.log('Email sending is currently paused.');
    return false;
  }
  if (!isAllowedTime()) {
    console.log(`⏰ Not within working hours. Email to ${to} will be skipped.`);
    return false;
  }
  const emailTemplate = fs.readFileSync(path.join(__dirname, 'email_template.html'), 'utf-8');
  const mailOptions = {
    from: `"${process.env.SENDER_NAME || 'Lead Scraper'}" <${emailAccounts[currentAccountIndex].user}>`,
    to: to,
    subject: 'Following up on your interest',
    html: emailTemplate
      .replace('{logo_url}', 'https://i.pinimg.com/1200x/bc/d2/48/bcd2488484224fdbbed256abb2a0f3fc.jpg') // Replace with your logo URL
      .replace('{email_user}', to.split('@')[0])
      .replace('{timestamp}', new Date().toLocaleString()),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to} from ${emailAccounts[currentAccountIndex].user} (Subject: ${mailOptions.subject})`);
    return true;
  } catch (error) {
    console.error(`❌ Error sending email to ${to} from ${emailAccounts[currentAccountIndex].user}:`, error);

    // Any error will cause a switch to the next account.
    console.log(`🚫 Error with account ${emailAccounts[currentAccountIndex].user}. Switching to the next one.`);

    // Mark this account as having an issue
    emailAccounts[currentAccountIndex].limitExceeded = true;

    // Try to switch to the next available account
    const nextAccountIndex = emailAccounts.findIndex(acc => !acc.limitExceeded);

    if (nextAccountIndex !== -1) {
      console.log('Switching to the next available email account...');
      currentAccountIndex = nextAccountIndex;
      setupTransporter(); // Re-initialize transporter with the new account
    } else {
      // All accounts have hit their limits
      console.log('🚫 All email accounts have reached their daily sending limits. Pausing email sending and switching to hourly check mode.');
      emailSendingPaused = true;
      limitCheckPaused = true; // Enter probing mode

      // Reset limit flags for the next day's probing
      emailAccounts.forEach(acc => acc.limitExceeded = false);

      if (probeInterval) clearInterval(probeInterval);
      probeInterval = setInterval(probeEmailQueue, 60 * 60 * 1000); // Check every hour
    }
    return false;
  }
}

async function probeEmailQueue() {
  if (!isAllowedTime() || !limitCheckPaused) {
    return;
  }

  console.log('Hourly check: Probing to see if Gmail sending limit is lifted...');
  const leads = loadLeads();
  const unsentLead = leads.find(lead => !lead.emailsSent && lead.emails.length > 0);

  if (!unsentLead) {
    console.log('Probe check: No more unsent emails found. Stopping hourly checks.');
    limitCheckPaused = false;
    emailSendingPaused = false;
    if (probeInterval) clearInterval(probeInterval);
    return;
  }

  // Use the first account for probing
  currentAccountIndex = 0;
  setupTransporter();

  // Try sending the first email of the first unsent lead
  const emailToSend = unsentLead.emails[0];
  const success = await sendEmail(emailToSend, unsentLead);

  if (success) {
    console.log('Probe successful! Gmail limit has been lifted. Resuming normal email sending.');
    limitCheckPaused = false;
    emailSendingPaused = false;
    emailAccounts.forEach(acc => acc.limitExceeded = false); // Reset all account limits
    if (probeInterval) clearInterval(probeInterval);
    // Immediately trigger the main processor
    emailQueueProcessor();
  } else {
    // The sendEmail function will have already logged the specific error
    console.log('Probe failed. Gmail limit is still in effect. Will check again in 1 hour.');
  }
}

async function emailQueueProcessor() {
  if (emailSendingPaused || limitCheckPaused) {
    console.log('Email queue processor is currently paused.');
    return;
  }

  console.log('Running email queue processor...');
  const leads = loadLeads();
  const unsentLeads = leads.filter(lead => !lead.emailsSent);

  if (unsentLeads.length > 0) {
    console.log(`Found ${unsentLeads.length} leads with unsent emails.`);
  } else {
    return;
  }

  for (const lead of unsentLeads) {
    if (!lead.emails || lead.emails.length === 0) {
      lead.emailsSent = true; // Mark as sent if there are no emails to send
      continue;
    }

    // Ensure sentEmailLinks array exists
    if (!lead.sentEmailLinks) {
      lead.sentEmailLinks = [];
    }

    const emailsToSend = lead.emails.filter(email => !lead.sentEmailLinks.includes(email));

    if (emailsToSend.length === 0) {
        // This can happen if all emails were sent but the emailsSent flag was not yet true
        if (lead.sentEmailLinks.length === lead.emails.length) {
            lead.emailsSent = true;
        }
        continue;
    }

    console.log(`Lead ${lead.website} has ${emailsToSend.length} email(s) to send.`);

    for (const email of emailsToSend) {
      if (emailSendingPaused) {
        console.log('Email sending paused. Saving progress and stopping processor.');
        saveLeads(leads); // Save progress
        return;
      }

      const success = await sendEmail(email, lead);
      if (success) {
        console.log(`Successfully sent email to ${email}, marking as sent.`);
        lead.sentEmailLinks.push(email);
        await wait(randomInt(CONFIG.emailDelay.min, CONFIG.emailDelay.max));
      } else {
        // If sending failed because of a limit, we should stop. The processor will pick it up next time.
        if (emailSendingPaused) {
          console.log('Email sending limit reached. Pausing queue processor.');
          saveLeads(leads); // Save progress
          return;
        }
        // If it failed for other reasons (e.g., temporary network issue), we'll just stop processing this lead for now
        // and pick it up in the next cycle. We won't mark the whole lead as failed.
        console.log(`Failed to send to ${email}, will retry in the next cycle.`);
        break; // Stop processing emails for this lead for now
      }
    }

    // After attempting to send all emails for the lead in this cycle, check if it's complete.
    if (lead.sentEmailLinks.length === lead.emails.length) {
      console.log(`All emails for lead ${lead.website} have been sent.`);
      lead.emailsSent = true;
    }
  }

  const leadsToKeep = leads.filter(lead => !lead.emailsSent);
  const leadsToMove = leads.filter(lead => lead.emailsSent);

  if (leadsToMove.length > 0) {
    saveSentLeads(leadsToMove);
  }

  saveLeads(leadsToKeep);
  console.log('Email queue processing finished for this cycle.');
}

// ---------- UTILITY ----------
const randomInt = (min,max) => Math.floor(Math.random()*(max-min+1))+min;
const wait = ms => new Promise(r => setTimeout(r, ms));
function isAllowedTime() {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  return CONFIG.workingDays.includes(day) && hour >= CONFIG.workingHours.start && hour < CONFIG.workingHours.end;
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

function saveSentLeads(sentLeads) {
  const sentLeadsFile = path.join(__dirname, 'sent_leads.json');
  console.log(`Moving ${sentLeads.length} completed lead(s) to ${sentLeadsFile}`);
  let existingSentLeads = [];
  if (fs.existsSync(sentLeadsFile)) {
    existingSentLeads = JSON.parse(fs.readFileSync(sentLeadsFile));
  }
  const allSentLeads = existingSentLeads.concat(sentLeads);
  fs.writeFileSync(sentLeadsFile, JSON.stringify(allSentLeads, null, 2));
}

// ---------- SCRAPING ----------
async function getWebsitesByIndustry(industry, browser) {
  const allLinks = [];
  const tldsToSearch = shuffleArray([...CONFIG.searchTlds]).slice(0, 20);
  console.log(`Searching TLDs: ${tldsToSearch.join(', ')}`);

  for (const tld of tldsToSearch) {
    let page;
    try {
      page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

      const query = `"${industry}" company`;
      const searchUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`;

      await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });

      const links = await page.$$eval('a.result__a', anchors =>
        anchors.map(a => a.href)
      );

      const cleanedLinks = links.map(link => {
        try {
          const url = new URL(link);
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
            const domain = new URL(link).hostname.replace('www.', '');
            if (!isValidDomain(domain)) return false;
            const hasIrrelevantKeyword = CONFIG.irrelevantKeywords.some(keyword => link.includes(keyword));
            return !hasIrrelevantKeyword;
        } catch (error) {
            return false;
        }
      });

      allLinks.push(...filteredLinks);
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Could not scrape for TLD ${tld}: ${error.message}`);
    } finally {
      if (page) {
        await page.close();
      }
    }
  }
  return [...new Set(allLinks)];
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

      if (fileExtensionsToIgnore.some(ext => currentUrl.toLowerCase().endsWith(ext))) {
        continue;
      }

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
          if (visited.size >= 15) break;
          if (!visited.has(link)) {
            visited.add(link);
            if (priorityLinks.includes(link)) {
              queue.unshift(link); // Add priority links to the front
            } else {
              queue.push(link);
            }
          }
        }
      } catch (err) {
        console.log(`Error visiting ${currentUrl}: ${err.message}`);
      }
    }
  } catch (error) {
    console.error(`An error occurred while extracting emails from ${url}:`, error);
    return []; // Return an empty array in case of an error
  } finally {
    if (page) {
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

  let browser;
  try {
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

    while (true) {
      const leads = loadLeads();
      const shuffledIndustries = shuffleArray([...CONFIG.industries]);

      for (const industry of shuffledIndustries) {
        console.log(`\n🔎 Searching websites for industry: ${industry}`);

        const websites = await getWebsitesByIndustry(industry, browser);
        console.log(`Found ${websites.length} websites.`);

        for (const website of websites) {
          if (leads.some(l => l.website === website)) {
            console.log(`Skipping already processed website: ${website}`);
            continue;
          }

          const emails = await extractEmailsFromWebsite(website, browser);
          if (emails.length > 0) {
            console.log(`✅ Found ${emails.length} emails on ${website}`);
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
            io.emit('new-lead', lead);
          }
        }
      }

      console.log('\n✅ Finished scraping all industries. Restarting...');
    }
  } catch (error) {
    console.error('An error occurred in the main function:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

module.exports = { main };