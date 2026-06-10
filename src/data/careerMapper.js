/**
 * AgroNet Africa — Dream-to-Role Career Mapper Engine
 * 
 * A rule-based script that reads a user's dream career text,
 * identifies keywords, maps them to career paths, and produces
 * a chronological step-by-step roadmap with:
 *   1. Agronomic skills to learn
 *   2. Badges/certifications needed
 *   3. Matching mock job openings
 */

// ===== CAREER PATH DEFINITIONS =====
// Each career path has keyword triggers, a multi-step roadmap, and matching job templates
const CAREER_PATHS = [
  {
    id: 'hydroponics',
    name: 'Hydroponics & Controlled Environment Agriculture',
    keywords: ['hydroponic', 'hydroponics', 'soilless', 'indoor farm', 'vertical farm', 'vertical farming', 'controlled environment', 'CEA', 'nutrient film'],
    icon: '🌱',
    roleTitle: 'Hydroponics Farm Manager',
    roadmap: [
      {
        phase: 'Foundation',
        duration: '0 – 3 months',
        title: 'Master Plant Science Fundamentals',
        description: 'Build core knowledge in plant biology, nutrient cycles, and water chemistry essential for soilless growing systems.',
        skills: ['Plant Physiology', 'Water Chemistry', 'Nutrient Solution Management'],
        type: 'skill',
      },
      {
        phase: 'Specialization',
        duration: '3 – 6 months',
        title: 'Hydroponic Systems Certification',
        description: 'Complete hands-on training in NFT, DWC, ebb-and-flow, and aeroponics systems. Learn climate control and environmental monitoring.',
        skills: ['NFT Systems', 'Deep Water Culture', 'Climate Control Automation'],
        type: 'badge',
        badge: { name: 'Certified Hydroponics Technician', issuer: 'AgroNet Africa Academy', icon: '🏅' },
      },
      {
        phase: 'Advanced Training',
        duration: '6 – 9 months',
        title: 'Precision Agriculture & IoT Integration',
        description: 'Learn sensor-based monitoring, automated fertigation, and data-driven crop optimization for commercial-scale operations.',
        skills: ['IoT Sensors & Monitoring', 'Fertigation Automation', 'Crop Data Analytics'],
        type: 'badge',
        badge: { name: 'Precision Ag Tech Specialist', issuer: 'Pan-African AgriTech Board', icon: '🎖️' },
      },
      {
        phase: 'Leadership',
        duration: '9 – 12 months',
        title: 'Commercial Operations & Farm Management',
        description: 'Develop business skills for running a commercial hydroponic operation — budgeting, staff management, supply chain, and market strategy.',
        skills: ['Farm Business Management', 'Supply Chain Logistics', 'Team Leadership'],
        type: 'skill',
      },
    ],
    matchingJobs: [
      {
        id: 'mapped_job_hydro_1',
        title: 'Hydroponics Operations Lead',
        company: 'UrbanGreens Nigeria Ltd.',
        location: 'Lagos, Nigeria',
        type: 'Full-time',
        salary: '₦500,000 – ₦700,000/month',
        tags: ['Hydroponics', 'Controlled Environment', 'Farm Management'],
        postedAt: '2025-09-01',
      },
      {
        id: 'mapped_job_hydro_2',
        title: 'Vertical Farm Systems Engineer',
        company: 'AfriGrow Technologies',
        location: 'Nairobi, Kenya',
        type: 'Full-time',
        salary: 'KSh 180,000 – KSh 280,000/month',
        tags: ['Vertical Farming', 'IoT Agriculture', 'Automation'],
        postedAt: '2025-09-05',
      },
    ],
  },

  {
    id: 'aquaculture',
    name: 'Aquaculture & Fish Farming',
    keywords: ['aquaculture', 'fish farm', 'fish farming', 'aquaponics', 'catfish', 'tilapia', 'shrimp', 'hatchery', 'fishery', 'fisheries', 'marine'],
    icon: '🐟',
    roleTitle: 'Aquaculture Production Manager',
    roadmap: [
      {
        phase: 'Foundation',
        duration: '0 – 3 months',
        title: 'Aquatic Biology & Water Quality',
        description: 'Master the science of aquatic ecosystems, fish biology, water quality parameters, and species-specific requirements.',
        skills: ['Aquatic Biology', 'Water Quality Management', 'Fish Health & Nutrition'],
        type: 'skill',
      },
      {
        phase: 'Specialization',
        duration: '3 – 6 months',
        title: 'Precision Aquaculture Certification',
        description: 'Gain certified expertise in pond construction, recirculating aquaculture systems (RAS), and feed optimization.',
        skills: ['RAS Design', 'Feed Formulation', 'Pond Construction'],
        type: 'badge',
        badge: { name: 'Certified Aquaculture Specialist', issuer: 'African Aquaculture Institute', icon: '🏅' },
      },
      {
        phase: 'Advanced Training',
        duration: '6 – 9 months',
        title: 'Disease Management & Biosecurity',
        description: 'Learn diagnostic techniques for common fish diseases, vaccination protocols, and biosecurity measures for large-scale operations.',
        skills: ['Fish Disease Diagnostics', 'Biosecurity Protocols', 'Vaccination Programs'],
        type: 'badge',
        badge: { name: 'Aquatic Health Professional', issuer: 'Pan-African Fisheries Board', icon: '🎖️' },
      },
      {
        phase: 'Leadership',
        duration: '9 – 14 months',
        title: 'Commercial Hatchery & Farm Management',
        description: 'Develop the business acumen to manage a commercial fish farming operation — from hatchery to market.',
        skills: ['Hatchery Management', 'Market Analysis', 'Export Compliance'],
        type: 'skill',
      },
    ],
    matchingJobs: [
      {
        id: 'mapped_job_aqua_1',
        title: 'Aquaculture Farm Supervisor',
        company: 'BlueTide Fisheries',
        location: 'Accra, Ghana',
        type: 'Full-time',
        salary: 'GH₵ 8,000 – GH₵ 12,000/month',
        tags: ['Aquaculture', 'Fish Farming', 'Operations'],
        postedAt: '2025-08-28',
      },
      {
        id: 'mapped_job_aqua_2',
        title: 'RAS Systems Technician',
        company: 'AquaHarvest Africa',
        location: 'Ibadan, Nigeria',
        type: 'Contract',
        salary: '₦350,000 – ₦500,000/month',
        tags: ['Recirculating Systems', 'Water Treatment', 'Engineering'],
        postedAt: '2025-09-02',
      },
    ],
  },

  {
    id: 'greenhouse',
    name: 'Greenhouse & Protected Agriculture',
    keywords: ['greenhouse', 'glasshouse', 'polytunnel', 'protected cultivation', 'protected agriculture', 'shade house', 'screen house', 'horticulture', 'floriculture', 'flower'],
    icon: '🏠',
    roleTitle: 'Greenhouse Production Manager',
    roadmap: [
      {
        phase: 'Foundation',
        duration: '0 – 3 months',
        title: 'Horticulture & Protected Crop Science',
        description: 'Learn the fundamentals of growing high-value horticultural crops under controlled conditions — temperature, humidity, and light management.',
        skills: ['Horticultural Science', 'Climate Management', 'Protected Crop Varieties'],
        type: 'skill',
      },
      {
        phase: 'Specialization',
        duration: '3 – 6 months',
        title: 'Greenhouse Systems & Design',
        description: 'Master greenhouse construction types, ventilation systems, irrigation design, and environmental control technology.',
        skills: ['Greenhouse Design', 'Ventilation Engineering', 'Automated Irrigation'],
        type: 'badge',
        badge: { name: 'Greenhouse Agronomy Specialist', issuer: 'AgroNet Africa Academy', icon: '🏅' },
      },
      {
        phase: 'Advanced Training',
        duration: '6 – 9 months',
        title: 'IPM & Sustainable Greenhouse Practices',
        description: 'Implement integrated pest management, biological control agents, and sustainable resource usage to maximize yields while minimizing inputs.',
        skills: ['Integrated Pest Management', 'Biological Controls', 'Resource Optimization'],
        type: 'badge',
        badge: { name: 'Sustainable Greenhouse Practitioner', issuer: 'Pan-African Agricultural Board', icon: '🎖️' },
      },
      {
        phase: 'Leadership',
        duration: '9 – 12 months',
        title: 'Commercial Greenhouse Operations',
        description: 'Scale up — learn labor management, export grading standards, cold chain logistics, and financial planning for greenhouse enterprises.',
        skills: ['Export Standards', 'Cold Chain Management', 'Financial Planning'],
        type: 'skill',
      },
    ],
    matchingJobs: [
      {
        id: 'mapped_job_gh_1',
        title: 'Greenhouse Production Coordinator',
        company: 'SunCrest Horticulture',
        location: 'Naivasha, Kenya',
        type: 'Full-time',
        salary: 'KSh 150,000 – KSh 220,000/month',
        tags: ['Greenhouse', 'Horticulture', 'Production'],
        postedAt: '2025-08-20',
      },
      {
        id: 'mapped_job_gh_2',
        title: 'Protected Agriculture Specialist',
        company: 'AgriVida Farms',
        location: 'Kumasi, Ghana',
        type: 'Full-time',
        salary: 'GH₵ 9,000 – GH₵ 14,000/month',
        tags: ['Protected Crops', 'Climate Control', 'Agronomy'],
        postedAt: '2025-09-08',
      },
    ],
  },

  {
    id: 'livestock',
    name: 'Livestock & Animal Production',
    keywords: ['livestock', 'cattle', 'poultry', 'goat', 'sheep', 'dairy', 'ranch', 'ranching', 'animal husbandry', 'pig', 'piggery', 'swine', 'broiler', 'layer', 'egg', 'meat', 'beef'],
    icon: '🐄',
    roleTitle: 'Livestock Production Manager',
    roadmap: [
      {
        phase: 'Foundation',
        duration: '0 – 3 months',
        title: 'Animal Science & Nutrition Basics',
        description: 'Learn animal physiology, breed selection, nutritional requirements, and basic veterinary care across major livestock species.',
        skills: ['Animal Nutrition', 'Breed Selection', 'Basic Veterinary Care'],
        type: 'skill',
      },
      {
        phase: 'Specialization',
        duration: '3 – 6 months',
        title: 'Livestock Health & Welfare Certification',
        description: 'Earn certification in disease prevention, vaccination schedules, welfare standards, and reproductive management.',
        skills: ['Disease Prevention', 'Reproductive Management', 'Welfare Auditing'],
        type: 'badge',
        badge: { name: 'Certified Livestock Health Technician', issuer: 'African Livestock Council', icon: '🏅' },
      },
      {
        phase: 'Advanced Training',
        duration: '6 – 10 months',
        title: 'Precision Livestock & Feed Technology',
        description: 'Master precision feeding, wearable livestock sensors, genetic improvement programs, and pasture management.',
        skills: ['Precision Feeding', 'Livestock Wearables', 'Genetic Improvement'],
        type: 'badge',
        badge: { name: 'Precision Livestock Specialist', issuer: 'Pan-African AgriTech Board', icon: '🎖️' },
      },
      {
        phase: 'Leadership',
        duration: '10 – 14 months',
        title: 'Commercial Ranch & Farm Operations',
        description: 'Scale your expertise into managing large operations — financial modelling, staff coordination, market access, and value chain development.',
        skills: ['Ranch Management', 'Value Chain Analysis', 'Market Access Strategy'],
        type: 'skill',
      },
    ],
    matchingJobs: [
      {
        id: 'mapped_job_live_1',
        title: 'Poultry Farm Operations Manager',
        company: 'HarvestPrime Farms',
        location: 'Ibadan, Nigeria',
        type: 'Full-time',
        salary: '₦400,000 – ₦600,000/month',
        tags: ['Poultry', 'Operations', 'Farm Management'],
        postedAt: '2025-08-18',
      },
      {
        id: 'mapped_job_live_2',
        title: 'Dairy Production Specialist',
        company: 'GreenPasture Dairies',
        location: 'Eldoret, Kenya',
        type: 'Full-time',
        salary: 'KSh 120,000 – KSh 190,000/month',
        tags: ['Dairy', 'Animal Nutrition', 'Quality Control'],
        postedAt: '2025-09-10',
      },
    ],
  },

  {
    id: 'agronomy',
    name: 'Field Agronomy & Crop Science',
    keywords: ['agronomy', 'agronomist', 'crop', 'crops', 'grain', 'maize', 'rice', 'wheat', 'cassava', 'yam', 'soybean', 'field', 'plantation', 'farming', 'farm manager', 'manage a farm', 'commercial farm', 'large scale', 'large-scale'],
    icon: '🌾',
    roleTitle: 'Senior Agronomist / Crop Production Manager',
    roadmap: [
      {
        phase: 'Foundation',
        duration: '0 – 3 months',
        title: 'Soil Science & Crop Fundamentals',
        description: 'Build deep understanding of soil types, fertility management, crop rotation principles, and agro-ecological zoning across Africa.',
        skills: ['Soil Science', 'Crop Rotation Planning', 'Agro-Ecology'],
        type: 'skill',
      },
      {
        phase: 'Specialization',
        duration: '3 – 6 months',
        title: 'Advanced Agronomy Certification',
        description: 'Get certified in precision planting, soil testing, integrated nutrient management, and pest & weed control for field crops.',
        skills: ['Soil Testing & Analysis', 'Integrated Nutrient Management', 'Pest & Weed Control'],
        type: 'badge',
        badge: { name: 'Certified Field Agronomist', issuer: 'AgroNet Africa Academy', icon: '🏅' },
      },
      {
        phase: 'Advanced Training',
        duration: '6 – 9 months',
        title: 'Precision Agriculture & Drone Technology',
        description: 'Learn GPS-guided planting, drone-based crop scouting, variable-rate application, and satellite imagery interpretation.',
        skills: ['Drone Crop Scouting', 'GPS-Guided Planting', 'Remote Sensing'],
        type: 'badge',
        badge: { name: 'Precision Agriculture Professional', issuer: 'Pan-African AgriTech Board', icon: '🎖️' },
      },
      {
        phase: 'Leadership',
        duration: '9 – 12 months',
        title: 'Large-Scale Farm Management',
        description: 'Run commercial field operations — logistics, mechanization planning, seasonal labor management, and procurement strategy.',
        skills: ['Mechanization Planning', 'Seasonal Workforce Management', 'Procurement Strategy'],
        type: 'skill',
      },
    ],
    matchingJobs: [
      {
        id: 'mapped_job_agro_1',
        title: 'Senior Agronomist',
        company: 'GreenFields Agro Ltd.',
        location: 'Lagos, Nigeria',
        type: 'Full-time',
        salary: '₦450,000 – ₦650,000/month',
        tags: ['Agronomy', 'Crop Science', 'Research'],
        postedAt: '2025-08-01',
      },
      {
        id: 'mapped_job_agro_2',
        title: 'Crop Production Manager',
        company: 'SahelAgri International',
        location: 'Tamale, Ghana',
        type: 'Full-time',
        salary: 'GH₵ 10,000 – GH₵ 15,000/month',
        tags: ['Field Crops', 'Farm Management', 'Precision Farming'],
        postedAt: '2025-09-12',
      },
    ],
  },

  {
    id: 'agritech',
    name: 'Agricultural Technology & Data Science',
    keywords: ['agritech', 'agri-tech', 'agricultural technology', 'tech', 'data', 'ai', 'artificial intelligence', 'machine learning', 'app', 'software', 'digital', 'drone', 'robot', 'automation', 'smart farm', 'smart farming', 'iot', 'sensor'],
    icon: '💻',
    roleTitle: 'AgriTech Product Manager / Data Scientist',
    roadmap: [
      {
        phase: 'Foundation',
        duration: '0 – 3 months',
        title: 'Agricultural Domain Knowledge',
        description: 'Understand farming operations, crop cycles, and supply chains so you can build technology that solves real agricultural problems.',
        skills: ['Farming Operations', 'Agricultural Supply Chains', 'Domain Problem Mapping'],
        type: 'skill',
      },
      {
        phase: 'Specialization',
        duration: '3 – 7 months',
        title: 'Agricultural Data Analytics Certification',
        description: 'Learn to collect, clean, and analyze agricultural data — weather patterns, soil sensors, yield predictions, and market pricing.',
        skills: ['Data Collection & Cleaning', 'Statistical Analysis', 'Yield Prediction Models'],
        type: 'badge',
        badge: { name: 'Agricultural Data Analyst', issuer: 'AgriTech Learning Hub', icon: '🏅' },
      },
      {
        phase: 'Advanced Training',
        duration: '7 – 11 months',
        title: 'AI/ML for Agriculture',
        description: 'Build machine learning models for crop disease detection, precision irrigation scheduling, and supply chain optimization.',
        skills: ['Computer Vision for Crops', 'ML Model Deployment', 'IoT Platform Integration'],
        type: 'badge',
        badge: { name: 'AI Agriculture Engineer', issuer: 'Pan-African AgriTech Board', icon: '🎖️' },
      },
      {
        phase: 'Leadership',
        duration: '11 – 14 months',
        title: 'AgriTech Product Strategy',
        description: 'Lead product development — user research with farmers, MVP building, go-to-market strategy, and investment pitching.',
        skills: ['Product Management', 'UX Research with Farmers', 'Investor Relations'],
        type: 'skill',
      },
    ],
    matchingJobs: [
      {
        id: 'mapped_job_tech_1',
        title: 'Agricultural Data Scientist',
        company: 'FarmIQ Africa',
        location: 'Lagos, Nigeria',
        type: 'Full-time',
        salary: '₦600,000 – ₦900,000/month',
        tags: ['Data Science', 'Machine Learning', 'Agriculture'],
        postedAt: '2025-09-03',
      },
      {
        id: 'mapped_job_tech_2',
        title: 'IoT Solutions Engineer — Agriculture',
        company: 'SmartFarm Technologies',
        location: 'Kigali, Rwanda',
        type: 'Full-time',
        salary: 'RWF 800,000 – RWF 1,200,000/month',
        tags: ['IoT', 'Embedded Systems', 'Smart Agriculture'],
        postedAt: '2025-09-07',
      },
    ],
  },

  {
    id: 'soil',
    name: 'Soil Health & Conservation',
    keywords: ['soil', 'soil health', 'soil science', 'erosion', 'conservation', 'compost', 'composting', 'regenerative', 'organic', 'fertility', 'land restoration', 'carbon'],
    icon: '🪨',
    roleTitle: 'Soil Health & Conservation Specialist',
    roadmap: [
      {
        phase: 'Foundation',
        duration: '0 – 3 months',
        title: 'Soil Science Fundamentals',
        description: 'Master soil classification, texture analysis, organic matter dynamics, and nutrient cycling in tropical African soils.',
        skills: ['Soil Classification', 'Texture Analysis', 'Nutrient Cycling'],
        type: 'skill',
      },
      {
        phase: 'Specialization',
        duration: '3 – 6 months',
        title: 'Soil Testing & Lab Certification',
        description: 'Become certified in soil sampling protocols, laboratory analysis techniques, pH management, and fertilizer recommendations.',
        skills: ['Lab Analysis Techniques', 'pH Management', 'Fertilizer Recommendations'],
        type: 'badge',
        badge: { name: 'Certified Soil Analyst', issuer: 'AgroNet Africa Academy', icon: '🏅' },
      },
      {
        phase: 'Advanced Training',
        duration: '6 – 9 months',
        title: 'Regenerative Agriculture & Carbon Credits',
        description: 'Learn regenerative soil practices — cover cropping, no-till, composting — and how to monetize carbon sequestration credits.',
        skills: ['Regenerative Practices', 'Carbon Sequestration', 'Cover Crop Systems'],
        type: 'badge',
        badge: { name: 'Regenerative Ag Practitioner', issuer: 'African Conservation Institute', icon: '🎖️' },
      },
      {
        phase: 'Leadership',
        duration: '9 – 12 months',
        title: 'Land Restoration Program Management',
        description: 'Lead large-scale soil restoration projects — writing proposals, managing field teams, GIS mapping, and impact reporting.',
        skills: ['GIS Mapping', 'Proposal Writing', 'Impact Reporting'],
        type: 'skill',
      },
    ],
    matchingJobs: [
      {
        id: 'mapped_job_soil_1',
        title: 'Soil Health Research Officer',
        company: 'GreenFields Agro Ltd.',
        location: 'Kano, Nigeria',
        type: 'Full-time',
        salary: '₦380,000 – ₦520,000/month',
        tags: ['Soil Science', 'Research', 'Field Analysis'],
        postedAt: '2025-08-25',
      },
      {
        id: 'mapped_job_soil_2',
        title: 'Conservation Agriculture Advisor',
        company: 'EarthRoots Foundation',
        location: 'Kampala, Uganda',
        type: 'Contract',
        salary: 'UGX 4,500,000 – UGX 6,800,000/month',
        tags: ['Conservation', 'Regenerative', 'Training'],
        postedAt: '2025-09-14',
      },
    ],
  },

  {
    id: 'irrigation',
    name: 'Irrigation & Water Management',
    keywords: ['irrigation', 'water', 'drip', 'sprinkler', 'pivot', 'water management', 'fertigation', 'water harvesting', 'borehole', 'dam'],
    icon: '💧',
    roleTitle: 'Irrigation Systems Engineer',
    roadmap: [
      {
        phase: 'Foundation',
        duration: '0 – 3 months',
        title: 'Hydraulics & Water Resource Basics',
        description: 'Understand water sources, hydraulic principles, crop water requirements, and water budgeting for African farming systems.',
        skills: ['Hydraulic Engineering', 'Crop Water Requirements', 'Water Budgeting'],
        type: 'skill',
      },
      {
        phase: 'Specialization',
        duration: '3 – 6 months',
        title: 'Irrigation Design Certification',
        description: 'Get certified in drip, sprinkler, and center-pivot system design, installation, and maintenance.',
        skills: ['Drip System Design', 'Sprinkler Engineering', 'Center-Pivot Systems'],
        type: 'badge',
        badge: { name: 'Certified Irrigation Designer', issuer: 'African Water & Irrigation Council', icon: '🏅' },
      },
      {
        phase: 'Advanced Training',
        duration: '6 – 9 months',
        title: 'Smart Irrigation & Fertigation',
        description: 'Integrate IoT soil-moisture sensors, weather-based scheduling, and automated fertigation for maximum water-use efficiency.',
        skills: ['IoT Soil Sensors', 'Weather-Based Scheduling', 'Fertigation Automation'],
        type: 'badge',
        badge: { name: 'Smart Irrigation Specialist', issuer: 'Pan-African AgriTech Board', icon: '🎖️' },
      },
      {
        phase: 'Leadership',
        duration: '9 – 12 months',
        title: 'Water Project Management',
        description: 'Lead irrigation infrastructure projects — surveying, contractor management, budgeting, and community water governance.',
        skills: ['Project Surveying', 'Contractor Management', 'Community Water Governance'],
        type: 'skill',
      },
    ],
    matchingJobs: [
      {
        id: 'mapped_job_irr_1',
        title: 'Irrigation Technician',
        company: 'GreenFields Agro Ltd.',
        location: 'Kano, Nigeria',
        type: 'Contract',
        salary: '₦200,000 – ₦300,000/month',
        tags: ['Irrigation', 'Engineering', 'Water Management'],
        postedAt: '2025-08-15',
      },
      {
        id: 'mapped_job_irr_2',
        title: 'Water Resources Engineer — Agriculture',
        company: 'AquaSmart Solutions',
        location: 'Dodoma, Tanzania',
        type: 'Full-time',
        salary: 'TZS 2,800,000 – TZS 4,200,000/month',
        tags: ['Water Engineering', 'Fertigation', 'IoT'],
        postedAt: '2025-09-06',
      },
    ],
  },
];

// ===== DEFAULT / FALLBACK PATH =====
const DEFAULT_PATH = {
  id: 'general',
  name: 'General Agricultural Career',
  icon: '🌍',
  roleTitle: 'Agricultural Professional',
  roadmap: [
    {
      phase: 'Foundation',
      duration: '0 – 3 months',
      title: 'Agricultural Science Essentials',
      description: 'Build a solid base in crop science, soil health, and sustainable farming practices used across the African continent.',
      skills: ['Crop Science Basics', 'Soil Fundamentals', 'Sustainable Farming'],
      type: 'skill',
    },
    {
      phase: 'Specialization',
      duration: '3 – 6 months',
      title: 'AgroNet Core Certification',
      description: 'Complete the AgroNet Africa foundational certification covering modern agricultural techniques, safety protocols, and digital tools.',
      skills: ['Modern Ag Techniques', 'Safety Protocols', 'Digital Farm Tools'],
      type: 'badge',
      badge: { name: 'AgroNet Africa Certified Professional', issuer: 'AgroNet Africa Academy', icon: '🏅' },
    },
    {
      phase: 'Advanced Training',
      duration: '6 – 9 months',
      title: 'Specialized Domain Training',
      description: 'Choose a niche — aquaculture, hydroponics, livestock, or crop science — and earn advanced credentials through hands-on field training.',
      skills: ['Niche Specialization', 'Field Research Methods', 'Industry Networking'],
      type: 'badge',
      badge: { name: 'Agricultural Domain Expert', issuer: 'Pan-African Agricultural Board', icon: '🎖️' },
    },
    {
      phase: 'Leadership',
      duration: '9 – 12 months',
      title: 'Agricultural Leadership & Enterprise',
      description: 'Build management and entrepreneurial skills — agribusiness finance, team leadership, and go-to-market strategies.',
      skills: ['Agribusiness Finance', 'Team Leadership', 'Go-to-Market Strategy'],
      type: 'skill',
    },
  ],
  matchingJobs: [
    {
      id: 'mapped_job_gen_1',
      title: 'Farm Operations Manager',
      company: 'HarvestPrime Farms',
      location: 'Ibadan, Nigeria',
      type: 'Full-time',
      salary: '₦350,000 – ₦500,000/month',
      tags: ['Management', 'Operations', 'Livestock'],
      postedAt: '2025-08-10',
    },
    {
      id: 'mapped_job_gen_2',
      title: 'Agricultural Extension Officer',
      company: 'AgroNet Africa Foundation',
      location: 'Dakar, Senegal',
      type: 'Full-time',
      salary: 'CFA 450,000 – CFA 700,000/month',
      tags: ['Extension', 'Community', 'Training'],
      postedAt: '2025-09-01',
    },
  ],
};


/**
 * Main mapping function — the "engine".
 * 
 * @param {string} dreamText - The user's typed dream career description
 * @returns {object} A complete career roadmap result
 */
export function mapDreamToCareer(dreamText) {
  if (!dreamText || typeof dreamText !== 'string' || dreamText.trim().length < 3) {
    return null;
  }

  const normalizedText = dreamText.toLowerCase().trim();

  // Score each career path by counting keyword matches
  let bestMatch = null;
  let bestScore = 0;

  for (const path of CAREER_PATHS) {
    let score = 0;
    for (const keyword of path.keywords) {
      if (normalizedText.includes(keyword.toLowerCase())) {
        // Longer keywords get more weight (more specific matches)
        score += keyword.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = path;
    }
  }

  // Use the best match or fall back to general
  const selectedPath = bestScore > 0 ? bestMatch : DEFAULT_PATH;

  // Build the result
  return {
    pathId: selectedPath.id,
    pathName: selectedPath.name,
    pathIcon: selectedPath.icon,
    targetRole: selectedPath.roleTitle,
    dreamInput: dreamText.trim(),
    totalDuration: selectedPath.roadmap[selectedPath.roadmap.length - 1].duration.split('–')[1]?.trim() || '12 months',
    steps: selectedPath.roadmap.map((step, index) => ({
      id: `step_${index + 1}`,
      stepNumber: index + 1,
      phase: step.phase,
      duration: step.duration,
      title: step.title,
      description: step.description,
      skills: step.skills,
      type: step.type,
      badge: step.badge || null,
    })),
    matchingJobs: selectedPath.matchingJobs,
    confidence: bestScore > 0 ? Math.min(Math.round((bestScore / 20) * 100), 98) : 72,
  };
}
