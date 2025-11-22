
# SMA Daily Assist

![SMA Daily Assist](public/logo.png)

**SMA Daily Assist** is a web application designed to improve the daily lives of people living with **Spinal Muscular Atrophy (SMA)** and their caregivers. This project was built using **Next.js**, **v0.dev**, and **Supabase** for authentication and data storage. It provides smart assistive tools, caregiver-patient connection features, and dashboards for better communication and independence.

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

---

## About

Living with SMA comes with daily challenges, from mobility and communication to caregiving and independence. **SMA Daily Assist** is designed to:

- Enable better patient-caregiver communication
- Provide dashboards for tracking requests and activities
- Offer simple, achievable solutions to improve quality of life

This project was originally developed as part of a hackathon focused on **human-centered innovation** for SMA patients.

---

## Features

- **Patient & Caregiver Connection**: Connects patients and caregivers for smoother communication.
- **Dashboard Management**: Role-specific dashboards for caregivers and patients.
- **Request Management**: Track and manage assistance requests efficiently.
- **Settings & Personalization**: Customize user settings for better experience.
- **Authentication**: Secure signup and login using Supabase.

---

## Tech Stack

- **Frontend**: Next.js 16, React
- **Backend / Database**: Supabase
- **Deployment**: Vercel
- **Styling**: Tailwind CSS
- **Other**: v0.dev (for rapid prototyping and AI-assisted component generation)

---

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/Victor4life/sma-daily-assist.git
cd sma-daily-assist
````

2. **Install dependencies**

```bash
pnpm install
```

3. **Setup environment variables** (see below)

4. **Run locally**

```bash
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

Create a `.env.local` file in the root directory and add the following:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

* `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
* `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase public anonymous key.

> **Do not commit `.env.local`** to GitHub as it contains sensitive credentials.

---

## Usage

* **Sign Up / Login**: Users can register and log in.
* **Dashboards**: Depending on role (patient or caregiver), users see a custom dashboard.
* **Patient-Caregiver Connection**: Send and respond to requests.
* **Settings**: Update profile and preferences.

---

## Contributing

We welcome contributions! To contribute:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Commit your changes: `git commit -m "Add your feature"`
5. Push to the branch: `git push origin feature/your-feature`
6. Open a pull request

---

## License

This project is open-source and available under the [MIT License](LICENSE).

---

## Acknowledgements

* Built with ❤️ using **Next.js**, **Supabase**, and **v0.dev**.
* Inspired by real-world challenges faced by SMA patients and caregivers.
* Hackathon project: **LIFE HACKS: Creating Solutions for Daily SMA Challenges**
```
