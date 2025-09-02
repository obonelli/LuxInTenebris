# CV Reviewer with AI

This project is a **Next.js 15** application designed to help users
improve their resumes using **AI assistance**.\
It allows candidates to upload or paste their CV, and the system
automatically analyzes its content, providing feedback, improvements,
and suggestions tailored for the tech industry.

------------------------------------------------------------------------

## 🚀 Features

-   **Resume Upload & Analysis**\
    Users can upload a PDF/DOCX file or paste text directly into the
    app.

-   **AI Feedback Engine**\
    Uses OpenAI integration to analyze resumes and suggest improvements
    in:

    -   Clarity and formatting
    -   Technical skills alignment
    -   Grammar and readability
    -   Keywords for ATS (Applicant Tracking Systems)

-   **Job-Oriented Suggestions**\
    The system adapts suggestions based on job position and seniority
    level.

-   **Modern UI**\
    Built with **Material UI (MUI)** and a dark mode--friendly design.\
    Responsive layouts optimized for both desktop and mobile.

-   **Authentication**\
    Integrated with **NextAuth** to allow sign-in with Google.\
    Personalized feedback and history saved per user.

-   **API Routes**\
    Custom `/api/analyze` endpoint to handle CV parsing and LLM
    integration.

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

## 🌐 Demo

You can test the live demo here: [https://www.luxintenebris.mx](https://www.luxintenebris.mx)

------------------------------------------------------------------------

## 📜 License

MIT License