const Imap = require('node-imap');
const { simpleParser } = require('mailparser');

// IMAP server configuration
const imapConfig = {
  user: 'accounts@localserver.com', // Your email address configured in hMailServer
  password: 'test1234',
  host: 'localserver.com', // or '127.0.0.1'
  port: 143, // Default IMAP port for hMailServer
  tls: false, // hMailServer does not support TLS for IMAP, so set this to false
};


// Connect to the IMAP server
const imap = new Imap(imapConfig);

// Function to fetch emails
function fetchEmails() {
  imap.connect();

  imap.once('ready', () => {
    imap.openBox('INBOX', true, (err, box) => {
      if (err) {
        console.error(err);
        return;
      }

      // Fetch emails
      imap.search(['ALL'], (err, results) => {
        if (err) {
          console.error(err);
          return;
        }

        const fetch = imap.fetch(results, { bodies: '' });

        fetch.on('message', (msg) => {
          msg.on('body', (stream, info) => {
            simpleParser(stream, async (err, parsed) => {
              if (err) {
                console.error(err);
                return;
              }

              console.log('From:', parsed.headers.get('from').text);
              console.log('Subject:', parsed.subject);
              console.log('Text body:', parsed.text);
              console.log('HTML body:', parsed.html);

              // Process the email as needed
            });
          });
        });

        fetch.once('error', (err) => {
          console.error(err);
        });

        fetch.once('end', () => {
          imap.end();
        });
      });
    });
  });

  imap.once('error', (err) => {
    console.error(err);
  });

  imap.once('end', () => {
    console.log('Connection ended');
  });
}

fetchEmails();
