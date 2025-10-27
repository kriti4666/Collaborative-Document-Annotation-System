import { useState } from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Login from './components/Login';
import DocumentList from './components/DocumentList';
import DocumentViewer from './components/DocumentViewer';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

function App() {
    const [user, setUser] = useState(null);
    const [selectedDocument, setSelectedDocument] = useState(null);

    const handleLogin = (userData) => {
        setUser(userData);
    };

    const handleSelectDocument = (document) => {
        setSelectedDocument(document);
    };

    const handleBack = () => {
        setSelectedDocument(null);
    };

    if (!user) {
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Login onLogin={handleLogin} />
            </ThemeProvider>
        );
    }

    if (selectedDocument) {
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <DocumentViewer
                    document={selectedDocument}
                    user={user}
                    onBack={handleBack}
                />
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <DocumentList user={user} onSelectDocument={handleSelectDocument} />
        </ThemeProvider>
    );
}

export default App;
