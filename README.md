# Lux In Tenebris — AI Recruitment Platform

This project is a **Next.js 15** application that serves as a modern **job board and recruitment system**, inspired by platforms like Computrabajo.  
It connects candidates with open roles and supports recruiters with **AI-assisted insights** to improve the hiring process.

---

## 🚀 Features

- **Job Listings & Search**  
  Browse and filter open positions by technology, seniority, working scheme, English level, and location.

- **AI-Powered Matching (Planned)**  
  Smart matching engine that will leverage AI to connect candidate profiles with the most relevant opportunities.

- **Global Talent Pool (Planned)**  
  Candidate database with advanced filters to help recruiters identify top talent faster.

- **Technical Screening (Planned)**  
  Automated candidate testing and feedback to validate skills efficiently.

- **Modern UI**  
  Built with **Material UI (MUI)** in dark mode, fully responsive and mobile-friendly.

- **Authentication**  
  Integrated with **NextAuth** for secure sign-in (Google).  
  Enables personalized dashboards and candidate history.

- **Scalable Backend**  
  Powered by **Next.js API Routes + Prisma + MySQL**, ready for future integrations with ATS/HR systems.

------------------------------------------------------------------------

## 🛠️ Tech Stack

-   **Frontend**: Next.js 15 (App Router, React Server Components,
    Suspense)\
-   **Styling**: Material UI + Custom CSS\
-   **Backend**: Next.js API Routes\
-   **Database**: Prisma ORM + MySQL (extendable)\
-   **Authentication**: NextAuth.js (Google provider)\
-   **AI**: OpenAI API integration

------------------------------------------------------------------------

## 📦 Installation

Clone the repository:

``` bash
git clone https://github.com/your-username/LuxInTenebris.git
cd cv-reviewer
```

Install dependencies:

``` bash
npm install
# or
yarn install
```

Start development server:

``` bash
npm run dev
```

Then open <http://localhost:3000>.

------------------------------------------------------------------------

## 🔑 Environment Variables

Create a `.env.local` file with:

```env
NEXTAUTH_SECRET=your_secret
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_google_secret
DATABASE_URL=mysql://user:password@localhost:3306/cv_reviewer

# Optional: only required if you want to enable AI-powered CV analysis
OPENAI_API_KEY=your_openai_api_key

------------------------------------------------------------------------

## 📂 Project Structure

    cv-reviewer/
     ├─ app/                # App Router (pages, layouts, routes)
     │   ├─ api/            # Internal API routes
     │   ├─ components/     # Reusable UI components
     │   └─ (auth, jobs)/   # Authentication and job-related routes
     ├─ prisma/             # Prisma schema and migrations
     ├─ public/             # Static assets
     ├─ styles/             # Global styles
     └─ README.md

------------------------------------------------------------------------

## 📄 Roadmap

- [x] Basic resume upload & text analysis  
- [x] AI integration for feedback  
- [x] Export analyzed CV as PDF  
- [x] Mobile support
- [ ] User dashboard with CV history  
- [ ] Multi-language support  
- [ ] Admin panel for job insights  
- [ ] Administrative module to create/manage new job postings  
- [ ] Candidate testing module (practice exercises & assessments)  

------------------------------------------------------------------------

``` bash
## 🌐 Demo
```
You can test the live demo here: <https://www.luxintenebris.mx>

------------------------------------------------------------------------

## 📜 License

MIT License
