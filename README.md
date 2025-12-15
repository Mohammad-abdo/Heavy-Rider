# Heavy Rider - Admin Dashboard

A modern, responsive admin dashboard for managing heavy equipment, cranes, drivers, and rides.

## 🚀 Features

- **Modern UI/UX**: Beautiful, animated dashboard with smooth transitions
- **Complete API Integration**: All Postman collection endpoints integrated
- **Data Tables**: Searchable, sortable, paginated data tables with animations
- **Charts & Analytics**: Multiple chart types (Area, Bar, Donut, Radial, etc.)
- **Real-time Statistics**: Live dashboard with performance metrics
- **Responsive Design**: Works on all devices
- **Multi-language Support**: i18n ready

## 🛠️ Tech Stack

- React 18
- Vite
- React Bootstrap
- ApexCharts
- React Router
- Axios
- React Hook Form
- i18next

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Deployment to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. For production deployment:
```bash
vercel --prod
```

### Option 2: Deploy via GitHub

1. Push your code to GitHub (already done ✅)
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository: `Mohammad-abdo/Heavy-Rider`
4. Vercel will auto-detect Vite and configure settings
5. Click "Deploy"

### Configuration

The `vercel.json` file is already configured with:
- ✅ Build command: `npm run build`
- ✅ Output directory: `dist`
- ✅ Framework: Vite
- ✅ Client-side routing support
- ✅ Asset caching headers

### Environment Variables (if needed)

If you need to change the API base URL, you can set environment variables in Vercel:

1. Go to your project settings in Vercel
2. Navigate to "Environment Variables"
3. Add any required variables

Currently, the API base URL is hardcoded in `src/api/api.js`. To make it configurable:

1. Create a `.env` file:
```
VITE_API_BASE_URL=https://heavy-ride.teamqeematech.site/api/
```

2. Update `src/api/api.js`:
```javascript
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://heavy-ride.teamqeematech.site/api/'
```

3. Add the variable in Vercel dashboard

## 📁 Project Structure

```
src/
├── api/              # API configuration and endpoints
├── app/              # Application pages
│   ├── (admin)/      # Admin pages
│   └── (other)/      # Auth and other pages
├── assets/           # Images, fonts, styles
├── components/       # Reusable components
├── context/          # React context providers
├── hooks/            # Custom React hooks
├── routes/           # Route configuration
└── utils/            # Utility functions
```

## 🎨 Features Overview

### Dashboard
- Real-time statistics
- Activity trends charts
- Status comparison charts
- Performance metrics
- Entity distribution
- Data tables with search & pagination

### Authentication
- Modern login page design
- "Heavy Rider" branding
- Secure authentication flow

### Data Management
- Riders management
- Drivers management
- Cranes management
- Admins management
- Settings configuration

## 📝 License

Private project - All rights reserved

## 👨‍💻 Author

Mohammad Abdo

---

Built with ❤️ for Heavy Rider
