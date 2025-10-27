import { useState, useEffect, useRef } from 'react';
import { Box, Paper, TextField, Button, Typography, IconButton, Chip } from '@mui/material';
import { ArrowBack, Delete } from '@mui/icons-material';
import API from '../service/api';
import socket from '../utils/socket';

const DocumentViewer = ({ document, user, onBack }) => {
    const [annotations, setAnnotations] = useState([]);
    const [selectedText, setSelectedText] = useState('');
    const [comment, setComment] = useState('');
    const [showCommentBox, setShowCommentBox] = useState(false);
    const [selectionRange, setSelectionRange] = useState(null);
    const contentRef = useRef(null);

    useEffect(() => {
        fetchAnnotations();
        
        // Join document room for real-time updates
        socket.emit('join-document', document._id);

        // Listen for new annotations
        socket.on('annotation-added', (annotation) => {
            setAnnotations(prev => [annotation, ...prev]);
        });

        // Listen for deleted annotations
        socket.on('annotation-deleted', ({ annotationId }) => {
            setAnnotations(prev => prev.filter(ann => ann._id !== annotationId));
        });

        return () => {
            socket.emit('leave-document', document._id);
            socket.off('annotation-added');
            socket.off('annotation-deleted');
        };
    }, [document._id]);

    const fetchAnnotations = async () => {
        try {
            const response = await API.get(`/document/${document._id}`);
            setAnnotations(response.data.annotations || []);
        } catch (error) {
            console.error('Error fetching annotations:', error);
        }
    };

    const handleTextSelection = () => {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();
        
        if (selectedText.length > 0) {
            const range = selection.getRangeAt(0);
            const container = contentRef.current;
            
            // Calculate the start and end indices within the content
            const startOffset = range.startOffset;
            const endOffset = range.endOffset;
            
            setSelectedText(selectedText);
            setSelectionRange({ startOffset, endOffset });
            setShowCommentBox(true);
        }
    };

    const handleSubmitAnnotation = async () => {
        if (!comment.trim() || !selectedText.trim()) return;

        const annotationData = {
            documentId: document._id,
            userId: user._id,
            username: user.username,
            userColor: user.color,
            selectedText,
            comment,
            startIndex: selectionRange.startOffset,
            endIndex: selectionRange.endOffset,
            rangeHash: `${document._id}-${user._id}-${selectionRange.startOffset}-${selectionRange.endOffset}`
        };

        try {
            // Emit through socket for real-time update
            socket.emit('new-annotation', annotationData);
            
            // Reset state
            setComment('');
            setSelectedText('');
            setShowCommentBox(false);
            window.getSelection().removeAllRanges();
        } catch (error) {
            console.error('Error creating annotation:', error);
            alert('Error creating annotation');
        }
    };

    const handleDeleteAnnotation = async (annotationId) => {
        try {
            socket.emit('delete-annotation', { annotationId, documentId: document._id });
        } catch (error) {
            console.error('Error deleting annotation:', error);
        }
    };

    const highlightAnnotations = (content) => {
        // Create highlighted version of content
        const sortedAnnotations = [...annotations].sort((a, b) => b.startIndex - a.startIndex);
        
        let result = content;
        sortedAnnotations.forEach((ann) => {
            const before = result.substring(0, ann.startIndex);
            const selected = result.substring(ann.startIndex, ann.endIndex);
            const after = result.substring(ann.endIndex);
            
            result = `${before}<mark style="background-color: ${ann.userColor}40; cursor: pointer;" data-annotation-id="${ann._id}">${selected}</mark>${after}`;
        });
        
        return result;
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            {/* Document Viewer */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={onBack} sx={{ mr: 2 }}>
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h6">{document.originalName}</Typography>
                </Box>
                
                <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
                    <Paper elevation={1} sx={{ p: 3, minHeight: '100%' }}>
                        <div
                            ref={contentRef}
                            onMouseUp={handleTextSelection}
                            dangerouslySetInnerHTML={{ __html: highlightAnnotations(document.content) }}
                            style={{
                                whiteSpace: 'pre-wrap',
                                fontFamily: 'monospace',
                                fontSize: '14px',
                                lineHeight: '1.6'
                            }}
                        />
                    </Paper>
                </Box>

                {/* Comment Box */}
                {showCommentBox && (
                    <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', backgroundColor: '#f5f5f5' }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            Selected: "{selectedText}"
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={2}
                            placeholder="Add your comment..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            sx={{ mb: 1 }}
                        />
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button variant="contained" onClick={handleSubmitAnnotation}>
                                Add Annotation
                            </Button>
                            <Button onClick={() => {
                                setShowCommentBox(false);
                                setComment('');
                                setSelectedText('');
                            }}>
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>

            {/* Annotations Panel */}
            <Box sx={{ width: 350, borderLeft: '1px solid #e0e0e0', overflow: 'auto' }}>
                <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="h6">Annotations ({annotations.length})</Typography>
                </Box>
                <Box sx={{ p: 2 }}>
                    {annotations.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                            No annotations yet. Select text to add one!
                        </Typography>
                    ) : (
                        annotations.map((ann) => (
                            <Paper
                                key={ann._id}
                                elevation={1}
                                sx={{ p: 2, mb: 2 }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Chip
                                        label={ann.username}
                                        size="small"
                                        sx={{ backgroundColor: ann.userColor, color: 'white' }}
                                    />
                                    {ann.userId === user._id && (
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDeleteAnnotation(ann._id)}
                                        >
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    )}
                                </Box>
                                <Typography variant="body2" sx={{ mb: 1, fontStyle: 'italic' }}>
                                    "{ann.selectedText}"
                                </Typography>
                                <Typography variant="body2">{ann.comment}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {new Date(ann.createdAt).toLocaleString()}
                                </Typography>
                            </Paper>
                        ))
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default DocumentViewer;


