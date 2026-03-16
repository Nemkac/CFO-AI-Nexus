export type Speaker = {
    image: string
    speaker: string
    role: string
    title: string
    stage: string[]
    link?: string
}

export const stages = ['Main Stage', 'FP&A', 'Financial Close & Consolidation', 'Treasury & Cash Management', 'AR/AP Automation']

export const speakers: Speaker[] = [
    {
        image: "./assets/speakers/Bojan Radojicic.png",
        title: "Opening Keynote: The CFO Evolution: From Financial Steward to AI Growth Pilot",
        speaker: "Bojan Radojičić",
        role: "Founder of CFO AI Nexus, Corporate Finance Hub and WTS Tax & Finance.",
        stage: ['Main Stage'],
        link: "https://www.linkedin.com/in/bojan-radojicic-a132a526/"
    },
    {
        image: "./assets/speakers/LazarDjurisic.png",
        title: "Technology Trends for Finance: Tools, Implementation and Real-World Use Cases",
        speaker: "Lazar Djurišić",
        role: "Senior Finance and Tax Advisor, WTS Tax & Finance",
        stage: ['Main Stage'],
        link: "https://www.linkedin.com/in/lazar-%C4%91uri%C5%A1i%C4%87-5277511b0/"
    },
    {
        image: "./assets/speakers/josh.jpg",
        title: "Beyond the Spreadsheet: How AI LLMs are Transforming Financial Reporting",
        speaker: "Josh Aharonoff",
        role: "Founder and CEO of Model Wiz, Mighty Digits and ",
        stage: ['Main Stage', 'FP&A']
    },
    {
        image: "./assets/speakers/Bojan Radojicic.png",
        title: "Building Custom Dashboarding Tools with AI Model",
        speaker: "Bojan Radojičić",
        role: "Founder of CFO AI Nexus, Corporate Finance Hub and WTS Tax & Finance.",
        stage: ['FP&A'],
        link: "https://www.linkedin.com/in/bojan-radojicic-a132a526/"
    },
    {
        image: "./assets/speakers/Bojan Radojicic.png",
        title: "How to Use Claude AI for Predictive Forecasting from Hindsight to Foresight",
        speaker: "Bojan Radojičić",
        role: "Founder of CFO AI Nexus, Corporate Finance Hub and WTS Tax & Finance.",
        stage: ['FP&A'],
        link: "https://www.linkedin.com/in/bojan-radojicic-a132a526/"
    },
    {
        image: "./assets/speakers/Soufyan.jpeg",
        title: "How to Communicate Insights and Influence Business Decisions like a Strategic CFO",
        speaker: "Soufyan Hamid",
        role: "Founder of The Finance Circle.",
        stage: ['FP&A'],
        link: "https://www.linkedin.com/in/soufyanhamid/"
    },
    {
        image: "./assets/speakers/DusanAleksov.png",
        title: "How to Eliminate Financial Reporting Errors and Face Audits with Confidence using AI",
        speaker: "Dušan Aleksov",
        role: "Partner at WTS Tax & Finance",
        stage: ['Financial Close & Consolidation'],
        link: "https://www.linkedin.com/in/dusan-aleksov-425812155/"
    },
    {
        image: '/assets/speakers/Alex Stojanovic.jpg',
        title: "How to Automate the Financial Close and Eliminate Manual Reconciliations",
        speaker: "Alex Stojanović",
        role: "Founder of Fiscalion",
        stage: ['Financial Close & Consolidation'],
        link: "https://www.linkedin.com/in/aleksandar-stojanovic-msc/"
    },
    {
        image: '/assets/speakers/Fake 1 (4).png',
        title: "Connecting ERP Systems to AI for Real-Time Decision Making",
        speaker: "Robert Miller",
        role: "CFO, LedgerFlow",
        stage: ['Financial Close & Consolidation']
    },
    {
        image: "./assets/speakers/Bojan Radojicic.png",
        title: "Advanced Cash Flow Forecasting by Syncing Banks, PSPs, and ERP Systems",
        speaker: "Bojan Radojičić",
        role: "Founder of CFO AI Nexus, Corporate Finance Hub and WTS Tax & Finance.",
        stage: ['Treasury & Cash Management'],
        link: "https://www.linkedin.com/in/bojan-radojicic-a132a526/"
    },
    {
        image: "./assets/speakers/Marina Milisic.jpg",
        title: "How to Use Automation to Protect Cash Flow from Currency and Interest Rate Risks",
        speaker: "Marina Milisić",
        role: "AI Implementation Developer, Corporate Finance Hub",
        stage: ['Treasury & Cash Management'],
        link: "https://www.linkedin.com/in/marina-milisic-019839138/"
    },
    {
        image: "./assets/speakers/Fake 1 (1).png",
        title: "How to Centralize Global Entity Data and Bank Account Management",
        speaker: "Rachel Goldstein",
        role: "Head of Treasury, Trade4Distribution",
        stage: ['Treasury & Cash Management']
    },
    {
        image: "./assets/speakers/Filip Karaicic.jpg",
        title: "Integrating AI Agents into the Finance Team Workflow",
        speaker: "Filip Karaičić",
        role: "Chief Executive Officer at Quantox Technology, Founder at OsirisAI",
        stage: ['AR/AP Automation'],
        link: "https://www.linkedin.com/in/filipkaraicic/"
    },
    {
        image: "./assets/speakers/LazarDjurisic.png",
        title: "How to Strengthen Financial Controls and Prevent Payment Fraud via AI",
        speaker: "Lazar Djurišić",
        role: "AI Implementation Manager at Corporate Finance Hub",
        stage: ['AR/AP Automation']
    },
    {
        image: "./assets/speakers/Fake 1 (1).png",
        title: "How AI is transforming AR from a reactive collections function into a predictive engine",
        speaker: "Derek Wu",
        role: "Director of Revenue Operations, Payments Force",
        stage: ['AR/AP Automation']
    },
]