import { useState, useEffect } from 'react';
import { Box, Button, List, ListItem, ListItemText, Paper, Typography, CircularProgress } from '@mui/material';
import API from '../service/api';

const DocumentList = ({ user, onSelectDocument }) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const response = await API.get('/documents');
            setDocuments(response.data);
        } catch (error) {
            console.error('Error fetching documents:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt,.pdf';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('file', file);
            formData.append('userId', user._id);

            try {
                await API.post('/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                fetchDocuments();
            } catch (error) {
                console.error('Upload error:', error);
                alert('Error uploading file');
            }
        };
        input.click();
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">Documents</Typography>
                <Button variant="contained" onClick={handleUpload}>
                    Upload Document
                </Button>
            </Box>
            
            <Paper elevation={2}>
                <List>
                    {documents.length === 0 ? (
                        <ListItem>
                            <ListItemText primary="No documents yet. Upload one to get started!" />
                        </ListItem>
                    ) : (
                        documents.map((doc) => (
                            <ListItem
                                key={doc._id}
                                button
                                onClick={() => onSelectDocument(doc)}
                                sx={{
                                    borderBottom: '1px solid #e0e0e0',
                                    '&:hover': { backgroundColor: '#f5f5f5' }
                                }}
                            >
                                <ListItemText
                                    primary={doc.originalName}
                                    secondary={`${doc.fileType.toUpperCase()} • ${doc.annotationCount} annotations • ${new Date(doc.createdAt).toLocaleDateString()}`}
                                />
                            </ListItem>
                        ))
                    )}
                </List>
            </Paper>
        </Box>
    );
};

export default DocumentList;


