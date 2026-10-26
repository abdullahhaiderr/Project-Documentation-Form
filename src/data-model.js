const o=s=>s.split('|');
const SV=['Website design and development','Web apps and dashboards','MVP development','Mobile apps','Automation and integrations','Social media management','SEO and online presence','Branding and graphic design','Maintenance and support'];
const PAL=[
['Teal and sage','Calm, fresh, trustworthy',['#2C6975','#68B2A0','#CDE0C9','#E0ECDE','#FFFFFF']],
['Navy and gold','Premium and established',['#14213D','#C9A24B','#F6F1E7','#D9CFB8','#FFFFFF']],
['Charcoal and coral','Bold and modern',['#22252B','#E2603F','#F3EEE6','#B9B4A9','#FFFFFF']],
['Blue and green','Corporate and friendly',['#1F6FB2','#2FA37A','#DCEBF7','#EAF5EE','#FFFFFF']],
['Earth tones','Warm and natural',['#6B4F3A','#A9825C','#D8C3A5','#EFE6D8','#FFFFFF']],
['Black and gold','Luxury and confident',['#15171C','#E0A81C','#F6F6F4','#B9B4A9','#FFFFFF']],
['Black and white','Minimal and sharp',['#111111','#555555','#BBBBBB','#EEEEEE','#FFFFFF']]
];
/* question: [key, label, type, options, required]  types: t text, a long text, e email, p phone, d date, r one choice, c many choices, P palette */
const ALL=[
{n:'You and your business',t:'Let\u2019s plan your project',i:'Answer what you can. Anything you skip, we will guide you on later.',q:[
['name','Your name','t','',1],['email','Your email','e','',1],['phone','Phone or WhatsApp','p'],
['biz','Business name','t','',1],['what','What does your business do?','a'],['since','Year started and team size','t'],
['addr','Business address and opening hours','a'],['site','Current website address, if you have one','t'],
['social','Social media links','a'],['approver','Who approves designs and content?','t']]},
{n:'Services',t:'What do you need from us?',i:'Pick everything that applies. We will only ask the questions that fit your choices.',q:[
['svc','Services','c',SV,1],['proj','Describe your project in a few sentences','a','',1],['prob','What problem should it solve for you or your customers?','a']]},
{n:'Goals and audience',t:'What should the website achieve?',i:'This shapes every page and button we design.',q:[
['purpose','Main purpose of the website','c',o('Generate leads|Sell products online|Book appointments|Share information|Build trust|Recruit staff')],
['goals','Your top three goals, most important first','a'],['action','What should a visitor do first? For example call, fill a form or book','t'],
['audience','Describe your ideal customer: age, location, job, needs','a'],['areas','Where do you serve? Countries, states or cities','t'],
['diff','What makes you different from competitors?','a'],['metric','How will you measure success?','t']]},
{w:[1,2,3],n:'Apps and dashboards',t:'About your app or dashboard',i:'The more detail here, the more accurate our plan and quote.',q:[
['apptype','What are you building?','r',o('Admin dashboard|Customer portal|SaaS product|Marketplace|Internal business tool|Mobile app|MVP to test an idea|Other')],
['users','Who will use it, and what roles are there? For example admin, staff, customer','a'],
['core','Must have features for the first version','a'],['later','Features that can wait until later','a'],
['plat','Platforms','c',o('Web|iPhone|Android|Desktop')],
['data','Data and systems it must connect to, such as databases, APIs or spreadsheets','a'],
['dash','Dashboard needs','c',o('Charts and reports|Data tables|Export to Excel or PDF|User management|Notifications|Real time updates|Payments and billing')],
['login','Sign in method','c',o('Email and password|Google sign in|Phone number|Single sign on|Not needed')],
['similar','Similar apps you like, with links','a'],['scale','How many users do you expect in the first year?','t'],['tech','Technology preferences, if any','t']]},
{w:[4],n:'Automation',t:'What should we automate?',i:'Describe the manual work you want to remove.',q:[
['aproc','Which tasks take the most time today?','a'],['astep','Walk us through one process step by step','a'],
['atools','Tools you use','c',o('Google Sheets|Excel|WhatsApp|Email|Slack|CRM|Shopify|WordPress|Accounting software|Other')],
['atrig','What should start the automation? For example a new form entry or a payment','a'],
['aout','What should happen at the end?','a'],['avol','Roughly how often does it run each day or month?','t'],
['aapi','Do your tools offer API access?','r',o('Yes|No|Not sure')]]},
{w:[5],n:'Social media',t:'Social media management',i:'So we can plan content that fits your brand and audience.',q:[
['splat','Platforms to manage','c',o('Instagram|Facebook|LinkedIn|TikTok|YouTube|X|Pinterest|Google Business Profile')],
['shand','Links to your current accounts','a'],['sfreq','Posts per week','r',o('2 to 3|4 to 5|Daily|Not sure')],
['stype','Content types','c',o('Photos|Short videos|Carousels|Stories|Reels|Blog sharing|Promotions')],
['screate','Who creates the photos and videos?','r',o('We create them|You provide them|Shared')],
['sgoal','Main goal','c',o('Followers|Leads|Sales|Brand awareness|Community')],
['sads','Do you want paid ad management?','r',o('Yes|No|Later')],['srep','Reporting','r',o('Weekly|Monthly|Quarterly')]]},
{w:[0,1,2,3,7],n:'Inspiration',t:'Show us what you like',i:'Links are perfect. Say what you like or dislike about each.',q:[
['comp','Competitor websites','a'],['admire','Websites you admire, from any industry','a'],['avoid','Looks or styles you want to avoid','a']]},
{w:[0,1,2,3,7],n:'Brand',t:'Your brand',i:'How the website should feel and sound.',q:[
['logo','Do you have a logo?','r',o('Yes, vector file|Yes, image only|No, I need one')],
['guide','Do you have brand guidelines?','r',o('Yes, I will send them|No')],['tag','Tagline or slogan','t'],
['pers','Words that describe your brand','c',o('Professional|Friendly|Premium|Modern|Traditional|Bold|Calm|Playful|Trustworthy|Technical')],
['tone','Tone of the text','r',o('Formal|Conversational|Technical|Warm|Direct')],['lang','Website languages','t']]},
{w:[0,1,2,3,7],n:'Colors',t:'Color theme and palette',i:'Pick the direction closest to your taste. We will fine tune it together.',q:[
['pal','Palette direction','P'],['own','Brand colors you already use (hex codes if you know them)','t'],
['avoidc','Colors to avoid','t'],['theme','Theme','r',o('Light|Dark|Both with a switch')],
['btn','Button style','r',o('Fully rounded|Slightly rounded|Square corners')],['grad','Gradients','r',o('Soft gradients|Flat colors only')]]},
{w:[0,1,2,3,7],n:'Look and feel',t:'Typography and style',i:'Small choices that change how the site feels.',q:[
['font','Font style','r',o('Modern sans serif|Classic serif|A mix of both|No preference')],
['layout','Layout feel','r',o('Spacious and airy|Balanced|Compact and information rich')],
['look','Overall style','r',o('Minimal|Corporate|Creative|Editorial|Tech and futuristic')],
['img','Imagery','c',o('Real photos|Stock photos|Illustrations|Icons|3D graphics|Video')],
['anim','Animation level','r',o('None|Subtle|Rich')]]},
{w:[0],n:'Pages',t:'Pages you need',i:'Tick everything you want on the site.',q:[
['pages','Pages','c',o('Home|About us|Our team|Services overview|Individual service pages|Industries or specialties|Pricing|Case studies|Testimonials|Blog|FAQ|Contact|Book a call|Careers|Locations|Downloads|Privacy policy|Terms of service|Thank you page|Custom 404 page')],
['services','List each service or specialty that needs its own page','a'],
['menu','How should the main menu be organized?','a'],['count','Roughly how many pages in total?','t']]},
{w:[0],n:'Page content',t:'What goes on each page',i:'Tell us which content you want shown.',q:[
['home','Home page','c',o('Headline and call to action|Key numbers|Services summary|Why choose us|How it works|Testimonials|Client logos|Case studies|Latest blog posts|Contact form')],
['about','About page','c',o('Company story|Mission and values|Team bios|Certifications and awards|Milestones')],
['svcpage','Each service page','c',o('Description|Benefits|Process steps|Pricing|FAQ|Related case study')],
['contact','Contact page','c',o('Contact form|Phone and email|Map|Opening hours|Live chat|Booking calendar')],
['who','Who writes the website text?','r',o('I will|You write it|Shared')]]},
{w:[0],n:'Features',t:'Features you want',i:'Pick what your visitors should be able to do.',q:[
['feats','Features','c',o('Contact forms|Appointment booking|Online payments|Online store|Client login|Live chat|AI chat assistant|Calculator|Quote request form|Search|Newsletter signup|Blog|Gallery|Downloads|Multiple languages|Interactive map|Reviews and ratings|Popup offer|Cookie banner|Social feeds|Job applications')],
['top3','Your three most important features','a'],
['tools','Tools to connect: CRM, email marketing, booking, payments, analytics','a'],['formto','Where should form messages go?','t']]},
{w:[0,1,5,7],n:'Content and media',t:'Text, photos and video',i:'What you can provide, and when.',q:[
['photos','Do you have professional photos?','r',o('Yes|Some|No, please use stock')],
['shoot','Do you want a photo or video shoot arranged?','r',o('Yes|No')],
['files','Link to your files (Google Drive, Dropbox)','t'],['due','Date you can send all content','d']]},
{w:[0,6],n:'SEO and marketing',t:'SEO and online presence',i:'Helps us build for search and campaigns from day one.',q:[
['presence','What do you need?','c',o('Google Business Profile|Directory listings|Review management|Local SEO|Link building|Content writing|Technical SEO audit')],
['kw','Keywords and locations you want to rank for','a'],
['ads','Paid ads you plan to run','c',o('Google|Facebook and Instagram|LinkedIn|None')],
['blog','How often will you publish blog posts?','r',o('Weekly|Monthly|Rarely|Never')]]},
{w:[0,1,2,3],n:'Domain and legal',t:'Domain, hosting and legal',i:'The practical details that keep the launch smooth.',q:[
['domain','Domain name you want or own','t'],['reg','Where is it registered?','t'],
['host','Hosting','r',o('I have hosting|Please recommend one')],['mail','Do you need business email addresses?','r',o('Yes|No')],
['legal','Privacy policy and terms','r',o('I have them|Please draft them')],
['rules','Industry rules that apply, such as health data, finance or children\u2019s data','t'],
['access','Accessibility standards (WCAG)','r',o('Required|Not required|Not sure')],
['platform','Platform preference','r',o('WordPress|Custom build|Shopify|Webflow|No preference')],
['edit','Do you want to edit the site yourself after launch?','r',o('Yes|No')]]},
{n:'Timeline and budget',t:'Timeline, budget and support',i:'Last step. Then you can send everything over.',q:[
['launch','Preferred launch date','d'],['deadline','Is there a fixed deadline? Tell us why','t'],
['budget','Budget range','t'],['rounds','How many design revision rounds do you expect?','t'],
['signoff','Who gives final sign off?','t'],
['after','Support after launch','c',o('Monthly updates|Backups and security|Content changes|Training|SEO reports|None')],
['via','Best way to reach you','r',o('Email|WhatsApp|Phone|Video call')],['notes','Anything else we should know?','a']]}
];
