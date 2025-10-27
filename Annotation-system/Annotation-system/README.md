# Collaborative Document Annotation System

A real-time collaborative document annotation system built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.io for real-time collaboration.

## Features

- ✅ **Document Upload & Storage**: Upload text (.txt) or PDF (.pdf) files
- ✅ **Annotation Feature**: Select text and add comments with timestamps
- ✅ **Real-Time Collaboration**: Multiple users can annotate simultaneously with live updates
- ✅ **Efficient Handling**: Optimized for documents with 1000+ annotations
- ✅ **Duplicate Prevention**: Prevents duplicate annotations for the same text range by the same user
- ✅ **User Management**: Simple user authentication and color-coded annotations

## Project Structure

```
Annotation-system/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Login.jsx           # User login component
│   │   │   ├── DocumentList.jsx    # List of uploaded documents
│   │   │   └── DocumentViewer.jsx  # Document viewer with annotations
│   │   ├── service/
│   │   │   └── api.js      # Axios API configuration
│   │   ├── utils/
│   │   │   └── socket.js   # Socket.io client setup
│   │   └── App.jsx         # Main app component
│   └── package.json
│
└── server/                 # Node.js Backend
    ├── models/             # MongoDB schemas
    │   ├── User.js         # User model
    │   ├── Document.js     # Document model
    │   └── Annotation.js  # Annotation model
    ├── controllers/
    │   └── documentController.js  # API controllers
    ├── routes/
    │   └── route.js        # Express routes
    ├── database/
    │   └── db.js          # MongoDB connection
    ├── uploads/           # Temporary file storage
    └── index.js          # Server entry point with Socket.io
```

## Technology Stack

### Backend
- **Node.js** + **Express**: RESTful API server
- **MongoDB** + **Mongoose**: Database and ODM
- **Socket.io**: Real-time bidirectional communication
- **Multer**: File upload handling
- **pdf-parse**: PDF text extraction

### Frontend
- **React**: UI framework
- **Material-UI**: Component library
- **Axios**: HTTP client
- **Socket.io-client**: Real-time client

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory:
```env
DB_USERNAME=your_mongodb_username
DB_PASSWORD=your_mongodb_password
```

4. Update the MongoDB connection string in `server/database/db.js` with your credentials.

5. Start the server:
```bash
npm start
```

The server will run on `http://localhost:8000`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## How It Works

### 1. User Authentication (`Login.jsx`)
- Users enter username and email
- Backend creates or retrieves user from database
- Each user gets a unique color for their annotations

### 2. Document Upload (`DocumentList.jsx`)
- Users can upload `.txt` or `.pdf` files
- PDFs are parsed to extract text content
- Documents are stored in MongoDB with metadata
- File is temporarily stored, content extracted, then deleted

### 3. Document Viewing (`DocumentViewer.jsx`)
- Displays document content with syntax highlighting
- Users can select text to annotate
- Selected text triggers a comment input box
- Annotations are displayed in a side panel

### 4. Real-Time Collaboration (`Socket.io`)
- When a user opens a document, they join a Socket.io room
- New annotations are broadcast to all users in the room
- Deletions are also synchronized in real-time
- No page refresh needed for updates

## Database Schema Design

### User Schema
```javascript
{
    username: String,
    email: String (unique),
    color: String (default: '#FF5733'),
    timestamps: true
}
```

### Document Schema
```javascript
{
    filename: String,
    originalName: String,
    fileType: String (enum: ['text', 'pdf']),
    content: String,
    uploadedBy: ObjectId (ref: User),
    annotationCount: Number,
    timestamps: true
}
```

### Annotation Schema
```javascript
{
    documentId: ObjectId (ref: Document),
    userId: ObjectId (ref: User),
    username: String,
    userColor: String,
    selectedText: String,
    comment: String,
    startIndex: Number,
    endIndex: Number,
    rangeHash: String (unique),
    timestamps: true
}
```

## Performance Optimizations

### 1. Database Indexing
- **Document**: Indexed on `uploadedBy` and `createdAt` for faster queries
- **Annotation**: Indexed on `documentId` for efficient filtering
- **Compound Index**: `{documentId, userId, rangeHash}` prevents duplicates and speeds up lookups

### 2. Pagination
- Annotations are fetched in batches of 100
- Reduces initial load time for documents with many annotations
- Implemented in both REST API and Socket.io handlers

### 3. Efficient Text Highlighting
- Annotations are sorted by index before highlighting
- Uses HTML `<mark>` tags for visual highlighting
- Client-side rendering for instant feedback

### 4. Real-Time Updates
- Socket.io rooms isolate updates to specific documents
- Only relevant users receive updates
- Reduces unnecessary network traffic

## API Endpoints

### User Management
- `POST /user` - Create or get user

### Document Management
- `POST /upload` - Upload a document (multipart/form-data)
- `GET /documents` - Get all documents
- `GET /document/:id` - Get document with annotations

### Annotation Management
- `POST /annotation` - Create annotation
- `GET /annotations/:documentId` - Get annotations for a document
- `DELETE /annotation/:id` - Delete annotation

## Socket.io Events

### Client → Server
- `join-document` - Join a document room
- `leave-document` - Leave a document room
- `new-annotation` - Create a new annotation
- `delete-annotation` - Delete an annotation

### Server → Client
- `annotation-added` - Broadcast new annotation to all users
- `annotation-deleted` - Broadcast deleted annotation
- `annotation-error` - Send error messages

## Edge Case Handling

### 1. Duplicate Annotations
- **Problem**: Same user annotating the same text range multiple times
- **Solution**: `rangeHash` field creates unique constraint using compound index
- **Implementation**: MD5 hash of `documentId-userId-startIndex-endIndex`

### 2. Overlapping Text Ranges
- **Problem**: Multiple users annotating overlapping text
- **Solution**: Each annotation is independent with its own range
- **Display**: Multiple highlights can overlap visually

### 3. Large Documents
- **Problem**: Documents with 1000+ annotations causing UI lag
- **Solution**: Pagination limits initial load to 100 annotations
- **Implementation**: Lazy loading additional annotations as needed

### 4. File Upload Errors
- **Problem**: Invalid file types or oversized files
- **Solution**: Multer middleware validates file type and size (10MB limit)
- **Error Handling**: User-friendly error messages

### 5. Concurrent Updates
- **Problem**: Multiple users editing simultaneously
- **Solution**: Socket.io ensures atomic updates
- **Database**: MongoDB handles concurrent writes safely

## Security Considerations

- File type validation (only .txt and .pdf allowed)
- File size limits (10MB maximum)
- Input sanitization for user comments
- MongoDB injection prevention via Mongoose
- CORS configuration for API access

## Future Enhancements

- User authentication with JWT tokens
- Role-based access control
- Export annotations to PDF/Word
- Search functionality within documents
- Annotation replies/threads
- User mentions (@username)
- Rich text formatting in comments
- Document versioning

## Troubleshooting

### Server won't start
- Check MongoDB connection string in `.env`
- Ensure port 8000 is not in use
- Verify all dependencies are installed

### File upload fails
- Check file size (must be < 10MB)
- Verify file type is .txt or .pdf
- Ensure `uploads/` directory exists

### Real-time updates not working
- Verify Socket.io connection in browser console
- Check CORS configuration in `server/index.js`
- Ensure both frontend and backend are running

## License

MIT License - feel free to use this project for learning and development.

## Author

Built as a MERN stack learning project demonstrating:
- Full-stack development
- Real-time collaboration
- Database design and optimization
- RESTful API design
- React component architecture


