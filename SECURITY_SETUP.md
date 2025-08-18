# Contact Form Security Setup

## 🔒 Security Measures Implemented

Your contact form now has two layers of security:

### 1. Origin Check (Domain Restriction)
- Only allows requests from specified domains
- Blocks requests from unauthorized origins
- Prevents cross-site request forgery (CSRF)

### 2. Secret Token Authentication
- Requires a secret token for form submission
- Prevents random curl hits and spam
- Adds an extra layer of protection

## 🛠️ Setup Instructions

### Step 1: Set Environment Variables

Create a `.env` file in your project root with:

```env
# Contact Form Security Token (generate a strong random string)
CONTACT_FORM_TOKEN=your-super-secret-token-here

# Resend Email Service
RESEND_API_KEY=your-resend-api-key-here

# Public token for frontend (same as above)
PUBLIC_CONTACT_FORM_TOKEN=your-super-secret-token-here
```

### Step 2: Update Allowed Origins

In `api/contact.js`, update the `ALLOWED_ORIGINS` array with your actual domains:

```javascript
const ALLOWED_ORIGINS = [
  'http://localhost:4321', // Astro dev server
  'http://localhost:3000', // Alternative dev port
  'https://yourdomain.com', // Replace with your actual domain
  'https://www.yourdomain.com', // With www
];
```

### Step 3: Generate a Strong Token

Generate a secure random token (you can use this command):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```



### Step 4: Deploy to Vercel

When deploying to Vercel, add these environment variables in your Vercel dashboard:
- `CONTACT_FORM_TOKEN`
- `RESEND_API_KEY`
- `PUBLIC_CONTACT_FORM_TOKEN`

## 🔍 How It Works

1. **Origin Check**: The API checks if the request comes from an allowed domain
2. **Token Validation**: The API validates the secret token in the request headers
3. **Request Processing**: Only if both checks pass, the email is sent

## 🚨 Security Benefits

- **Prevents CSRF attacks**: Origin checking blocks cross-site requests
- **Stops spam**: Secret token prevents random form submissions
- **Logs unauthorized attempts**: Failed requests are logged for monitoring

## 🧪 Testing

To test locally:
1. Set up your `.env` file
2. Update `ALLOWED_ORIGINS` to include `http://localhost:4321`
3. Submit the contact form
4. Check the console for any security warnings

## 🔧 Troubleshooting

If the form stops working:
1. Check that `PUBLIC_CONTACT_FORM_TOKEN` is set correctly
2. Verify your domain is in `ALLOWED_ORIGINS`
3. Check browser console for error messages
4. Verify environment variables are set in Vercel 