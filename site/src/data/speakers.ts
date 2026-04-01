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
        image: "./assets/speakers/2.png",
        title: "Opening Keynote: The CFO Evolution: From Financial Steward to AI Growth Pilot",
        speaker: "Bojan Radojičić",
        role: "Founder of CFO AI Nexus, Corporate Finance Hub and WTS Tax & Finance.",
        stage: ['Main Stage'],
        link: "https://www.linkedin.com/in/bojan-radojicic-a132a526/"
    },
    {
        image: "./assets/speakers/5.png",
        title: "Technology Trends for Finance: Tools, Implementation and Real-World Use Cases",
        speaker: "Nicolas Boucher",
        role: "Nicolas Boucher, Founder of AI Finance Club",
        stage: ['Main Stage'],
        link: "https://www.linkedin.com/in/bouchernicolas/"
    },
    {
        image: "./assets/speakers/8.png",
        title: "CFO Leadership Transformation",
        speaker: "Steve Rosvold",
        role: "Founder of CFO.University, MBA",
        stage: ['Main Stage'],
        link: "https://www.linkedin.com/in/steverosvold/"
    },
    {
        image: "./assets/speakers/14.png",
        title: "Build Financial Dashboards Leadership Actually Trust",
        speaker: "Josh Aharonoff",
        role: "Founder of Model Wiz and Mighty Digits",
        stage: ['Main Stage'],
        link: "https://www.linkedin.com/in/joshaharonoff/"
    },
    {
        image: "./assets/speakers/9.png",
        title: "How to Use AI for Audit Offense",
        speaker: "Joy Mbanugo",
        role: "J.D., MAcc., 2xs CFO, ex-Google, ex-BlackRock, ex-EY, Board Advisor",
        stage: ['Main Stage'],
        link: "https://www.linkedin.com/in/joymbanugo/"
    },
    {
        image: "./assets/speakers/3.png",
        title: "Storytelling framework and practical tools to become a powerful presenter",
        speaker: "Ron Monteiro",
        role: "CPA, CMA, Speaker and Coach, Clean Concept inc.",
        stage: ['Main Stage'],
        link: "https://www.linkedin.com/in/ronmonteiro18/"
    },
    // {
    //     image: "./assets/speakers/LazarDjurisic.webp",
    //     title: "Technology Trends for Finance: Tools, Implementation and Real-World Use Cases",
    //     speaker: "Lazar Djurišić",
    //     role: "Senior Finance and Tax Advisor, WTS Tax & Finance",
    //     stage: ['Main Stage'],
    //     link: "https://www.linkedin.com/in/lazar-%C4%91uri%C5%A1i%C4%87-5277511b0/"
    // },
    {
        image: "./assets/speakers/4.png",
        title: "Strategic FP&A Roadmap 2027",
        speaker: "Christian Wattig",
        role: "Director, Wharton FP&A Program, Founder of Inside FP&A",
        stage: ['FP&A'],
        link: "https://www.linkedin.com/in/christian-wattig/"
    },
    {
        image: "./assets/speakers/13.png",
        title: "FP&A Today: Industry-Leading Solutions",
        speaker: "Paul Barnhurst",
        role: "Founder of The FP&A Guy, Co-founder FP&A Hub, Microsoft MVP",
        stage: ['FP&A'],
        link: "https://www.linkedin.com/in/thefpandaguy/"
    },
    {
        image: "./assets/speakers/7.png",
        title: "Why AI Without Expertise is Just Automated Mediocrity",
        speaker: "Carolina Lago",
        role: "Corporate Trainer, FP&A & Financial Modeling Specialist",
        stage: ['FP&A'],
        link: "https://www.linkedin.com/in/s-carolinalago/"
    },
    {
        image: "./assets/speakers/12.png",
        title: "How to Communicate Insights and Influence Business Decisions like a Strategic CFO",
        speaker: "Soufyan Hamid",
        role: "Founder of The Finance Circle.",
        stage: ['FP&A'],
        link: "https://www.linkedin.com/in/soufyanhamid/"
    },
    {
        image: "./assets/speakers/10.png",
        title: "How to Eliminate Financial Reporting Errors and Face Audits with Confidence using AI",
        speaker: "Dušan Aleksov",
        role: "Partner at WTS Tax & Finance",
        stage: ['Financial Close & Consolidation'],
        link: "https://www.linkedin.com/in/dusan-aleksov-425812155/"
    },
    {
        image: '/assets/speakers/6.png',
        title: "How to Automate the Financial Close and Eliminate Manual Reconciliations",
        speaker: "Alex Stojanović",
        role: "Founder of Fiscalion",
        stage: ['Financial Close & Consolidation'],
        link: "https://www.linkedin.com/in/aleksandar-stojanovic-msc/"
    },
    {
        image: '/assets/speakers/2.png',
        title: "Connecting ERP Systems with MCP server for Real-Time Decision Making",
        speaker: "Bojan Radojičić",
        role: "Founder of CFO AI Nexus, Corporate Finance Hub and WTS Tax & Finance.",
        stage: ['Financial Close & Consolidation'],
        link: "https://www.linkedin.com/in/aleksandar-stojanovic-msc/"
    },
    {
        image: "./assets/speakers/2.png",
        title: "Advanced Cash Flow Forecasting by Syncing Banks, PSPs, and ERP Systems",
        speaker: "Bojan Radojičić",
        role: "Founder of CFO AI Nexus, Corporate Finance Hub and WTS Tax & Finance.",
        stage: ['Treasury & Cash Management'],
        link: "https://www.linkedin.com/in/bojan-radojicic-a132a526/"
    },
    {
        image: "./assets/speakers/Marina Milisic.webp",
        title: "How to Use Automation to Protect Cash Flow from Currency and Interest Rate Risks",
        speaker: "Marina Milisić",
        role: "AI Implementation Developer, Corporate Finance Hub",
        stage: ['Treasury & Cash Management'],
        link: "https://www.linkedin.com/in/marina-milisic-019839138/"
    },
    {
        image: "./assets/speakers/11.png",
        title: "Integrating AI Agents into the Finance Team Workflow",
        speaker: "Filip Karaičić",
        role: "Chief Executive Officer at Quantox Technology, Founder at OsirisAI",
        stage: ['AR/AP Automation'],
        link: "https://www.linkedin.com/in/filipkaraicic/"
    },
    {
        image: "./assets/speakers/1.png",
        title: "How to Strengthen Financial Controls and Prevent Payment Fraud via AI",
        speaker: "Lazar Djurišić",
        role: "AI Implementation Manager at Corporate Finance Hub",
        stage: ['AR/AP Automation']
    },
    {
        image: "./assets/speakers/2.png",
        title: "How AI is transforming AR from a reactive collections function into a predictive engine",
        speaker: "Bojan Radojičiċ",
        role: "Founder of CFO AI Nexus, Corporate Finance Hub and WTS Tax & Finance",
        stage: ['AR/AP Automation']
    },
]