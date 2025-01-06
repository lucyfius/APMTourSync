import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  Snackbar,
  Alert,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EmailIcon from '@mui/icons-material/Email';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

export default function ApplicationRequestView() {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [selectedDocs, setSelectedDocs] = useState({
    rental_agreement: false,
    payment_history: false,
    utility_bill: false,
    mortgage_docs: false,
    paystubs: false,
    tax_docs: false,
    section8: false
  });

  const documentDescriptions = {
    rental_agreement: "Current and fully executed Rental Agreement",
    payment_history: "24-month rent payment history (bank statements/tenant ledger)",
    utility_bill: "Recent utility bill",
    mortgage_docs: "Recent mortgage statements and bank statements (for homeowners)",
    paystubs: "Two most recent pay stubs",
    tax_docs: "W2 or full 1040 Tax Returns (last two years for self-employed)",
    section8: "Section 8 voucher"
  };

  const handleCheckboxChange = (event) => {
    setSelectedDocs({
      ...selectedDocs,
      [event.target.name]: event.target.checked
    });
  };

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const generateMessageText = () => {
    const missingDocs = Object.entries(selectedDocs)
      .filter(([key, value]) => value)
      .map(([key]) => documentDescriptions[key]);

    if (missingDocs.length === 0) {
      return "No missing documents selected.";
    }

    const docsList = missingDocs.map(doc => `   • ${doc}`).join('\n');

    return `${getTimeBasedGreeting()},

Thank you for submitting your application for one of our properties. We noticed that one or more required documents are missing from your submission. 

*Please note that your application cannot be processed until all required documents are submitted.*

Kindly provide the following documents:
${docsList}

Additional Requirements:
───────────────────────────────────────────────────
• For Homeowners:
  Two (2) most recent mortgage statements and bank statements showing mortgage payments

• For Section 8 Applicants:
  Section 8 voucher (number of bedrooms must match the property)
  All other required documents listed above

Important Note:
───────────────────────────────────────────────────
Please ensure that an application is submitted for anyone age 18 and over.

Thank you for your cooperation!

Best regards,
Affordable Property Management`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMessageText());
    setOpenSnackbar(true);
  };

  const handleSendEmail = async () => {
    try {
      // Here you would integrate with your email service (e.g., SendGrid, AWS SES)
      await sendEmail({
        to: emailAddress,
        subject: 'Application Documents Required',
        body: generateMessageText()
      });
      
      setOpenEmailDialog(false);
      setSnackbarMessage('Email sent successfully!');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error sending email:', error);
      setSnackbarMessage('Failed to send email. Please try again.');
      setOpenSnackbar(true);
    }
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom>Document Request Template</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Select Missing Documents
            </Typography>
            <List>
              {Object.entries(documentDescriptions).map(([key, description]) => (
                <ListItem 
                  key={key}
                  disablePadding
                  sx={{ 
                    mb: 1,
                    bgcolor: selectedDocs[key] ? 'action.selected' : 'transparent',
                    borderRadius: 1
                  }}
                >
                  <FormControlLabel
                    sx={{ m: 0, width: '100%', py: 1, px: 2 }}
                    control={
                      <Checkbox
                        checked={selectedDocs[key]}
                        onChange={handleCheckboxChange}
                        name={key}
                        icon={<CheckBoxOutlineBlankIcon />}
                        checkedIcon={<CheckBoxIcon />}
                      />
                    }
                    label={
                      <ListItemText 
                        primary={description}
                        primaryTypographyProps={{
                          variant: 'body2',
                          sx: { fontWeight: selectedDocs[key] ? 500 : 400 }
                        }}
                      />
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 2 
            }}>
              <Typography variant="h6">
                Message Preview
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<ContentCopyIcon />}
                  onClick={handleCopy}
                >
                  Copy Message
                </Button>
                <Button
                  variant="contained"
                  startIcon={<EmailIcon />}
                  onClick={() => setOpenEmailDialog(true)}
                >
                  Send Email
                </Button>
              </Box>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Box 
              sx={{ 
                p: 2, 
                bgcolor: 'background.default',
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                whiteSpace: 'pre-wrap',
                minHeight: '200px',
                maxHeight: '600px',
                overflow: 'auto',
                fontFamily: 'system-ui',
                fontSize: '0.9rem',
                lineHeight: 1.6
              }}
            >
              {generateMessageText()}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openEmailDialog} onClose={() => setOpenEmailDialog(false)}>
        <DialogTitle>Send Email</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Recipient Email"
            type="email"
            fullWidth
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEmailDialog(false)}>Cancel</Button>
          <Button onClick={handleSendEmail} variant="contained">
            Send
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity="success"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
} 