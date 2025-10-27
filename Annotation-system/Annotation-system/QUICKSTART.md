# Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Backend Setup (Terminal 1)
```bash
cd server
npm install
npm start
```
✅ Server running on http://localhost:8000

### Step 2: Frontend Setup (Terminal 2)
```bash
cd client
npm install
npm run dev
```
✅ Frontend running on http://localhost:5173

### Step 3: Configure MongoDB
1. Create a `.env` file in the `server` folder
2. Add your MongoDB credentials:
```env
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

3. Update the connection string in `server/database/db.js`:
```javascript
const URL = `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.jxvc56p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
```

### Step 4: Test the Application
1. Open http://localhost:5173 in your browser
2. Enter username and email
3. Upload a text file (.txt) or PDF (.pdf)
4. Click on the uploaded document
5. Select text and add a comment
6. Open the same document in another browser tab to see real-time updates!

## 📁 Project Structure Overview

```
Annotation-system/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/       # UI Components
│   │   │   ├── Login.jsx
│   │   │   ├── DocumentList.jsx
│   │   │   └── DocumentViewer.jsx
│   │   ├── service/
│   │   │   └── api.js         # API configuration
│   │   ├── utils/
│   │   │   └── socket.js      # Socket.io setup
│   │   └── App.jsx            # Main app
│   └── package.json
│
└── server/                    # Node.js Backend
    ├── models/                # Database schemas
    │   ├── User.js
    │   ├── Document.js
    │   └── Annotation.js
    ├── controllers/
    │   └── documentController.js
    ├── routes/
    │   └── route.js
    ├── database/
    │   └── db.js
    └── index.js              # Server entry point
```

## 🎯 Key Features

### ✅ Document Upload
- Upload .txt or .pdf files
- Automatic text extraction from PDFs
- File size limit: 10MB

### ✅ Text Annotation
- Select any text in the document
- Add comments/annotations
- See annotations in side panel

### ✅ Real-Time Collaboration
- Multiple users can annotate simultaneously
- Updates appear instantly for all users
- Color-coded by user

### ✅ Performance Optimized
- Handles 1000+ annotations efficiently
- Pagination for large datasets
- Database indexing for fast queries

## 🔧 Troubleshooting

### Server won't start
- Check MongoDB connection in `.env`
- Ensure port 8000 is available
- Run `npm install` in server folder

### Frontend won't start
- Run `npm install` in client folder
- Check if port 5173 is available
- Clear browser cache

### File upload fails
- Check file size (< 10MB)
- Verify file type (.txt or .pdf)
- Check browser console for errors

### Real-time not working
- Verify both servers are running
- Check browser console for Socket.io connection
- Ensure CORS is configured correctly

## 📚 Learn More

- **README.md** - Complete documentation
- **TUTORIAL.md** - Detailed file-by-file explanation
- Check console logs for debugging

## 🎓 Learning Path

1. **Start Simple**: Understand the basic flow
   - Login → Upload → Annotate

2. **Explore Backend**: 
   - Check `server/models/` for database structure
   - Look at `server/controllers/` for API logic
   - Study `server/index.js` for Socket.io setup

3. **Explore Frontend**:
   - Check `client/src/components/` for UI
   - Study `DocumentViewer.jsx` for annotation logic
   - Understand Socket.io integration

4. **Experiment**:
   - Add new features
   - Modify the UI
   - Add new API endpoints

## 🎉 You're Ready!

The application is now set up and ready to use. Start by uploading a document and trying out the annotation features!


